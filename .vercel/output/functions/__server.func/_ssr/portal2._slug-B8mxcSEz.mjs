import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-rgEw8wDd.mjs";
import { a as require_react, i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { $ as FileText, A as Percent, D as Printer, E as RefreshCw, N as MousePointer, P as MousePointerClick, T as Repeat, Tt as Activity, Y as Image, Z as Gauge, a as Wallet, at as Download, b as ShieldAlert, ct as Coins, et as FileImage, ft as CircleDollarSign, gt as ChevronDown, it as ExternalLink, mt as CircleAlert, o as Users, ot as DollarSign, p as Target, pt as CircleCheck, rt as Eye, u as TrendingUp, ut as Clock, yt as ChartColumn } from "../_libs/lucide-react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as LogoMark } from "./Logo-CoFHNc4d.mjs";
import { n as toCsv, t as downloadCsv } from "./csv-LdasEXPS.mjs";
import { a as ThemePicker, i as ModeToggle, n as LanguageToggle, r as LiveClock, s as useI18n } from "./LiveClock-B_2daxln.mjs";
import { i as triggerClientSync, n as getClientInsightsForExport, r as getClientPortalData, t as Route } from "./portal._slug-BS9oLLT8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal2._slug-B8mxcSEz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PortalPage() {
	const { slug } = Route.useParams();
	const { token } = Route.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalDashboard, {
		slug,
		token
	});
}
function PortalDashboard({ slug, token }) {
	const { t } = useI18n();
	const fetchPortal = useServerFn(getClientPortalData);
	const fetchExport = useServerFn(getClientInsightsForExport);
	const runSync = useServerFn(triggerClientSync);
	const [exporting, setExporting] = (0, import_react.useState)(null);
	const [range, setRange] = (0, import_react.useState)("7d");
	const [pendingRange, setPendingRange] = (0, import_react.useState)("7d");
	const [syncing, setSyncing] = (0, import_react.useState)(false);
	const [lastSyncAt, setLastSyncAt] = (0, import_react.useState)(null);
	const { data, isLoading, isFetching, refetch, dataUpdatedAt } = useQuery({
		queryKey: [
			"portal",
			slug,
			token ?? ""
		],
		queryFn: () => fetchPortal({ data: {
			slug,
			token
		} }),
		refetchInterval: 6e4
	});
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const run = async (minAgeSec) => {
			if (cancelled) return;
			try {
				setSyncing(true);
				const r = await runSync({ data: {
					slug,
					token,
					minAgeSec
				} });
				if (!cancelled && r?.ok) {
					setLastSyncAt(Date.now());
					if (r.synced > 0) refetch();
				}
			} catch (_e) {} finally {
				if (!cancelled) setSyncing(false);
			}
		};
		run(120);
		const id = setInterval(() => run(50), 6e4);
		return () => {
			cancelled = true;
			clearInterval(id);
		};
	}, [
		slug,
		token,
		runSync,
		refetch
	]);
	const hardRefresh = async () => {
		try {
			setSyncing(true);
			await runSync({ data: {
				slug,
				token,
				force: true
			} });
			setLastSyncAt(Date.now());
			await refetch();
		} catch (_e) {
			await refetch();
		} finally {
			setSyncing(false);
		}
	};
	(0, import_react.useEffect)(() => {
		const ch = supabase.channel(`portal-${slug}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "ad_accounts"
		}, () => refetch()).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "campaigns"
		}, () => refetch()).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "ad_sets"
		}, () => refetch()).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "insights_snapshots"
		}, () => refetch()).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "alerts"
		}, () => refetch()).subscribe();
		return () => {
			supabase.removeChannel(ch);
		};
	}, [slug, refetch]);
	const rangeDays = range === "today" ? 1 : range === "7d" ? 7 : range === "30d" ? 30 : range === "month" ? (/* @__PURE__ */ new Date()).getDate() : 9999;
	const filteredTS = (0, import_react.useMemo)(() => {
		if (!data || data.notFound || data.forbidden) return [];
		const ts = data.timeSeries ?? [];
		if (range === "all") return ts;
		const cutoff = /* @__PURE__ */ new Date();
		cutoff.setDate(cutoff.getDate() - (rangeDays - 1));
		const cutoffStr = cutoff.toISOString().slice(0, 10);
		return ts.filter((r) => r.date_start >= cutoffStr);
	}, [
		data,
		range,
		rangeDays
	]);
	const totals = (0, import_react.useMemo)(() => {
		const empty = {
			spend: 0,
			reach: 0,
			impressions: 0,
			clicks: 0,
			results: 0,
			active: 0,
			frequency: 0
		};
		if (!data || data.notFound || data.forbidden) return empty;
		const d = data;
		if (range !== "all") {
			const sum = filteredTS.reduce((a, r) => ({
				spend: a.spend + (Number(r.spend) || 0),
				reach: a.reach + (Number(r.reach) || 0),
				impressions: a.impressions + (Number(r.impressions) || 0),
				clicks: a.clicks + (Number(r.clicks) || 0),
				results: a.results + (Number(r.results) || 0)
			}), {
				spend: 0,
				reach: 0,
				impressions: 0,
				clicks: 0,
				results: 0
			});
			return {
				...sum,
				active: (d.campaigns ?? []).filter((c) => c.effective_status === "ACTIVE").length,
				frequency: sum.reach > 0 ? sum.impressions / sum.reach : 0
			};
		}
		if ((d.assignedCampaignIds ?? []).length) {
			const sum = (d.campaigns ?? []).reduce((acc, c) => ({
				spend: acc.spend + (Number(c.spend) || 0),
				reach: acc.reach + (Number(c.reach) || 0),
				impressions: acc.impressions + (Number(c.impressions) || 0),
				clicks: acc.clicks + (Number(c.clicks) || 0),
				results: acc.results + (Number(c.results) || 0),
				active: acc.active + (c.effective_status === "ACTIVE" ? 1 : 0)
			}), {
				spend: 0,
				reach: 0,
				impressions: 0,
				clicks: 0,
				results: 0,
				active: 0
			});
			return {
				...sum,
				frequency: sum.reach > 0 ? sum.impressions / sum.reach : 0
			};
		}
		const sum = (d.accounts ?? []).reduce((acc, a) => ({
			spend: acc.spend + (Number(a.total_spend) || 0),
			reach: acc.reach + (Number(a.total_reach) || 0),
			impressions: acc.impressions + (Number(a.total_impressions) || 0),
			clicks: acc.clicks + (Number(a.total_clicks) || 0),
			results: acc.results + (Number(a.total_results) || 0),
			active: acc.active + (Number(a.active_campaigns) || 0)
		}), {
			spend: 0,
			reach: 0,
			impressions: 0,
			clicks: 0,
			results: 0,
			active: 0
		});
		return {
			...sum,
			frequency: sum.reach > 0 ? sum.impressions / sum.reach : 0
		};
	}, [
		data,
		range,
		filteredTS
	]);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen grid place-items-center text-muted-foreground",
		children: "Loading…"
	});
	if (!data || data.notFound) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotFoundCard, { reason: "not-found" });
	if (data.forbidden) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotFoundCard, { reason: "forbidden" });
	const d = data;
	const { client, accounts, campaigns, adSets, ads } = d;
	const currency = accounts[0]?.currency ?? "USD";
	const bdtRate = Number(client.bdt_rate) || 0;
	const bdt = (n) => bdtRate > 0 ? `৳${(n * bdtRate).toLocaleString(void 0, { maximumFractionDigits: 0 })}` : null;
	const commissionPct = Number(client.commission_percent) || 0;
	const markup = !!client.commission_enabled && commissionPct > 0 && commissionPct < 100 ? 1 / (1 - commissionPct / 100) : 1;
	const mk = (n) => (Number(n) || 0) * markup;
	const cur = (n) => `${currencySymbol(currency)}${(Number(n) || 0).toFixed(2)}`;
	const dcur = (n) => cur(mk(n));
	const num = (n) => (Number(n) || 0).toLocaleString();
	const last7Cutoff = /* @__PURE__ */ new Date();
	last7Cutoff.setDate(last7Cutoff.getDate() - 6);
	const last7CutoffStr = last7Cutoff.toISOString().slice(0, 10);
	const last7 = (d.timeSeries ?? []).filter((r) => r.date_start >= last7CutoffStr);
	new Set(last7.map((r) => r.date_start)).size;
	last7.reduce((a, r) => ({
		spend: a.spend + (Number(r.spend) || 0),
		results: a.results + (Number(r.results) || 0),
		impressions: a.impressions + (Number(r.impressions) || 0),
		reach: a.reach + (Number(r.reach) || 0),
		clicks: a.clicks + (Number(r.clicks) || 0)
	}), {
		spend: 0,
		results: 0,
		impressions: 0,
		reach: 0,
		clicks: 0
	});
	const featured = campaigns[0];
	const featuredSpend = featured ? Number(featured.spend) || 0 : 0;
	const featuredResults = featured ? Number(featured.results) || 0 : 0;
	const featuredCtr = featured ? Number(featured.ctr) || 0 : 0;
	const featuredCostPerResult = featuredResults > 0 ? mk(featuredSpend) / featuredResults : 0;
	const monthlyBudget = Number(client.monthly_budget) || 0;
	const deposit = Number(client.deposit_amount) || 0;
	const totalDeposit = monthlyBudget || deposit;
	const displaySpend = mk(totals.spend);
	const remaining = totalDeposit - displaySpend;
	const budgetPct = totalDeposit > 0 ? displaySpend / totalDeposit * 100 : 0;
	const cpm = totals.impressions > 0 ? mk(totals.spend) / totals.impressions * 1e3 : 0;
	const cpc = totals.clicks > 0 ? mk(totals.spend) / totals.clicks : 0;
	const ctr = totals.impressions > 0 ? totals.clicks / totals.impressions * 100 : 0;
	const resultRate = totals.impressions > 0 ? totals.results / totals.impressions * 100 : 0;
	const reachRate = totals.impressions > 0 ? totals.reach / totals.impressions * 100 : 0;
	const costPerResult = totals.results > 0 ? mk(totals.spend) / totals.results : 0;
	const journey = [
		{
			label: "Impressions",
			value: totals.impressions,
			color: "from-blue-500 to-cyan-500"
		},
		{
			label: "Reach",
			value: totals.reach,
			color: "from-emerald-500 to-teal-500"
		},
		{
			label: "Clicks",
			value: totals.clicks,
			color: "from-amber-500 to-orange-500"
		},
		{
			label: "Results",
			value: totals.results,
			color: "from-violet-500 to-fuchsia-500"
		}
	];
	const journeyMax = Math.max(...journey.map((j) => j.value), 1);
	const applyRange = () => setRange(pendingRange);
	const downloadExport = async (level) => {
		setExporting(level);
		try {
			const res = await fetchExport({ data: {
				slug,
				token,
				level
			} });
			if (!res || res.forbidden) return;
			const csv = toCsv(res.rows ?? []);
			downloadCsv(`${client.slug}-${level}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, csv);
		} finally {
			setExporting(null);
		}
	};
	const adSetList = adSets ?? [];
	const adSetsCount = adSetList.length;
	const adList = ads ?? [];
	adList.length;
	new Map(adSetList.map((s) => [s.id, s]));
	adList.reduce((a, r) => a + (Number(r.spend) || 0), 0);
	const totalAdSetSpend = adSetList.reduce((a, r) => a + (Number(r.spend) || 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-gradient-to-br from-background via-surface/40 to-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "bg-[oklch(0.18_0.04_262)] text-white border-b border-white/10 sticky top-0 z-30 backdrop-blur shadow-lg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container mx-auto grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-3 sm:flex sm:flex-wrap sm:justify-between sm:gap-3 sm:px-4 sm:py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-2 sm:gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "size-9 sm:size-11 shrink-0 p-1 shadow-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display font-extrabold text-sm sm:text-xl lg:text-2xl tracking-tight leading-tight truncate",
							children: "GrowVibe Ads Solution"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[10px] sm:text-[12px] text-white/70 truncate",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-white/85",
									children: client.name
								}),
								" · ",
								t("portal.tagline")
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-span-2 flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end sm:col-span-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveClock, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeToggle, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageToggle, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemePicker, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: hardRefresh,
							disabled: isFetching || syncing,
							className: "inline-flex items-center gap-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 px-3 py-2 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold disabled:opacity-60 transition-all min-h-[36px] sm:min-h-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `size-3.5 sm:size-3.5 ${isFetching || syncing ? "animate-spin" : ""}` }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: syncing ? "Syncing…" : t("portal.refresh") ?? "Refresh"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sm:hidden",
									children: syncing ? "Sync…" : "Sync"
								})
							]
						})
					]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-5 gv-fade-up",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-card border border-border shadow-sm p-3 flex items-center justify-between gap-3 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] uppercase tracking-wider text-muted-foreground font-semibold",
								children: "Date Range"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: pendingRange,
									onChange: (e) => setPendingRange(e.target.value),
									className: "appearance-none rounded-lg border border-border bg-surface pl-3 pr-9 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/40 min-w-[140px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											children: "All Time"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "today",
											children: "Today"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "7d",
											children: "Last 7 days"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "30d",
											children: "Last 30 days"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "month",
											children: "This Month"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: applyRange,
								className: "inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-4 py-2 text-sm font-semibold shadow hover:opacity-95 hover:-translate-y-0.5 hover:shadow-lg transition-all",
								children: "Apply Filter"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground font-medium inline-flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-1.5 rounded-full ${syncing ? "bg-amber-500 animate-pulse" : "bg-emerald-500 gv-pulse-dot"}` }),
								adSetsCount,
								" Ad Set",
								adSetsCount !== 1 ? "s" : "",
								" · ",
								syncing ? "Syncing live…" : "Live Data"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SyncedAgo, { at: lastSyncAt ?? dataUpdatedAt })]
					})]
				}),
				accounts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-semibold text-amber-500",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4" }), " No connected campaigns yet"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-amber-700 dark:text-amber-300/80 mt-1",
						children: "Your agency hasn't linked any active campaigns to this portal yet, or the latest Meta sync hasn't completed."
					})]
				}),
				featured && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-2xl p-4 sm:p-6 lg:p-7 text-white shadow-xl gv-border-glow",
					style: { background: "linear-gradient(135deg, oklch(0.55 0.22 265) 0%, oklch(0.48 0.24 280) 60%, oklch(0.55 0.22 320) 100%)" },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-24 -right-24 size-72 rounded-full bg-white/10 blur-3xl pointer-events-none gv-float" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute -bottom-24 -left-24 size-72 rounded-full bg-white/10 blur-3xl pointer-events-none gv-float",
							style: { animationDelay: "2s" }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] sm:text-[11px] uppercase tracking-widest font-bold text-white/80 mb-2 inline-flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-emerald-300 gv-pulse-dot" }), "Last 7 days · Top Campaign"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl sm:text-3xl lg:text-4xl font-extrabold truncate",
									children: featured.name || client.slug
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] sm:text-xs text-white/70 mt-1 truncate",
									children: [
										"Campaign ID: ",
										featured.id?.slice(0, 8).toUpperCase(),
										" · ",
										featured.objective ?? "—",
										" · Live data"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureStat, {
											label: "Results",
											value: num(featuredResults)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureStat, {
											label: "Cost / Result",
											value: featuredResults > 0 ? cur(featuredCostPerResult) : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureStat, {
											label: "CTR",
											value: `${featuredCtr.toFixed(2)}%`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureStat, {
											label: "Total Spend",
											value: dcur(featuredSpend)
										})
									]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 grid-cols-1 md:grid-cols-3 gv-stagger",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiHeroCard, {
							label: `Total Deposit (${currency})`,
							value: cur(totalDeposit),
							secondary: bdt(totalDeposit),
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "size-4" }),
							accent: "indigo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiHeroCard, {
							label: "Total Spend",
							value: dcur(totals.spend),
							secondary: bdt(displaySpend),
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4" }),
							accent: "violet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiHeroCard, {
							label: "Remaining Balance",
							value: cur(remaining),
							secondary: bdt(remaining),
							tag: remaining < 0 ? "OVER BUDGET" : "REMAINING",
							tagTone: remaining < 0 ? "danger" : "success",
							icon: remaining < 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" }),
							accent: remaining < 0 ? "rose" : "emerald"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-card border border-border p-4 shadow-sm gv-lift",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-[11px] mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground font-semibold uppercase tracking-wider inline-flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "size-3.5" }), " Budget Usage"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `font-bold ${budgetPct > 100 ? "text-destructive" : budgetPct > 80 ? "text-amber-500" : "text-emerald-500"}`,
							children: [budgetPct.toFixed(1), "%"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2.5 rounded-full bg-surface overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `h-full rounded-full transition-all duration-700 ${budgetPct > 100 ? "bg-gradient-to-r from-rose-500 to-red-500" : "bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500"}`,
							style: { width: `${Math.min(100, budgetPct)}%` }
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gv-stagger",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BentoMetric, {
							label: "Impressions",
							value: num(totals.impressions),
							dot: "amber",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BentoMetric, {
							label: "Reach",
							value: num(totals.reach),
							dot: "emerald",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BentoMetric, {
							label: "Clicks",
							value: num(totals.clicks),
							dot: "amber",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MousePointerClick, { className: "size-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BentoMetric, {
							label: "Results",
							value: num(totals.results),
							dot: "rose",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "size-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BentoMetric, {
							label: "CTR",
							value: `${ctr.toFixed(2)}%`,
							dot: "violet",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "size-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BentoMetric, {
							label: "Cost / Result",
							value: totals.results > 0 ? cur(costPerResult) : "—",
							dot: "violet",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "size-3.5" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-card border border-border p-5 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-bold inline-flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-4 text-primary" }), " Performance Snapshot"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] uppercase tracking-wider text-muted-foreground font-semibold",
							children: "Traffic & Cost"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SnapCell, {
								label: "Results",
								value: num(totals.results),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "size-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SnapCell, {
								label: "Cost per result",
								value: totals.results > 0 ? cur(costPerResult) : "—",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "size-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SnapCell, {
								label: "Spend",
								value: dcur(totals.spend),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SnapCell, {
								label: "Reach",
								value: num(totals.reach),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SnapCell, {
								label: "Impressions",
								value: num(totals.impressions),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SnapCell, {
								label: "Frequency",
								value: totals.frequency > 0 ? totals.frequency.toFixed(2) : "—",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat, { className: "size-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SnapCell, {
								label: "CPM",
								value: totals.impressions > 0 ? cur(cpm) : "—",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDollarSign, { className: "size-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SnapCell, {
								label: "CPC",
								value: totals.clicks > 0 ? cur(cpc) : "—",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MousePointer, { className: "size-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SnapCell, {
								label: "Link Clicks",
								value: num(totals.clicks),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MousePointerClick, { className: "size-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SnapCell, {
								label: "CTR",
								value: `${ctr.toFixed(2)}%`,
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "size-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SnapCell, {
								label: "Result Rate",
								value: totals.impressions > 0 ? `${resultRate.toFixed(2)}%` : "—",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SnapCell, {
								label: "Outbound Clicks",
								value: num(totals.clicks),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-card border border-border p-5 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-bold inline-flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-4 text-primary" }), " Campaign Journey"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] uppercase tracking-wider text-muted-foreground font-semibold",
								children: "Impressions → Conversion"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: journey.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-24 text-sm font-medium text-muted-foreground shrink-0",
										children: j.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex-1 h-2.5 rounded-full bg-surface overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `h-full rounded-full bg-gradient-to-r ${j.color} transition-all duration-700`,
											style: { width: `${j.value / journeyMax * 100}%` }
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-28 text-right text-sm font-bold tabular-nums",
										children: num(j.value)
									})
								]
							}, j.label))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RateCell, {
									label: "CTR",
									value: `${ctr.toFixed(2)}%`,
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "size-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RateCell, {
									label: "Reach Rate",
									value: totals.impressions > 0 ? `${reachRate.toFixed(2)}%` : "—",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RateCell, {
									label: "Result Rate",
									value: totals.impressions > 0 ? `${resultRate.toFixed(2)}%` : "—",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RateCell, {
									label: "Cost / Result",
									value: totals.results > 0 ? cur(costPerResult) : "—",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "size-3.5" })
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-card border border-border shadow-sm overflow-hidden gv-lift",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-5 py-4 border-b border-border flex items-center justify-between gap-3 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-bold inline-flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-4 text-primary" }), " Ad Set Performance"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: [
									adSetsCount,
									" ad set",
									adSetsCount !== 1 ? "s" : "",
									" assigned to your account"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-9 grid place-items-center rounded-lg border border-border bg-surface/60",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-4 text-muted-foreground" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:hidden divide-y divide-border/60",
							children: adSetList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-center py-10 text-muted-foreground text-sm",
								children: "No ad sets assigned yet. Contact your agency."
							}) : adSetList.map((s) => {
								const aSpend = Number(s.spend) || 0;
								const aResults = Number(s.results) || 0;
								const aImpr = Number(s.impressions) || 0;
								const dailyBudget = s.daily_budget ? Number(s.daily_budget) : 0;
								const resultRateAd = aImpr > 0 ? aResults / aImpr * 100 : 0;
								const spendPct = totalAdSetSpend > 0 ? aSpend / totalAdSetSpend * 100 : 0;
								const costPerR = aResults > 0 ? mk(aSpend) / aResults : 0;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-semibold text-sm leading-tight truncate",
													children: s.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] text-muted-foreground tabular-nums mt-1",
													children: (s.id ?? "").toString().slice(0, 16)
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `shrink-0 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase rounded-full px-2.5 py-1 ${s.effective_status === "ACTIVE" ? "bg-emerald-500/15 text-emerald-500" : s.effective_status === "PAUSED" ? "bg-amber-500/15 text-amber-500" : "bg-muted/40 text-muted-foreground"}`,
												children: s.effective_status ?? "—"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-3 gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-lg bg-surface/60 px-2.5 py-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[9px] uppercase tracking-wider text-muted-foreground font-semibold",
														children: "Spend"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-sm font-bold tabular-nums mt-0.5 truncate",
														children: dcur(aSpend)
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-lg bg-surface/60 px-2.5 py-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[9px] uppercase tracking-wider text-muted-foreground font-semibold",
														children: "Results"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-sm font-bold tabular-nums mt-0.5 truncate",
														children: num(aResults)
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-lg bg-surface/60 px-2.5 py-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[9px] uppercase tracking-wider text-muted-foreground font-semibold",
														children: "Cost/Res"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-sm font-bold tabular-nums mt-0.5 truncate",
														children: aResults > 0 ? cur(costPerR) : "—"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-lg bg-surface/60 px-2.5 py-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[9px] uppercase tracking-wider text-muted-foreground font-semibold",
														children: "Impr."
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-sm font-bold tabular-nums mt-0.5 truncate",
														children: num(aImpr)
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-lg bg-surface/60 px-2.5 py-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[9px] uppercase tracking-wider text-muted-foreground font-semibold",
														children: "Reach"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-sm font-bold tabular-nums mt-0.5 truncate",
														children: num(Number(s.reach) || 0)
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-lg bg-surface/60 px-2.5 py-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[9px] uppercase tracking-wider text-muted-foreground font-semibold",
														children: "CTR"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-sm font-bold tabular-nums mt-0.5 truncate",
														children: [Number(s.ctr || 0).toFixed(2), "%"]
													})]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-[11px] text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Daily: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: dailyBudget > 0 ? dcur(dailyBudget) : "—"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Result Rate: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: aImpr > 0 ? `${resultRateAd.toFixed(2)}%` : "—"
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-1.5 rounded-full bg-surface overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-700",
												style: { width: `${Math.min(100, spendPct)}%` }
											})
										})
									]
								}, s.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden md:block overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "text-[10px] uppercase tracking-wider text-muted-foreground bg-surface/60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-left px-4 py-3",
											children: "Ad Set Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-center px-3 py-3",
											children: "Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-center px-3 py-3",
											children: "Daily Budget"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-center px-3 py-3",
											children: "End Date"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-center px-3 py-3",
											children: "Spend"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-center px-3 py-3",
											children: "Impressions"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-center px-3 py-3",
											children: "Reach"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-center px-3 py-3",
											children: "CTR"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-center px-3 py-3",
											children: "Result Rate"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-center px-3 py-3",
											children: "Results"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-center px-3 py-3",
											children: "Cost / Result"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-center px-3 py-3",
											children: "Result Value"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-center px-3 py-3",
											children: "ROAS"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-center px-3 py-3",
											children: "Spend %"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: adSetList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 14,
									className: "text-center py-12 text-muted-foreground",
									children: "No ad sets assigned yet. Contact your agency."
								}) }) : adSetList.map((s) => {
									const aSpend = Number(s.spend) || 0;
									const aResults = Number(s.results) || 0;
									const aImpr = Number(s.impressions) || 0;
									const dailyBudget = s.daily_budget ? Number(s.daily_budget) : 0;
									const endTime = s.end_time;
									const goal = s.optimization_goal ?? "";
									const resultRateAd = aImpr > 0 ? aResults / aImpr * 100 : 0;
									const spendPct = totalAdSetSpend > 0 ? aSpend / totalAdSetSpend * 100 : 0;
									const goalLabel = goalToLabel(goal);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-border/60 hover:bg-surface/40 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 max-w-[280px]",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-semibold truncate",
														children: s.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[10px] text-muted-foreground tabular-nums mt-0.5",
														children: (s.id ?? "").toString().slice(0, 16)
													})]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3 text-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `inline-flex items-center gap-1.5 text-[10px] font-bold uppercase rounded-full px-2.5 py-1 ${s.effective_status === "ACTIVE" ? "bg-emerald-500/15 text-emerald-500" : s.effective_status === "PAUSED" ? "bg-amber-500/15 text-amber-500" : "bg-muted/40 text-muted-foreground"}`,
													children: s.effective_status ?? "—"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3 text-center tabular-nums",
												children: dailyBudget > 0 ? dcur(dailyBudget) : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3 text-center text-xs text-muted-foreground",
												children: formatEndDate(endTime)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3 text-center font-bold tabular-nums",
												children: dcur(aSpend)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3 text-center tabular-nums",
												children: num(aImpr)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3 text-center tabular-nums",
												children: num(Number(s.reach) || 0)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "px-3 py-3 text-center tabular-nums",
												children: [Number(s.ctr || 0).toFixed(2), "%"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3 text-center tabular-nums",
												children: aImpr > 0 ? `${resultRateAd.toFixed(2)}%` : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "px-3 py-3 text-center",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-bold tabular-nums",
													children: num(aResults)
												}), goalLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5",
													children: goalLabel
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3 text-center tabular-nums",
												children: aResults > 0 ? cur(mk(aSpend) / aResults) : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3 text-center tabular-nums text-muted-foreground",
												children: cur(0)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3 text-center tabular-nums",
												children: "0.00x"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3 text-center min-w-[110px]",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-col items-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "h-1.5 w-full rounded-full bg-surface overflow-hidden",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-700",
															style: { width: `${Math.min(100, spendPct)}%` }
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[10px] font-semibold tabular-nums",
														children: [spendPct.toFixed(1), "%"]
													})]
												})
											})
										]
									}, s.id);
								}) })]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-end gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => downloadExport("campaign"),
							disabled: exporting === "campaign",
							className: "inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-surface disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Export CSV"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => window.print(),
							className: "inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-surface",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileImage, { className: "size-4" }), " Download PNG"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => window.print(),
							className: "inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-surface",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" }), " Download PDF"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => window.print(),
							className: "inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-4 py-2 text-sm font-semibold hover:opacity-90",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }),
								" ",
								t("portal.print")
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
					className: "text-center text-xs text-muted-foreground py-6 space-y-2 border-t border-border/40 mt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-2 font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("portal.autoUpdated") })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-muted-foreground/80",
							children: [
								t("portal.poweredBy"),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold gradient-text",
									children: "GrowVibe Ads Solution"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-1.5 text-[11px] opacity-70",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }),
								t("portal.lastSync"),
								": ",
								dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleString() : "—"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-2.5 pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "size-10 p-0.5 gv-float" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display font-extrabold text-lg sm:text-xl gradient-text gv-brand-shimmer tracking-tight",
								children: "GrowVibe Ads Solution"
							})]
						})
					]
				})
			]
		})]
	});
}
function currencySymbol(code) {
	switch ((code || "").toUpperCase()) {
		case "USD": return "$";
		case "BDT": return "৳";
		case "EUR": return "€";
		case "GBP": return "£";
		case "INR": return "₹";
		default: return `${code} `;
	}
}
function FeatureStat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-white/15 backdrop-blur px-4 py-3 border border-white/20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] uppercase tracking-wider text-white/70 font-semibold",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-2xl font-extrabold mt-0.5 tabular-nums",
			children: value
		})]
	});
}
function BentoMetric({ label, value, dot, icon }) {
	const iconBg = {
		amber: "bg-amber-500/15 text-amber-500",
		emerald: "bg-emerald-500/15 text-emerald-500",
		rose: "bg-rose-500/15 text-rose-500",
		violet: "bg-violet-500/15 text-violet-500"
	}[dot];
	const glow = {
		amber: "from-amber-500/15",
		emerald: "from-emerald-500/15",
		rose: "from-rose-500/15",
		violet: "from-violet-500/15"
	}[dot];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "col-span-1 lg:col-span-1 rounded-2xl bg-card border border-border p-4 shadow-sm relative overflow-hidden gv-lift",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute -top-8 -right-8 size-24 rounded-full bg-gradient-to-br ${glow} to-transparent blur-2xl pointer-events-none` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] uppercase tracking-wider text-muted-foreground font-semibold truncate",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `size-6 rounded-md grid place-items-center shrink-0 ${iconBg}`,
					children: icon
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xl lg:text-2xl font-extrabold mt-1.5 tabular-nums truncate gv-count",
				children: value
			}, value)
		]
	});
}
function KpiHeroCard({ label, value, secondary, tag, tagTone, icon, accent }) {
	const styles = {
		indigo: {
			ring: "from-indigo-500/15",
			badge: "bg-indigo-500/15 text-indigo-500 border-indigo-500/30",
			border: "border-indigo-500/25"
		},
		violet: {
			ring: "from-violet-500/15",
			badge: "bg-violet-500/15 text-violet-500 border-violet-500/30",
			border: "border-violet-500/25"
		},
		emerald: {
			ring: "from-emerald-500/15",
			badge: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
			border: "border-emerald-500/25"
		},
		rose: {
			ring: "from-rose-500/15",
			badge: "bg-rose-500/15 text-rose-500 border-rose-500/30",
			border: "border-rose-500/25"
		}
	}[accent];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `relative rounded-2xl bg-card border ${styles.border} p-5 shadow-sm overflow-hidden gv-lift gv-shimmer`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute -top-16 -right-16 size-40 rounded-full bg-gradient-to-br ${styles.ring} to-transparent blur-2xl pointer-events-none` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] uppercase tracking-wider text-muted-foreground font-bold",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `size-8 rounded-lg grid place-items-center border ${styles.badge}`,
					children: icon
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 text-3xl lg:text-4xl font-extrabold tabular-nums gv-count",
				children: value
			}, value),
			secondary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground mt-1 tabular-nums",
				children: secondary
			}),
			tag && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `mt-2 text-[10px] font-bold uppercase tracking-wider ${tagTone === "danger" ? "text-rose-500" : "text-emerald-500"}`,
				children: tag
			})
		]
	});
}
function SnapCell({ label, value, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border/70 bg-surface/40 px-3 py-2.5 transition-all hover:border-primary/40 hover:bg-surface/70",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] uppercase tracking-wider font-semibold",
				children: label
			}), icon]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-base font-bold mt-1 tabular-nums",
			children: value
		})]
	});
}
function RateCell({ label, value, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-gradient-to-br from-primary/10 to-primary/0 border border-primary/20 px-3 py-3 text-center transition-all hover:from-primary/20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-center gap-1.5 text-muted-foreground",
			children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] uppercase tracking-wider font-semibold",
				children: label
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xl font-extrabold mt-1 tabular-nums",
			children: value
		})]
	});
}
function goalToLabel(goal) {
	if (!goal) return "";
	const g = goal.toUpperCase();
	if (g.includes("MESSAGE") || g.includes("CONVERSATION") || g.includes("REPLIES")) return "Messages";
	if (g.includes("LEAD")) return "Leads";
	if (g.includes("PURCHASE")) return "Purchases";
	if (g.includes("LINK_CLICKS")) return "Link Clicks";
	if (g.includes("LANDING_PAGE")) return "Landing Page Views";
	if (g.includes("REACH")) return "Reach";
	if (g.includes("IMPRESSION")) return "Impressions";
	if (g.includes("VIDEO")) return "Video Views";
	if (g.includes("ENGAGEMENT") || g.includes("POST")) return "Engagement";
	return goal.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
function formatEndDate(end) {
	if (!end) return "—";
	try {
		const d = new Date(end);
		if (isNaN(d.getTime())) return "—";
		return d.toLocaleDateString(void 0, {
			month: "short",
			day: "numeric",
			year: "numeric"
		});
	} catch {
		return "—";
	}
}
function NotFoundCard({ reason }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen grid place-items-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl bg-card border border-border p-10 text-center max-w-md shadow-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "size-16 mx-auto rounded-2xl bg-surface grid place-items-center text-2xl",
					children: reason === "forbidden" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-7 text-destructive" }) : "🔍"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 text-xl font-bold",
					children: reason === "forbidden" ? "Access token required" : "Dashboard not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: reason === "forbidden" ? "This portal requires a verified access token. Please open the full link sent to you by your agency." : "Please check the link or contact your agency."
				})
			]
		})
	});
}
function SyncedAgo({ at }) {
	const [, tick] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => tick((n) => n + 1), 15e3);
		return () => clearInterval(id);
	}, []);
	if (!at) return null;
	const diff = Math.max(0, Math.floor((Date.now() - at) / 1e3));
	const label = diff < 10 ? "just now" : diff < 60 ? `${diff}s ago` : diff < 3600 ? `${Math.floor(diff / 60)}m ago` : `${Math.floor(diff / 3600)}h ago`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-[11px] text-muted-foreground inline-flex items-center gap-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }),
			"Synced ",
			label
		]
	});
}
//#endregion
export { PortalDashboard, PortalPage as component };
