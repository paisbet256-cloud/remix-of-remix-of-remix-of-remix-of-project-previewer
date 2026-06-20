import "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { c as lazyRouteComponent, l as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./esm-I6x-3bX5.mjs";
import { a as numberType, n as booleanType, o as objectType, r as enumType, s as stringType } from "../_libs/zod.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DZQxRd04.mjs";
require_react();
require_jsx_runtime();
var getClientPortalData = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	slug: stringType().min(1).max(120),
	token: stringType().min(4).max(128).optional()
}).parse(d)).handler(createSsrRpc("d3880dadeea232d2ef18d24a4befa01f47698d367670378dcb886a550b9cc09c"));
var getClientInsightsForExport = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	slug: stringType().min(1).max(120),
	token: stringType().min(4).max(128).optional(),
	level: enumType([
		"campaign",
		"adset",
		"ad"
	])
}).parse(d)).handler(createSsrRpc("d8b2001416b0964535be965fe1f9dcdc78cb1523957457d80b665cbb3cc975c6"));
var triggerClientSync = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	slug: stringType().min(1).max(120),
	token: stringType().min(4).max(128).optional(),
	minAgeSec: numberType().int().min(0).max(3600).optional(),
	force: booleanType().optional()
}).parse(d)).handler(createSsrRpc("6f3c4ab677ae65fd810f2d5f186454870f9d14c2b9b7b94ff8bd2eee7aa9f681"));
var $$splitComponentImporter = () => import("./portal2._slug-BAnTy-fE.mjs");
var searchSchema = objectType({ token: stringType().optional() });
var Route = createFileRoute("/portal/$slug")({
	validateSearch: (s) => searchSchema.parse(s),
	head: ({ params }) => ({ meta: [
		{ title: `${params.slug} — Live Ads Dashboard` },
		{
			name: "description",
			content: `Live Facebook Ads performance dashboard for ${params.slug}.`
		},
		{
			name: "robots",
			content: "noindex,nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { triggerClientSync as i, getClientInsightsForExport as n, getClientPortalData as r, Route as t };
