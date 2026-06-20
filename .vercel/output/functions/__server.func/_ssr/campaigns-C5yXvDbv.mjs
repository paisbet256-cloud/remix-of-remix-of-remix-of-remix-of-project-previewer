import { t as supabase } from "./client-rgEw8wDd.mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { d as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as Megaphone } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/campaigns-C5yXvDbv.js
var import_jsx_runtime = require_jsx_runtime();
function CampaignsPage() {
	const { data: campaigns } = useQuery({
		queryKey: ["campaigns"],
		queryFn: async () => {
			const { data } = await supabase.from("campaigns").select("*, ad_account:ad_accounts(account_name, currency, client:clients(name,slug))").order("spend", { ascending: false });
			return data ?? [];
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: "Campaigns"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground text-sm",
			children: "All campaigns across every connected ad account, sorted by spend."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "glass-card overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-xs uppercase tracking-wider text-muted-foreground bg-surface/40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left px-4 py-3",
							children: "Campaign"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left px-4 py-3",
							children: "Client"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left px-4 py-3",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right px-4 py-3",
							children: "Spend"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right px-4 py-3",
							children: "Reach"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right px-4 py-3",
							children: "Impr."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right px-4 py-3",
							children: "Clicks"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right px-4 py-3",
							children: "CTR"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right px-4 py-3",
							children: "CPC"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right px-4 py-3",
							children: "Results"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (campaigns ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
					colSpan: 10,
					className: "text-center py-12 text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "size-10 mx-auto opacity-30 mb-2" }),
						"No campaigns yet — connect an ad account in ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/clients",
							className: "text-primary underline",
							children: "Clients"
						})
					]
				}) }) : (campaigns ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border/40 hover:bg-surface/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3 max-w-[300px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium truncate",
								children: c.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: c.objective
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-xs",
							children: c.ad_account?.client?.name ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.effective_status ?? c.status })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3 text-right font-medium",
							children: [c.ad_account?.currency ?? "$", Number(c.spend).toFixed(2)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-right",
							children: Number(c.reach).toLocaleString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-right",
							children: Number(c.impressions).toLocaleString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-right",
							children: Number(c.clicks).toLocaleString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3 text-right",
							children: [(Number(c.ctr) * 1).toFixed(2), "%"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3 text-right",
							children: ["$", Number(c.cpc).toFixed(2)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-right font-medium text-primary",
							children: Number(c.results).toLocaleString()
						})
					]
				}, c.id)) })]
			})
		})]
	});
}
function StatusBadge({ status }) {
	if (!status) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-xs text-muted-foreground",
		children: "—"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `text-[10px] font-semibold uppercase rounded-full px-2 py-0.5 ${{
			ACTIVE: "bg-success/15 text-success",
			PAUSED: "bg-warning/15 text-warning",
			DELETED: "bg-destructive/15 text-destructive",
			ARCHIVED: "bg-muted text-muted-foreground"
		}[status] ?? "bg-surface text-muted-foreground"}`,
		children: status.replace(/_/g, " ")
	});
}
//#endregion
export { StatusBadge, CampaignsPage as component };
