import { t as supabase } from "./client-rgEw8wDd.mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as StatusBadge } from "./campaigns-CLzYqQNT.mjs";
import { Y as Image } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ads-36KFNwoi.js
var import_jsx_runtime = require_jsx_runtime();
function AdsPage() {
	const { data: items } = useQuery({
		queryKey: ["ads-list"],
		queryFn: async () => {
			const { data } = await supabase.from("ads").select("*, campaign:campaigns(name), ad_set:ad_sets(name), ad_account:ad_accounts(currency, client:clients(name))").order("spend", { ascending: false });
			return data ?? [];
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: "Ads"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground text-sm",
			children: "Individual ad creatives across all ad sets."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "glass-card overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-xs uppercase tracking-wider text-muted-foreground bg-surface/40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left px-4 py-3",
							children: "Ad"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left px-4 py-3",
							children: "Campaign / Ad Set"
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-10 mx-auto opacity-30 mb-2" }), "No ads yet"]
				}) }) : (items ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border/40 hover:bg-surface/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 max-w-[280px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-10 rounded-md bg-surface border border-border overflow-hidden grid place-items-center shrink-0",
									children: a.creative_thumbnail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: a.creative_thumbnail,
										alt: "",
										className: "w-full h-full object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-4 opacity-40" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium truncate",
										children: a.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground truncate",
										children: a.ad_account?.client?.name ?? ""
									})]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3 text-xs max-w-[220px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate",
								children: a.campaign?.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted-foreground truncate",
								children: a.ad_set?.name
							})]
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
export { AdsPage as component };
