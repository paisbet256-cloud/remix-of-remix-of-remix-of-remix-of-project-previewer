//#region node_modules/.nitro/vite/services/ssr/assets/api.server-CX7ebn7X.js
var GRAPH = `https://graph.facebook.com/v21.0`;
var VISIBLE_ENTITY_STATUSES = "['ACTIVE','PAUSED','ARCHIVED','CAMPAIGN_PAUSED','ADSET_PAUSED','IN_PROCESS','WITH_ISSUES','PENDING_REVIEW','DISAPPROVED','PREAPPROVED','PENDING_BILLING_INFO']";
var INSIGHTS_ATTRIBUTION_PARAMS = {
	use_unified_attribution_setting: "true",
	action_report_time: "conversion"
};
function formatDate(d) {
	return d.toISOString().slice(0, 10);
}
function recentRangeThroughToday(days) {
	const until = /* @__PURE__ */ new Date();
	const since = new Date(until);
	since.setUTCDate(since.getUTCDate() - (days - 1));
	return JSON.stringify({
		since: formatDate(since),
		until: formatDate(until)
	});
}
var FbApiError = class extends Error {
	code;
	type;
	fbtrace_id;
	constructor(message, code, type, fbtrace_id) {
		super(message);
		this.code = code;
		this.type = type;
		this.fbtrace_id = fbtrace_id;
	}
};
async function fbFetch(path, params, token) {
	const url = new URL(`${GRAPH}${path.startsWith("/") ? path : "/" + path}`);
	Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
	url.searchParams.set("access_token", token);
	const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
	const json = await res.json();
	if (!res.ok || json.error) {
		const e = json.error ?? {};
		throw new FbApiError(e.message ?? `HTTP ${res.status}`, e.code, e.type, e.fbtrace_id);
	}
	return json;
}
async function fbFetchAll(path, params, token, max = 1e3) {
	let url = `${GRAPH}${path.startsWith("/") ? path : "/" + path}`;
	let first = true;
	const all = [];
	while (true) {
		const u = new URL(url);
		if (first) {
			Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
			first = false;
		}
		u.searchParams.set("access_token", token);
		const res = await fetch(u.toString(), { headers: { Accept: "application/json" } });
		const json = await res.json();
		if (!res.ok || json.error) {
			const e = json.error ?? {};
			throw new FbApiError(e.message ?? `HTTP ${res.status}`, e.code, e.type, e.fbtrace_id);
		}
		if (Array.isArray(json.data)) all.push(...json.data);
		if (all.length >= max) break;
		const next = json.paging?.next;
		if (!next) break;
		url = next;
	}
	return all;
}
var fb = {
	async validateToken(token) {
		return fbFetch("/me", { fields: "id,name" }, token);
	},
	async listBusinesses(token) {
		try {
			return await fbFetchAll("/me/businesses", {
				fields: "id,name",
				limit: "100"
			}, token);
		} catch (e) {
			console.warn("[fb] /me/businesses failed", e);
			return [];
		}
	},
	async listAdAccountsDetailed(token, businessId) {
		const fields = "id,name,account_status,currency,timezone_name,business{id,name}";
		const seen = /* @__PURE__ */ new Map();
		const probes = [];
		const add = (rows) => rows.forEach((r) => {
			if (r?.id) seen.set(r.id, r);
		});
		const probe = async (endpoint, fn) => {
			try {
				const rows = await fn();
				add(rows);
				probes.push({
					endpoint,
					ok: true,
					count: rows.length
				});
			} catch (e) {
				probes.push({
					endpoint,
					ok: false,
					count: 0,
					error: {
						code: e?.code,
						type: e?.type,
						message: e?.message ?? String(e),
						fbtrace_id: e?.fbtrace_id
					}
				});
			}
		};
		await probe("/me/adaccounts", () => fbFetchAll("/me/adaccounts", {
			fields,
			limit: "200"
		}, token));
		if (businessId) {
			const bid = businessId.replace(/^B?_?/, "").trim();
			await probe(`/${bid}/owned_ad_accounts`, () => fbFetchAll(`/${bid}/owned_ad_accounts`, {
				fields,
				limit: "200"
			}, token));
			await probe(`/${bid}/client_ad_accounts`, () => fbFetchAll(`/${bid}/client_ad_accounts`, {
				fields,
				limit: "200"
			}, token));
		}
		return {
			accounts: Array.from(seen.values()),
			probes
		};
	},
	async listAdAccounts(token, businessId) {
		const { accounts } = await this.listAdAccountsDetailed(token, businessId);
		return accounts;
	},
	async probeAccountDataAccess(accounts, token, maxAccounts = 10) {
		const probes = [];
		const probe = async (account, endpoint, fn) => {
			try {
				const rows = await fn();
				probes.push({
					account_id: account.id,
					account_name: account.name,
					endpoint,
					ok: true,
					count: rows.length
				});
			} catch (e) {
				probes.push({
					account_id: account.id,
					account_name: account.name,
					endpoint,
					ok: false,
					count: 0,
					error: {
						code: e?.code,
						type: e?.type,
						message: e?.message ?? String(e),
						fbtrace_id: e?.fbtrace_id
					}
				});
			}
		};
		for (const account of accounts.slice(0, maxAccounts)) {
			await probe(account, `/${account.id}/campaigns`, () => fbFetchAll(`/${account.id}/campaigns`, {
				fields: "id,name,effective_status",
				limit: "1"
			}, token, 1));
			await probe(account, `/${account.id}/adsets`, () => fbFetchAll(`/${account.id}/adsets`, {
				fields: "id,name,effective_status",
				limit: "1"
			}, token, 1));
			await probe(account, `/${account.id}/ads`, () => fbFetchAll(`/${account.id}/ads`, {
				fields: "id,name,effective_status",
				limit: "1"
			}, token, 1));
			await probe(account, `/${account.id}/insights`, () => fbFetchAll(`/${account.id}/insights`, {
				level: "account",
				date_preset: "maximum",
				fields: "spend,reach,impressions,clicks,date_start,date_stop",
				limit: "1",
				...INSIGHTS_ATTRIBUTION_PARAMS
			}, token, 1));
		}
		return probes;
	},
	async getAccount(actId, token) {
		return fbFetch(`/${actId}`, { fields: "id,name,account_status,currency,timezone_name,business{id,name}" }, token);
	},
	async listCampaigns(actId, token) {
		return fbFetchAll(`/${actId}/campaigns`, {
			fields: "id,name,objective,status,effective_status,daily_budget,lifetime_budget,buying_type,start_time,stop_time",
			effective_status: VISIBLE_ENTITY_STATUSES,
			limit: "200"
		}, token);
	},
	async listAdSets(actId, token) {
		return fbFetchAll(`/${actId}/adsets`, {
			fields: "id,name,campaign_id,status,effective_status,daily_budget,lifetime_budget,optimization_goal,billing_event,bid_amount,start_time,end_time",
			effective_status: VISIBLE_ENTITY_STATUSES,
			limit: "300"
		}, token);
	},
	async listAds(actId, token) {
		return fbFetchAll(`/${actId}/ads`, {
			fields: "id,name,adset_id,campaign_id,status,effective_status,creative{id,thumbnail_url,object_story_spec}",
			effective_status: VISIBLE_ENTITY_STATUSES,
			limit: "500"
		}, token);
	},
	async getInsights(actId, token, datePreset = "last_7d", level = "campaign") {
		return fbFetchAll(`/${actId}/insights`, {
			level,
			date_preset: datePreset,
			fields: "campaign_id,campaign_name,adset_id,adset_name,ad_id,ad_name,spend,reach,impressions,clicks,ctr,cpc,cpm,frequency,actions,date_start,date_stop",
			limit: "500",
			...INSIGHTS_ATTRIBUTION_PARAMS
		}, token);
	},
	async getAccountInsights(actId, token, datePreset = "last_7d") {
		return (await fbFetchAll(`/${actId}/insights`, {
			level: "account",
			date_preset: datePreset,
			fields: "spend,reach,impressions,clicks,ctr,cpc,cpm,frequency,actions,date_start,date_stop",
			limit: "1",
			...INSIGHTS_ATTRIBUTION_PARAMS
		}, token))[0] ?? null;
	},
	async getTimeSeries(actId, token, datePreset = "last_7d") {
		const params = {
			level: "account",
			time_increment: "1",
			fields: "spend,reach,impressions,clicks,ctr,cpc,cpm,frequency,actions,date_start,date_stop",
			limit: "100",
			...INSIGHTS_ATTRIBUTION_PARAMS
		};
		if (datePreset === "last_30d") params.time_range = recentRangeThroughToday(30);
		else params.date_preset = datePreset;
		return fbFetchAll(`/${actId}/insights`, params, token);
	}
};
function extractPrimaryResults(actions) {
	if (!actions || !Array.isArray(actions)) return 0;
	for (const t of [
		"onsite_conversion.messaging_conversation_started_7d",
		"onsite_conversion.messaging_first_reply",
		"onsite_conversion.total_messaging_connection",
		"messaging_conversation_started",
		"onsite_conversion.lead_grouped",
		"lead",
		"offsite_conversion.fb_pixel_lead",
		"offsite_conversion.fb_pixel_purchase",
		"purchase",
		"complete_registration",
		"link_click"
	]) {
		const a = actions.find((x) => x.action_type === t);
		if (a) return Number(a.value) || 0;
	}
	return Number(actions[0]?.value) || 0;
}
function normalizeActId(s) {
	const t = s.trim();
	return t.startsWith("act_") ? t : `act_${t.replace(/\D/g, "")}`;
}
//#endregion
export { FbApiError, extractPrimaryResults, fb, normalizeActId };
