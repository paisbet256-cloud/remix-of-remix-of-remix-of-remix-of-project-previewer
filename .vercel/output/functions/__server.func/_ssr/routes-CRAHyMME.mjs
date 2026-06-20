import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-rgEw8wDd.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { d as Link, p as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { Tt as Activity, o as Users, t as Zap, u as TrendingUp, v as Shield, yt as ChartColumn } from "../_libs/lucide-react.mjs";
import { t as Logo } from "./Logo-CoFHNc4d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CRAHyMME.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Landing() {
	const [checking, setChecking] = (0, import_react.useState)(true);
	const [signedIn, setSignedIn] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let isMounted = true;
		const timeout = setTimeout(() => {
			if (isMounted) setChecking(false);
		}, 3e3);
		supabase.auth.getSession().then(({ data }) => {
			if (!isMounted) return;
			clearTimeout(timeout);
			setSignedIn(!!data?.session);
			setChecking(false);
		}).catch((error) => {
			if (!isMounted) return;
			console.warn("[Auth] Session check failed:", error instanceof Error ? error.message : String(error));
			clearTimeout(timeout);
			setChecking(false);
		});
		return () => {
			isMounted = false;
			clearTimeout(timeout);
		};
	}, []);
	if (checking) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-10 rounded-full border-2 border-primary border-t-transparent animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground animate-pulse",
				children: "Loading..."
			})]
		})
	});
	if (signedIn) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/dashboard" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-border/40 backdrop-blur-md sticky top-0 z-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container mx-auto flex items-center justify-between px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "h-10 w-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display font-bold text-lg",
							children: "GrowVibe Ads Solution"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						className: "rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90",
						children: "Sign in"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container mx-auto px-6 py-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "text-center max-w-3xl mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-full border border-border/50 bg-surface/60 px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-primary animate-pulse" }), " Live Facebook Marketing API"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-5xl md:text-6xl font-bold tracking-tight",
							children: ["Your Ads. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "gradient-text",
								children: "In real time."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-lg text-muted-foreground",
							children: "Manage unlimited clients, ad accounts, campaigns and ads — and give each client a beautiful, branded live dashboard with a single shareable link."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 flex justify-center gap-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								className: "rounded-xl bg-gradient-to-r from-primary to-primary-glow px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 ring-glow",
								children: "Get started"
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mt-20 grid gap-5 md:grid-cols-3",
					children: [
						{
							i: Activity,
							t: "Real-time sync",
							d: "Every 2-5 minutes from Facebook Marketing API."
						},
						{
							i: ChartColumn,
							t: "All KPIs in one place",
							d: "Spend, Reach, CTR, CPC, CPM, ROAS, Frequency."
						},
						{
							i: Users,
							t: "Client portals",
							d: "Public link per client — they see only their data."
						},
						{
							i: Zap,
							t: "Instant alerts",
							d: "Budget pacing, performance drops, sync failures."
						},
						{
							i: TrendingUp,
							t: "Deep insights",
							d: "Time-series charts down to ad-level breakdown."
						},
						{
							i: Shield,
							t: "Secure by design",
							d: "Server-side token storage, never exposed to browser."
						}
					].map(({ i: Icon, t, d }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass-card p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-6 text-primary mb-3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold",
								children: t
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground mt-1",
								children: d
							})
						]
					}, t))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "border-t border-border/40 py-8 text-center text-sm text-muted-foreground",
				children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" GrowVibe Ads Solution"
				]
			})
		]
	});
}
//#endregion
export { Landing as component };
