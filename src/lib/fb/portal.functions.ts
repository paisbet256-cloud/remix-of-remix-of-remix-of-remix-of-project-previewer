import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Public server fns for the client portal (/portal/:slug).
// When client.portal_token is set, the caller must present the matching token —
// this is how we verify client ownership beyond a guessable slug.

async function loadClientWithAuth(slug: string, token?: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const code = slug.toUpperCase();
  // Try client_code first (uppercase codes like BZJECYGM), then slug.
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

    const { data: assigned } = await supabaseAdmin
      .from("client_campaigns")
      .select("campaign_id")
      .eq("client_id", client.id);
    const assignedCampaignIds = (assigned ?? []).map((r) => r.campaign_id);

    let accounts: any[] = [];
    let campaigns: any[] = [];
    let adSets: any[] = [];
    let ads: any[] = [];

    if (assignedCampaignIds.length) {
      const { data: assignedCampaigns } = await supabaseAdmin
        .from("campaigns")
        .select("id,ad_account_id,name,objective,effective_status,daily_budget,lifetime_budget,spend,reach,impressions,clicks,ctr,cpc,cpm,frequency,results")
        .in("id", assignedCampaignIds)
        .order("spend", { ascending: false })
        .limit(50);
      campaigns = assignedCampaigns ?? [];

      // Ad Sets for the assigned campaigns — this is the ad-set-level data shown in the table
      const { data: assignedAdSets } = await supabaseAdmin
        .from("ad_sets")
        .select("id,campaign_id,ad_account_id,name,effective_status,daily_budget,lifetime_budget,optimization_goal,start_time,end_time,spend,reach,impressions,clicks,ctr,cpc,cpm,results,frequency")
        .in("campaign_id", assignedCampaignIds)
        .order("spend", { ascending: false })
        .limit(200);
      adSets = assignedAdSets ?? [];

      const { data: assignedAds } = await supabaseAdmin
        .from("ads")
        .select("id,ad_account_id,campaign_id,ad_set_id,name,fb_ad_id,effective_status,creative_thumbnail,preview_link,spend,reach,impressions,clicks,ctr,results")
        .in("campaign_id", assignedCampaignIds)
        .order("spend", { ascending: false })
        .limit(200);
      ads = assignedAds ?? [];

      const campaignAccountIds = Array.from(new Set(campaigns.map((c) => c.ad_account_id).filter(Boolean)));
      if (campaignAccountIds.length) {
        const { data: scopedAccounts } = await supabaseAdmin
          .from("ad_accounts")
          .select("id,connection_id,fb_account_id,account_name,currency,timezone_name,business_name,total_spend,total_reach,total_impressions,total_clicks,total_results,active_campaigns,last_sync_at,last_sync_status,account_status")
          .in("id", campaignAccountIds)
          .eq("is_active", true);
        accounts = scopedAccounts ?? [];
      }
    } else {
      const { data: clientAccounts } = await supabaseAdmin
        .from("ad_accounts")
        .select("id,connection_id,fb_account_id,account_name,currency,timezone_name,business_name,total_spend,total_reach,total_impressions,total_clicks,total_results,active_campaigns,last_sync_at,last_sync_status,account_status")
        .eq("client_id", client.id)
        .eq("is_active", true);
      accounts = clientAccounts ?? [];
      const accountIds = accounts.map((a) => a.id);
      if (accountIds.length) {
        const [{ data: accountCampaigns }, { data: accountAdSets }, { data: accountAds }] = await Promise.all([
          supabaseAdmin.from("campaigns")
            .select("id,ad_account_id,name,objective,effective_status,daily_budget,lifetime_budget,spend,reach,impressions,clicks,ctr,cpc,cpm,frequency,results")
            .in("ad_account_id", accountIds).order("spend", { ascending: false }).limit(50),
          supabaseAdmin.from("ad_sets")
            .select("id,campaign_id,ad_account_id,name,effective_status,daily_budget,lifetime_budget,optimization_goal,start_time,end_time,spend,reach,impressions,clicks,ctr,cpc,cpm,results,frequency")
            .in("ad_account_id", accountIds).order("spend", { ascending: false }).limit(200),
          supabaseAdmin.from("ads")
            .select("id,ad_account_id,campaign_id,ad_set_id,name,fb_ad_id,effective_status,creative_thumbnail,preview_link,spend,reach,impressions,clicks,ctr,results")
            .in("ad_account_id", accountIds).order("spend", { ascending: false }).limit(200),
        ]);
        campaigns = accountCampaigns ?? [];
        adSets = accountAdSets ?? [];
        ads = accountAds ?? [];
      }
    }

    const accountIds = accounts.map((a) => a.id);

    let liveTimeSeries: any[] | null = null;
    if (accounts.length > 0) {
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
          const rows = await fb.getTimeSeries(account.fb_account_id, token, "last_30d");
          liveRows.push(...rows.map((row: any) => ({ ...row, ad_account_id: account.id })));
        }
        liveTimeSeries = liveRows;
      } catch (e) {
        liveTimeSeries = null;
      }
    }

    const [{ data: timeSeries }, { data: alerts }] = await Promise.all([
      accountIds.length
        ? supabaseAdmin.from("insights_snapshots").select("ad_account_id,date_start,spend,reach,impressions,clicks,results").in("ad_account_id", accountIds).eq("level", "account").gte("date_start", new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10)).order("date_start", { ascending: true })
        : Promise.resolve({ data: [] as any[] }),
      supabaseAdmin.from("alerts").select("id,type,severity,title,message,created_at").eq("client_id", client.id).order("created_at", { ascending: false }).limit(15),
    ]);

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
      assignedCampaignIds,
      timeSeries: liveTimeSeries ?? timeSeries ?? [],
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

    const { data: accounts } = await supabaseAdmin
      .from("ad_accounts").select("id,fb_account_id,account_name,currency").eq("client_id", client.id).eq("is_active", true);
    const ids = (accounts ?? []).map((a) => a.id);
    if (!ids.length) return { forbidden: false as const, rows: [] as any[] };
    const acctById = new Map((accounts ?? []).map((a) => [a.id, a]));

    const table = data.level === "campaign" ? "campaigns" : data.level === "adset" ? "ad_sets" : "ads";
    const { data: rows } = await supabaseAdmin.from(table)
      .select("ad_account_id,name,effective_status,spend,reach,impressions,clicks,ctr,cpc,cpm,results,frequency")
      .in("ad_account_id", ids)
      .order("spend", { ascending: false });

    const enriched = (rows ?? []).map((r: any) => {
      const acct: any = acctById.get(r.ad_account_id);
      return {
        client: client.name,
        ad_account: acct?.account_name ?? acct?.fb_account_id ?? "",
        currency: acct?.currency ?? "",
        name: r.name,
        status: r.effective_status,
        spend: r.spend, reach: r.reach, impressions: r.impressions, clicks: r.clicks,
        ctr: r.ctr, cpc: r.cpc, cpm: r.cpm, results: r.results, frequency: r.frequency,
      };
    });
    return { forbidden: false as const, rows: enriched };
  });

// Trigger a fresh Meta sync for all ad accounts attached to a client/portal slug.
// Debounced: skips accounts whose last_sync_at < `minAgeSec` ago, so calling this
// every page load is safe. Returns immediately even if sync is still running in
// the background for large accounts — the realtime channel will pick up updates.
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

    // Resolve the relevant ad accounts (same scoping rule as getClientPortalData).
    const { data: assigned } = await supabaseAdmin
      .from("client_campaigns").select("campaign_id").eq("client_id", client.id);
    const assignedIds = (assigned ?? []).map((a) => a.campaign_id);

    let accountIds: string[] = [];
    if (assignedIds.length) {
      const { data: cs } = await supabaseAdmin
        .from("campaigns").select("ad_account_id").in("id", assignedIds);
      accountIds = Array.from(new Set((cs ?? []).map((c) => c.ad_account_id).filter(Boolean)));
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

    // Fire-and-await — keep latency acceptable but ensure DB is fresh before returning.
    const { syncAdAccount } = await import("./sync.server");
    const results = await Promise.allSettled(toSync.map((a) => syncAdAccount(a.id)));
    const okCount = results.filter((r) => r.status === "fulfilled").length;
    return { ok: true as const, synced: okCount, skipped: accountIds.length - toSync.length };
  });
