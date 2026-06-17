import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

type ProfileUpsert = {
  id: string;
  email: string;
  full_name: string;
  updated_at: string;
};

type AdminRoleUpsert = {
  user_id: string;
  role: "admin";
};

async function requireAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "admin")
    .limit(1);
  if (error) throw new Error(error.message);
  if (data?.length) return supabaseAdmin;

  const { count, error: countError } = await supabaseAdmin
    .from("user_roles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");
  if (countError) throw new Error(countError.message);

  if ((count ?? 0) === 0) {
    const { data: authUser, error: userError } =
      await supabaseAdmin.auth.admin.getUserById(userId);
    if (userError) throw new Error(userError.message);
    const email = authUser.user?.email ?? "";
    const fullName =
      (authUser.user?.user_metadata?.full_name as string | undefined) ||
      email ||
      "Admin";
    const profile: ProfileUpsert = {
      id: userId,
      email,
      full_name: fullName,
      updated_at: new Date().toISOString(),
    };

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert(profile, { onConflict: "id" });
    if (profileError) throw new Error(profileError.message);

    const adminRole: AdminRoleUpsert = { user_id: userId, role: "admin" };
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .upsert(adminRole, { onConflict: "user_id,role" });
    if (roleError) throw new Error(roleError.message);
    return supabaseAdmin;
  }

  throw new Error("Forbidden — this account is not admin. Sign in with the owner account.");
}

// ============ Settings ============
export const getSettingsPublic = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("app_settings")
      .select("fb_system_user_token,fb_app_id,fb_business_id,sync_interval_minutes,auto_sync_enabled,updated_at,fb_verify_token,fb_app_secret,token_status,token_scopes,token_missing_scopes,token_user_name,token_expires_at,token_checked_at,token_error,org_name,org_email,org_phone,org_address,brand_logo_url,brand_primary_color,brand_secondary_color,pref_timezone,pref_currency,pref_language,pref_attribution_window")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    const d: any = data ?? {};
    return {
      has_token: !!d.fb_system_user_token,
      fb_app_id: d.fb_app_id ?? null,
      fb_business_id: d.fb_business_id ?? null,
      sync_interval_minutes: d.sync_interval_minutes ?? 5,
      auto_sync_enabled: d.auto_sync_enabled ?? true,
      updated_at: d.updated_at ?? null,
      has_verify_token: !!d.fb_verify_token,
      has_app_secret: !!d.fb_app_secret,
      token_status: d.token_status ?? null,
      token_scopes: d.token_scopes ?? null,
      token_missing_scopes: d.token_missing_scopes ?? null,
      token_user_name: d.token_user_name ?? null,
      token_expires_at: d.token_expires_at ?? null,
      token_checked_at: d.token_checked_at ?? null,
      token_error: d.token_error ?? null,
      org_name: d.org_name ?? null,
      org_email: d.org_email ?? null,
      org_phone: d.org_phone ?? null,
      org_address: d.org_address ?? null,
      brand_logo_url: d.brand_logo_url ?? null,
      brand_primary_color: d.brand_primary_color ?? "#1F2240",
      brand_secondary_color: d.brand_secondary_color ?? "#8B5CF6",
      pref_timezone: d.pref_timezone ?? "Asia/Dhaka",
      pref_currency: d.pref_currency ?? "USD",
      pref_language: d.pref_language ?? "en",
      pref_attribution_window: d.pref_attribution_window ?? "28d_click",
    };
  });

export const saveSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    token?: string; fb_app_id?: string; fb_business_id?: string;
    sync_interval_minutes?: number; auto_sync_enabled?: boolean;
    fb_verify_token?: string; fb_app_secret?: string;
  }) =>
    z.object({
      token: z.string().optional(),
      fb_app_id: z.string().optional(),
      fb_business_id: z.string().optional(),
      sync_interval_minutes: z.number().min(1).max(1440).optional(),
      auto_sync_enabled: z.boolean().optional(),
      fb_verify_token: z.string().max(200).optional(),
      fb_app_secret: z.string().max(200).optional(),
    }).parse(d))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const update: Record<string, any> = { id: 1, updated_at: new Date().toISOString(), updated_by: context.userId };
    if (data.token !== undefined && data.token.trim() !== "") update.fb_system_user_token = data.token.trim();
    if (data.fb_app_id !== undefined) update.fb_app_id = data.fb_app_id;
    if (data.fb_business_id !== undefined) update.fb_business_id = data.fb_business_id;
    if (data.sync_interval_minutes !== undefined) update.sync_interval_minutes = data.sync_interval_minutes;
    if (data.auto_sync_enabled !== undefined) update.auto_sync_enabled = data.auto_sync_enabled;
    if (data.fb_verify_token !== undefined && data.fb_verify_token !== "") update.fb_verify_token = data.fb_verify_token;
    if (data.fb_app_secret !== undefined && data.fb_app_secret !== "") update.fb_app_secret = data.fb_app_secret;

    const { error } = await supabaseAdmin.from("app_settings").upsert(update as any, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Run a full token health check (scopes + expiry) on demand. Also runs at the
// start of every cron sync via syncAllAccounts → checkTokenHealth.
export const checkTokenHealthNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const { checkTokenHealth } = await import("./permissions.server");
    return checkTokenHealth();
  });

// Rotate (or clear) a per-client portal access token used for verified ownership.
export const rotatePortalToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { client_id: string; clear?: boolean }) =>
    z.object({ client_id: z.string().uuid(), clear: z.boolean().optional() }).parse(d))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    if (data.clear) {
      const { error } = await supabaseAdmin.from("clients").update({ portal_token: null }).eq("id", data.client_id);
      if (error) throw new Error(error.message);
      return { token: null as string | null };
    }
    const arr = new Uint8Array(24);
    crypto.getRandomValues(arr);
    const token = Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
    const { error } = await supabaseAdmin.from("clients").update({ portal_token: token }).eq("id", data.client_id);
    if (error) throw new Error(error.message);
    return { token };
  });

// Reveal the active portal token (admin only). Returns null if not set.
export const getPortalToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { client_id: string }) => z.object({ client_id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { data: row } = await supabaseAdmin.from("clients").select("portal_token").eq("id", data.client_id).maybeSingle();
    return { token: (row?.portal_token ?? null) as string | null };
  });

export const testFbToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { data: s } = await supabaseAdmin.from("app_settings").select("fb_system_user_token,fb_business_id").eq("id", 1).maybeSingle();
    const token = s?.fb_system_user_token;
    if (!token) return { ok: false, error: "No Facebook token configured. Paste your System User token in Settings first.", probes: [] as any[] };
    try {
      const { fb } = await import("./api.server");
      const me = await fb.validateToken(token);
      const { accounts, probes } = await fb.listAdAccountsDetailed(token, s?.fb_business_id);
      const dataProbes = accounts.length > 0 ? await fb.probeAccountDataAccess(accounts, token) : [];
      if (accounts.length === 0) {
        return {
          ok: false,
          user: me,
          accounts: [],
          probes,
          dataProbes,
          error: "Token works, but 0 ad accounts visible. In Business Settings → Users → System Users → select your user → Add Assets → choose your Ad Accounts (Full control). Then set Business ID in Settings here and retry.",
        };
      }
      const blocked = dataProbes.filter((p) => !p.ok);
      if (blocked.length > 0) {
        return {
          ok: false,
          user: me,
          accounts,
          probes,
          dataProbes,
          error: `Found ${accounts.length} ad accounts, but Facebook blocks campaign/insights reads. First failed call: ${blocked[0].endpoint} — ${blocked[0].error?.message ?? "permission denied"}`,
        };
      }
      return { ok: true, user: me, accounts, probes, dataProbes };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? "Token validation failed", probes: [] as any[] };
    }
  });

export const importVisibleAdAccounts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { data: s } = await supabaseAdmin.from("app_settings").select("fb_system_user_token,fb_business_id").eq("id", 1).maybeSingle();
    const token = s?.fb_system_user_token;
    if (!token) throw new Error("No Facebook token configured");
    const { fb } = await import("./api.server");
    const { accounts } = await fb.listAdAccountsDetailed(token, s?.fb_business_id);
    if (accounts.length === 0) throw new Error("Facebook returned 0 visible ad accounts. Fix asset assignment first.");

    const { data: existingClient } = await supabaseAdmin.from("clients").select("id").eq("slug", "meta-imported-accounts").maybeSingle();
    let clientId = existingClient?.id as string | undefined;
    if (!clientId) {
      const { data: client, error: clientError } = await supabaseAdmin.from("clients").insert({
        name: "Meta Imported Accounts",
        slug: "meta-imported-accounts",
        company: "Facebook Ads",
        created_by: context.userId,
      }).select("id").single();
      if (clientError) throw new Error(clientError.message);
      clientId = client.id;
    }

    const rows = accounts.map((a) => ({
      client_id: clientId,
      fb_account_id: a.id,
      account_name: a.name,
      currency: a.currency,
      timezone_name: a.timezone_name,
      account_status: a.account_status,
      business_name: a.business?.name ?? null,
      is_active: true,
    }));
    const { data: imported, error } = await supabaseAdmin.from("ad_accounts").upsert(rows, { onConflict: "fb_account_id" }).select("id,fb_account_id");
    if (error) throw new Error(error.message);

    const { syncAdAccount } = await import("./sync.server");
    const syncResults = [] as Array<{ id: string; fb_account_id: string; ok: boolean; error?: string | null; itemsSynced?: number }>;
    for (const account of imported ?? []) {
      const result = await syncAdAccount(account.id);
      syncResults.push({ id: account.id, fb_account_id: account.fb_account_id, ok: result.ok, error: result.error, itemsSynced: result.itemsSynced });
    }
    return { imported: imported?.length ?? 0, syncResults };
  });

// Detect Business Manager accounts the System User token has access to.
// Used to auto-suggest Business ID in Settings.
export const detectBusinessesFromToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { data: s } = await supabaseAdmin.from("app_settings").select("fb_system_user_token").eq("id", 1).maybeSingle();
    const token = s?.fb_system_user_token;
    if (!token) return { ok: false, businesses: [] as Array<{ id: string; name: string }>, error: "No token configured" };
    try {
      const { fb } = await import("./api.server");
      const businesses = await fb.listBusinesses(token);
      return { ok: true, businesses };
    } catch (e: any) {
      return { ok: false, businesses: [] as Array<{ id: string; name: string }>, error: e?.message ?? "Failed" };
    }
  });

// ============ List available FB ad accounts (for connecting new accounts) ============
export const listAvailableAdAccounts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { data: s } = await supabaseAdmin.from("app_settings").select("fb_system_user_token,fb_business_id").eq("id", 1).maybeSingle();
    const token = s?.fb_system_user_token;
    const [{ data: existing }, { data: campaigns }] = await Promise.all([
      supabaseAdmin
        .from("ad_accounts")
        .select("id,fb_account_id,account_name,currency,timezone_name,account_status,business_name,total_spend,total_reach,total_results,active_campaigns,last_sync_at,last_sync_status,client_id,clients(name,slug)"),
      supabaseAdmin
        .from("campaigns")
        .select("id,ad_account_id,name,effective_status,spend,reach,impressions,clicks,results")
        .order("spend", { ascending: false })
        .limit(1000),
    ]);

    const campaignMap = new Map<string, any[]>();
    for (const c of campaigns ?? []) {
      const rows = campaignMap.get(c.ad_account_id) ?? [];
      rows.push(c);
      campaignMap.set(c.ad_account_id, rows);
    }

    const existingByFb = new Map<string, any>();
    for (const row of existing ?? []) existingByFb.set(row.fb_account_id, row);

    let liveAccounts: any[] = [];
    let liveError: string | null = null;
    if (token) {
      try {
        const { fb } = await import("./api.server");
        liveAccounts = await fb.listAdAccounts(token, s?.fb_business_id);
      } catch (e: any) {
        liveError = e?.message ?? "Could not refresh live Meta accounts";
      }
    }

    if (!token && existingByFb.size === 0) throw new Error("No Facebook token configured");

    const merged = new Map<string, any>();
    for (const live of liveAccounts) {
      const db = existingByFb.get(live.id);
      const client = Array.isArray(db?.clients) ? db.clients[0] : db?.clients;
      const accountCampaigns = db?.id ? (campaignMap.get(db.id) ?? []) : [];
      merged.set(live.id, {
        ...live,
        db_id: db?.id ?? null,
        connectedClientName: client?.name ?? null,
        connectedClientSlug: client?.slug ?? null,
        alreadyConnected: !!client && client.slug !== "meta-imported-accounts",
        isImportBucket: client?.slug === "meta-imported-accounts",
        campaignCount: accountCampaigns.length,
        activeCampaignCount: accountCampaigns.filter((c) => c.effective_status === "ACTIVE").length || Number(db?.active_campaigns ?? 0),
        topCampaigns: accountCampaigns.slice(0, 8).map((c) => ({ id: c.id, name: c.name, status: c.effective_status, spend: c.spend, reach: c.reach, impressions: c.impressions, clicks: c.clicks, results: c.results })),
        last_sync_at: db?.last_sync_at ?? null,
        last_sync_status: db?.last_sync_status ?? null,
      });
    }
    for (const db of existing ?? []) {
      if (merged.has(db.fb_account_id)) continue;
      const client = Array.isArray((db as any).clients) ? (db as any).clients[0] : (db as any).clients;
      const accountCampaigns = campaignMap.get(db.id) ?? [];
      merged.set(db.fb_account_id, {
        id: db.fb_account_id,
        name: db.account_name ?? db.fb_account_id,
        account_status: db.account_status,
        currency: db.currency,
        timezone_name: db.timezone_name,
        business: db.business_name ? { name: db.business_name } : undefined,
        db_id: db.id,
        connectedClientName: client?.name ?? null,
        connectedClientSlug: client?.slug ?? null,
        alreadyConnected: !!client && client.slug !== "meta-imported-accounts",
        isImportBucket: client?.slug === "meta-imported-accounts",
        campaignCount: accountCampaigns.length,
        activeCampaignCount: accountCampaigns.filter((c) => c.effective_status === "ACTIVE").length || Number(db.active_campaigns ?? 0),
        topCampaigns: accountCampaigns.slice(0, 8).map((c) => ({ id: c.id, name: c.name, status: c.effective_status, spend: c.spend, reach: c.reach, impressions: c.impressions, clicks: c.clicks, results: c.results })),
        last_sync_at: db.last_sync_at,
        last_sync_status: db.last_sync_status,
        cachedOnly: true,
      });
    }

    return Array.from(merged.values())
      .sort((a, b) => (Number(b.campaignCount) || 0) - (Number(a.campaignCount) || 0) || String(a.name).localeCompare(String(b.name)))
      .map((a) => ({ ...a, liveError }));
  });

// ============ Clients ============
export const createClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) =>
    z.object({
      name: z.string().min(1).max(200),
      slug: z.string().regex(/^[a-z0-9-]+$/).max(80).optional(),
      contact_email: z.string().email().optional().or(z.literal("")),
      contact_phone: z.string().max(40).optional(),
      company: z.string().max(200).optional(),
      website: z.string().max(300).optional().or(z.literal("")),
      address: z.string().max(500).optional(),
      notes: z.string().max(2000).optional(),
      monthly_budget: z.number().nonnegative().optional(),
      deposit_amount: z.number().nonnegative().optional(),
      deposit_currency: z.string().max(8).optional(),
      bdt_rate: z.number().nonnegative().optional().nullable(),
      commission_enabled: z.boolean().optional(),
      commission_percent: z.number().min(0).max(100).optional(),
      commission_notes: z.string().max(2000).optional(),
      brand_color: z.string().max(20).optional(),
      ad_account_ids: z.array(z.string()).optional(),
      campaign_ids: z.array(z.string().uuid()).optional(),
    }).parse(d))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const slug = (data.slug && data.slug.length > 0 ? data.slug : data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""))
      || Math.random().toString(36).slice(2, 10);
    const { error, data: row } = await context.supabase.from("clients").insert({
      name: data.name, slug,
      contact_email: data.contact_email || null,
      contact_phone: data.contact_phone || null,
      company: data.company || null,
      website: data.website || null,
      address: data.address || null,
      notes: data.notes || null,
      monthly_budget: data.monthly_budget ?? 0,
      deposit_amount: data.deposit_amount ?? 0,
      deposit_currency: data.deposit_currency || "USD",
      bdt_rate: data.bdt_rate ?? null,
      commission_enabled: !!data.commission_enabled,
      commission_percent: data.commission_percent ?? 0,
      commission_notes: data.commission_notes || null,
      brand_color: data.brand_color || null,
      created_by: context.userId,
    }).select().single();
    if (error) throw new Error(error.message);

    // Connect selected ad accounts to this client. Accounts imported during sync
    // first live under the internal "Meta Imported Accounts" bucket, so move
    // those rows instead of hiding them or creating duplicates.
    if (data.ad_account_ids && data.ad_account_ids.length > 0 && row) {
      const { data: s } = await supabaseAdmin.from("app_settings").select("fb_system_user_token").eq("id", 1).maybeSingle();
      const token = s?.fb_system_user_token;
      const { fb, normalizeActId } = await import("./api.server");
      for (const accId of data.ad_account_ids) {
        const actId = normalizeActId(accId);
        const { data: existingAccount } = await supabaseAdmin
          .from("ad_accounts")
          .select("id")
          .eq("fb_account_id", actId)
          .maybeSingle();
        if (existingAccount?.id) {
          await supabaseAdmin.from("ad_accounts").update({ client_id: row.id, is_active: true }).eq("id", existingAccount.id);
          continue;
        }
        if (!token) continue;
        try {
          const info = await fb.getAccount(actId, token);
          await supabaseAdmin.from("ad_accounts").insert({
            client_id: row.id,
            fb_account_id: actId,
            account_name: info.name,
            currency: info.currency,
            timezone_name: info.timezone_name,
            account_status: info.account_status,
            business_name: info.business?.name ?? null,
            is_active: true,
          });
        } catch (e) { /* keep saving the partner even if one account fails */ }
      }
    }
    if (data.campaign_ids && data.campaign_ids.length > 0 && row) {
      const rows = data.campaign_ids.map((campaignId: string) => ({ client_id: row.id, campaign_id: campaignId }));
      const { error: campaignError } = await supabaseAdmin.from("client_campaigns").upsert(rows, { onConflict: "client_id,campaign_id" });
      if (campaignError) throw new Error(campaignError.message);
    }
    return row;
  });

export const updateClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => z.object({
    id: z.string().uuid(),
    name: z.string().min(1).optional(),
    slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
    contact_email: z.string().optional(),
    contact_phone: z.string().optional(),
    company: z.string().optional(),
    website: z.string().optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
    monthly_budget: z.number().optional(),
    deposit_amount: z.number().optional(),
    deposit_currency: z.string().optional(),
    bdt_rate: z.number().nullable().optional(),
    commission_enabled: z.boolean().optional(),
    commission_percent: z.number().optional(),
    commission_notes: z.string().optional(),
    brand_color: z.string().optional(),
    status: z.enum(["active", "paused", "archived"]).optional(),
  }).parse(d))
  .handler(async ({ data, context }) => {
    const { id, ...rest } = data;
    const { error } = await context.supabase.from("clients").update(rest).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });


export const deleteClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("clients").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ Ad accounts ============
export const connectAdAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { client_id: string; fb_account_id: string }) =>
    z.object({ client_id: z.string().uuid(), fb_account_id: z.string().min(1) }).parse(d))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { data: s } = await supabaseAdmin.from("app_settings").select("fb_system_user_token").eq("id", 1).maybeSingle();
    const token = s?.fb_system_user_token;
    if (!token) throw new Error("Configure your Facebook token in Settings first");
    const { fb, normalizeActId } = await import("./api.server");
    const actId = normalizeActId(data.fb_account_id);
    const info = await fb.getAccount(actId, token);
    const { error, data: row } = await supabaseAdmin.from("ad_accounts").insert({
      client_id: data.client_id,
      fb_account_id: info.id,
      account_name: info.name,
      currency: info.currency,
      timezone_name: info.timezone_name,
      account_status: info.account_status,
      business_name: info.business?.name ?? null,
    }).select().single();
    if (error) throw new Error(error.message);
    // Kick off first sync
    try {
      const { syncAdAccount } = await import("./sync.server");
      await syncAdAccount(row.id);
    } catch (e) {
      console.error("[connectAdAccount] initial sync failed", e);
    }
    return row;
  });

export const disconnectAdAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("ad_accounts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ Manual sync ============
export const syncAllAccountsNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const { syncAllAccounts } = await import("./sync.server");
    const res = await syncAllAccounts();
    return res;
  });

export const syncOneAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await requireAdmin(context.userId);
    const { syncAdAccount } = await import("./sync.server");
    return syncAdAccount(data.id);
  });

// ============ Refresh all data — wipe cached metrics, force full re-sync ============
export const refreshAllData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    // Wipe cached metric tables (keep ad_accounts + clients + settings).
    await supabaseAdmin.from("insights_snapshots").delete().not("id", "is", null);
    await supabaseAdmin.from("ads").delete().not("id", "is", null);
    await supabaseAdmin.from("ad_sets").delete().not("id", "is", null);
    await supabaseAdmin.from("campaigns").delete().not("id", "is", null);
    await supabaseAdmin.from("sync_logs").delete().not("id", "is", null);
    // Reset cached totals on accounts so dashboard zeros until sync completes.
    await supabaseAdmin.from("ad_accounts").update({
      total_spend: 0, total_reach: 0, total_results: 0, active_campaigns: 0,
      last_sync_status: null, last_sync_error: null, last_sync_at: null,
    }).not("id", "is", null);
    const { syncAllAccounts } = await import("./sync.server");
    const res = await syncAllAccounts();
    return { cleared: true, ...res };
  });

// ============ Re-test token + re-import visible accounts in one click ============
export const retestAndReimport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { data: s } = await supabaseAdmin.from("app_settings")
      .select("fb_system_user_token,fb_business_id").eq("id", 1).maybeSingle();
    const token = s?.fb_system_user_token;
    if (!token) return { ok: false, error: "No Facebook token configured.", imported: 0 };
    const { fb } = await import("./api.server");
    const { checkTokenHealth } = await import("./permissions.server");
    const health = await checkTokenHealth();
    if (health.status !== "ok") {
      return { ok: false, error: health.error ?? `Token status: ${health.status}`, health, imported: 0 };
    }
    const { accounts } = await fb.listAdAccountsDetailed(token, s?.fb_business_id);
    if (accounts.length === 0) {
      return { ok: false, error: "Token works, but 0 ad accounts visible. Assign assets in Meta Business Settings.", imported: 0, health };
    }
    const { data: existingClient } = await supabaseAdmin.from("clients").select("id").eq("slug", "meta-imported-accounts").maybeSingle();
    let clientId = existingClient?.id as string | undefined;
    if (!clientId) {
      const { data: created, error: ce } = await supabaseAdmin.from("clients").insert({
        name: "Meta Imported Accounts", slug: "meta-imported-accounts", company: "Facebook Ads", created_by: context.userId,
      }).select("id").single();
      if (ce) throw new Error(ce.message);
      clientId = created.id;
    }
    const rows = accounts.map((a) => ({
      client_id: clientId, fb_account_id: a.id, account_name: a.name,
      currency: a.currency, timezone_name: a.timezone_name,
      account_status: a.account_status, business_name: a.business?.name ?? null, is_active: true,
    }));
    const { data: imported, error } = await supabaseAdmin.from("ad_accounts")
      .upsert(rows, { onConflict: "fb_account_id" }).select("id,fb_account_id,account_name");
    if (error) throw new Error(error.message);
    const { syncAdAccount } = await import("./sync.server");
    const syncResults: Array<{ id: string; fb_account_id: string; account_name: string | null; ok: boolean; error?: string | null; itemsSynced?: number }> = [];
    for (const a of imported ?? []) {
      try {
        const r = await syncAdAccount(a.id);
        syncResults.push({ id: a.id, fb_account_id: a.fb_account_id, account_name: a.account_name, ok: r.ok, error: r.error, itemsSynced: r.itemsSynced });
      } catch (e: any) {
        syncResults.push({ id: a.id, fb_account_id: a.fb_account_id, account_name: a.account_name, ok: false, error: e?.message ?? "sync failed" });
      }
    }
    return { ok: true, imported: imported?.length ?? 0, accounts, syncResults, health };
  });

// ============ Campaign-mapping verification: diff FB live IDs vs DB ============
export const verifyCampaignMapping = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { data: s } = await supabaseAdmin.from("app_settings").select("fb_system_user_token").eq("id", 1).maybeSingle();
    const token = s?.fb_system_user_token;
    if (!token) throw new Error("No Facebook token configured");
    const { fb } = await import("./api.server");
    const { data: accounts } = await supabaseAdmin.from("ad_accounts")
      .select("id,fb_account_id,account_name").eq("is_active", true);
    const report: Array<{
      ad_account_id: string; fb_account_id: string; account_name: string | null;
      fb_count: number; db_count: number; matched: number;
      missing_in_db: Array<{ id: string; name: string; status?: string }>;
      stale_in_db: Array<{ id: string; name: string | null }>;
      diffs: Array<{ id: string; field: "name" | "status"; fb: string | null; db: string | null }>;
      error?: string;
    }> = [];
    for (const a of accounts ?? []) {
      try {
        const live = await fb.listCampaigns(a.fb_account_id, token);
        const { data: dbRows } = await supabaseAdmin.from("campaigns")
          .select("fb_campaign_id,name,status,effective_status").eq("ad_account_id", a.id);
        const liveMap = new Map(live.map((c: any) => [String(c.id), c]));
        const dbMap = new Map((dbRows ?? []).map((c: any) => [String(c.fb_campaign_id), c]));
        const missing_in_db: any[] = [];
        const stale_in_db: any[] = [];
        const diffs: any[] = [];
        let matched = 0;
        for (const [id, lc] of liveMap) {
          const dc = dbMap.get(id);
          if (!dc) { missing_in_db.push({ id, name: lc.name, status: lc.effective_status ?? lc.status }); continue; }
          matched++;
          if ((dc.name ?? "") !== (lc.name ?? "")) diffs.push({ id, field: "name", fb: lc.name ?? null, db: dc.name ?? null });
          if ((dc.effective_status ?? dc.status ?? "") !== (lc.effective_status ?? lc.status ?? "")) {
            diffs.push({ id, field: "status", fb: lc.effective_status ?? lc.status ?? null, db: dc.effective_status ?? dc.status ?? null });
          }
        }
        for (const [id, dc] of dbMap) if (!liveMap.has(id)) stale_in_db.push({ id, name: dc.name });
        report.push({
          ad_account_id: a.id, fb_account_id: a.fb_account_id, account_name: a.account_name,
          fb_count: liveMap.size, db_count: dbMap.size, matched,
          missing_in_db, stale_in_db, diffs,
        });
      } catch (e: any) {
        report.push({
          ad_account_id: a.id, fb_account_id: a.fb_account_id, account_name: a.account_name,
          fb_count: 0, db_count: 0, matched: 0, missing_in_db: [], stale_in_db: [], diffs: [],
          error: e?.message ?? "fetch failed",
        });
      }
    }
    return { generated_at: new Date().toISOString(), report };
  });

// ============ Settings: Org / Branding / Preferences ============
export const saveOrgInfo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { org_name?: string; org_email?: string; org_phone?: string; org_address?: string }) =>
    z.object({
      org_name: z.string().trim().max(200).optional(),
      org_email: z.string().trim().max(255).optional().or(z.literal("")),
      org_phone: z.string().trim().max(50).optional(),
      org_address: z.string().trim().max(1000).optional(),
    }).parse(d))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.from("app_settings").upsert({
      id: 1,
      org_name: data.org_name ?? null,
      org_email: data.org_email ?? null,
      org_phone: data.org_phone ?? null,
      org_address: data.org_address ?? null,
      updated_at: new Date().toISOString(),
      updated_by: context.userId,
    } as any, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const saveBranding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { brand_logo_url?: string; brand_primary_color?: string; brand_secondary_color?: string }) =>
    z.object({
      brand_logo_url: z.string().trim().max(2000).optional(),
      brand_primary_color: z.string().trim().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
      brand_secondary_color: z.string().trim().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    }).parse(d))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const update: Record<string, any> = { id: 1, updated_at: new Date().toISOString(), updated_by: context.userId };
    if (data.brand_logo_url !== undefined) update.brand_logo_url = data.brand_logo_url || null;
    if (data.brand_primary_color !== undefined) update.brand_primary_color = data.brand_primary_color;
    if (data.brand_secondary_color !== undefined) update.brand_secondary_color = data.brand_secondary_color;
    const { error } = await supabaseAdmin.from("app_settings").upsert(update as any, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const savePreferences = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { pref_timezone?: string; pref_currency?: string; pref_language?: string; pref_attribution_window?: string }) =>
    z.object({
      pref_timezone: z.string().trim().max(100).optional(),
      pref_currency: z.string().trim().max(10).optional(),
      pref_language: z.string().trim().max(20).optional(),
      pref_attribution_window: z.string().trim().max(50).optional(),
    }).parse(d))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.from("app_settings").upsert({
      id: 1,
      ...data,
      updated_at: new Date().toISOString(),
      updated_by: context.userId,
    } as any, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { full_name?: string; new_password?: string; current_password?: string }) =>
    z.object({
      full_name: z.string().trim().min(1).max(150).optional(),
      new_password: z.string().min(8).max(200).optional(),
      current_password: z.string().min(1).max(200).optional(),
    }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.full_name !== undefined) {
      const { error } = await supabaseAdmin.from("profiles")
        .update({ full_name: data.full_name, updated_at: new Date().toISOString() })
        .eq("id", context.userId);
      if (error) throw new Error(error.message);
    }
    if (data.new_password) {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(context.userId, {
        password: data.new_password,
      });
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const clearAllData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { confirm: string }) =>
    z.object({ confirm: z.literal("CLEAR ALL DATA") }).parse(d))
  .handler(async ({ context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { data, error } = await supabaseAdmin.rpc("admin_clear_all_data", { _user_id: context.userId });
    if (error) throw new Error(error.message);
    return { ok: true, result: data };
  });
