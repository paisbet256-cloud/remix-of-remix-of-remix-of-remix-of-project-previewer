import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-rgEw8wDd.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { d as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as RefreshCw, H as LoaderCircle, L as Megaphone, O as Plus, St as ArrowUpRight, Tt as Activity, a as Wallet, f as Trash2, g as Sparkles, h as SquareCheckBig, mt as CircleAlert, o as Users, ot as DollarSign, rt as Eye, ut as Clock, y as ShieldCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { d as retestAndReimport, g as syncAllAccountsNow, o as getSettingsPublic, u as refreshAllData } from "./admin.functions-DJtfy5At.mjs";
import { c as Cell, l as ResponsiveContainer, n as PieChart, s as Pie, u as Tooltip } from "../_libs/recharts+[...].mjs";
import { t as CandlestickChart } from "./CandlestickChart-D6pbie1f.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-D-94icy8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const qc = useQueryClient();
	const getSettings = useServerFn(getSettingsPublic);
	const syncFn = useServerFn(syncAllAccountsNow);
	const retestFn = useServerFn(retestAndReimport);
	const refreshFn = useServerFn(refreshAllData);
	const [datePreset, setDatePreset] = (0, import_react.useState)("Last 7 days");
	const [autoSync, setAutoSync] = (0, import_react.useState)(true);
	const [syncing, setSyncing] = (0, import_react.useState)(false);
	const [retesting, setRetesting] = (0, import_react.useState)(false);
	const [refreshingAll, setRefreshingAll] = (0, import_react.useState)(false);
	const [lastSyncAt, setLastSyncAt] = (0, import_react.useState)(null);
	const [autoSyncErrors, setAutoSyncErrors] = (0, import_react.useState)(0);
	const { data: settings } = useQuery({
		queryKey: ["settings"],
		queryFn: () => getSettings({ data: {} })
	});
	const { data: accounts } = useQuery({
		queryKey: ["dashboard-accounts"],
		queryFn: async () => {
			const { data } = await supabase.from("ad_accounts").select("*, client:clients(id,name,slug)").eq("is_active", true).order("total_spend", { ascending: false });
			return data ?? [];
		}
	});
	const { data: timeSeries } = useQuery({
		queryKey: ["dashboard-timeseries", datePreset],
		queryFn: async () => {
			const days = datePreset === "Today" || datePreset === "Yesterday" ? 1 : datePreset === "Last 14 days" ? 14 : datePreset === "Last 30 days" ? 30 : 7;
			const cutoff = /* @__PURE__ */ new Date();
			if (datePreset === "Yesterday") cutoff.setDate(cutoff.getDate() - 1);
			else cutoff.setDate(cutoff.getDate() - (days - 1));
			const cutoffStr = cutoff.toISOString().slice(0, 10);
			let query = supabase.from("insights_snapshots").select("date_start,spend,results,reach,impressions").eq("level", "account").gte("date_start", cutoffStr).order("date_start");
			if (datePreset === "Today" || datePreset === "Yesterday") query = query.lte("date_start", cutoffStr);
			const { data } = await query;
			const grouped = {};
			(data ?? []).forEach((r) => {
				const k = r.date_start;
				grouped[k] = grouped[k] ?? {
					date: k,
					spend: 0,
					results: 0,
					reach: 0,
					impressions: 0
				};
				grouped[k].spend += Number(r.spend) || 0;
				grouped[k].results += Number(r.results) || 0;
				grouped[k].reach += Number(r.reach) || 0;
				grouped[k].impressions += Number(r.impressions) || 0;
			});
			return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
		}
	});
	const { data: campaignsByObjective } = useQuery({
		queryKey: ["dashboard-by-objective"],
		queryFn: async () => {
			const { data } = await supabase.from("campaigns").select("objective, spend");
			const grouped = {};
			(data ?? []).forEach((c) => {
				const key = c.objective ?? "OTHER";
				grouped[key] = (grouped[key] ?? 0) + (Number(c.spend) || 0);
			});
			return Object.entries(grouped).map(([name, value]) => ({
				name,
				value
			})).filter((x) => x.value > 0);
		}
	});
	const { data: recentLogs } = useQuery({
		queryKey: ["dashboard-logs"],
		queryFn: async () => {
			const { data } = await supabase.from("sync_logs").select("*, ad_account:ad_accounts(account_name,fb_account_id, client:clients(name))").order("started_at", { ascending: false }).limit(8);
			return data ?? [];
		}
	});
	const MAX_SYNC_ERRORS = 3;
	(0, import_react.useEffect)(() => {
		if (settings?.auto_sync_enabled !== void 0) setAutoSync(settings.auto_sync_enabled);
	}, [settings?.auto_sync_enabled]);
	(0, import_react.useEffect)(() => {
		if (!autoSync || !settings?.has_token) {
			setAutoSyncErrors(0);
			return;
		}
		const minutes = Math.max(1, Number(settings.sync_interval_minutes) || 5);
		let timer;
		let isMounted = true;
		const runSync = async () => {
			if (syncing || !isMounted) return;
			try {
				const res = await syncFn({ data: {} });
				if (!res.skipped) {
					qc.invalidateQueries();
					setAutoSyncErrors(0);
				} else {
					const newErrorCount = autoSyncErrors + 1;
					setAutoSyncErrors(newErrorCount);
					if (newErrorCount >= MAX_SYNC_ERRORS) {
						console.error("[dashboard auto-sync] Max retries reached - disabling", res.tokenHealth?.error);
						toast.error("Auto-sync stopped. Check your settings.");
						setAutoSync(false);
					} else console.warn("[dashboard auto-sync] Skipped", res.tokenHealth?.error);
				}
			} catch (error) {
				const newErrorCount = autoSyncErrors + 1;
				setAutoSyncErrors(newErrorCount);
				console.error("[dashboard auto-sync] failed:", error instanceof Error ? error.message : String(error));
				if (newErrorCount >= MAX_SYNC_ERRORS) {
					console.error("[dashboard auto-sync] Max retries reached - disabling");
					toast.error("Auto-sync failed too many times. Please check your connection.");
					setAutoSync(false);
				}
			}
		};
		timer = window.setInterval(runSync, minutes * 6e4);
		const initialTimer = window.setTimeout(() => {
			if (isMounted) runSync();
		}, 5e3);
		return () => {
			isMounted = false;
			window.clearInterval(timer);
			window.clearTimeout(initialTimer);
		};
	}, [
		autoSync,
		settings?.has_token,
		settings?.sync_interval_minutes,
		syncing,
		syncFn,
		qc,
		autoSyncErrors
	]);
	(0, import_react.useEffect)(() => {
		let isActive = true;
		const ch = supabase.channel("dashboard-rt").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "ad_accounts"
		}, () => {
			if (isActive) qc.invalidateQueries({ queryKey: ["dashboard-accounts"] });
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "sync_logs"
		}, () => {
			if (isActive) qc.invalidateQueries({ queryKey: ["dashboard-logs"] });
		}).subscribe((status) => {
			if (status === "CLOSED" && isActive) console.warn("[Dashboard] Realtime channel closed unexpectedly");
		});
		return () => {
			isActive = false;
			supabase.removeChannel(ch);
		};
	}, [qc]);
	const totals = (0, import_react.useMemo)(() => {
		const acc = accounts ?? [];
		const rangeTotals = (timeSeries ?? []).reduce((s, r) => ({
			spend: s.spend + (Number(r.spend) || 0),
			reach: s.reach + (Number(r.reach) || 0),
			results: s.results + (Number(r.results) || 0)
		}), {
			spend: 0,
			reach: 0,
			results: 0
		});
		return {
			spend: rangeTotals.spend,
			reach: rangeTotals.reach,
			results: rangeTotals.results,
			activeCampaigns: acc.reduce((s, a) => s + (Number(a.active_campaigns) || 0), 0),
			accounts: acc.length
		};
	}, [accounts, timeSeries]);
	const onSync = async () => {
		if (!settings?.has_token) {
			toast.error("Add your Facebook System User token in Settings first");
			return;
		}
		setSyncing(true);
		try {
			const res = await syncFn({ data: {} });
			if (res.skipped) toast.error(res.tokenHealth?.error ?? "Token check failed. Fix Settings first.");
			else if (res.count === 0) toast.warning("No ad accounts synced. Go to Settings → Test connection → Import visible accounts.");
			else {
				const failed = (res.results ?? []).filter((r) => !r.ok);
				toast[failed.length ? "warning" : "success"](`Synced ${res.count} accounts${failed.length ? ` · ${failed.length} failed` : ""}`);
			}
			setLastSyncAt(Date.now());
			setAutoSyncErrors(0);
			qc.invalidateQueries();
		} catch (e) {
			console.error("[Dashboard] Sync failed:", e);
			toast.error(e?.message ?? "Sync failed");
		} finally {
			setSyncing(false);
		}
	};
	const onRetest = async () => {
		setRetesting(true);
		try {
			const r = await retestFn({ data: {} });
			if (!r.ok) toast.error(r.error ?? "Retest failed");
			else toast.success(`Re-imported ${r.imported} accounts`);
			setLastSyncAt(Date.now());
			setAutoSyncErrors(0);
			qc.invalidateQueries();
		} catch (e) {
			console.error("[Dashboard] Retest failed:", e);
			toast.error(e?.message ?? "Retest failed");
		} finally {
			setRetesting(false);
		}
	};
	const onRefreshAll = async () => {
		if (!confirm("This will wipe all cached campaigns/ad sets/ads/insights and run a full re-sync. Continue?")) return;
		setRefreshingAll(true);
		try {
			const r = await refreshFn({ data: {} });
			toast.success(`Cleared cache · synced ${r.count ?? 0} accounts`);
			setLastSyncAt(Date.now());
			setAutoSyncErrors(0);
			qc.invalidateQueries();
		} catch (e) {
			console.error("[Dashboard] Refresh failed:", e);
			toast.error(e?.message ?? "Refresh failed");
		} finally {
			setRefreshingAll(false);
		}
	};
	const intervalMin = Math.max(1, Number(settings?.sync_interval_minutes) || 5);
	const nextSyncLabel = autoSync && settings?.has_token ? new Date((lastSyncAt ?? Date.now()) + intervalMin * 6e4).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit"
	}) : "—";
	const intervalLabel = intervalMin >= 1440 ? `${Math.round(intervalMin / 1440)}d` : intervalMin >= 60 ? `${Math.round(intervalMin / 60)}h` : `${intervalMin}m`;
	const PIE_COLORS = [
		"oklch(0.78 0.18 165)",
		"oklch(0.66 0.22 295)",
		"oklch(0.83 0.16 85)",
		"oklch(0.70 0.20 30)",
		"oklch(0.62 0.18 220)"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 gv-fade-up",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hero-panel gv-border-glow p-6 lg:p-8 relative overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-32 -right-20 size-72 rounded-full bg-primary/15 blur-3xl gv-float pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute -bottom-32 -left-20 size-72 rounded-full bg-accent/15 blur-3xl gv-float pointer-events-none",
						style: { animationDelay: "1.5s" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 flex flex-col lg:flex-row gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-2 text-xs font-medium text-primary",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🌅" }),
										" Good Day, ",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground",
											children: "Welcome back"
										}),
										" ✨"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold",
									children: ["Welcome to your ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "gradient-text",
										children: "Command Center"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-muted-foreground",
									children: "Track every campaign, every client, every dollar — all in real time."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 flex flex-wrap gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: onSync,
											disabled: syncing,
											className: "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-50",
											children: [syncing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), " Sync All Accounts"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: onRetest,
											disabled: retesting,
											title: "Re-test Facebook token + re-import visible ad accounts",
											className: "inline-flex items-center gap-2 rounded-xl bg-surface-elevated border border-border px-4 py-2.5 text-sm font-medium hover:bg-surface disabled:opacity-50",
											children: [retesting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }), " Re-test & Re-import"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: onRefreshAll,
											disabled: refreshingAll,
											title: "Wipe cached metrics and force a full re-sync",
											className: "inline-flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/40 text-destructive px-4 py-2.5 text-sm font-medium hover:bg-destructive/20 disabled:opacity-50",
											children: [refreshingAll ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Refresh all data"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/sync-activity",
											className: "inline-flex items-center gap-2 rounded-xl bg-surface-elevated border border-border px-4 py-2.5 text-sm font-medium hover:bg-surface",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-4" }), " Sync Activity"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/clients",
											className: "inline-flex items-center gap-2 rounded-xl bg-surface-elevated border border-border px-4 py-2.5 text-sm font-medium hover:bg-surface",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }), " Client View"]
										})
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg:w-72 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass-card p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-between mb-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-medium",
										children: "📅 Date preset"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: datePreset,
									onChange: (e) => setDatePreset(e.target.value),
									className: "w-full rounded-lg bg-input border border-border px-3 py-2 text-sm",
									children: [
										"Last 7 days",
										"Last 14 days",
										"Last 30 days",
										"Today",
										"Yesterday"
									].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: p }, p))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass-card p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center justify-between mb-2 text-xs font-medium",
										children: ["Auto-sync ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: autoSync,
											onChange: (e) => setAutoSync(e.target.checked),
											className: "size-4 accent-primary"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm",
										children: ["Every ", intervalLabel]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground mt-1 inline-flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }),
											" Next sync ~",
											nextSyncLabel
										]
									})
								]
							})]
						})]
					})
				]
			}),
			!settings?.has_token && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card p-4 flex items-center gap-3 border-warning/30",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-5 text-warning shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "No Facebook token configured." }),
						" Add your System User access token in ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/facebook-marketing-api",
							className: "text-primary underline",
							children: "Settings"
						}),
						" to start syncing real-time data."
					]
				})]
			}),
			settings?.has_token && (accounts ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card p-4 flex items-center gap-3 border-warning/30",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-5 text-warning shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "No ad accounts imported yet." }),
						" Open ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/facebook-marketing-api",
							className: "text-primary underline",
							children: "Settings"
						}),
						", run Test connection, then click Import visible accounts to load the exact Ads Manager accounts."
					]
				})]
			}),
			settings?.has_token && (accounts ?? []).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-4 text-primary" }), " Connection Status"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [
							"Token: ",
							settings.token_status === "ok" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-success",
								children: "healthy"
							}) : settings.token_status === "missing_scopes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-warning",
								children: "missing scopes"
							}) : settings.token_status === "invalid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-destructive",
								children: "invalid"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "not checked"
							}),
							settings.token_missing_scopes && settings.token_missing_scopes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/facebook-marketing-api",
								className: "text-primary underline ml-2",
								children: "Fix in Settings"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-2",
					children: (accounts ?? []).map((a) => {
						const ok = a.last_sync_status === "success";
						const failed = a.last_sync_status === "failed";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-surface/60 border border-border/50 px-3 py-2.5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium truncate",
										children: a.client?.name ?? a.account_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-2 rounded-full ${ok ? "bg-success" : failed ? "bg-destructive" : "bg-muted-foreground"}` })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground truncate",
									children: a.account_name ?? a.fb_account_id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] mt-1 text-muted-foreground",
									children: a.last_sync_at ? `Synced ${new Date(a.last_sync_at).toLocaleTimeString()}` : "Awaiting first sync"
								}),
								failed && a.last_sync_error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] mt-1 text-destructive truncate",
									title: a.last_sync_error,
									children: ["⚠ ", a.last_sync_error]
								})
							]
						}, a.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4 gv-stagger",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: DollarSign,
						label: "Total Spend",
						value: `$${totals.spend.toFixed(2)}`,
						accent: "from-primary to-primary-glow"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: Users,
						label: "Total Reach",
						value: totals.reach.toLocaleString(),
						accent: "from-accent to-primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: SquareCheckBig,
						label: "Results",
						value: totals.results.toLocaleString(),
						accent: "from-warning to-primary-glow"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: Megaphone,
						label: "Active Campaigns",
						value: String(totals.activeCampaigns),
						accent: "from-destructive to-accent"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3 gv-stagger",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-card p-5 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between mb-3 flex-wrap gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-semibold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-4 text-primary" }),
								" Performance Overview (7 Days)",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-wider text-muted-foreground font-semibold ml-1 rounded-md bg-primary/10 text-primary px-1.5 py-0.5",
									children: "Candlestick"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandlestickChart, {
						data: timeSeries ?? [],
						height: 260,
						series: [
							{
								key: "spend",
								label: "Spend",
								upColor: "oklch(0.78 0.18 165)",
								downColor: "oklch(0.66 0.22 25)",
								format: (v) => `$${v.toFixed(2)}`
							},
							{
								key: "results",
								label: "Results",
								upColor: "oklch(0.72 0.19 295)",
								downColor: "oklch(0.66 0.22 25)",
								format: (v) => v.toLocaleString()
							},
							{
								key: "clicks",
								label: "Clicks",
								upColor: "oklch(0.83 0.16 85)",
								downColor: "oklch(0.66 0.22 25)",
								format: (v) => v.toLocaleString()
							}
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-semibold mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-accent" }), " Spend by Objective"]
					}), (campaignsByObjective ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64 grid place-items-center text-sm text-muted-foreground text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-24 mx-auto rounded-full bg-gradient-to-br from-accent/30 to-primary/30 grid place-items-center mb-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl font-bold",
								children: "$0"
							})
						}), "No spend data yet"] })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: campaignsByObjective,
							dataKey: "value",
							innerRadius: 48,
							outerRadius: 80,
							paddingAngle: 3,
							children: (campaignsByObjective ?? []).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: PIE_COLORS[i % PIE_COLORS.length] }, i))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
							background: "oklch(0.22 0.04 262)",
							border: "1px solid oklch(0.30 0.04 263)",
							borderRadius: 12
						} })] }) })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-semibold mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4 text-primary" }), " Quick Actions"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/clients",
								className: "flex items-center justify-between rounded-lg bg-surface border border-border px-4 py-3 hover:bg-surface-elevated text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add New Client"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4 opacity-50" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/budget-tracker",
								className: "flex items-center justify-between rounded-lg bg-surface border border-border px-4 py-3 hover:bg-surface-elevated text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex items-center gap-2",
									children: "💰 Budget Overview"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4 opacity-50" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/clients",
								className: "flex items-center justify-between rounded-lg bg-surface border border-border px-4 py-3 hover:bg-surface-elevated text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }), " Preview Client Portal"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4 opacity-50" })]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-semibold mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-4 text-accent" }), " Live Activity Feed"]
					}), (recentLogs ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-44 grid place-items-center text-center text-sm text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-10 mx-auto text-muted-foreground/40 mb-2" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium text-foreground",
								children: "No activity yet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs",
								children: "Activity will appear here when you add campaigns or clients"
							})
						] })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2 max-h-72 overflow-y-auto",
						children: (recentLogs ?? []).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 rounded-lg bg-surface/60 px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-2 rounded-full ${l.status === "success" ? "bg-success" : l.status === "failed" ? "bg-destructive" : "bg-warning"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "truncate",
									children: [
										l.ad_account?.client?.name ?? "—",
										" · ",
										l.ad_account?.account_name ?? l.ad_account?.fb_account_id
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										l.items_synced,
										" items · ",
										l.duration_ms,
										"ms · ",
										new Date(l.started_at).toLocaleTimeString()
									]
								})]
							})]
						}, l.id))
					})]
				})]
			})
		]
	});
}
function KpiCard({ icon: Icon, label, value, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-card gv-lift gv-shimmer p-5 relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute -top-8 -right-8 size-32 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-2xl` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `size-10 rounded-xl bg-gradient-to-br ${accent} grid place-items-center text-primary-foreground shadow-lg`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-semibold text-success bg-success/10 rounded-full px-2 py-0.5 inline-flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-success gv-pulse-dot" }), " live"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 text-[11px] font-semibold tracking-[0.14em] uppercase text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-2xl sm:text-3xl font-bold gv-count tabular-nums truncate",
				children: value
			}, value)
		]
	});
}
//#endregion
export { Dashboard as component };
