import { c as createServerFn } from "./esm-I6x-3bX5.mjs";
import { t as createServerRpc } from "./createServerRpc-BWrlMzYt.mjs";
import { a as numberType, n as booleanType, o as objectType, r as enumType, s as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.functions-By1_qg48.js
async function loadClientWithAuth(slug, token) {
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.mjs");
	const code = slug.toUpperCase();
	let { data: client, error } = await supabaseAdmin.from("clients").select("id,name,slug,client_code,company,logo_url,brand_color,status,monthly_budget,deposit_amount,deposit_currency,bdt_rate,portal_token,commission_enabled,commission_percent").eq("client_code", code).maybeSingle();
	if (!client && !error) {
		const r2 = await supabaseAdmin.from("clients").select("id,name,slug,client_code,company,logo_url,brand_color,status,monthly_budget,deposit_amount,deposit_currency,bdt_rate,portal_token,commission_enabled,commission_percent").eq("slug", slug).maybeSingle();
		client = r2.data;
		error = r2.error;
	}
	if (error) {
		console.error("[portal] client lookup error", {
			slug,
			code,
			error: error.message
		});
		throw new Error(error.message);
	}
	if (!client) {
		console.error("[portal] client not found", {
			slug,
			code
		});
		return { notFound: true };
	}
	if (client.status === "archived") return { notFound: true };
	if (client.portal_token && client.portal_token !== token) return { forbidden: true };
	return {
		client,
		supabaseAdmin
	};
}
async function getTokenForPortalAccount(supabaseAdmin, account, legacyToken) {
	if (account.connection_id) {
		const { data: c } = await supabaseAdmin.from("meta_connections").select("fb_system_user_token").eq("id", account.connection_id).maybeSingle();
		if (c?.fb_system_user_token) return c.fb_system_user_token;
	}
	return legacyToken || null;
}
var getClientPortalData_createServerFn_handler = createServerRpc({
	id: "d3880dadeea232d2ef18d24a4befa01f47698d367670378dcb886a550b9cc09c",
	name: "getClientPortalData",
	filename: "src/lib/fb/portal.functions.ts"
}, (opts) => getClientPortalData.__executeServer(opts));
var getClientPortalData = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	slug: stringType().min(1).max(120),
	token: stringType().min(4).max(128).optional()
}).parse(d)).handler(getClientPortalData_createServerFn_handler, async ({ data }) => {
	const r = await loadClientWithAuth(data.slug, data.token);
	if ("notFound" in r) return { notFound: true };
	if ("forbidden" in r) return { forbidden: true };
	const { client, supabaseAdmin } = r;
	const { data: assigned } = await supabaseAdmin.from("client_campaigns").select("campaign_id").eq("client_id", client.id);
	const assignedCampaignIds = (assigned ?? []).map((r) => r.campaign_id);
	let accounts = [];
	let campaigns = [];
	let adSets = [];
	let ads = [];
	if (assignedCampaignIds.length) {
		const { data: assignedCampaigns } = await supabaseAdmin.from("campaigns").select("id,ad_account_id,name,objective,effective_status,daily_budget,lifetime_budget,spend,reach,impressions,clicks,ctr,cpc,cpm,frequency,results").in("id", assignedCampaignIds).order("spend", { ascending: false }).limit(50);
		campaigns = assignedCampaigns ?? [];
		const { data: assignedAdSets } = await supabaseAdmin.from("ad_sets").select("id,campaign_id,ad_account_id,name,effective_status,daily_budget,lifetime_budget,optimization_goal,start_time,end_time,spend,reach,impressions,clicks,ctr,cpc,cpm,results,frequency").in("campaign_id", assignedCampaignIds).order("spend", { ascending: false }).limit(200);
		adSets = assignedAdSets ?? [];
		const { data: assignedAds } = await supabaseAdmin.from("ads").select("id,ad_account_id,campaign_id,ad_set_id,name,fb_ad_id,effective_status,creative_thumbnail,preview_link,spend,reach,impressions,clicks,ctr,results").in("campaign_id", assignedCampaignIds).order("spend", { ascending: false }).limit(200);
		ads = assignedAds ?? [];
		const campaignAccountIds = Array.from(new Set(campaigns.map((c) => c.ad_account_id).filter(Boolean)));
		if (campaignAccountIds.length) {
			const { data: scopedAccounts } = await supabaseAdmin.from("ad_accounts").select("id,connection_id,fb_account_id,account_name,currency,timezone_name,business_name,total_spend,total_reach,total_impressions,total_clicks,total_results,active_campaigns,last_sync_at,last_sync_status,account_status").in("id", campaignAccountIds).eq("is_active", true);
			accounts = scopedAccounts ?? [];
		}
	} else {
		const { data: clientAccounts } = await supabaseAdmin.from("ad_accounts").select("id,connection_id,fb_account_id,account_name,currency,timezone_name,business_name,total_spend,total_reach,total_impressions,total_clicks,total_results,active_campaigns,last_sync_at,last_sync_status,account_status").eq("client_id", client.id).eq("is_active", true);
		accounts = clientAccounts ?? [];
		const accountIds = accounts.map((a) => a.id);
		if (accountIds.length) {
			const [{ data: accountCampaigns }, { data: accountAdSets }, { data: accountAds }] = await Promise.all([
				supabaseAdmin.from("campaigns").select("id,ad_account_id,name,objective,effective_status,daily_budget,lifetime_budget,spend,reach,impressions,clicks,ctr,cpc,cpm,frequency,results").in("ad_account_id", accountIds).order("spend", { ascending: false }).limit(50),
				supabaseAdmin.from("ad_sets").select("id,campaign_id,ad_account_id,name,effective_status,daily_budget,lifetime_budget,optimization_goal,start_time,end_time,spend,reach,impressions,clicks,ctr,cpc,cpm,results,frequency").in("ad_account_id", accountIds).order("spend", { ascending: false }).limit(200),
				supabaseAdmin.from("ads").select("id,ad_account_id,campaign_id,ad_set_id,name,fb_ad_id,effective_status,creative_thumbnail,preview_link,spend,reach,impressions,clicks,ctr,results").in("ad_account_id", accountIds).order("spend", { ascending: false }).limit(200)
			]);
			campaigns = accountCampaigns ?? [];
			adSets = accountAdSets ?? [];
			ads = accountAds ?? [];
		}
	}
	const accountIds = accounts.map((a) => a.id);
	let liveTimeSeries = null;
	if (accounts.length > 0) try {
		const { fb } = await import("./api.server-CX7ebn7X.mjs");
		const { data: settings } = await supabaseAdmin.from("app_settings").select("fb_system_user_token").eq("id", 1).maybeSingle();
		const liveRows = [];
		for (const account of accounts) {
			const token = await getTokenForPortalAccount(supabaseAdmin, account, settings?.fb_system_user_token);
			if (!token) continue;
			const rows = await fb.getTimeSeries(account.fb_account_id, token, "last_30d");
			liveRows.push(...rows.map((row) => ({
				...row,
				ad_account_id: account.id
			})));
		}
		liveTimeSeries = liveRows;
	} catch (e) {
		liveTimeSeries = null;
	}
	const [{ data: timeSeries }, { data: alerts }] = await Promise.all([accountIds.length ? supabaseAdmin.from("insights_snapshots").select("ad_account_id,date_start,spend,reach,impressions,clicks,results").in("ad_account_id", accountIds).eq("level", "account").gte("date_start", (/* @__PURE__ */ new Date(Date.now() - 29 * 864e5)).toISOString().slice(0, 10)).order("date_start", { ascending: true }) : Promise.resolve({ data: [] }), supabaseAdmin.from("alerts").select("id,type,severity,title,message,created_at").eq("client_id", client.id).order("created_at", { ascending: false }).limit(15)]);
	const { portal_token: _t, ...clientPub } = client;
	return {
		notFound: false,
		forbidden: false,
		client: clientPub,
		accounts,
		campaigns,
		adSets,
		ads,
		assignedCampaignIds,
		timeSeries: liveTimeSeries ?? timeSeries ?? [],
		alerts: alerts ?? []
	};
});
var getClientInsightsForExport_createServerFn_handler = createServerRpc({
	id: "d8b2001416b0964535be965fe1f9dcdc78cb1523957457d80b665cbb3cc975c6",
	name: "getClientInsightsForExport",
	filename: "src/lib/fb/portal.functions.ts"
}, (opts) => getClientInsightsForExport.__executeServer(opts));
var getClientInsightsForExport = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	slug: stringType().min(1).max(120),
	token: stringType().min(4).max(128).optional(),
	level: enumType([
		"campaign",
		"adset",
		"ad"
	])
}).parse(d)).handler(getClientInsightsForExport_createServerFn_handler, async ({ data }) => {
	const r = await loadClientWithAuth(data.slug, data.token);
	if ("notFound" in r) return { forbidden: true };
	if ("forbidden" in r) return { forbidden: true };
	const { client, supabaseAdmin } = r;
	const { data: accounts } = await supabaseAdmin.from("ad_accounts").select("id,fb_account_id,account_name,currency").eq("client_id", client.id).eq("is_active", true);
	const ids = (accounts ?? []).map((a) => a.id);
	if (!ids.length) return {
		forbidden: false,
		rows: []
	};
	const acctById = new Map((accounts ?? []).map((a) => [a.id, a]));
	const table = data.level === "campaign" ? "campaigns" : data.level === "adset" ? "ad_sets" : "ads";
	const { data: rows } = await supabaseAdmin.from(table).select("ad_account_id,name,effective_status,spend,reach,impressions,clicks,ctr,cpc,cpm,results,frequency").in("ad_account_id", ids).order("spend", { ascending: false });
	return {
		forbidden: false,
		rows: (rows ?? []).map((r) => {
			const acct = acctById.get(r.ad_account_id);
			return {
				client: client.name,
				ad_account: acct?.account_name ?? acct?.fb_account_id ?? "",
				currency: acct?.currency ?? "",
				name: r.name,
				status: r.effective_status,
				spend: r.spend,
				reach: r.reach,
				impressions: r.impressions,
				clicks: r.clicks,
				ctr: r.ctr,
				cpc: r.cpc,
				cpm: r.cpm,
				results: r.results,
				frequency: r.frequency
			};
		})
	};
});
var triggerClientSync_createServerFn_handler = createServerRpc({
	id: "6f3c4ab677ae65fd810f2d5f186454870f9d14c2b9b7b94ff8bd2eee7aa9f681",
	name: "triggerClientSync",
	filename: "src/lib/fb/portal.functions.ts"
}, (opts) => triggerClientSync.__executeServer(opts));
var triggerClientSync = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	slug: stringType().min(1).max(120),
	token: stringType().min(4).max(128).optional(),
	minAgeSec: numberType().int().min(0).max(3600).optional(),
	force: booleanType().optional()
}).parse(d)).handler(triggerClientSync_createServerFn_handler, async ({ data }) => {
	const r = await loadClientWithAuth(data.slug, data.token);
	if ("notFound" in r) return {
		ok: false,
		reason: "not-found"
	};
	if ("forbidden" in r) return {
		ok: false,
		reason: "forbidden"
	};
	const { client, supabaseAdmin } = r;
	const { data: assigned } = await supabaseAdmin.from("client_campaigns").select("campaign_id").eq("client_id", client.id);
	const assignedIds = (assigned ?? []).map((a) => a.campaign_id);
	let accountIds = [];
	if (assignedIds.length) {
		const { data: cs } = await supabaseAdmin.from("campaigns").select("ad_account_id").in("id", assignedIds);
		accountIds = Array.from(new Set((cs ?? []).map((c) => c.ad_account_id).filter(Boolean)));
	} else {
		const { data: as } = await supabaseAdmin.from("ad_accounts").select("id").eq("client_id", client.id).eq("is_active", true);
		accountIds = (as ?? []).map((a) => a.id);
	}
	if (!accountIds.length) return {
		ok: true,
		synced: 0,
		skipped: 0
	};
	const minAgeSec = data.minAgeSec ?? 50;
	const cutoff = (/* @__PURE__ */ new Date(Date.now() - minAgeSec * 1e3)).toISOString();
	const { data: accounts } = await supabaseAdmin.from("ad_accounts").select("id,last_sync_at").in("id", accountIds);
	const toSync = (accounts ?? []).filter((a) => data.force || !a.last_sync_at || a.last_sync_at < cutoff);
	if (!toSync.length) return {
		ok: true,
		synced: 0,
		skipped: accountIds.length
	};
	const { syncAdAccount } = await import("./sync.server-CcW-Yp5J.mjs");
	return {
		ok: true,
		synced: (await Promise.allSettled(toSync.map((a) => syncAdAccount(a.id)))).filter((r) => r.status === "fulfilled").length,
		skipped: accountIds.length - toSync.length
	};
});
//#endregion
export { getClientInsightsForExport_createServerFn_handler, getClientPortalData_createServerFn_handler, triggerClientSync_createServerFn_handler };
