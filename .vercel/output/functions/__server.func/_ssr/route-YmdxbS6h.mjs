import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-rgEw8wDd.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { d as Link, h as useRouter, i as useLocation, s as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as FileText, B as LogOut, G as LayoutDashboard, I as Menu, K as Layers, L as Megaphone, O as Plus, Tt as Activity, Y as Image, a as Wallet, n as X, nt as Facebook, o as Users, x as Settings, xt as BellRing, yt as ChartColumn } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Logo } from "./Logo-CoFHNc4d.mjs";
import { t as ensureBootstrapAdmin } from "./auth-bootstrap.functions-KzM5YryO.mjs";
import { a as ThemePicker, i as ModeToggle, n as LanguageToggle, r as LiveClock, s as useI18n } from "./LiveClock-B_2daxln.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-YmdxbS6h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV_MAIN = [
	{
		to: "/dashboard",
		labelKey: "nav.dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/campaigns",
		labelKey: "nav.campaigns",
		icon: Megaphone
	},
	{
		to: "/ad-sets",
		labelKey: "nav.adsets",
		icon: Layers
	},
	{
		to: "/ads",
		labelKey: "nav.ads",
		icon: Image
	},
	{
		to: "/insights",
		labelKey: "nav.insights",
		icon: ChartColumn
	}
];
var NAV_MANAGEMENT = [
	{
		to: "/clients",
		labelKey: "nav.clients",
		icon: Users
	},
	{
		to: "/reports",
		labelKey: "nav.reports",
		icon: FileText
	},
	{
		to: "/budget-tracker",
		labelKey: "nav.budget",
		icon: Wallet
	},
	{
		to: "/alerts",
		labelKey: "nav.alerts",
		icon: BellRing
	}
];
var NAV_SYSTEM = [
	{
		to: "/sync-activity",
		labelKey: "nav.sync",
		icon: Activity
	},
	{
		to: "/facebook-marketing-api",
		labelKey: "nav.fbapi",
		icon: Facebook
	},
	{
		to: "/settings",
		labelKey: "nav.settings",
		icon: Settings
	}
];
function AuthedLayout() {
	const { t } = useI18n();
	const router = useRouter();
	const loc = useLocation();
	const ensureAdminFn = useServerFn(ensureBootstrapAdmin);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [profile, setProfile] = (0, import_react.useState)({
		name: "",
		email: "",
		isAdmin: false
	});
	const [accountsConnected, setAccountsConnected] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) return;
			await ensureAdminFn({ data: void 0 });
			const [{ data: prof }, { data: roles }, { count }] = await Promise.all([
				supabase.from("profiles").select("full_name,email").eq("id", user.id).maybeSingle(),
				supabase.from("user_roles").select("role").eq("user_id", user.id),
				supabase.from("ad_accounts").select("*", {
					count: "exact",
					head: true
				}).eq("is_active", true)
			]);
			setProfile({
				name: prof?.full_name ?? user.email ?? "User",
				email: prof?.email ?? user.email ?? "",
				isAdmin: !!roles?.some((r) => r.role === "admin")
			});
			setAccountsConnected(count ?? 0);
		})();
	}, [loc.pathname]);
	const signOut = async () => {
		await supabase.auth.signOut();
		toast.success("Signed out");
		router.navigate({ to: "/auth" });
	};
	const NavSection = ({ title, items }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-3 mt-6 first:mt-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-3 text-[10px] tracking-[0.18em] uppercase text-muted-foreground/60 font-semibold mb-2",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "space-y-1",
			children: items.map(({ to, labelKey, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to,
				onClick: () => setOpen(false),
				activeProps: { className: "bg-sidebar-accent text-sidebar-primary border-l-2 border-l-primary" },
				inactiveProps: { className: "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 border-l-2 border-l-transparent" },
				className: "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), t(labelKey)]
			}, to))
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: `fixed lg:sticky top-0 left-0 z-30 h-screen w-72 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-4 border-b border-sidebar-border flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "h-10 w-auto" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display font-bold text-sm",
									children: "GrowVibe Ads Solution"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted-foreground truncate",
									children: profile.email || "..."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setOpen(false),
								className: "lg:hidden text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-3 border-b border-sidebar-border/60 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-9 rounded-full bg-gradient-to-br from-accent to-primary grid place-items-center font-bold text-sm",
							children: (profile.name || "U").slice(0, 1).toUpperCase()
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold leading-tight",
								children: profile.name || t("user.default")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground",
								children: profile.isAdmin ? t("role.admin") : t("role.member")
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 overflow-y-auto py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavSection, {
								title: t("nav.main"),
								items: NAV_MAIN
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavSection, {
								title: t("nav.management"),
								items: NAV_MANAGEMENT
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavSection, {
								title: t("nav.system"),
								items: NAV_SYSTEM
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-sidebar-border px-4 py-3 flex items-center gap-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-1.5 rounded-full ${accountsConnected ? "bg-success animate-pulse" : "bg-muted-foreground"}` }), accountsConnected === null ? t("status.checking") : accountsConnected === 0 ? t("status.noAccounts") : `${accountsConnected} ${t("status.live")}`]
					})
				]
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				onClick: () => setOpen(false),
				className: "lg:hidden fixed inset-0 bg-black/50 z-20"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0 flex flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "sticky top-0 z-10 bg-background/70 backdrop-blur-md border-b border-border/50",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 px-4 lg:px-6 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setOpen(true),
								className: "lg:hidden p-2 rounded-lg hover:bg-surface",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "h-7 w-auto shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-sm truncate hidden sm:inline",
									children: "GrowVibe Ads Solution"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveClock, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeToggle, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageToggle, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemePicker, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/clients",
									className: "hidden md:inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-3 py-1.5 text-xs font-semibold hover:opacity-90",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }),
										" ",
										t("header.newClient")
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: signOut,
									className: "inline-flex items-center gap-2 rounded-lg border border-border bg-surface hover:bg-surface-elevated px-3 py-1.5 text-xs font-medium",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5" }),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "hidden sm:inline",
											children: t("header.logout")
										})
									]
								})
							]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 p-4 lg:p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				})]
			})
		]
	});
}
//#endregion
export { AuthedLayout as component };
