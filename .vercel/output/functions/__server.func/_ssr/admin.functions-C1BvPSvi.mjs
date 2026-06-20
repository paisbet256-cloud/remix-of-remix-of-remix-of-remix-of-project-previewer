import { c as createServerFn } from "./esm-I6x-3bX5.mjs";
import { t as createServerRpc } from "./createServerRpc-BWrlMzYt.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bcxi9eKV.mjs";
import { a as numberType, i as literalType, n as booleanType, o as objectType, r as enumType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-C1BvPSvi.js
async function requireAdmin(userId) {
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.mjs");
	const { data, error } = await supabaseAdmin.from("user_roles").select("id").eq("user_id", userId).eq("role", "admin").limit(1);
	if (error) throw new Error(error.message);
	if (data?.length) return supabaseAdmin;
	const { count, error: countError } = await supabaseAdmin.from("user_roles").select("id", {
		count: "exact",
		head: true
	}).eq("role", "admin");
	if (countError) throw new Error(countError.message);
	if ((count ?? 0) === 0) {
		const { data: authUser, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
		if (userError) throw new Error(userError.message);
		const email = authUser.user?.email ?? "";
		const profile = {
			id: userId,
			email,
			full_name: authUser.user?.user_metadata?.full_name || email || "Admin",
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		const { error: profileError } = await supabaseAdmin.from("profiles").upsert(profile, { onConflict: "id" });
		if (profileError) throw new Error(profileError.message);
		const adminRole = {
			user_id: userId,
			role: "admin"
		};
		const { error: roleError } = await supabaseAdmin.from("user_roles").upsert(adminRole, { onConflict: "user_id,role" });
		if (roleError) throw new Error(roleError.message);
		return supabaseAdmin;
	}
	throw new Error("Forbidden — this account is not admin. Sign in with the owner account.");
}
var getSettingsPublic_createServerFn_handler = createServerRpc({
	id: "5ee5c99290e6fb5274ff96dfc680fc4d7845c573fea636f86bc67e651251deee",
	name: "getSettingsPublic",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => getSettingsPublic.__executeServer(opts));
var getSettingsPublic = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getSettingsPublic_createServerFn_handler, async () => {
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.mjs");
	const { data, error } = await supabaseAdmin.from("app_settings").select("fb_system_user_token,fb_app_id,fb_business_id,sync_interval_minutes,auto_sync_enabled,updated_at,fb_verify_token,fb_app_secret,token_status,token_scopes,token_missing_scopes,token_user_name,token_expires_at,token_checked_at,token_error,org_name,org_email,org_phone,org_address,brand_logo_url,brand_primary_color,brand_secondary_color,pref_timezone,pref_currency,pref_language,pref_attribution_window").eq("id", 1).maybeSingle();
	if (error) throw new Error(error.message);
	const d = data ?? {};
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
		pref_attribution_window: d.pref_attribution_window ?? "28d_click"
	};
});
var saveSettings_createServerFn_handler = createServerRpc({
	id: "8b336b7ed9b10382280f4179449979092e995d3c115e8c63183a2f39e8155fc4",
	name: "saveSettings",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => saveSettings.__executeServer(opts));
var saveSettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	token: stringType().optional(),
	fb_app_id: stringType().optional(),
	fb_business_id: stringType().optional(),
	sync_interval_minutes: numberType().min(1).max(1440).optional(),
	auto_sync_enabled: booleanType().optional(),
	fb_verify_token: stringType().max(200).optional(),
	fb_app_secret: stringType().max(200).optional()
}).parse(d)).handler(saveSettings_createServerFn_handler, async ({ data, context }) => {
	const supabaseAdmin = await requireAdmin(context.userId);
	const update = {
		id: 1,
		updated_at: (/* @__PURE__ */ new Date()).toISOString(),
		updated_by: context.userId
	};
	if (data.token !== void 0 && data.token.trim() !== "") update.fb_system_user_token = data.token.trim();
	if (data.fb_app_id !== void 0) update.fb_app_id = data.fb_app_id;
	if (data.fb_business_id !== void 0) update.fb_business_id = data.fb_business_id;
	if (data.sync_interval_minutes !== void 0) update.sync_interval_minutes = data.sync_interval_minutes;
	if (data.auto_sync_enabled !== void 0) update.auto_sync_enabled = data.auto_sync_enabled;
	if (data.fb_verify_token !== void 0 && data.fb_verify_token !== "") update.fb_verify_token = data.fb_verify_token;
	if (data.fb_app_secret !== void 0 && data.fb_app_secret !== "") update.fb_app_secret = data.fb_app_secret;
	const { error } = await supabaseAdmin.from("app_settings").upsert(update, { onConflict: "id" });
	if (error) throw new Error(error.message);
	return { ok: true };
});
var checkTokenHealthNow_createServerFn_handler = createServerRpc({
	id: "4ca178ec85f3c11f3d1d65775065dc9c27106c3b4517f44fd36a98dffad0dbed",
	name: "checkTokenHealthNow",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => checkTokenHealthNow.__executeServer(opts));
var checkTokenHealthNow = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(checkTokenHealthNow_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	const { checkTokenHealth } = await import("./permissions.server-BAfXJezO.mjs");
	return checkTokenHealth();
});
var rotatePortalToken_createServerFn_handler = createServerRpc({
	id: "9e72591e79f7d3b1aa310fb7febc904ef0ddb50d4c4f305c8933b53dd299173a",
	name: "rotatePortalToken",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => rotatePortalToken.__executeServer(opts));
var rotatePortalToken = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	client_id: stringType().uuid(),
	clear: booleanType().optional()
}).parse(d)).handler(rotatePortalToken_createServerFn_handler, async ({ data, context }) => {
	const supabaseAdmin = await requireAdmin(context.userId);
	if (data.clear) {
		const { error } = await supabaseAdmin.from("clients").update({ portal_token: null }).eq("id", data.client_id);
		if (error) throw new Error(error.message);
		return { token: null };
	}
	const arr = new Uint8Array(24);
	crypto.getRandomValues(arr);
	const token = Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
	const { error } = await supabaseAdmin.from("clients").update({ portal_token: token }).eq("id", data.client_id);
	if (error) throw new Error(error.message);
	return { token };
});
var getPortalToken_createServerFn_handler = createServerRpc({
	id: "17bdde9e35b6cfa3c1abdca7af97592b6b76ab92d63e37c1f834bd79062d88f8",
	name: "getPortalToken",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => getPortalToken.__executeServer(opts));
var getPortalToken = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ client_id: stringType().uuid() }).parse(d)).handler(getPortalToken_createServerFn_handler, async ({ data, context }) => {
	const { data: row } = await (await requireAdmin(context.userId)).from("clients").select("portal_token").eq("id", data.client_id).maybeSingle();
	return { token: row?.portal_token ?? null };
});
var testFbToken_createServerFn_handler = createServerRpc({
	id: "96943db2743d97bd35a7a90349b6c08db4244fad88cfb8f712856df1eeabd8b7",
	name: "testFbToken",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => testFbToken.__executeServer(opts));
var testFbToken = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(testFbToken_createServerFn_handler, async ({ context }) => {
	const { data: s } = await (await requireAdmin(context.userId)).from("app_settings").select("fb_system_user_token,fb_business_id").eq("id", 1).maybeSingle();
	const token = s?.fb_system_user_token;
	if (!token) return {
		ok: false,
		error: "No Facebook token configured. Paste your System User token in Settings first.",
		probes: []
	};
	try {
		const { fb } = await import("./api.server-CX7ebn7X.mjs");
		const me = await fb.validateToken(token);
		const { accounts, probes } = await fb.listAdAccountsDetailed(token, s?.fb_business_id);
		const dataProbes = accounts.length > 0 ? await fb.probeAccountDataAccess(accounts, token) : [];
		if (accounts.length === 0) return {
			ok: false,
			user: me,
			accounts: [],
			probes,
			dataProbes,
			error: "Token works, but 0 ad accounts visible. In Business Settings → Users → System Users → select your user → Add Assets → choose your Ad Accounts (Full control). Then set Business ID in Settings here and retry."
		};
		const blocked = dataProbes.filter((p) => !p.ok);
		if (blocked.length > 0) return {
			ok: false,
			user: me,
			accounts,
			probes,
			dataProbes,
			error: `Found ${accounts.length} ad accounts, but Facebook blocks campaign/insights reads. First failed call: ${blocked[0].endpoint} — ${blocked[0].error?.message ?? "permission denied"}`
		};
		return {
			ok: true,
			user: me,
			accounts,
			probes,
			dataProbes
		};
	} catch (e) {
		return {
			ok: false,
			error: e?.message ?? "Token validation failed",
			probes: []
		};
	}
});
var importVisibleAdAccounts_createServerFn_handler = createServerRpc({
	id: "594c2a2c286ec1e22bb11a428ed83afeac7c06f35f2330b2120d3fa2184e72dd",
	name: "importVisibleAdAccounts",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => importVisibleAdAccounts.__executeServer(opts));
var importVisibleAdAccounts = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(importVisibleAdAccounts_createServerFn_handler, async ({ context }) => {
	const supabaseAdmin = await requireAdmin(context.userId);
	const { data: s } = await supabaseAdmin.from("app_settings").select("fb_system_user_token,fb_business_id").eq("id", 1).maybeSingle();
	const token = s?.fb_system_user_token;
	if (!token) throw new Error("No Facebook token configured");
	const { fb } = await import("./api.server-CX7ebn7X.mjs");
	const { accounts } = await fb.listAdAccountsDetailed(token, s?.fb_business_id);
	if (accounts.length === 0) throw new Error("Facebook returned 0 visible ad accounts. Fix asset assignment first.");
	const { data: existingClient } = await supabaseAdmin.from("clients").select("id").eq("slug", "meta-imported-accounts").maybeSingle();
	let clientId = existingClient?.id;
	if (!clientId) {
		const { data: client, error: clientError } = await supabaseAdmin.from("clients").insert({
			name: "Meta Imported Accounts",
			slug: "meta-imported-accounts",
			company: "Facebook Ads",
			created_by: context.userId
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
		is_active: true
	}));
	const { data: imported, error } = await supabaseAdmin.from("ad_accounts").upsert(rows, { onConflict: "fb_account_id" }).select("id,fb_account_id");
	if (error) throw new Error(error.message);
	const { syncAdAccount } = await import("./sync.server-CcW-Yp5J.mjs");
	const syncResults = [];
	for (const account of imported ?? []) {
		const result = await syncAdAccount(account.id);
		syncResults.push({
			id: account.id,
			fb_account_id: account.fb_account_id,
			ok: result.ok,
			error: result.error,
			itemsSynced: result.itemsSynced
		});
	}
	return {
		imported: imported?.length ?? 0,
		syncResults
	};
});
var detectBusinessesFromToken_createServerFn_handler = createServerRpc({
	id: "a65133d2132f57b75cdda183fe4e2bf3116f0f26e18525e4e7e7ec37163757e2",
	name: "detectBusinessesFromToken",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => detectBusinessesFromToken.__executeServer(opts));
var detectBusinessesFromToken = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(detectBusinessesFromToken_createServerFn_handler, async ({ context }) => {
	const { data: s } = await (await requireAdmin(context.userId)).from("app_settings").select("fb_system_user_token").eq("id", 1).maybeSingle();
	const token = s?.fb_system_user_token;
	if (!token) return {
		ok: false,
		businesses: [],
		error: "No token configured"
	};
	try {
		const { fb } = await import("./api.server-CX7ebn7X.mjs");
		return {
			ok: true,
			businesses: await fb.listBusinesses(token)
		};
	} catch (e) {
		return {
			ok: false,
			businesses: [],
			error: e?.message ?? "Failed"
		};
	}
});
var listAvailableAdAccounts_createServerFn_handler = createServerRpc({
	id: "1976cb2abb52099b76530267a51a2f142b7ba666f9ed1dd525186a76e03575f1",
	name: "listAvailableAdAccounts",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => listAvailableAdAccounts.__executeServer(opts));
var listAvailableAdAccounts = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(listAvailableAdAccounts_createServerFn_handler, async ({ context }) => {
	const supabaseAdmin = await requireAdmin(context.userId);
	const { data: s } = await supabaseAdmin.from("app_settings").select("fb_system_user_token,fb_business_id").eq("id", 1).maybeSingle();
	const token = s?.fb_system_user_token;
	const [{ data: existing }, { data: campaigns }] = await Promise.all([supabaseAdmin.from("ad_accounts").select("id,fb_account_id,account_name,currency,timezone_name,account_status,business_name,total_spend,total_reach,total_results,active_campaigns,last_sync_at,last_sync_status,client_id,clients(name,slug)"), supabaseAdmin.from("campaigns").select("id,ad_account_id,name,effective_status,spend,reach,impressions,clicks,results").order("spend", { ascending: false }).limit(1e3)]);
	const campaignMap = /* @__PURE__ */ new Map();
	for (const c of campaigns ?? []) {
		const rows = campaignMap.get(c.ad_account_id) ?? [];
		rows.push(c);
		campaignMap.set(c.ad_account_id, rows);
	}
	const existingByFb = /* @__PURE__ */ new Map();
	for (const row of existing ?? []) existingByFb.set(row.fb_account_id, row);
	let liveAccounts = [];
	let liveError = null;
	if (token) try {
		const { fb } = await import("./api.server-CX7ebn7X.mjs");
		liveAccounts = await fb.listAdAccounts(token, s?.fb_business_id);
	} catch (e) {
		liveError = e?.message ?? "Could not refresh live Meta accounts";
	}
	if (!token && existingByFb.size === 0) throw new Error("No Facebook token configured");
	const merged = /* @__PURE__ */ new Map();
	for (const live of liveAccounts) {
		const db = existingByFb.get(live.id);
		const client = Array.isArray(db?.clients) ? db.clients[0] : db?.clients;
		const accountCampaigns = db?.id ? campaignMap.get(db.id) ?? [] : [];
		merged.set(live.id, {
			...live,
			db_id: db?.id ?? null,
			connectedClientName: client?.name ?? null,
			connectedClientSlug: client?.slug ?? null,
			alreadyConnected: !!client && client.slug !== "meta-imported-accounts",
			isImportBucket: client?.slug === "meta-imported-accounts",
			campaignCount: accountCampaigns.length,
			activeCampaignCount: accountCampaigns.filter((c) => c.effective_status === "ACTIVE").length || Number(db?.active_campaigns ?? 0),
			topCampaigns: accountCampaigns.slice(0, 8).map((c) => ({
				id: c.id,
				name: c.name,
				status: c.effective_status,
				spend: c.spend,
				reach: c.reach,
				impressions: c.impressions,
				clicks: c.clicks,
				results: c.results
			})),
			last_sync_at: db?.last_sync_at ?? null,
			last_sync_status: db?.last_sync_status ?? null
		});
	}
	for (const db of existing ?? []) {
		if (merged.has(db.fb_account_id)) continue;
		const client = Array.isArray(db.clients) ? db.clients[0] : db.clients;
		const accountCampaigns = campaignMap.get(db.id) ?? [];
		merged.set(db.fb_account_id, {
			id: db.fb_account_id,
			name: db.account_name ?? db.fb_account_id,
			account_status: db.account_status,
			currency: db.currency,
			timezone_name: db.timezone_name,
			business: db.business_name ? { name: db.business_name } : void 0,
			db_id: db.id,
			connectedClientName: client?.name ?? null,
			connectedClientSlug: client?.slug ?? null,
			alreadyConnected: !!client && client.slug !== "meta-imported-accounts",
			isImportBucket: client?.slug === "meta-imported-accounts",
			campaignCount: accountCampaigns.length,
			activeCampaignCount: accountCampaigns.filter((c) => c.effective_status === "ACTIVE").length || Number(db.active_campaigns ?? 0),
			topCampaigns: accountCampaigns.slice(0, 8).map((c) => ({
				id: c.id,
				name: c.name,
				status: c.effective_status,
				spend: c.spend,
				reach: c.reach,
				impressions: c.impressions,
				clicks: c.clicks,
				results: c.results
			})),
			last_sync_at: db.last_sync_at,
			last_sync_status: db.last_sync_status,
			cachedOnly: true
		});
	}
	return Array.from(merged.values()).sort((a, b) => (Number(b.campaignCount) || 0) - (Number(a.campaignCount) || 0) || String(a.name).localeCompare(String(b.name))).map((a) => ({
		...a,
		liveError
	}));
});
var createClient_createServerFn_handler = createServerRpc({
	id: "a24c2a6fd36e6f2862f0a9801145db1c26d9bfc22db9581a2abbbd7a00ad7134",
	name: "createClient",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => createClient.__executeServer(opts));
var createClient = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	name: stringType().min(1).max(200),
	slug: stringType().regex(/^[a-z0-9-]+$/).max(80).optional(),
	contact_email: stringType().email().optional().or(literalType("")),
	contact_phone: stringType().max(40).optional(),
	company: stringType().max(200).optional(),
	website: stringType().max(300).optional().or(literalType("")),
	address: stringType().max(500).optional(),
	notes: stringType().max(2e3).optional(),
	monthly_budget: numberType().nonnegative().optional(),
	deposit_amount: numberType().nonnegative().optional(),
	deposit_currency: stringType().max(8).optional(),
	bdt_rate: numberType().nonnegative().optional().nullable(),
	commission_enabled: booleanType().optional(),
	commission_percent: numberType().min(0).max(100).optional(),
	commission_notes: stringType().max(2e3).optional(),
	brand_color: stringType().max(20).optional(),
	ad_account_ids: arrayType(stringType()).optional(),
	campaign_ids: arrayType(stringType().uuid()).optional()
}).parse(d)).handler(createClient_createServerFn_handler, async ({ data, context }) => {
	const supabaseAdmin = await requireAdmin(context.userId);
	const slug = (data.slug && data.slug.length > 0 ? data.slug : data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")) || Math.random().toString(36).slice(2, 10);
	const { error, data: row } = await context.supabase.from("clients").insert({
		name: data.name,
		slug,
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
		created_by: context.userId
	}).select().single();
	if (error) throw new Error(error.message);
	if (data.ad_account_ids && data.ad_account_ids.length > 0 && row) {
		const { data: s } = await supabaseAdmin.from("app_settings").select("fb_system_user_token").eq("id", 1).maybeSingle();
		const token = s?.fb_system_user_token;
		const { fb, normalizeActId } = await import("./api.server-CX7ebn7X.mjs");
		for (const accId of data.ad_account_ids) {
			const actId = normalizeActId(accId);
			const { data: existingAccount } = await supabaseAdmin.from("ad_accounts").select("id").eq("fb_account_id", actId).maybeSingle();
			if (existingAccount?.id) {
				await supabaseAdmin.from("ad_accounts").update({
					client_id: row.id,
					is_active: true
				}).eq("id", existingAccount.id);
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
					is_active: true
				});
			} catch (e) {}
		}
	}
	if (data.campaign_ids && data.campaign_ids.length > 0 && row) {
		const rows = data.campaign_ids.map((campaignId) => ({
			client_id: row.id,
			campaign_id: campaignId
		}));
		const { error: campaignError } = await supabaseAdmin.from("client_campaigns").upsert(rows, { onConflict: "client_id,campaign_id" });
		if (campaignError) throw new Error(campaignError.message);
	}
	return row;
});
var updateClient_createServerFn_handler = createServerRpc({
	id: "7b982528a73dc461515fedfd6f08c441f6be8ed49a0ff9b59c5537ef17c523b2",
	name: "updateClient",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => updateClient.__executeServer(opts));
var updateClient = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	name: stringType().min(1).optional(),
	slug: stringType().regex(/^[a-z0-9-]+$/).optional(),
	contact_email: stringType().optional(),
	contact_phone: stringType().optional(),
	company: stringType().optional(),
	website: stringType().optional(),
	address: stringType().optional(),
	notes: stringType().optional(),
	monthly_budget: numberType().optional(),
	deposit_amount: numberType().optional(),
	deposit_currency: stringType().optional(),
	bdt_rate: numberType().nullable().optional(),
	commission_enabled: booleanType().optional(),
	commission_percent: numberType().optional(),
	commission_notes: stringType().optional(),
	brand_color: stringType().optional(),
	status: enumType([
		"active",
		"paused",
		"archived"
	]).optional()
}).parse(d)).handler(updateClient_createServerFn_handler, async ({ data, context }) => {
	const { id, ...rest } = data;
	const { error } = await context.supabase.from("clients").update(rest).eq("id", id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var deleteClient_createServerFn_handler = createServerRpc({
	id: "5d69605a540eb154dab0f96d8ae25317f3aca15bbf4fc776dc27f7a682a2c05f",
	name: "deleteClient",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => deleteClient.__executeServer(opts));
var deleteClient = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteClient_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("clients").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var connectAdAccount_createServerFn_handler = createServerRpc({
	id: "7a121a2dcc8521d42bf2f35a6ee6b18ffeb39873e3f3ba515014dc777c34fa0f",
	name: "connectAdAccount",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => connectAdAccount.__executeServer(opts));
var connectAdAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	client_id: stringType().uuid(),
	fb_account_id: stringType().min(1)
}).parse(d)).handler(connectAdAccount_createServerFn_handler, async ({ data, context }) => {
	const supabaseAdmin = await requireAdmin(context.userId);
	const { data: s } = await supabaseAdmin.from("app_settings").select("fb_system_user_token").eq("id", 1).maybeSingle();
	const token = s?.fb_system_user_token;
	if (!token) throw new Error("Configure your Facebook token in Settings first");
	const { fb, normalizeActId } = await import("./api.server-CX7ebn7X.mjs");
	const actId = normalizeActId(data.fb_account_id);
	const info = await fb.getAccount(actId, token);
	const { error, data: row } = await supabaseAdmin.from("ad_accounts").insert({
		client_id: data.client_id,
		fb_account_id: info.id,
		account_name: info.name,
		currency: info.currency,
		timezone_name: info.timezone_name,
		account_status: info.account_status,
		business_name: info.business?.name ?? null
	}).select().single();
	if (error) throw new Error(error.message);
	try {
		const { syncAdAccount } = await import("./sync.server-CcW-Yp5J.mjs");
		await syncAdAccount(row.id);
	} catch (e) {
		console.error("[connectAdAccount] initial sync failed", e);
	}
	return row;
});
var disconnectAdAccount_createServerFn_handler = createServerRpc({
	id: "832ee181b4992b7e78d18e1a9e76fc2ef9b55d3b8aa82d56331b376fb6d7a87b",
	name: "disconnectAdAccount",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => disconnectAdAccount.__executeServer(opts));
var disconnectAdAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(disconnectAdAccount_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("ad_accounts").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var syncAllAccountsNow_createServerFn_handler = createServerRpc({
	id: "1619975a36ff61cb9a14a5e67d97fbe3e539c12dfcce7d42a99a5b717f875f19",
	name: "syncAllAccountsNow",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => syncAllAccountsNow.__executeServer(opts));
var syncAllAccountsNow = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(syncAllAccountsNow_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	const { syncAllAccounts } = await import("./sync.server-CcW-Yp5J.mjs");
	return await syncAllAccounts();
});
var syncOneAccount_createServerFn_handler = createServerRpc({
	id: "5bcccb45770e887275ac0ddffd5245da9c79bdc062b1308b9851de6cdc4eb8f6",
	name: "syncOneAccount",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => syncOneAccount.__executeServer(opts));
var syncOneAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(syncOneAccount_createServerFn_handler, async ({ data, context }) => {
	await requireAdmin(context.userId);
	const { syncAdAccount } = await import("./sync.server-CcW-Yp5J.mjs");
	return syncAdAccount(data.id);
});
var refreshAllData_createServerFn_handler = createServerRpc({
	id: "47af7bc1e01bbeff499042d94c2f854c010cdcc67e44469cb3ac2b2ebc4f8372",
	name: "refreshAllData",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => refreshAllData.__executeServer(opts));
var refreshAllData = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(refreshAllData_createServerFn_handler, async ({ context }) => {
	const supabaseAdmin = await requireAdmin(context.userId);
	await supabaseAdmin.from("insights_snapshots").delete().not("id", "is", null);
	await supabaseAdmin.from("ads").delete().not("id", "is", null);
	await supabaseAdmin.from("ad_sets").delete().not("id", "is", null);
	await supabaseAdmin.from("campaigns").delete().not("id", "is", null);
	await supabaseAdmin.from("sync_logs").delete().not("id", "is", null);
	await supabaseAdmin.from("ad_accounts").update({
		total_spend: 0,
		total_reach: 0,
		total_results: 0,
		active_campaigns: 0,
		last_sync_status: null,
		last_sync_error: null,
		last_sync_at: null
	}).not("id", "is", null);
	const { syncAllAccounts } = await import("./sync.server-CcW-Yp5J.mjs");
	return {
		cleared: true,
		...await syncAllAccounts()
	};
});
var retestAndReimport_createServerFn_handler = createServerRpc({
	id: "ab8ec0f5d50f519b6af8fe924c4bad33de598960b90d20ba3a4194d20d94644b",
	name: "retestAndReimport",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => retestAndReimport.__executeServer(opts));
var retestAndReimport = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(retestAndReimport_createServerFn_handler, async ({ context }) => {
	const supabaseAdmin = await requireAdmin(context.userId);
	const { data: s } = await supabaseAdmin.from("app_settings").select("fb_system_user_token,fb_business_id").eq("id", 1).maybeSingle();
	const token = s?.fb_system_user_token;
	if (!token) return {
		ok: false,
		error: "No Facebook token configured.",
		imported: 0
	};
	const { fb } = await import("./api.server-CX7ebn7X.mjs");
	const { checkTokenHealth } = await import("./permissions.server-BAfXJezO.mjs");
	const health = await checkTokenHealth();
	if (health.status !== "ok") return {
		ok: false,
		error: health.error ?? `Token status: ${health.status}`,
		health,
		imported: 0
	};
	const { accounts } = await fb.listAdAccountsDetailed(token, s?.fb_business_id);
	if (accounts.length === 0) return {
		ok: false,
		error: "Token works, but 0 ad accounts visible. Assign assets in Meta Business Settings.",
		imported: 0,
		health
	};
	const { data: existingClient } = await supabaseAdmin.from("clients").select("id").eq("slug", "meta-imported-accounts").maybeSingle();
	let clientId = existingClient?.id;
	if (!clientId) {
		const { data: created, error: ce } = await supabaseAdmin.from("clients").insert({
			name: "Meta Imported Accounts",
			slug: "meta-imported-accounts",
			company: "Facebook Ads",
			created_by: context.userId
		}).select("id").single();
		if (ce) throw new Error(ce.message);
		clientId = created.id;
	}
	const rows = accounts.map((a) => ({
		client_id: clientId,
		fb_account_id: a.id,
		account_name: a.name,
		currency: a.currency,
		timezone_name: a.timezone_name,
		account_status: a.account_status,
		business_name: a.business?.name ?? null,
		is_active: true
	}));
	const { data: imported, error } = await supabaseAdmin.from("ad_accounts").upsert(rows, { onConflict: "fb_account_id" }).select("id,fb_account_id,account_name");
	if (error) throw new Error(error.message);
	const { syncAdAccount } = await import("./sync.server-CcW-Yp5J.mjs");
	const syncResults = [];
	for (const a of imported ?? []) try {
		const r = await syncAdAccount(a.id);
		syncResults.push({
			id: a.id,
			fb_account_id: a.fb_account_id,
			account_name: a.account_name,
			ok: r.ok,
			error: r.error,
			itemsSynced: r.itemsSynced
		});
	} catch (e) {
		syncResults.push({
			id: a.id,
			fb_account_id: a.fb_account_id,
			account_name: a.account_name,
			ok: false,
			error: e?.message ?? "sync failed"
		});
	}
	return {
		ok: true,
		imported: imported?.length ?? 0,
		accounts,
		syncResults,
		health
	};
});
var verifyCampaignMapping_createServerFn_handler = createServerRpc({
	id: "a8792639bc1e0ea68a07a49b65e0dc08ab811e553b2b0b9f735bc024dddc53da",
	name: "verifyCampaignMapping",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => verifyCampaignMapping.__executeServer(opts));
var verifyCampaignMapping = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(verifyCampaignMapping_createServerFn_handler, async ({ context }) => {
	const supabaseAdmin = await requireAdmin(context.userId);
	const { data: s } = await supabaseAdmin.from("app_settings").select("fb_system_user_token").eq("id", 1).maybeSingle();
	const token = s?.fb_system_user_token;
	if (!token) throw new Error("No Facebook token configured");
	const { fb } = await import("./api.server-CX7ebn7X.mjs");
	const { data: accounts } = await supabaseAdmin.from("ad_accounts").select("id,fb_account_id,account_name").eq("is_active", true);
	const report = [];
	for (const a of accounts ?? []) try {
		const live = await fb.listCampaigns(a.fb_account_id, token);
		const { data: dbRows } = await supabaseAdmin.from("campaigns").select("fb_campaign_id,name,status,effective_status").eq("ad_account_id", a.id);
		const liveMap = new Map(live.map((c) => [String(c.id), c]));
		const dbMap = new Map((dbRows ?? []).map((c) => [String(c.fb_campaign_id), c]));
		const missing_in_db = [];
		const stale_in_db = [];
		const diffs = [];
		let matched = 0;
		for (const [id, lc] of liveMap) {
			const dc = dbMap.get(id);
			if (!dc) {
				missing_in_db.push({
					id,
					name: lc.name,
					status: lc.effective_status ?? lc.status
				});
				continue;
			}
			matched++;
			if ((dc.name ?? "") !== (lc.name ?? "")) diffs.push({
				id,
				field: "name",
				fb: lc.name ?? null,
				db: dc.name ?? null
			});
			if ((dc.effective_status ?? dc.status ?? "") !== (lc.effective_status ?? lc.status ?? "")) diffs.push({
				id,
				field: "status",
				fb: lc.effective_status ?? lc.status ?? null,
				db: dc.effective_status ?? dc.status ?? null
			});
		}
		for (const [id, dc] of dbMap) if (!liveMap.has(id)) stale_in_db.push({
			id,
			name: dc.name
		});
		report.push({
			ad_account_id: a.id,
			fb_account_id: a.fb_account_id,
			account_name: a.account_name,
			fb_count: liveMap.size,
			db_count: dbMap.size,
			matched,
			missing_in_db,
			stale_in_db,
			diffs
		});
	} catch (e) {
		report.push({
			ad_account_id: a.id,
			fb_account_id: a.fb_account_id,
			account_name: a.account_name,
			fb_count: 0,
			db_count: 0,
			matched: 0,
			missing_in_db: [],
			stale_in_db: [],
			diffs: [],
			error: e?.message ?? "fetch failed"
		});
	}
	return {
		generated_at: (/* @__PURE__ */ new Date()).toISOString(),
		report
	};
});
var saveOrgInfo_createServerFn_handler = createServerRpc({
	id: "07cba1d6db5cae99f676db280c5093a7a3505d8684cb915bdcf084f431183e4d",
	name: "saveOrgInfo",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => saveOrgInfo.__executeServer(opts));
var saveOrgInfo = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	org_name: stringType().trim().max(200).optional(),
	org_email: stringType().trim().max(255).optional().or(literalType("")),
	org_phone: stringType().trim().max(50).optional(),
	org_address: stringType().trim().max(1e3).optional()
}).parse(d)).handler(saveOrgInfo_createServerFn_handler, async ({ data, context }) => {
	const { error } = await (await requireAdmin(context.userId)).from("app_settings").upsert({
		id: 1,
		org_name: data.org_name ?? null,
		org_email: data.org_email ?? null,
		org_phone: data.org_phone ?? null,
		org_address: data.org_address ?? null,
		updated_at: (/* @__PURE__ */ new Date()).toISOString(),
		updated_by: context.userId
	}, { onConflict: "id" });
	if (error) throw new Error(error.message);
	return { ok: true };
});
var saveBranding_createServerFn_handler = createServerRpc({
	id: "8aabb484ae7bc53f076ebaffc97dc1c74e28a6e65deaa11fc66acca70ed9b7fa",
	name: "saveBranding",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => saveBranding.__executeServer(opts));
var saveBranding = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	brand_logo_url: stringType().trim().max(2e3).optional(),
	brand_primary_color: stringType().trim().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
	brand_secondary_color: stringType().trim().regex(/^#[0-9A-Fa-f]{6}$/).optional()
}).parse(d)).handler(saveBranding_createServerFn_handler, async ({ data, context }) => {
	const supabaseAdmin = await requireAdmin(context.userId);
	const update = {
		id: 1,
		updated_at: (/* @__PURE__ */ new Date()).toISOString(),
		updated_by: context.userId
	};
	if (data.brand_logo_url !== void 0) update.brand_logo_url = data.brand_logo_url || null;
	if (data.brand_primary_color !== void 0) update.brand_primary_color = data.brand_primary_color;
	if (data.brand_secondary_color !== void 0) update.brand_secondary_color = data.brand_secondary_color;
	const { error } = await supabaseAdmin.from("app_settings").upsert(update, { onConflict: "id" });
	if (error) throw new Error(error.message);
	return { ok: true };
});
var savePreferences_createServerFn_handler = createServerRpc({
	id: "bd762f6c6acd30a1d366b88262c964aa5bbe99b5ed55a54d2dfb745829dec3b4",
	name: "savePreferences",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => savePreferences.__executeServer(opts));
var savePreferences = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	pref_timezone: stringType().trim().max(100).optional(),
	pref_currency: stringType().trim().max(10).optional(),
	pref_language: stringType().trim().max(20).optional(),
	pref_attribution_window: stringType().trim().max(50).optional()
}).parse(d)).handler(savePreferences_createServerFn_handler, async ({ data, context }) => {
	const { error } = await (await requireAdmin(context.userId)).from("app_settings").upsert({
		id: 1,
		...data,
		updated_at: (/* @__PURE__ */ new Date()).toISOString(),
		updated_by: context.userId
	}, { onConflict: "id" });
	if (error) throw new Error(error.message);
	return { ok: true };
});
var updateMyProfile_createServerFn_handler = createServerRpc({
	id: "b42020008c86901cfe77b761b1ba1882632503ef802617bc2dfa8bf7614a3922",
	name: "updateMyProfile",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => updateMyProfile.__executeServer(opts));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	full_name: stringType().trim().min(1).max(150).optional(),
	new_password: stringType().min(8).max(200).optional(),
	current_password: stringType().min(1).max(200).optional()
}).parse(d)).handler(updateMyProfile_createServerFn_handler, async ({ data, context }) => {
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.mjs");
	if (data.full_name !== void 0) {
		const { error } = await supabaseAdmin.from("profiles").update({
			full_name: data.full_name,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", context.userId);
		if (error) throw new Error(error.message);
	}
	if (data.new_password) {
		const { error } = await supabaseAdmin.auth.admin.updateUserById(context.userId, { password: data.new_password });
		if (error) throw new Error(error.message);
	}
	return { ok: true };
});
var clearAllData_createServerFn_handler = createServerRpc({
	id: "53e1587fc11d7a23790c7863fe4e1e87f921dc920fbfa071e453b40a040d44c4",
	name: "clearAllData",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => clearAllData.__executeServer(opts));
var clearAllData = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ confirm: literalType("CLEAR ALL DATA") }).parse(d)).handler(clearAllData_createServerFn_handler, async ({ context }) => {
	const { data, error } = await (await requireAdmin(context.userId)).rpc("admin_clear_all_data", { _user_id: context.userId });
	if (error) throw new Error(error.message);
	return {
		ok: true,
		result: data
	};
});
var listAvailableAdSets_createServerFn_handler = createServerRpc({
	id: "354247f9013d303096b8e165c5bddf96e20761a9eefd9415cb75c0a45ee41a45",
	name: "listAvailableAdSets",
	filename: "src/lib/fb/admin.functions.ts"
}, (opts) => listAvailableAdSets.__executeServer(opts));
var listAvailableAdSets = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(listAvailableAdSets_createServerFn_handler, async ({ context }) => {
	const supabaseAdmin = await requireAdmin(context.userId);
	const { data: s } = await supabaseAdmin.from("app_settings").select("fb_system_user_token,fb_business_id").eq("id", 1).maybeSingle();
	const token = s?.fb_system_user_token;
	if (!token) throw new Error("No Facebook token configured. Open Meta connection settings first.");
	const { fb } = await import("./api.server-CX7ebn7X.mjs");
	let liveAccounts = [];
	let liveError = null;
	try {
		liveAccounts = await fb.listAdAccounts(token, s?.fb_business_id);
	} catch (e) {
		liveError = e?.message ?? "Could not reach Meta";
	}
	const [{ data: existingAccounts }, { data: existingCampaigns }] = await Promise.all([supabaseAdmin.from("ad_accounts").select("id,fb_account_id,account_name,client_id,clients(name,slug)"), supabaseAdmin.from("campaigns").select("id,fb_campaign_id,ad_account_id")]);
	const accByFb = /* @__PURE__ */ new Map();
	for (const a of existingAccounts ?? []) accByFb.set(a.fb_account_id, a);
	const internalCampaignByFb = /* @__PURE__ */ new Map();
	for (const c of existingCampaigns ?? []) if (c.fb_campaign_id) internalCampaignByFb.set(c.fb_campaign_id, c.id);
	const MAX_ACCOUNTS = 20;
	const accountsToFetch = liveAccounts.slice(0, MAX_ACCOUNTS);
	const results = [];
	const perAccountErrors = [];
	await Promise.all(accountsToFetch.map(async (acc) => {
		try {
			const [campaigns, adsets, ads] = await Promise.all([
				fb.listCampaigns(acc.id, token),
				fb.listAdSets(acc.id, token),
				fb.listAds(acc.id, token)
			]);
			const campaignNameById = /* @__PURE__ */ new Map();
			for (const c of campaigns) campaignNameById.set(c.id, c.name);
			const thumbByAdset = /* @__PURE__ */ new Map();
			for (const ad of ads) {
				const adsetId = ad.adset_id;
				if (!adsetId || thumbByAdset.has(adsetId)) continue;
				const thumb = ad?.creative?.thumbnail_url ?? null;
				if (thumb) thumbByAdset.set(adsetId, thumb);
			}
			const dbAcc = accByFb.get(acc.id);
			const client = Array.isArray(dbAcc?.clients) ? dbAcc.clients[0] : dbAcc?.clients;
			const assignedClientName = client && client.slug !== "meta-imported-accounts" ? client.name : null;
			const assignedClientSlug = client && client.slug !== "meta-imported-accounts" ? client.slug : null;
			for (const a of adsets) results.push({
				id: a.id,
				name: a.name,
				status: a.effective_status ?? a.status ?? "UNKNOWN",
				campaign_id: a.campaign_id,
				campaign_name: campaignNameById.get(a.campaign_id) ?? "(unknown campaign)",
				account_id: acc.id,
				account_name: acc.name ?? acc.id,
				currency: acc.currency ?? null,
				thumbnail_url: thumbByAdset.get(a.id) ?? null,
				internal_campaign_id: internalCampaignByFb.get(a.campaign_id) ?? null,
				assignedClientName,
				assignedClientSlug
			});
		} catch (e) {
			perAccountErrors.push({
				account_id: acc.id,
				account_name: acc.name ?? acc.id,
				error: e?.message ?? String(e)
			});
		}
	}));
	return {
		adsets: results,
		accounts: accountsToFetch.map((a) => ({
			id: a.id,
			name: a.name,
			currency: a.currency ?? null
		})),
		totalAccounts: liveAccounts.length,
		truncatedAccounts: Math.max(0, liveAccounts.length - MAX_ACCOUNTS),
		perAccountErrors,
		liveError
	};
});
//#endregion
export { checkTokenHealthNow_createServerFn_handler, clearAllData_createServerFn_handler, connectAdAccount_createServerFn_handler, createClient_createServerFn_handler, deleteClient_createServerFn_handler, detectBusinessesFromToken_createServerFn_handler, disconnectAdAccount_createServerFn_handler, getPortalToken_createServerFn_handler, getSettingsPublic_createServerFn_handler, importVisibleAdAccounts_createServerFn_handler, listAvailableAdAccounts_createServerFn_handler, listAvailableAdSets_createServerFn_handler, refreshAllData_createServerFn_handler, retestAndReimport_createServerFn_handler, rotatePortalToken_createServerFn_handler, saveBranding_createServerFn_handler, saveOrgInfo_createServerFn_handler, savePreferences_createServerFn_handler, saveSettings_createServerFn_handler, syncAllAccountsNow_createServerFn_handler, syncOneAccount_createServerFn_handler, testFbToken_createServerFn_handler, updateClient_createServerFn_handler, updateMyProfile_createServerFn_handler, verifyCampaignMapping_createServerFn_handler };
