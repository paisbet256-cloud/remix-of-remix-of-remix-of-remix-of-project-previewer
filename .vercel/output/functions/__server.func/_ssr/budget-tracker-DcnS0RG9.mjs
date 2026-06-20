import { t as supabase } from "./client-rgEw8wDd.mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as Wallet, l as TriangleAlert, u as TrendingUp } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/budget-tracker-DcnS0RG9.js
var import_jsx_runtime = require_jsx_runtime();
function BudgetTracker() {
	const { data: clients } = useQuery({
		queryKey: ["budget-clients"],
		queryFn: async () => {
			const { data } = await supabase.from("clients").select("id,name,monthly_budget, ad_accounts(id,total_spend,currency)").eq("status", "active");
			return (data ?? []).map((c) => ({
				...c,
				spent: (c.ad_accounts ?? []).reduce((s, a) => s + (Number(a.total_spend) || 0), 0),
				currency: c.ad_accounts?.[0]?.currency ?? "$"
			}));
		}
	});
	const { data: pacing } = useQuery({
		queryKey: ["budget-pacing"],
		queryFn: async () => {
			const since = (/* @__PURE__ */ new Date(Date.now() - 30 * 864e5)).toISOString().slice(0, 10);
			const { data } = await supabase.from("insights_snapshots").select("date_start,spend,ad_account:ad_accounts(id,client_id)").eq("level", "account").gte("date_start", since);
			const byClient = {};
			(data ?? []).forEach((r) => {
				const cid = r.ad_account?.client_id;
				if (!cid) return;
				byClient[cid] = byClient[cid] ?? {
					dates: /* @__PURE__ */ new Set(),
					total: 0,
					perDay: {}
				};
				byClient[cid].dates.add(r.date_start);
				byClient[cid].perDay[r.date_start] = (byClient[cid].perDay[r.date_start] ?? 0) + (Number(r.spend) || 0);
				byClient[cid].total += Number(r.spend) || 0;
			});
			return byClient;
		}
	});
	const now = /* @__PURE__ */ new Date();
	const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
	const dayOfMonth = now.getDate();
	const remainingDays = daysInMonth - dayOfMonth;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: "Budget Tracker"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground text-sm",
			children: "Monthly pacing & spend forecast based on the last 30 days of insights."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: (clients ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card p-12 text-center md:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-10 mx-auto opacity-30 mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground",
					children: "No clients yet"
				})]
			}) : (clients ?? []).map((c) => {
				const budget = Number(c.monthly_budget) || 0;
				const spent = Number(c.spent) || 0;
				const pct = budget > 0 ? spent / budget * 100 : 0;
				const expectedPct = budget > 0 ? dayOfMonth / daysInMonth * 100 : 0;
				const series = pacing?.[c.id]?.perDay ?? {};
				const last7 = Array.from({ length: 7 }, (_, i) => {
					const d = /* @__PURE__ */ new Date();
					d.setDate(d.getDate() - (6 - i));
					return series[d.toISOString().slice(0, 10)] ?? 0;
				});
				const avgDaily = last7.length ? last7.reduce((s, n) => s + n, 0) / last7.length : 0;
				const projectedMonth = spent + avgDaily * remainingDays;
				const overBy = projectedMonth - budget;
				const onTrack = budget === 0 ? null : projectedMonth <= budget;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-card p-5 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold min-w-0 truncate",
								children: c.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									c.currency,
									" ",
									spent.toFixed(2),
									" / ",
									c.currency,
									" ",
									budget.toFixed(2)
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "h-2 rounded-full bg-surface overflow-hidden relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `h-full ${pct > 90 ? "bg-destructive" : pct > 70 ? "bg-warning" : "bg-gradient-to-r from-primary to-primary-glow"}`,
								style: { width: `${Math.min(100, pct)}%` }
							}), budget > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-0 h-full w-px bg-foreground/40",
								style: { left: `${Math.min(100, expectedPct)}%` },
								title: `Expected pace today: ${expectedPct.toFixed(0)}%`
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1.5 text-xs text-muted-foreground flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [pct.toFixed(1), "% used"] }), budget > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: pct - expectedPct > 20 ? "text-destructive" : pct - expectedPct > 0 ? "text-warning" : "text-success",
								children: pct > expectedPct ? `+${(pct - expectedPct).toFixed(1)}pp vs schedule` : `${(expectedPct - pct).toFixed(1)}pp under schedule`
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-2 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
									label: "Avg daily (7d)",
									value: `${c.currency} ${avgDaily.toFixed(2)}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
									label: "Weekly proj.",
									value: `${c.currency} ${(avgDaily * 7).toFixed(2)}`,
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
									label: "Month-end proj.",
									value: `${c.currency} ${projectedMonth.toFixed(2)}`,
									accent: budget > 0 ? onTrack ? "success" : "destructive" : void 0
								})
							]
						}),
						budget > 0 && !onTrack && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2 text-xs text-destructive bg-destructive/10 rounded-lg p-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3.5 mt-0.5 shrink-0" }),
								"Projected to exceed budget by ",
								c.currency,
								" ",
								overBy.toFixed(2),
								" (",
								(overBy / budget * 100).toFixed(1),
								"%)."
							]
						})
					]
				}, c.id);
			})
		})]
	});
}
function Tile({ label, value, accent, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-surface/60 border border-border px-2 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-[10px] uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-1",
			children: [icon, label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `text-sm font-bold mt-0.5 ${accent === "destructive" ? "text-destructive" : accent === "success" ? "text-success" : ""}`,
			children: value
		})]
	});
}
//#endregion
export { BudgetTracker as component };
