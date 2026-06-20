import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-rgEw8wDd.mjs";
import { a as require_react, i as require_jsx_runtime, n as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { D as redirect, c as lazyRouteComponent, d as Link, h as useRouter, l as createFileRoute, n as Scripts, o as createRouter, r as HeadContent, s as Outlet, u as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$18 } from "./campaigns-CLzYqQNT.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$19 } from "./clients_._slug.report-7zYfZm78.mjs";
import { o as ThemeProvider, t as I18nProvider } from "./LiveClock-B_2daxln.mjs";
import { t as Route$20 } from "./portal._slug-BS9oLLT8.mjs";
import { createHmac, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/router-HbQfst91.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DuOoFIWw.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-card max-w-md p-10 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold gradient-text",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "এই page টা পাওয়া যায়নি বা সরিয়ে ফেলা হয়েছে।"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90",
					children: "Go home"
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-card max-w-md p-10 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: "Something went wrong"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: error.message
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						router.invalidate();
						reset();
					},
					className: "mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90",
					children: "Try again"
				})
			]
		})
	});
}
var Route$17 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "GrowVibe Ads Solution — Command Center" },
			{
				name: "description",
				content: "Real-time Facebook Ads analytics command center. Track every campaign, every client, every dollar in real time."
			},
			{
				name: "author",
				content: "GrowVibe Ads Solution"
			},
			{
				property: "og:title",
				content: "GrowVibe Ads Solution — Command Center"
			},
			{
				property: "og:description",
				content: "Real-time Facebook Ads analytics command center."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$17.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => {
			sub.subscription.unsubscribe();
		};
	}, [queryClient, router]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(I18nProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-right",
			richColors: true,
			theme: "dark"
		})] }) })
	});
}
var $$splitComponentImporter$14 = () => import("./auth-B4bjWFuU.mjs");
var Route$16 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Sign in — GrowVibe Ads Solution" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./route-YmdxbS6h.mjs");
var Route$15 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./routes-CZ5I0HAc.mjs");
var Route$14 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "GrowVibe Ads Solution — Real-time Facebook Ads Command Center" }, {
		name: "description",
		content: "Track every campaign, every client, every dollar — all in real time. Built for Facebook Ads agencies."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./sync-activity-BX4qWlSF.mjs");
var Route$13 = createFileRoute("/_authenticated/sync-activity")({
	head: () => ({ meta: [{ title: "Sync Activity — GrowVibe Ads Solution" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./settings-BfkiZ3mm.mjs");
var Route$12 = createFileRoute("/_authenticated/settings")({
	head: () => ({ meta: [{ title: "Settings — GrowVibe Ads Solution" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./reports-CCdkBccV.mjs");
var Route$11 = createFileRoute("/_authenticated/reports")({
	head: () => ({ meta: [{ title: "Reports — GrowVibe Ads Solution" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./insights-Ziil8OC0.mjs");
var Route$10 = createFileRoute("/_authenticated/insights")({
	head: () => ({ meta: [{ title: "Insights — GrowVibe Ads Solution" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./facebook-marketing-api-nJankPMi.mjs");
var Route$9 = createFileRoute("/_authenticated/facebook-marketing-api")({
	head: () => ({ meta: [{ title: "Facebook Marketing API — GrowVibe Ads Solution" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./dashboard-DohqKMwJ.mjs");
var Route$8 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard — GrowVibe Ads Solution" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./clients-DHCywlow.mjs");
var Route$7 = createFileRoute("/_authenticated/clients")({
	head: () => ({ meta: [{ title: "Clients — GrowVibe Ads Solution" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./budget-tracker-DcnS0RG9.mjs");
var Route$6 = createFileRoute("/_authenticated/budget-tracker")({
	head: () => ({ meta: [{ title: "Budget Tracker — GrowVibe Ads Solution" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./alerts-B7NDXslR.mjs");
var Route$5 = createFileRoute("/_authenticated/alerts")({
	head: () => ({ meta: [{ title: "Alerts — GrowVibe Ads Solution" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./ads-36KFNwoi.mjs");
var Route$4 = createFileRoute("/_authenticated/ads")({
	head: () => ({ meta: [{ title: "Ads — GrowVibe Ads Solution" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./ad-sets-B49nc1AP.mjs");
var Route$3 = createFileRoute("/_authenticated/ad-sets")({
	head: () => ({ meta: [{ title: "Ad Sets — GrowVibe Ads Solution" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./clients_.new-qctqjjkt.mjs");
var Route$2 = createFileRoute("/_authenticated/clients_/new")({
	head: () => ({ meta: [{ title: "Add New Partner — GrowVibe Ads Solution" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route$1 = createFileRoute("/api/public/hooks/sync-all")({ server: { handlers: { POST: async ({ request }) => {
	const apiKey = request.headers.get("apikey") || request.headers.get("x-api-key");
	const expected = process.env.SUPABASE_PUBLISHABLE_KEY;
	if (!expected || apiKey !== expected) return new Response(JSON.stringify({ error: "unauthorized" }), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	});
	try {
		const { syncAllAccounts } = await import("./sync.server-CcW-Yp5J.mjs");
		const result = await syncAllAccounts();
		return new Response(JSON.stringify(result), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (e) {
		console.error("[sync-all] failed", e);
		return new Response(JSON.stringify({ error: e?.message ?? "Sync failed" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var Route = createFileRoute("/api/public/hooks/meta-webhook")({ server: { handlers: {
	GET: async ({ request }) => {
		const url = new URL(request.url);
		const mode = url.searchParams.get("hub.mode");
		const token = url.searchParams.get("hub.verify_token");
		const challenge = url.searchParams.get("hub.challenge");
		const { supabaseAdmin } = await import("./client.server-D1oHePJa.mjs");
		const { data: s } = await supabaseAdmin.from("app_settings").select("fb_verify_token").eq("id", 1).maybeSingle();
		const expected = s?.fb_verify_token;
		if (mode === "subscribe" && expected && token === expected && challenge) return new Response(challenge, {
			status: 200,
			headers: { "Content-Type": "text/plain" }
		});
		return new Response("Forbidden", { status: 403 });
	},
	POST: async ({ request }) => {
		const body = await request.text();
		const { supabaseAdmin } = await import("./client.server-D1oHePJa.mjs");
		const { data: s } = await supabaseAdmin.from("app_settings").select("fb_app_secret").eq("id", 1).maybeSingle();
		const appSecret = s?.fb_app_secret;
		const sigHeader = request.headers.get("x-hub-signature-256") || "";
		let valid = false;
		if (appSecret && sigHeader.startsWith("sha256=")) try {
			const expected = "sha256=" + createHmac("sha256", appSecret).update(body).digest("hex");
			const a = Buffer.from(sigHeader);
			const b = Buffer.from(expected);
			valid = a.length === b.length && timingSafeEqual(a, b);
		} catch {}
		if (!valid) {
			try {
				await supabaseAdmin.from("meta_webhook_events").insert({
					object: null,
					field: null,
					payload: safeParse(body),
					signature_valid: false,
					error: "Invalid signature"
				});
			} catch {}
			return new Response("Invalid signature", { status: 401 });
		}
		let payload;
		try {
			payload = JSON.parse(body);
		} catch {
			return new Response("Bad JSON", { status: 400 });
		}
		try {
			await processWebhook(payload, supabaseAdmin);
		} catch (e) {
			console.error("[meta-webhook] process error", e);
		}
		return new Response("ok", { status: 200 });
	}
} } });
function safeParse(s) {
	try {
		return JSON.parse(s);
	} catch {
		return { raw: s.slice(0, 2e3) };
	}
}
async function processWebhook(payload, db) {
	const object = payload?.object;
	const entries = Array.isArray(payload?.entry) ? payload.entry : [];
	for (const entry of entries) {
		const fbAccountId = entry?.id ? String(entry.id).startsWith("act_") ? String(entry.id) : `act_${entry.id}` : null;
		const { data: account } = fbAccountId ? await db.from("ad_accounts").select("id,client_id,account_name").eq("fb_account_id", fbAccountId).maybeSingle() : { data: null };
		const changes = Array.isArray(entry?.changes) ? entry.changes : [];
		for (const ch of changes) {
			const field = ch?.field;
			const value = ch?.value ?? {};
			await db.from("meta_webhook_events").insert({
				object,
				field,
				fb_account_id: fbAccountId,
				ad_account_id: account?.id ?? null,
				payload: {
					entry_id: entry.id,
					change: ch
				},
				signature_valid: true,
				processed: true
			});
			const acctLabel = account?.account_name ?? fbAccountId ?? "ad account";
			if (field === "account_disable_reason" || field === "disable_reason") await db.from("alerts").insert({
				client_id: account?.client_id ?? null,
				ad_account_id: account?.id ?? null,
				type: "account_disabled",
				severity: "critical",
				title: `Ad account disabled: ${acctLabel}`,
				message: `Meta reported disable reason: ${value?.disable_reason ?? "unknown"}.`,
				metadata: value
			});
			else if (field === "spend_cap_reached" || value?.spend_cap_reached) await db.from("alerts").insert({
				client_id: account?.client_id ?? null,
				ad_account_id: account?.id ?? null,
				type: "spend_cap_reached",
				severity: "critical",
				title: `Spend cap reached: ${acctLabel}`,
				message: `Ad account hit its spend cap and may pause delivery.`,
				metadata: value
			});
			else if (field === "account_status") await db.from("alerts").insert({
				client_id: account?.client_id ?? null,
				ad_account_id: account?.id ?? null,
				type: "account_status",
				severity: "warning",
				title: `Ad account status changed: ${acctLabel}`,
				message: `New status: ${value?.account_status ?? "unknown"}.`,
				metadata: value
			});
			else if (field === "campaign" || field === "adset" || field === "ad") {
				if (account?.id) try {
					const { syncAdAccount } = await import("./sync.server-CcW-Yp5J.mjs");
					syncAdAccount(account.id).catch(() => {});
				} catch {}
			} else await db.from("alerts").insert({
				client_id: account?.client_id ?? null,
				ad_account_id: account?.id ?? null,
				type: `webhook_${field ?? "event"}`,
				severity: "info",
				title: `Meta event: ${field ?? "update"} (${acctLabel})`,
				message: JSON.stringify(value).slice(0, 400),
				metadata: value
			});
		}
	}
}
var AuthRoute = Route$16.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$17
});
var AuthenticatedRouteRoute = Route$15.update({
	id: "/_authenticated",
	getParentRoute: () => Route$17
});
var IndexRoute = Route$14.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$17
});
var PortalSlugRoute = Route$20.update({
	id: "/portal/$slug",
	path: "/portal/$slug",
	getParentRoute: () => Route$17
});
var AuthenticatedSyncActivityRoute = Route$13.update({
	id: "/sync-activity",
	path: "/sync-activity",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedSettingsRoute = Route$12.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedReportsRoute = Route$11.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedInsightsRoute = Route$10.update({
	id: "/insights",
	path: "/insights",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedFacebookMarketingApiRoute = Route$9.update({
	id: "/facebook-marketing-api",
	path: "/facebook-marketing-api",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$8.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedClientsRoute = Route$7.update({
	id: "/clients",
	path: "/clients",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCampaignsRoute = Route$18.update({
	id: "/campaigns",
	path: "/campaigns",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedBudgetTrackerRoute = Route$6.update({
	id: "/budget-tracker",
	path: "/budget-tracker",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAlertsRoute = Route$5.update({
	id: "/alerts",
	path: "/alerts",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdsRoute = Route$4.update({
	id: "/ads",
	path: "/ads",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdSetsRoute = Route$3.update({
	id: "/ad-sets",
	path: "/ad-sets",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedClientsNewRoute = Route$2.update({
	id: "/clients_/new",
	path: "/clients/new",
	getParentRoute: () => AuthenticatedRouteRoute
});
var ApiPublicHooksSyncAllRoute = Route$1.update({
	id: "/api/public/hooks/sync-all",
	path: "/api/public/hooks/sync-all",
	getParentRoute: () => Route$17
});
var ApiPublicHooksMetaWebhookRoute = Route.update({
	id: "/api/public/hooks/meta-webhook",
	path: "/api/public/hooks/meta-webhook",
	getParentRoute: () => Route$17
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAdSetsRoute,
	AuthenticatedAdsRoute,
	AuthenticatedAlertsRoute,
	AuthenticatedBudgetTrackerRoute,
	AuthenticatedCampaignsRoute,
	AuthenticatedClientsRoute,
	AuthenticatedDashboardRoute,
	AuthenticatedFacebookMarketingApiRoute,
	AuthenticatedInsightsRoute,
	AuthenticatedReportsRoute,
	AuthenticatedSettingsRoute,
	AuthenticatedSyncActivityRoute,
	AuthenticatedClientsNewRoute,
	AuthenticatedClientsSlugReportRoute: Route$19.update({
		id: "/clients_/$slug/report",
		path: "/clients/$slug/report",
		getParentRoute: () => AuthenticatedRouteRoute
	})
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	PortalSlugRoute,
	ApiPublicHooksMetaWebhookRoute,
	ApiPublicHooksSyncAllRoute
};
var routeTree = Route$17._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient({ defaultOptions: { queries: {
			refetchInterval: 6e4,
			refetchIntervalInBackground: true,
			refetchOnWindowFocus: true,
			staleTime: 3e4
		} } }) },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
