import { fb } from "./api.server-CX7ebn7X.mjs";
import { supabaseAdmin } from "./client.server-D1oHePJa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/permissions.server-BAfXJezO.js
var REQUIRED_SCOPES = [
	"ads_read",
	"ads_management",
	"business_management"
];
async function fbJson(url) {
	return (await fetch(url, { headers: { Accept: "application/json" } })).json();
}
async function checkTokenHealth() {
	const { data: s } = await supabaseAdmin.from("app_settings").select("fb_system_user_token").eq("id", 1).maybeSingle();
	const token = s?.fb_system_user_token;
	const checkedAt = (/* @__PURE__ */ new Date()).toISOString();
	if (!token) {
		await supabaseAdmin.from("app_settings").update({
			token_status: "missing",
			token_error: "No token configured",
			token_checked_at: checkedAt,
			token_scopes: null,
			token_missing_scopes: null,
			token_user_name: null,
			token_expires_at: null
		}).eq("id", 1);
		return {
			ok: false,
			status: "missing",
			error: "No token configured"
		};
	}
	try {
		const me = await fb.validateToken(token);
		const perm = await fbJson(`https://graph.facebook.com/v21.0/me/permissions?access_token=${encodeURIComponent(token)}`);
		if (perm.error) throw new Error(perm.error.message);
		const granted = (perm.data ?? []).filter((p) => p.status === "granted").map((p) => p.permission);
		const missing = REQUIRED_SCOPES.filter((sc) => !granted.includes(sc));
		let expiresAt = null;
		try {
			const exp = (await fbJson(`https://graph.facebook.com/v21.0/debug_token?input_token=${encodeURIComponent(token)}&access_token=${encodeURIComponent(token)}`))?.data?.expires_at;
			if (typeof exp === "number" && exp > 0) expiresAt = (/* @__PURE__ */ new Date(exp * 1e3)).toISOString();
		} catch {}
		const expiringSoon = !!expiresAt && new Date(expiresAt).getTime() - Date.now() < 7 * 864e5;
		const status = missing.length ? "missing_scopes" : expiringSoon ? "expiring" : "ok";
		await supabaseAdmin.from("app_settings").update({
			token_status: status,
			token_scopes: granted,
			token_missing_scopes: missing,
			token_user_name: me?.name ?? null,
			token_expires_at: expiresAt,
			token_checked_at: checkedAt,
			token_error: null
		}).eq("id", 1);
		if (missing.length) await dedupedAlert("token_scopes", "warning", "Facebook token missing required scopes", `Missing: ${missing.join(", ")}. Regenerate the System User token with the correct permissions.`);
		if (expiringSoon) await dedupedAlert("token_expiring", "warning", "Facebook token expiring soon", `Expires ${new Date(expiresAt).toLocaleString()}. Regenerate a never-expiring System User token.`);
		return {
			ok: status === "ok",
			status,
			user_name: me?.name ?? null,
			granted,
			missing,
			expires_at: expiresAt
		};
	} catch (e) {
		const msg = e?.message ?? "Token validation failed";
		await supabaseAdmin.from("app_settings").update({
			token_status: "invalid",
			token_error: msg,
			token_checked_at: checkedAt
		}).eq("id", 1);
		await dedupedAlert("token_invalid", "critical", "Facebook token invalid or expired", msg);
		return {
			ok: false,
			status: "invalid",
			error: msg
		};
	}
}
async function checkConnectionHealth(connectionId) {
	const { data: c } = await supabaseAdmin.from("meta_connections").select("fb_system_user_token").eq("id", connectionId).maybeSingle();
	const token = c?.fb_system_user_token;
	const checkedAt = (/* @__PURE__ */ new Date()).toISOString();
	if (!token) {
		await supabaseAdmin.from("meta_connections").update({
			token_status: "missing",
			token_error: "No token configured",
			token_checked_at: checkedAt,
			token_scopes: null,
			token_missing_scopes: null,
			token_user_name: null,
			token_expires_at: null
		}).eq("id", connectionId);
		return {
			ok: false,
			status: "missing",
			error: "No token configured"
		};
	}
	try {
		const me = await fb.validateToken(token);
		const perm = await fbJson(`https://graph.facebook.com/v21.0/me/permissions?access_token=${encodeURIComponent(token)}`);
		if (perm.error) throw new Error(perm.error.message);
		const granted = (perm.data ?? []).filter((p) => p.status === "granted").map((p) => p.permission);
		const missing = REQUIRED_SCOPES.filter((sc) => !granted.includes(sc));
		let expiresAt = null;
		try {
			const exp = (await fbJson(`https://graph.facebook.com/v21.0/debug_token?input_token=${encodeURIComponent(token)}&access_token=${encodeURIComponent(token)}`))?.data?.expires_at;
			if (typeof exp === "number" && exp > 0) expiresAt = (/* @__PURE__ */ new Date(exp * 1e3)).toISOString();
		} catch {}
		const expiringSoon = !!expiresAt && new Date(expiresAt).getTime() - Date.now() < 7 * 864e5;
		const status = missing.length ? "missing_scopes" : expiringSoon ? "expiring" : "ok";
		await supabaseAdmin.from("meta_connections").update({
			token_status: status,
			token_scopes: granted,
			token_missing_scopes: missing,
			token_user_name: me?.name ?? null,
			token_expires_at: expiresAt,
			token_checked_at: checkedAt,
			token_error: null
		}).eq("id", connectionId);
		return {
			ok: status === "ok",
			status,
			user_name: me?.name ?? null,
			granted,
			missing,
			expires_at: expiresAt
		};
	} catch (e) {
		const msg = e?.message ?? "Token validation failed";
		await supabaseAdmin.from("meta_connections").update({
			token_status: "invalid",
			token_error: msg,
			token_checked_at: checkedAt
		}).eq("id", connectionId);
		return {
			ok: false,
			status: "invalid",
			error: msg
		};
	}
}
async function dedupedAlert(type, severity, title, message) {
	const since = (/* @__PURE__ */ new Date(Date.now() - 3600 * 1e3)).toISOString();
	const { data: existing } = await supabaseAdmin.from("alerts").select("id").eq("type", type).gte("created_at", since).limit(1);
	if (existing && existing.length) return;
	await supabaseAdmin.from("alerts").insert({
		type,
		severity,
		title,
		message
	});
}
//#endregion
export { checkConnectionHealth, checkTokenHealth };
