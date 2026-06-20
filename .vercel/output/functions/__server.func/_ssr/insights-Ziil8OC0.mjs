import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-rgEw8wDd.mjs";
import { a as require_react, i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { at as Download, yt as ChartColumn } from "../_libs/lucide-react.mjs";
import { t as CandlestickChart } from "./CandlestickChart-D6pbie1f.mjs";
import { n as toCsv, t as downloadCsv } from "./csv-LdasEXPS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/insights-Ziil8OC0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InsightsPage() {
	const [level, setLevel] = (0, import_react.useState)("timeseries");
	const [exporting, setExporting] = (0, import_react.useState)(false);
	const { data: snapshots } = useQuery({
		queryKey: ["insights-all"],
		queryFn: async () => {
			const { data } = await supabase.from("insights_snapshots").select("date_start,spend,clicks,impressions,reach,results,ad_account:ad_accounts(account_name,client:clients(name))").eq("level", "account").gte("date_start", (/* @__PURE__ */ new Date(Date.now() - 30 * 864e5)).toISOString().slice(0, 10)).order("date_start");
			const grouped = {};
			(data ?? []).forEach((r) => {
				const k = r.date_start;
				grouped[k] = grouped[k] ?? {
					date: k,
					spend: 0,
					clicks: 0,
					impressions: 0,
					reach: 0,
					results: 0
				};
				grouped[k].spend += Number(r.spend) || 0;
				grouped[k].clicks += Number(r.clicks) || 0;
				grouped[k].impressions += Number(r.impressions) || 0;
				grouped[k].reach += Number(r.reach) || 0;
				grouped[k].results += Number(r.results) || 0;
			});
			return Object.values(grouped);
		}
	});
	const onExport = async () => {
		setExporting(true);
		try {
			let rows = [];
			let name = "insights";
			if (level === "timeseries") {
				const { data } = await supabase.from("insights_snapshots").select("date_start,date_stop,spend,reach,impressions,clicks,ctr,cpc,cpm,results,frequency,ad_account:ad_accounts(account_name,fb_account_id,client:clients(name))").eq("level", "account").gte("date_start", (/* @__PURE__ */ new Date(Date.now() - 90 * 864e5)).toISOString().slice(0, 10)).order("date_start");
				rows = (data ?? []).map((r) => ({
					date: r.date_start,
					date_stop: r.date_stop,
					client: r.ad_account?.client?.name ?? "",
					ad_account: r.ad_account?.account_name ?? r.ad_account?.fb_account_id ?? "",
					spend: r.spend,
					reach: r.reach,
					impressions: r.impressions,
					clicks: r.clicks,
					ctr: r.ctr,
					cpc: r.cpc,
					cpm: r.cpm,
					results: r.results,
					frequency: r.frequency
				}));
				name = "insights-timeseries";
			} else {
				const table = level === "campaign" ? "campaigns" : level === "adset" ? "ad_sets" : "ads";
				const { data } = await supabase.from(table).select("name,effective_status,spend,reach,impressions,clicks,ctr,cpc,cpm,results,frequency,ad_account:ad_accounts(account_name,fb_account_id,currency,client:clients(name))").order("spend", { ascending: false });
				rows = (data ?? []).map((r) => ({
					client: r.ad_account?.client?.name ?? "",
					ad_account: r.ad_account?.account_name ?? r.ad_account?.fb_account_id ?? "",
					currency: r.ad_account?.currency ?? "",
					name: r.name,
					status: r.effective_status,
					spend: r.spend,
					reach: r.reach,
					impressions: r.impressions,
					clicks: r.clicks,
					ctr: r.ctr,
					cpc: r.cpc,
					cpm: r.cpm,
					results: r.results,
					frequency: r.frequency
				}));
				name = `insights-${level}`;
			}
			downloadCsv(`${name}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, toCsv(rows));
		} finally {
			setExporting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold",
				children: "Insights"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground text-sm",
				children: "30-day time-series across all accounts. Auto-synced from Facebook Marketing API."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: level,
					onChange: (e) => setLevel(e.target.value),
					className: "rounded-lg bg-input border border-border px-3 py-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "timeseries",
							children: "Time-series (account)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "campaign",
							children: "By campaign"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "adset",
							children: "By ad set"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "ad",
							children: "By ad"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onExport,
					disabled: exporting,
					className: "inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-3 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }),
						" ",
						exporting ? "Exporting…" : "Export CSV"
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-card p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-between gap-2 mb-3 flex-wrap",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-4 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold",
							children: "Daily performance"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase tracking-wider text-muted-foreground font-semibold rounded-md bg-primary/10 text-primary px-1.5 py-0.5",
							children: "Candlestick"
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandlestickChart, {
				data: snapshots ?? [],
				height: 340,
				series: [
					{
						key: "spend",
						label: "Spend",
						upColor: "oklch(0.78 0.18 165)",
						downColor: "oklch(0.66 0.22 25)",
						format: (v) => `$${v.toFixed(2)}`
					},
					{
						key: "clicks",
						label: "Clicks",
						upColor: "oklch(0.72 0.19 295)",
						downColor: "oklch(0.66 0.22 25)",
						format: (v) => v.toLocaleString()
					},
					{
						key: "results",
						label: "Results",
						upColor: "oklch(0.83 0.16 85)",
						downColor: "oklch(0.66 0.22 25)",
						format: (v) => v.toLocaleString()
					},
					{
						key: "impressions",
						label: "Impressions",
						upColor: "oklch(0.78 0.14 200)",
						downColor: "oklch(0.66 0.22 25)",
						format: (v) => v.toLocaleString()
					}
				]
			})]
		})]
	});
}
//#endregion
export { InsightsPage as component };
