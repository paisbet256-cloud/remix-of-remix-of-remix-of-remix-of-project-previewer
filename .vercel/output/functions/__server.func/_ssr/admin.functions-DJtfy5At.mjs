import { c as createServerFn } from "./esm-I6x-3bX5.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bcxi9eKV.mjs";
import { a as numberType, i as literalType, n as booleanType, o as objectType, r as enumType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DZQxRd04.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-DJtfy5At.js
var getSettingsPublic = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("5ee5c99290e6fb5274ff96dfc680fc4d7845c573fea636f86bc67e651251deee"));
var saveSettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	token: stringType().optional(),
	fb_app_id: stringType().optional(),
	fb_business_id: stringType().optional(),
	sync_interval_minutes: numberType().min(1).max(1440).optional(),
	auto_sync_enabled: booleanType().optional(),
	fb_verify_token: stringType().max(200).optional(),
	fb_app_secret: stringType().max(200).optional()
}).parse(d)).handler(createSsrRpc("8b336b7ed9b10382280f4179449979092e995d3c115e8c63183a2f39e8155fc4"));
var checkTokenHealthNow = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("4ca178ec85f3c11f3d1d65775065dc9c27106c3b4517f44fd36a98dffad0dbed"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	client_id: stringType().uuid(),
	clear: booleanType().optional()
}).parse(d)).handler(createSsrRpc("9e72591e79f7d3b1aa310fb7febc904ef0ddb50d4c4f305c8933b53dd299173a"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ client_id: stringType().uuid() }).parse(d)).handler(createSsrRpc("17bdde9e35b6cfa3c1abdca7af97592b6b76ab92d63e37c1f834bd79062d88f8"));
var testFbToken = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("96943db2743d97bd35a7a90349b6c08db4244fad88cfb8f712856df1eeabd8b7"));
var importVisibleAdAccounts = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("594c2a2c286ec1e22bb11a428ed83afeac7c06f35f2330b2120d3fa2184e72dd"));
var detectBusinessesFromToken = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("a65133d2132f57b75cdda183fe4e2bf3116f0f26e18525e4e7e7ec37163757e2"));
var listAvailableAdAccounts = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("1976cb2abb52099b76530267a51a2f142b7ba666f9ed1dd525186a76e03575f1"));
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
}).parse(d)).handler(createSsrRpc("a24c2a6fd36e6f2862f0a9801145db1c26d9bfc22db9581a2abbbd7a00ad7134"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
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
}).parse(d)).handler(createSsrRpc("7b982528a73dc461515fedfd6f08c441f6be8ed49a0ff9b59c5537ef17c523b2"));
var deleteClient = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("5d69605a540eb154dab0f96d8ae25317f3aca15bbf4fc776dc27f7a682a2c05f"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	client_id: stringType().uuid(),
	fb_account_id: stringType().min(1)
}).parse(d)).handler(createSsrRpc("7a121a2dcc8521d42bf2f35a6ee6b18ffeb39873e3f3ba515014dc777c34fa0f"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("832ee181b4992b7e78d18e1a9e76fc2ef9b55d3b8aa82d56331b376fb6d7a87b"));
var syncAllAccountsNow = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("1619975a36ff61cb9a14a5e67d97fbe3e539c12dfcce7d42a99a5b717f875f19"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("5bcccb45770e887275ac0ddffd5245da9c79bdc062b1308b9851de6cdc4eb8f6"));
var refreshAllData = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("47af7bc1e01bbeff499042d94c2f854c010cdcc67e44469cb3ac2b2ebc4f8372"));
var retestAndReimport = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("ab8ec0f5d50f519b6af8fe924c4bad33de598960b90d20ba3a4194d20d94644b"));
var verifyCampaignMapping = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("a8792639bc1e0ea68a07a49b65e0dc08ab811e553b2b0b9f735bc024dddc53da"));
var saveOrgInfo = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	org_name: stringType().trim().max(200).optional(),
	org_email: stringType().trim().max(255).optional().or(literalType("")),
	org_phone: stringType().trim().max(50).optional(),
	org_address: stringType().trim().max(1e3).optional()
}).parse(d)).handler(createSsrRpc("07cba1d6db5cae99f676db280c5093a7a3505d8684cb915bdcf084f431183e4d"));
var saveBranding = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	brand_logo_url: stringType().trim().max(2e3).optional(),
	brand_primary_color: stringType().trim().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
	brand_secondary_color: stringType().trim().regex(/^#[0-9A-Fa-f]{6}$/).optional()
}).parse(d)).handler(createSsrRpc("8aabb484ae7bc53f076ebaffc97dc1c74e28a6e65deaa11fc66acca70ed9b7fa"));
var savePreferences = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	pref_timezone: stringType().trim().max(100).optional(),
	pref_currency: stringType().trim().max(10).optional(),
	pref_language: stringType().trim().max(20).optional(),
	pref_attribution_window: stringType().trim().max(50).optional()
}).parse(d)).handler(createSsrRpc("bd762f6c6acd30a1d366b88262c964aa5bbe99b5ed55a54d2dfb745829dec3b4"));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	full_name: stringType().trim().min(1).max(150).optional(),
	new_password: stringType().min(8).max(200).optional(),
	current_password: stringType().min(1).max(200).optional()
}).parse(d)).handler(createSsrRpc("b42020008c86901cfe77b761b1ba1882632503ef802617bc2dfa8bf7614a3922"));
var clearAllData = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ confirm: literalType("CLEAR ALL DATA") }).parse(d)).handler(createSsrRpc("53e1587fc11d7a23790c7863fe4e1e87f921dc920fbfa071e453b40a040d44c4"));
var listAvailableAdSets = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("354247f9013d303096b8e165c5bddf96e20761a9eefd9415cb75c0a45ee41a45"));
//#endregion
export { testFbToken as _, detectBusinessesFromToken as a, listAvailableAdAccounts as c, retestAndReimport as d, saveBranding as f, syncAllAccountsNow as g, saveSettings as h, deleteClient as i, listAvailableAdSets as l, savePreferences as m, clearAllData as n, getSettingsPublic as o, saveOrgInfo as p, createClient as r, importVisibleAdAccounts as s, checkTokenHealthNow as t, refreshAllData as u, updateMyProfile as v, verifyCampaignMapping as y };
