import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Public server fns for the client portal (/portal/:slug).

async function loadClientWithAuth(slug: string, token?: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const code = slug.toUpperCase();
  let { data: client, error } = await supabaseAdmin
    .from("clients")
    .select("id,name,slug,client_code,company,logo_url,brand_color,status,monthly_budget,deposit_amount,deposit_currency,bdt_rate,portal_token,commission_enabled,commission_percent")
    .eq("client_code", code)
    .maybeSingle();
  if (!client && !error) {
    const r2 = await supabaseAdmin
      .from("clients")
      .select("id,name,slug,client_code,company,logo_url,brand_color,status,monthly_budget,deposit_amount,deposit_currency,bdt_rate,portal_token,commission_enabled,commission_percent")
      .eq("slug", slug)
      .maybeSingle();
    client = r2.data as any;
    error = r2.error as any;
  }
  if (error) {
    console.error("[portal] client lookup error", { slug, code, error: error.message });
    throw new Error(error.message);
  }
  if (!client) {
    console.error("[portal] client not found", { slug, code });
    return { notFound: true as const };
  }
  if (client.status === "archived") return { notFound: true as const };

  if (client.portal_token && client.portal_token !== token) {
    return { forbidden: true as const };
  }
  return { client, supabaseAdmin } as const;
}

async function getTokenForPortalAccount(supabaseAdmin: any, account: any, legacyToken?: string | null) {
  if (account.connection_id) {
    const { data: c } = await supabaseAdmin
      .from("meta_connections")
      .select("fb_system_user_token")
      .eq("id", account.connection_id)
      .maybeSingle();
    if (c?.fb_system_user_token) return c.fb_system_user_token as string;
  }
  return legacyToken || null;
}

export const getClientPortalData = createServerFn({ method: "POST" })
  .inputValidator((d: { slug: string; token?: string }) =>
    z.object({
      slug: z.string().min(1).max(120),
      token: z.string().min(4).max(128).optional(),
    }).parse(d))
  .handler(async ({ data }) => {
    const r = await loadClientWithAuth(data.slug, data.token);
    if ("notFound" in r) return { notFound: true as const };
    if ("forbidden" in r) return { forbidden: true as const };
    const { client, supabaseAdmin } = r;

    // ============ PER-AD SCOPING ============
    // Single source of truth: client_ads. Everything the client sees is
    // derived from this list — ad sets and campaigns are rollups of the
    // assigned ads, ad accounts are derived from the assigned ads' parents.
    // If the admin has not assigned any ads, the portal renders empty.
    const { data: assignedRows } = await (supabaseAdmin as any)
      .from("client_ads")
      .select("ad_id")
      .eq("client_id", client.id);
    const assignedAdIds: string[] = ((assignedRows ?? []) as any[]).map((r) => r.ad_id);

    let accounts: any[] = [];
    let campaigns: any[] = [];
    let adSets: any[] = [];
    let ads: any[] = [];
    let assignedFbCampaignIds: string[] = [];

    if (assignedAdIds.length > 0) {
      const { data: adRows } = await supabaseAdmin
        .from("ads")
        .select("id,ad_account_id,campaign_id,ad_set_id,name,fb_ad_id,effective_status,creative_thumbnail,preview_link,spend,reach,impressions,clicks,ctr,results")
        .in("id", assignedAdIds)
        .order("spend", { ascending: false });
      ads = adRows ?? [];

      const adSetIds = Array.from(new Set(ads.map((a) => a.ad_set_id).filter(Boolean)));
      const campaignIds = Array.from(new Set(ads.map((a) => a.campaign_id).filter(Boolean)));
      const accountIdsLocal = Array.from(new Set(ads.map((a) => a.ad_account_id).filter(Boolean)));

      const [{ data: adSetRows }, { data: campaignRows }, { data: accountRows }] = await Promise.all([
        adSetIds.length
          ? supabaseAdmin
              .from("ad_sets")
              .select("id,fb_adset_id,campaign_id,ad_account_id,name,effective_status,daily_budget,lifetime_budget,optimization_goal,start_time,end_time,frequency")
              .in("id", adSetIds)
          : Promise.resolve({ data: [] as any[] }),
        campaignIds.length
          ? supabaseAdmin
              .from("campaigns")
              .select("id,fb_campaign_id,ad_account_id,name,objective,effective_status,daily_budget,lifetime_budget,frequency")
              .in("id", campaignIds)
          : Promise.resolve({ data: [] as any[] }),
        accountIdsLocal.length
          ? supabaseAdmin
              .from("ad_accounts")
              .select("id,connection_id,fb_account_id,account_name,currency,timezone_name,business_name,total_spend,total_reach,total_impressions,total_clicks,total_results,active_campaigns,last_sync_at,last_sync_status,account_status")
              .in("id", accountIdsLocal)
          : Promise.resolve({ data: [] as any[] }),
      ]);

      const adSetBase = (adSetRows ?? []) as any[];
      const campaignBase = (campaignRows ?? []) as any[];
      accounts = (accountRows ?? []) as any[];

      // ----- Roll up ad-set metrics from assigned ads only -----
      const adsByAdSet = new Map<string, any[]>();
      for (const a of ads) {
        const arr = adsByAdSet.get(a.ad_set_id) ?? [];
        arr.push(a);
        adsByAdSet.set(a.ad_set_id, arr);
      }
      adSets = adSetBase.map((s) => {
        const children = adsByAdSet.get(s.id) ?? [];
        const spend = children.reduce((x, a) => x + (Number(a.spend) || 0), 0);
        const impressions = children.reduce((x, a) => x + (Number(a.impressions) || 0), 0);
        const clicks = children.reduce((x, a) => x + (Number(a.clicks) || 0), 0);
        const results = children.reduce((x, a) => x + (Number(a.results) || 0), 0);
        const reach = children.reduce((x, a) => Math.max(x, Number(a.reach) || 0), 0);
        return {
          ...s,
          spend, impressions, clicks, results, reach,
          ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
          cpc: clicks > 0 ? spend / clicks : 0,
          cpm: impressions > 0 ? (spend / impressions) * 1000 : 0,
          frequency: reach > 0 ? impressions / reach : 0,
        };
      });

      // ----- Roll up campaign metrics from assigned ads only -----
      const adsByCampaign = new Map<string, any[]>();
      for (const a of ads) {
        const arr = adsByCampaign.get(a.campaign_id) ?? [];
        arr.push(a);
        adsByCampaign.set(a.campaign_id, arr);
      }
      campaigns = campaignBase.map((c) => {
        const children = adsByCampaign.get(c.id) ?? [];
        const spend = children.reduce((x, a) => x + (Number(a.spend) || 0), 0);
        const impressions = children.reduce((x, a) => x + (Number(a.impressions) || 0), 0);
        const clicks = children.reduce((x, a) => x + (Number(a.clicks) || 0), 0);
        const results = children.reduce((x, a) => x + (Number(a.results) || 0), 0);
        const reach = children.reduce((x, a) => Math.max(x, Number(a.reach) || 0), 0);
        return {
          ...c,
          spend, impressions, clicks, results, reach,
          ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
          cpc: clicks > 0 ? spend / clicks : 0,
          cpm: impressions > 0 ? (spend / impressions) * 1000 : 0,
          frequency: reach > 0 ? impressions / reach : 0,
        };
      });

      assignedFbCampaignIds = campaigns.map((c: any) => c.fb_campaign_id).filter(Boolean);
    }

    const accountIds = accounts.map((a) => a.id);

    // ============ Time series — only when client has assigned ads ============
    let liveTimeSeries: any[] | null = null;
    if (assignedAdIds.length > 0 && assignedFbCampaignIds.length > 0 && accounts.length > 0) {
      try {
        const { fb } = await import("./api.server");
        const { data: settings } = await supabaseAdmin
          .from("app_settings")
          .select("fb_system_user_token")
          .eq("id", 1)
          .maybeSingle();
        const liveRows: any[] = [];
        for (const account of accounts) {
          const token = await getTokenForPortalAccount(supabaseAdmin, account, settings?.fb_system_user_token);
          if (!token) continue;
          const acctCampaignFbIds = campaigns
            .filter((c: any) => c.ad_account_id === account.id)
            .map((c: any) => c.fb_campaign_id)
            .filter(Boolean);
          if (acctCampaignFbIds.length === 0) continue;
          const rows = await fb.getCampaignTimeSeries(account.fb_account_id, token, acctCampaignFbIds, "last_30d");
          liveRows.push(...rows.map((row: any) => ({ ...row, ad_account_id: account.id })));
        }
        liveTimeSeries = liveRows;
      } catch (e) {
        liveTimeSeries = null;
      }
    }

    // DB fallback time series — campaign-level snapshots scoped to the
    // assigned campaigns. Reasonable approximation when live call fails.
    let dbTimeSeries: any[] = [];
    if (accountIds.length && assignedFbCampaignIds.length > 0) {
      const sinceStr = new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10);
      const { data: ts } = await supabaseAdmin
        .from("insights_snapshots")
        .select("ad_account_id,date_start,spend,reach,impressions,clicks,results,entity_id")
        .in("ad_account_id", accountIds)
        .eq("level", "campaign")
        .in("entity_id", assignedFbCampaignIds)
        .gte("date_start", sinceStr)
        .order("date_start", { ascending: true });
      dbTimeSeries = ts ?? [];
    }

    // Sort outputs — highest spend first.
    (adSets as any[]).sort((a, b) => (Number(b.spend) || 0) - (Number(a.spend) || 0));
    (campaigns as any[]).sort((a, b) => (Number(b.spend) || 0) - (Number(a.spend) || 0));


    const { data: alerts } = await supabaseAdmin
      .from("alerts")
      .select("id,type,severity,title,message,created_at")
      .eq("client_id", client.id)
      .order("created_at", { ascending: false })
      .limit(15);

    // Strip portal_token — never expose it.
    const { portal_token: _t, ...clientPub } = client as any;

    return {
      notFound: false as const,
      forbidden: false as const,
      client: clientPub,
      accounts,
      campaigns,
      adSets,
      ads,
      assignedAdIds,
      timeSeries: (liveTimeSeries && liveTimeSeries.length > 0) ? liveTimeSeries : dbTimeSeries,
      alerts: alerts ?? [],
    };
  });

// CSV-export-ready row fetch for the portal. Level = campaign|adset|ad.
export const getClientInsightsForExport = createServerFn({ method: "POST" })
  .inputValidator((d: { slug: string; token?: string; level: "campaign" | "adset" | "ad" }) =>
    z.object({
      slug: z.string().min(1).max(120),
      token: z.string().min(4).max(128).optional(),
      level: z.enum(["campaign", "adset", "ad"]),
    }).parse(d))
  .handler(async ({ data }) => {
    const r = await loadClientWithAuth(data.slug, data.token);
    if ("notFound" in r) return { forbidden: true as const };
    if ("forbidden" in r) return { forbidden: true as const };
    const { client, supabaseAdmin } = r;

    // Scope export to the client's assigned ads only.
    const { data: assigned } = await (supabaseAdmin as any)
      .from("client_ads").select("ad_id").eq("client_id", client.id);
    const adIds: string[] = ((assigned ?? []) as any[]).map((a) => a.ad_id);
    if (adIds.length === 0) return { forbidden: false as const, rows: [] as any[] };

    // Load the assigned ads with their parents in a single nested select.
    const { data: ads } = await supabaseAdmin
      .from("ads")
      .select("id,ad_account_id,campaign_id,ad_set_id,name,fb_ad_id,effective_status,spend,reach,impressions,clicks,ctr,results,campaign:campaigns(id,name),ad_set:ad_sets(id,name),ad_account:ad_accounts(id,fb_account_id,account_name,currency)")
      .in("id", adIds);

    const adsList = (ads ?? []) as any[];

    let rows: any[] = [];
    if (data.level === "ad") {
      rows = adsList.map((a) => ({
        ad_account_id: a.ad_account_id,
        campaign_id: a.campaign_id,
        name: a.name,
        effective_status: a.effective_status,
        spend: a.spend, reach: a.reach, impressions: a.impressions,
        clicks: a.clicks, ctr: a.ctr, cpc: a.clicks > 0 ? Number(a.spend) / Number(a.clicks) : 0,
        cpm: a.impressions > 0 ? (Number(a.spend) / Number(a.impressions)) * 1000 : 0,
        results: a.results, frequency: a.reach > 0 ? Number(a.impressions) / Number(a.reach) : 0,
        _acct: a.ad_account,
      }));
    } else {
      // Group by ad_set or campaign and aggregate.
      const groupBy = data.level === "adset" ? "ad_set" : "campaign";
      const groups = new Map<string, any>();
      for (const a of adsList) {
        const parent = a[groupBy];
        if (!parent?.id) continue;
        const cur = groups.get(parent.id) ?? {
          ad_account_id: a.ad_account_id,
          campaign_id: a.campaign_id,
          name: parent.name,
          effective_status: a.effective_status,
          spend: 0, reach: 0, impressions: 0, clicks: 0, results: 0,
          _acct: a.ad_account,
        };
        cur.spend += Number(a.spend) || 0;
        cur.impressions += Number(a.impressions) || 0;
        cur.clicks += Number(a.clicks) || 0;
        cur.results += Number(a.results) || 0;
        cur.reach = Math.max(cur.reach, Number(a.reach) || 0);
        groups.set(parent.id, cur);
      }
      rows = Array.from(groups.values()).map((g) => ({
        ...g,
        ctr: g.impressions > 0 ? (g.clicks / g.impressions) * 100 : 0,
        cpc: g.clicks > 0 ? g.spend / g.clicks : 0,
        cpm: g.impressions > 0 ? (g.spend / g.impressions) * 1000 : 0,
        frequency: g.reach > 0 ? g.impressions / g.reach : 0,
      }));
    }

    const enriched = rows
      .sort((a, b) => (Number(b.spend) || 0) - (Number(a.spend) || 0))
      .map((r: any) => ({
        client: client.name,
        ad_account: r._acct?.account_name ?? r._acct?.fb_account_id ?? "",
        currency: r._acct?.currency ?? "",
        name: r.name,
        status: r.effective_status,
        spend: r.spend, reach: r.reach, impressions: r.impressions, clicks: r.clicks,
        ctr: r.ctr, cpc: r.cpc, cpm: r.cpm, results: r.results, frequency: r.frequency,
      }));
    return { forbidden: false as const, rows: enriched };
  });


// Trigger a fresh Meta sync for all ad accounts attached to a client/portal slug.
export const triggerClientSync = createServerFn({ method: "POST" })
  .inputValidator((d: { slug: string; token?: string; minAgeSec?: number; force?: boolean }) =>
    z.object({
      slug: z.string().min(1).max(120),
      token: z.string().min(4).max(128).optional(),
      minAgeSec: z.number().int().min(0).max(3600).optional(),
      force: z.boolean().optional(),
    }).parse(d))
  .handler(async ({ data }) => {
    const r = await loadClientWithAuth(data.slug, data.token);
    if ("notFound" in r) return { ok: false as const, reason: "not-found" as const };
    if ("forbidden" in r) return { ok: false as const, reason: "forbidden" as const };
    const { client, supabaseAdmin } = r;

    // Sync ad accounts derived from the client's assigned ads.
    const { data: assigned } = await (supabaseAdmin as any)
      .from("client_ads").select("ad_id").eq("client_id", client.id);
    const adIds: string[] = ((assigned ?? []) as any[]).map((a) => a.ad_id);

    let accountIds: string[] = [];
    if (adIds.length) {
      const { data: ads } = await supabaseAdmin
        .from("ads").select("ad_account_id").in("id", adIds);
      accountIds = Array.from(new Set(((ads ?? []) as any[]).map((a) => a.ad_account_id).filter(Boolean)));
    } else {
      const { data: as } = await supabaseAdmin
        .from("ad_accounts").select("id").eq("client_id", client.id).eq("is_active", true);
      accountIds = (as ?? []).map((a) => a.id);
    }
    if (!accountIds.length) return { ok: true as const, synced: 0, skipped: 0 };

    const minAgeSec = data.minAgeSec ?? 50;
    const cutoff = new Date(Date.now() - minAgeSec * 1000).toISOString();
    const { data: accounts } = await supabaseAdmin
      .from("ad_accounts").select("id,last_sync_at").in("id", accountIds);

    const toSync = (accounts ?? []).filter((a) =>
      data.force || !a.last_sync_at || a.last_sync_at < cutoff,
    );
    if (!toSync.length) return { ok: true as const, synced: 0, skipped: accountIds.length };

    const { syncAdAccount } = await import("./sync.server");
    const results = await Promise.allSettled(toSync.map((a) => syncAdAccount(a.id)));
    const okCount = results.filter((r) => r.status === "fulfilled").length;
    return { ok: true as const, synced: okCount, skipped: accountIds.length - toSync.length };
  });
