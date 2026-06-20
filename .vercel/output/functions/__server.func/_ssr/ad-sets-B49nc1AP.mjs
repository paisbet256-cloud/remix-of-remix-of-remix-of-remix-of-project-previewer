import { t as supabase } from "./client-rgEw8wDd.mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as StatusBadge } from "./campaigns-CLzYqQNT.mjs";
import { K as Layers } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ad-sets-B49nc1AP.js
var import_jsx_runtime = require_jsx_runtime();
function AdSetsPage() {
	const { data: items } = useQuery({
		queryKey: ["adsets"],
		queryFn: async () => {
			const { data } = await supabase.from("ad_sets").select("*, campaign:campaigns(name), ad_account:ad_accounts(account_name, currency, client:clients(name))").order("spend", { ascending: false });
			return data ?? [];
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: "Ad Sets"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground text-sm",
			children: "Ad-set level breakdown across all clients."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "glass-card overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-xs uppercase tracking-wider text-muted-foreground bg-surface/40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left px-4 py-3",
							children: "Ad Set"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left px-4 py-3",
							children: "Campaign"
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
							children: "CPM"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right px-4 py-3",
							children: "Results"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (items ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
					colSpan: 9,
					className: "text-center py-12 text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-10 mx-auto opacity-30 mb-2" }), "No ad sets yet"]
				}) }) : (items ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border/40 hover:bg-surface/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3 max-w-[280px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium truncate",
								children: a.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: a.optimization_goal
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-xs max-w-[200px] truncate",
							children: a.campaign?.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: a.effective_status ?? a.status })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3 text-right font-medium",
							children: [a.ad_account?.currency ?? "$", Number(a.spend).toFixed(2)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-right",
							children: Number(a.impressions).toLocaleString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-right",
							children: Number(a.clicks).toLocaleString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3 text-right",
							children: [Number(a.ctr).toFixed(2), "%"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3 text-right",
							children: ["$", Number(a.cpm).toFixed(2)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-right font-medium text-primary",
							children: Number(a.results).toLocaleString()
						})
					]
				}, a.id)) })]
			})
		})]
	});
}
//#endregion
export { AdSetsPage as component };
