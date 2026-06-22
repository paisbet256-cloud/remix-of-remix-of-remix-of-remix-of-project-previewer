// Sync engine — SERVER ONLY.
// Dispatch pattern + bulk-upsert. Each per-account sync runs in its own
// Worker invocation via /api/public/hooks/sync-account (fresh 1000-subrequest
// budget). Inside each invocation we merge entity metadata + insights in
// memory and write ONE upsert per level (campaigns/ad_sets/ads) instead of
// looping per-row, so we stay well under the Cloudflare subrequest cap.
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { fb, extractPrimaryResults, FbApiError } from "./api.server";
import { checkTokenHealth } from "./permissions.server";
import { getRequest } from "@tanstack/react-start/server";

async function getLegacyToken(): Promise<string | null> {
  const { data } = await supabaseAdmin.from("app_settings").select("fb_system_user_token").eq("id", 1).maybeSingle();
  return data?.fb_system_user_token ?? null;
}

async function getTokenForAccount(accountId: string): Promise<string> {
  const { data: acc } = await supabaseAdmin
    .from("ad_accounts")
    .select("connection_id,fb_account_id,account_name")
    .eq("id", accountId)
    .maybeSingle();
  if (acc?.connection_id) {
    const { data: c } = await supabaseAdmin
      .from("meta_connections")
      .select("fb_system_user_token")
      .eq("id", acc.connection_id)
      .maybeSingle();
    if (c?.fb_system_user_token) return c.fb_system_user_token;
  }
  const legacy = await getLegacyToken();
  if (legacy) return legacy;
  throw new Error(
    `No Facebook System User token configured for account "${acc?.account_name ?? acc?.fb_account_id ?? accountId}". ` +
    `Go to Settings → Business Managers (or Legacy section) and paste a never-expiring System User token with ads_read + ads_management + business_management scopes.`,
  );
}

async function importVisibleAccountsForSync(token: string) {
  const { data: settings } = await supabaseAdmin.from("app_settings").select("fb_business_id").eq("id", 1).maybeSingle();
  const { accounts } = await fb.listAdAccountsDetailed(token, settings?.fb_business_id);
  if (accounts.length === 0) return { imported: 0 };

  const { data: client, error: clientError } = await supabaseAdmin.from("clients").upsert({
    name: "Meta Imported Accounts",
    slug: "meta-imported-accounts",
    company: "Facebook Ads",
  }, { onConflict: "slug" }).select("id").single();
  if (clientError) throw new Error(`client upsert: ${clientError.message}`);

  const rows = accounts.map((a) => ({
    client_id: client.id,
    fb_account_id: a.id,
    account_name: a.name,
    currency: a.currency,
    timezone_name: a.timezone_name,
    account_status: a.account_status,
    business_name: a.business?.name ?? null,
    is_active: true,
  }));
  const { data: imported, error } = await supabaseAdmin.from("ad_accounts").upsert(rows, { onConflict: "fb_account_id" }).select("id");
  if (error) throw new Error(`ad accounts upsert: ${error.message}`);
  return { imported: imported?.length ?? 0 };
}

// Chunked upsert helper — keeps payloads under Supabase request limits.
async function bulkUpsert(table: string, rows: any[], onConflict: string, chunkSize = 500) {
  if (rows.length === 0) return;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabaseAdmin.from(table).upsert(chunk, { onConflict });
    if (error) throw new Error(`${table} upsert: ${error.message}`);
  }
}

export async function syncAdAccount(adAccountId: string) {
  const started = Date.now();
  const { data: account } = await supabaseAdmin
    .from("ad_accounts")
    .select("id,fb_account_id,client_id,account_name")
    .eq("id", adAccountId)
    .maybeSingle();
  if (!account) {
    throw new Error(
      `Ad account row missing in DB for id="${adAccountId}". ` +
      `Click "Re-test & Re-import" to re-pull from Facebook, or the row was deleted from Business Manager.`,
    );
  }

  let itemsSynced = 0;
  let error: string | null = null;

  try {
    const token = await getTokenForAccount(account.id);
    const actId = account.fb_account_id;

    // ------- 1) Fetch everything from Facebook in parallel -------
    const [
      info,
      campaigns,
      adSets,
      ads,
      acctInsights,
      campInsights,
      asInsights,
      adInsights,
      ts,
      campTs,
      adsetTs,
    ] = await Promise.all([
      fb.getAccount(actId, token),
      fb.listCampaigns(actId, token),
      fb.listAdSets(actId, token),
      fb.listAds(actId, token),
      fb.getAccountInsights(actId, token, "maximum"),
      fb.getInsights(actId, token, "maximum", "campaign"),
      fb.getInsights(actId, token, "maximum", "adset"),
      fb.getInsights(actId, token, "maximum", "ad"),
      fb.getTimeSeries(actId, token, "last_30d"),
      fb.getCampaignTimeSeries(actId, token, [], "last_30d"),
      fb.getAdSetTimeSeries(actId, token, "last_30d"),
    ]);

    const nowIso = new Date().toISOString();
    const adSetGoalByFbId = new Map<string, string>();
    for (const a of adSets as any[]) {
      if (a.optimization_goal) adSetGoalByFbId.set(a.id, a.optimization_goal);
    }

    // ------- 2) Build per-FB-id insight maps so metadata + metrics merge in memory -------
    const campMetrics = new Map<string, any>();
    for (const row of (campInsights as any[]) ?? []) {
      campMetrics.set(row.campaign_id, {
        spend: Number(row.spend) || 0,
        reach: Number(row.reach) || 0,
        impressions: Number(row.impressions) || 0,
        clicks: Number(row.clicks) || 0,
        ctr: Number(row.ctr) || 0,
        cpc: Number(row.cpc) || 0,
        cpm: Number(row.cpm) || 0,
        frequency: Number(row.frequency) || 0,
        results: extractPrimaryResults(row.actions, row.optimization_goal),
      });
    }
    const adsetMetrics = new Map<string, any>();
    for (const row of (asInsights as any[]) ?? []) {
      adsetMetrics.set(row.adset_id, {
        spend: Number(row.spend) || 0,
        reach: Number(row.reach) || 0,
        impressions: Number(row.impressions) || 0,
        clicks: Number(row.clicks) || 0,
        ctr: Number(row.ctr) || 0,
        cpc: Number(row.cpc) || 0,
        cpm: Number(row.cpm) || 0,
        frequency: Number(row.frequency) || 0,
        results: extractPrimaryResults(row.actions, row.optimization_goal ?? adSetGoalByFbId.get(row.adset_id)),
      });
    }
    const adMetrics = new Map<string, any>();
    for (const row of (adInsights as any[]) ?? []) {
      adMetrics.set(row.ad_id, {
        spend: Number(row.spend) || 0,
        reach: Number(row.reach) || 0,
        impressions: Number(row.impressions) || 0,
        clicks: Number(row.clicks) || 0,
        ctr: Number(row.ctr) || 0,
        cpc: Number(row.cpc) || 0,
        cpm: Number(row.cpm) || 0,
        frequency: Number(row.frequency) || 0,
        results: extractPrimaryResults(row.actions, row.optimization_goal ?? adSetGoalByFbId.get(row.adset_id)),
      });
    }

    const zero = { spend: 0, reach: 0, impressions: 0, clicks: 0, ctr: 0, cpc: 0, cpm: 0, frequency: 0, results: 0 };

    // ------- 3) CAMPAIGNS: single bulk upsert with metadata + metrics merged -------
    if (campaigns.length > 0) {
      const rows = (campaigns as any[]).map((c) => ({
        ad_account_id: account.id,
        fb_campaign_id: c.id,
        name: c.name,
        objective: c.objective ?? null,
        status: c.status ?? null,
        effective_status: c.effective_status ?? null,
        daily_budget: c.daily_budget ? Number(c.daily_budget) / 100 : null,
        lifetime_budget: c.lifetime_budget ? Number(c.lifetime_budget) / 100 : null,
        buying_type: c.buying_type ?? null,
        start_time: c.start_time ?? null,
        stop_time: c.stop_time ?? null,
        last_sync_at: nowIso,
        ...(campMetrics.get(c.id) ?? zero),
      }));
      await bulkUpsert("campaigns", rows, "fb_campaign_id");
      itemsSynced += rows.length;
    }

    // ------- 4) AD SETS: need campaign UUID lookup (one SELECT) then single bulk upsert -------
    if (adSets.length > 0) {
      const { data: cps } = await supabaseAdmin.from("campaigns").select("id,fb_campaign_id").eq("ad_account_id", account.id);
      const cpMap = new Map((cps ?? []).map((c) => [c.fb_campaign_id, c.id]));
      const rows = (adSets as any[])
        .filter((a) => cpMap.has(a.campaign_id))
        .map((a) => ({
          campaign_id: cpMap.get(a.campaign_id)!,
          ad_account_id: account.id,
          fb_adset_id: a.id,
          name: a.name,
          status: a.status ?? null,
          effective_status: a.effective_status ?? null,
          daily_budget: a.daily_budget ? Number(a.daily_budget) / 100 : null,
          lifetime_budget: a.lifetime_budget ? Number(a.lifetime_budget) / 100 : null,
          optimization_goal: a.optimization_goal ?? null,
          billing_event: a.billing_event ?? null,
          bid_amount: a.bid_amount ? Number(a.bid_amount) / 100 : null,
          start_time: a.start_time ?? null,
          end_time: a.end_time ?? null,
          last_sync_at: nowIso,
          ...(adsetMetrics.get(a.id) ?? zero),
        }));
      await bulkUpsert("ad_sets", rows, "fb_adset_id");
      itemsSynced += rows.length;
    }

    // ------- 5) ADS: lookup campaign + adset UUIDs (two SELECTs) then single bulk upsert -------
    if (ads.length > 0) {
      const [{ data: cps }, { data: aset }] = await Promise.all([
        supabaseAdmin.from("campaigns").select("id,fb_campaign_id").eq("ad_account_id", account.id),
        supabaseAdmin.from("ad_sets").select("id,fb_adset_id").eq("ad_account_id", account.id),
      ]);
      const cpMap = new Map((cps ?? []).map((c) => [c.fb_campaign_id, c.id]));
      const asMap = new Map((aset ?? []).map((a) => [a.fb_adset_id, a.id]));
      const rows = (ads as any[])
        .filter((a) => cpMap.has(a.campaign_id) && asMap.has(a.adset_id))
        .map((a) => ({
          ad_set_id: asMap.get(a.adset_id)!,
          campaign_id: cpMap.get(a.campaign_id)!,
          ad_account_id: account.id,
          fb_ad_id: a.id,
          name: a.name,
          status: a.status ?? null,
          effective_status: a.effective_status ?? null,
          creative_thumbnail: a.creative?.thumbnail_url ?? null,
          creative_id: a.creative?.id ?? null,
          last_sync_at: nowIso,
          ...(adMetrics.get(a.id) ?? zero),
        }));
      await bulkUpsert("ads", rows, "fb_ad_id");
      itemsSynced += rows.length;
    }

    // ------- 6) Time-series snapshots — bulk upsert per level -------
    const snapshotSince = new Date();
    snapshotSince.setUTCDate(snapshotSince.getUTCDate() - 29);
    const snapshotSinceStr = snapshotSince.toISOString().slice(0, 10);

    if (ts.length > 0) {
      await supabaseAdmin.from("insights_snapshots").delete()
        .eq("ad_account_id", account.id).eq("level", "account").gte("date_start", snapshotSinceStr);
      const rows = (ts as any[]).map((r) => ({
        ad_account_id: account.id,
        level: "account" as const,
        entity_id: actId,
        date_start: r.date_start,
        date_stop: r.date_stop,
        spend: Number(r.spend) || 0,
        reach: Number(r.reach) || 0,
        impressions: Number(r.impressions) || 0,
        clicks: Number(r.clicks) || 0,
        ctr: Number(r.ctr) || 0,
        cpc: Number(r.cpc) || 0,
        cpm: Number(r.cpm) || 0,
        frequency: Number(r.frequency) || 0,
        results: extractPrimaryResults(r.actions),
      }));
      await bulkUpsert("insights_snapshots", rows, "ad_account_id,level,entity_id,date_start,date_stop");
    }

    if (campTs.length > 0) {
      await supabaseAdmin.from("insights_snapshots").delete()
        .eq("ad_account_id", account.id).eq("level", "campaign").gte("date_start", snapshotSinceStr);
      const rows = (campTs as any[]).map((r) => ({
        ad_account_id: account.id,
        level: "campaign" as const,
        entity_id: r.campaign_id,
        date_start: r.date_start,
        date_stop: r.date_stop,
        spend: Number(r.spend) || 0,
        reach: Number(r.reach) || 0,
        impressions: Number(r.impressions) || 0,
        clicks: Number(r.clicks) || 0,
        ctr: Number(r.ctr) || 0,
        cpc: Number(r.cpc) || 0,
        cpm: Number(r.cpm) || 0,
        frequency: Number(r.frequency) || 0,
        results: extractPrimaryResults(r.actions, r.optimization_goal),
      }));
      await bulkUpsert("insights_snapshots", rows, "ad_account_id,level,entity_id,date_start,date_stop");
    }

    if (adsetTs.length > 0) {
      await supabaseAdmin.from("insights_snapshots").delete()
        .eq("ad_account_id", account.id).eq("level", "adset").gte("date_start", snapshotSinceStr);
      const rows = (adsetTs as any[]).map((r) => ({
        ad_account_id: account.id,
        level: "adset" as const,
        entity_id: r.adset_id,
        date_start: r.date_start,
        date_stop: r.date_stop,
        spend: Number(r.spend) || 0,
        reach: Number(r.reach) || 0,
        impressions: Number(r.impressions) || 0,
        clicks: Number(r.clicks) || 0,
        ctr: Number(r.ctr) || 0,
        cpc: Number(r.cpc) || 0,
        cpm: Number(r.cpm) || 0,
        frequency: Number(r.frequency) || 0,
        results: extractPrimaryResults(r.actions, r.optimization_goal ?? adSetGoalByFbId.get(r.adset_id)),
      }));
      await bulkUpsert("insights_snapshots", rows, "ad_account_id,level,entity_id,date_start,date_stop");

      // Roll up ad_sets totals from the time-series — bulk upsert (one call)
      const agg = new Map<string, { spend: number; reach: number; impressions: number; clicks: number; results: number; goal?: string | null }>();
      for (const r of adsetTs as any[]) {
        const id = r.adset_id;
        if (!id) continue;
        const cur = agg.get(id) ?? { spend: 0, reach: 0, impressions: 0, clicks: 0, results: 0, goal: r.optimization_goal ?? adSetGoalByFbId.get(id) ?? null };
        cur.spend       += Number(r.spend) || 0;
        cur.impressions += Number(r.impressions) || 0;
        cur.clicks      += Number(r.clicks) || 0;
        cur.results     += extractPrimaryResults(r.actions, cur.goal);
        cur.reach = Math.max(cur.reach, Number(r.reach) || 0);
        agg.set(id, cur);
      }
      if (agg.size > 0) {
        const { data: aset } = await supabaseAdmin.from("ad_sets").select("id,fb_adset_id,campaign_id,ad_account_id,name").eq("ad_account_id", account.id);
        const rollupRows: any[] = [];
        for (const a of (aset ?? []) as any[]) {
          const v = agg.get(a.fb_adset_id);
          if (!v) continue;
          const ctr = v.impressions > 0 ? (v.clicks / v.impressions) * 100 : 0;
          const cpc = v.clicks > 0 ? v.spend / v.clicks : 0;
          const cpm = v.impressions > 0 ? (v.spend / v.impressions) * 1000 : 0;
          const frequency = v.reach > 0 ? v.impressions / v.reach : 0;
          rollupRows.push({
            id: a.id,
            campaign_id: a.campaign_id,
            ad_account_id: a.ad_account_id,
            fb_adset_id: a.fb_adset_id,
            name: a.name,
            spend: v.spend, reach: v.reach, impressions: v.impressions, clicks: v.clicks,
            ctr, cpc, cpm, frequency, results: v.results,
          });
        }
        await bulkUpsert("ad_sets", rollupRows, "fb_adset_id");
      }
    }

    // ------- 7) Account-level totals -------
    const activeCampaigns = (campaigns as any[]).filter((c) => c.effective_status === "ACTIVE").length;
    const accountUpdate: Record<string, any> = {
      account_name: info.name,
      currency: info.currency,
      timezone_name: info.timezone_name,
      account_status: info.account_status,
      business_name: info.business?.name ?? null,
      active_campaigns: activeCampaigns,
      last_sync_at: nowIso,
      last_sync_status: "success",
      last_sync_error: null,
    };
    if (acctInsights) {
      accountUpdate.total_spend = Number((acctInsights as any).spend) || 0;
      accountUpdate.total_reach = Number((acctInsights as any).reach) || 0;
      accountUpdate.total_impressions = Number((acctInsights as any).impressions) || 0;
      accountUpdate.total_clicks = Number((acctInsights as any).clicks) || 0;
      accountUpdate.total_results = extractPrimaryResults((acctInsights as any).actions);
    }
    await supabaseAdmin.from("ad_accounts").update(accountUpdate).eq("id", account.id);
  } catch (e) {
    error = e instanceof FbApiError
      ? `[FB ${e.code ?? ""}] ${e.message}${e.fbtrace_id ? ` (trace ${e.fbtrace_id})` : ""}`
      : (e as Error).message;

    console.error(
      `[syncAdAccount] FAILED account=${account.account_name ?? account.fb_account_id} (${account.id})`,
      "\n  error:", error,
      "\n  raw:", e,
    );

    await supabaseAdmin.from("ad_accounts").update({
      last_sync_at: new Date().toISOString(),
      last_sync_status: "failed",
      last_sync_error: error,
    }).eq("id", account.id);
    await supabaseAdmin.from("alerts").insert({
      client_id: account.client_id,
      ad_account_id: account.id,
      type: "sync_error",
      severity: "critical",
      title: "Sync failed",
      message: error,
    });
  }

  const duration = Date.now() - started;
  await supabaseAdmin.from("sync_logs").insert({
    ad_account_id: account.id,
    status: error ? "failed" : "success",
    items_synced: itemsSynced,
    error,
    duration_ms: duration,
    finished_at: new Date().toISOString(),
  });

  return { ok: !error, itemsSynced, error, duration_ms: duration };
}

/** Resolve current request origin (e.g. https://your-app.lovable.app). */
function getOriginFromRequest(): string {
  const req = getRequest();
  return new URL(req.url).origin;
}

/**
 * DISPATCH PATTERN — fan out per-account work to /api/public/hooks/sync-account
 * so each account sync runs in its own Worker invocation.
 */
export async function syncAllAccounts() {
  const health = await checkTokenHealth();
  const legacyToken = await getLegacyToken();

  if (!health.ok && (health.status === "invalid" || health.status === "missing")) {
    const { count: connCount } = await supabaseAdmin
      .from("meta_connections")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true);
    if ((connCount ?? 0) === 0) {
      return { count: 0, results: [], skipped: true, tokenHealth: health };
    }
  }

  const { count: existingCount } = await supabaseAdmin
    .from("ad_accounts")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true);
  const autoImport = existingCount === 0 && legacyToken ? await importVisibleAccountsForSync(legacyToken) : { imported: 0 };

  const { data: accounts } = await supabaseAdmin
    .from("ad_accounts")
    .select("id,client_id,account_name,fb_account_id")
    .eq("is_active", true);

  const origin = getOriginFromRequest();
  const apiKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? "";

  const settled = await Promise.allSettled(
    (accounts ?? []).map(async (a) => {
      const resp = await fetch(`${origin}/api/public/hooks/sync-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": apiKey },
        body: JSON.stringify({ adAccountId: a.id }),
      });
      const text = await resp.text();
      let body: any = null;
      try { body = text ? JSON.parse(text) : null; } catch { body = { raw: text }; }
      if (!resp.ok) throw new Error(body?.error ?? `dispatch HTTP ${resp.status}`);
      return { id: a.id, account_name: a.account_name, ...body };
    }),
  );

  const results = settled.map((s, i) => {
    const a = (accounts ?? [])[i];
    if (s.status === "fulfilled") {
      return { id: a.id, ok: s.value?.ok !== false, error: s.value?.error ?? null, account_name: a.account_name };
    }
    const msg = (s.reason as Error)?.message ?? "dispatch failed";
    console.error(`[syncAllAccounts] dispatch failed for ${a.account_name ?? a.fb_account_id}:`, msg);
    return { id: a.id, ok: false, error: msg, account_name: a.account_name };
  });

  try {
    await evaluateBudgetAlerts();
  } catch (e) {
    console.error("[syncAllAccounts] budget alerts failed", e);
  }

  return { count: results.length, results, tokenHealth: health, autoImport };
}

async function evaluateBudgetAlerts() {
  const { data: clients } = await supabaseAdmin
    .from("clients")
    .select("id,name,monthly_budget, ad_accounts(total_spend)")
    .eq("status", "active");
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  const expectedPct = (dayOfMonth / daysInMonth) * 100;

  for (const c of (clients ?? []) as any[]) {
    const budget = Number(c.monthly_budget) || 0;
    if (budget <= 0) continue;
    const spent = (c.ad_accounts ?? []).reduce((s: number, a: any) => s + (Number(a.total_spend) || 0), 0);
    const pct = (spent / budget) * 100;
    const since = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();

    async function emit(type: string, severity: "info" | "warning" | "critical", title: string, message: string) {
      const { data: existing } = await supabaseAdmin
        .from("alerts").select("id").eq("client_id", c.id).eq("type", type)
        .gte("created_at", since).limit(1);
      if (existing && existing.length) return;
      await supabaseAdmin.from("alerts").insert({ client_id: c.id, type, severity, title, message });
    }

    if (pct >= 100) {
      await emit("budget_exceeded", "critical", `${c.name}: monthly budget exceeded`,
        `Spent ${spent.toFixed(2)} of ${budget.toFixed(2)} (${pct.toFixed(1)}%).`);
    } else if (pct >= 90) {
      await emit("budget_90", "critical", `${c.name}: 90% of monthly budget used`,
        `Spent ${spent.toFixed(2)} of ${budget.toFixed(2)} (${pct.toFixed(1)}%).`);
    } else if (pct >= 75) {
      await emit("budget_75", "warning", `${c.name}: 75% of monthly budget used`,
        `Spent ${spent.toFixed(2)} of ${budget.toFixed(2)} (${pct.toFixed(1)}%).`);
    }
    if (pct - expectedPct >= 20) {
      await emit("pacing_ahead", "warning", `${c.name}: spend pacing ahead of schedule`,
        `Actual ${pct.toFixed(1)}% vs expected ${expectedPct.toFixed(1)}% by today.`);
    }
  }
}

export async function syncConnectionAccounts(connectionId: string) {
  const { data: accounts } = await supabaseAdmin
    .from("ad_accounts")
    .select("id,account_name,fb_account_id")
    .eq("connection_id", connectionId)
    .eq("is_active", true);

  const origin = getOriginFromRequest();
  const apiKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? "";

  const settled = await Promise.allSettled(
    (accounts ?? []).map(async (a) => {
      const resp = await fetch(`${origin}/api/public/hooks/sync-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": apiKey },
        body: JSON.stringify({ adAccountId: a.id }),
      });
      const text = await resp.text();
      let body: any = null;
      try { body = text ? JSON.parse(text) : null; } catch { body = { raw: text }; }
      if (!resp.ok) throw new Error(body?.error ?? `dispatch HTTP ${resp.status}`);
      return body;
    }),
  );

  const results = settled.map((s, i) => {
    const a = (accounts ?? [])[i];
    if (s.status === "fulfilled") {
      return { id: a.id, ok: s.value?.ok !== false, error: s.value?.error ?? null, account_name: a.account_name };
    }
    return { id: a.id, ok: false, error: (s.reason as Error)?.message ?? "dispatch failed", account_name: a.account_name };
  });

  return { count: results.length, results };
}
