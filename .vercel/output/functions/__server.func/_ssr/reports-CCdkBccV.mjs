import { t as supabase } from "./client-rgEw8wDd.mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { $ as FileText, at as Download } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-CCdkBccV.js
var import_jsx_runtime = require_jsx_runtime();
function ReportsPage() {
	const { data: clients } = useQuery({
		queryKey: ["report-clients"],
		queryFn: async () => {
			const { data } = await supabase.from("clients").select("*, ad_accounts(account_name,total_spend,total_reach,total_results,active_campaigns)").order("name");
			return data ?? [];
		}
	});
	const exportCsv = () => {
		const rows = [[
			"Client",
			"Account",
			"Spend",
			"Reach",
			"Results",
			"Active Campaigns"
		]];
		(clients ?? []).forEach((c) => {
			(c.ad_accounts ?? []).forEach((a) => rows.push([
				c.name,
				a.account_name,
				a.total_spend,
				a.total_reach,
				a.total_results,
				a.active_campaigns
			]));
		});
		const csv = rows.map((r) => r.map((x) => `"${String(x ?? "").replace(/"/g, "\"\"")}"`).join(",")).join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = `ads-report-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
		a.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between flex-wrap gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold",
					children: "Reports"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground text-sm",
					children: "Performance summary per client. Export to CSV."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: exportCsv,
				className: "inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-4 py-2 text-sm font-semibold shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Export CSV"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: (clients ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card p-12 text-center md:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-10 mx-auto opacity-30 mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground",
					children: "No data yet"
				})]
			}) : (clients ?? []).map((c) => {
				const totals = (c.ad_accounts ?? []).reduce((acc, a) => ({
					spend: acc.spend + (Number(a.total_spend) || 0),
					reach: acc.reach + (Number(a.total_reach) || 0),
					results: acc.results + (Number(a.total_results) || 0)
				}), {
					spend: 0,
					reach: 0,
					results: 0
				});
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold text-lg",
							children: c.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								c.ad_accounts?.length ?? 0,
								" ad account",
								c.ad_accounts?.length !== 1 ? "s" : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-3 mt-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-surface/60 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground uppercase",
										children: "Spend"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-bold",
										children: ["$", totals.spend.toFixed(2)]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-surface/60 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground uppercase",
										children: "Reach"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold",
										children: totals.reach.toLocaleString()
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-surface/60 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground uppercase",
										children: "Results"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-primary",
										children: totals.results.toLocaleString()
									})]
								})
							]
						})
					]
				}, c.id);
			})
		})]
	});
}
//#endregion
export { ReportsPage as component };
