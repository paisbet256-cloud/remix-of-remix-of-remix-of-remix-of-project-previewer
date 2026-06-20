import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-rgEw8wDd.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { d as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as RefreshCw, H as LoaderCircle, Tt as Activity, U as ListChecks, dt as CircleX, f as Trash2, mt as CircleAlert, pt as CircleCheck, y as ShieldCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { d as retestAndReimport, g as syncAllAccountsNow, u as refreshAllData, y as verifyCampaignMapping } from "./admin.functions-D-0P87qP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sync-activity-BX4qWlSF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SyncActivityPage() {
	const qc = useQueryClient();
	const verifyFn = useServerFn(verifyCampaignMapping);
	const syncFn = useServerFn(syncAllAccountsNow);
	const refreshFn = useServerFn(refreshAllData);
	const retestFn = useServerFn(retestAndReimport);
	const [verifying, setVerifying] = (0, import_react.useState)(false);
	const [syncing, setSyncing] = (0, import_react.useState)(false);
	const [refreshing, setRefreshing] = (0, import_react.useState)(false);
	const [retesting, setRetesting] = (0, import_react.useState)(false);
	const [report, setReport] = (0, import_react.useState)(null);
	const { data: accounts } = useQuery({
		queryKey: ["sa-accounts"],
		queryFn: async () => {
			const { data } = await supabase.from("ad_accounts").select("id,fb_account_id,account_name,last_sync_at,last_sync_status,last_sync_error,total_spend,total_results, client:clients(name)").order("last_sync_at", {
				ascending: false,
				nullsFirst: false
			});
			return data ?? [];
		}
	});
	const { data: logs } = useQuery({
		queryKey: ["sa-logs"],
		queryFn: async () => {
			const { data } = await supabase.from("sync_logs").select("*, ad_account:ad_accounts(account_name,fb_account_id)").order("started_at", { ascending: false }).limit(100);
			return data ?? [];
		}
	});
	const onSync = async () => {
		setSyncing(true);
		try {
			const r = await syncFn({ data: void 0 });
			if (r.skipped) toast.error(r.tokenHealth?.error ?? "Token check failed.");
			else toast.success(`Synced ${r.count} accounts`);
			qc.invalidateQueries();
		} catch (e) {
			toast.error(e?.message ?? "Sync failed");
		} finally {
			setSyncing(false);
		}
	};
	const onRefresh = async () => {
		if (!confirm("This wipes cached campaigns/ad sets/ads/insights and runs a full re-sync from Facebook. Continue?")) return;
		setRefreshing(true);
		try {
			const r = await refreshFn({ data: void 0 });
			toast.success(`Cleared cache · synced ${r.count ?? 0} accounts`);
			qc.invalidateQueries();
		} catch (e) {
			toast.error(e?.message ?? "Refresh failed");
		} finally {
			setRefreshing(false);
		}
	};
	const onRetest = async () => {
		setRetesting(true);
		try {
			const r = await retestFn({ data: void 0 });
			if (!r.ok) toast.error(r.error ?? "Retest failed");
			else toast.success(`Re-imported ${r.imported} accounts`);
			qc.invalidateQueries();
		} catch (e) {
			toast.error(e?.message ?? "Retest failed");
		} finally {
			setRetesting(false);
		}
	};
	const onVerify = async () => {
		setVerifying(true);
		setReport(null);
		try {
			const r = await verifyFn({ data: void 0 });
			setReport(r);
			const total = (r.report ?? []).reduce((s, x) => s + x.missing_in_db.length + x.stale_in_db.length + x.diffs.length, 0);
			toast[total ? "warning" : "success"](total ? `${total} mismatch(es) detected` : "All campaigns match Ads Manager ✓");
		} catch (e) {
			toast.error(e?.message ?? "Verify failed");
		} finally {
			setVerifying(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl font-bold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-6 text-primary" }), " Sync Activity & Mapping"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Verify every ad account synced correctly and that campaign IDs match Facebook Ads Manager."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: onSync,
							disabled: syncing,
							className: "inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-3.5 py-2 text-sm font-semibold disabled:opacity-50",
							children: [syncing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), " Sync Now"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: onRetest,
							disabled: retesting,
							className: "inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-semibold hover:bg-surface-elevated disabled:opacity-50",
							children: [retesting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }), " Re-test & Re-import"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: onRefresh,
							disabled: refreshing,
							className: "inline-flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive px-3.5 py-2 text-sm font-semibold hover:bg-destructive/20 disabled:opacity-50",
							children: [refreshing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Refresh all data"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-semibold mb-3 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "size-4 text-primary" }), " Per-account sync status"]
				}), (accounts ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm text-muted-foreground",
					children: ["No ad accounts yet. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/facebook-marketing-api",
						className: "text-primary underline",
						children: "Configure token →"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-md border border-border/50 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-surface/60 text-muted-foreground text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-3 py-2 font-medium",
									children: "Account"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-3 py-2 font-medium",
									children: "FB ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-3 py-2 font-medium",
									children: "Last sync"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-3 py-2 font-medium",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right px-3 py-2 font-medium",
									children: "Spend"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-3 py-2 font-medium",
									children: "Error"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (accounts ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border/40 align-top",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: a.account_name ?? "—"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: a.client?.name ?? "—"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 font-mono text-xs",
									children: a.fb_account_id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-xs",
									children: a.last_sync_at ? new Date(a.last_sync_at).toLocaleString() : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "never"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: a.last_sync_status === "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 text-success text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }), "success"]
									}) : a.last_sync_status === "failed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 text-destructive text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3" }), "failed"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "—"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-2 text-right font-mono text-xs",
									children: ["$", Number(a.total_spend || 0).toFixed(2)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-xs text-destructive max-w-xs truncate",
									title: a.last_sync_error ?? "",
									children: a.last_sync_error ?? ""
								})
							]
						}, a.id)) })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3 mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-semibold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-accent" }), " Campaign mapping verification"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: "Live-pulls campaign IDs from Facebook and diffs them against what's stored locally."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: onVerify,
						disabled: verifying,
						className: "inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-semibold hover:bg-surface-elevated disabled:opacity-50",
						children: [verifying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }), " Verify mapping"]
					})]
				}), !report ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm text-muted-foreground",
					children: [
						"Click ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Verify mapping" }),
						" to compare each account."
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [(report.report ?? []).map((row) => {
						const total = row.missing_in_db.length + row.stale_in_db.length + row.diffs.length;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border border-border/50 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm font-medium",
										children: [
											row.account_name ?? row.fb_account_id,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
												className: "text-xs text-muted-foreground ml-1",
												children: row.fb_account_id
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs",
										children: row.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-destructive",
											children: ["⚠ ", row.error]
										}) : total === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-success inline-flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }),
												" matched ",
												row.matched,
												"/",
												row.fb_count
											]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-warning",
											children: [
												total,
												" issue(s) · ",
												row.fb_count,
												" on FB · ",
												row.db_count,
												" in DB"
											]
										})
									})]
								}),
								row.missing_in_db.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
									className: "text-xs mb-1",
									open: true,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
										className: "cursor-pointer text-warning",
										children: [
											"Missing in your DB (",
											row.missing_in_db.length,
											") — Sync Now to import"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-1 space-y-0.5 pl-3",
										children: row.missing_in_db.slice(0, 20).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: c.id }),
											" — ",
											c.name,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground",
												children: [
													"[",
													c.status,
													"]"
												]
											})
										] }, c.id))
									})]
								}),
								row.stale_in_db.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
									className: "text-xs mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
										className: "cursor-pointer text-warning",
										children: [
											"Stale in DB (",
											row.stale_in_db.length,
											") — deleted on Facebook"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-1 space-y-0.5 pl-3",
										children: row.stale_in_db.slice(0, 20).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: c.id }),
											" — ",
											c.name ?? "(no name)"
										] }, c.id))
									})]
								}),
								row.diffs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
									className: "text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
										className: "cursor-pointer text-warning",
										children: [
											"Field mismatches (",
											row.diffs.length,
											")"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-1 space-y-0.5 pl-3",
										children: row.diffs.slice(0, 30).map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: d.id }),
											" · ",
											d.field,
											": FB=\"",
											d.fb,
											"\" vs DB=\"",
											d.db,
											"\""
										] }, i))
									})]
								})
							]
						}, row.ad_account_id);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[10px] text-muted-foreground",
						children: ["Generated ", new Date(report.generated_at).toLocaleString()]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-semibold mb-3 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-4 text-primary" }), " Recent sync runs (last 100)"]
				}), (logs ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm text-muted-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4" }), " No sync runs yet."]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-md border border-border/50 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-surface/60 text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-3 py-2 font-medium",
									children: "Started"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-3 py-2 font-medium",
									children: "Account"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-3 py-2 font-medium",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right px-3 py-2 font-medium",
									children: "Items"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right px-3 py-2 font-medium",
									children: "Duration"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-3 py-2 font-medium",
									children: "Error"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (logs ?? []).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: new Date(l.started_at).toLocaleString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: l.ad_account?.account_name ?? l.ad_account?.fb_account_id ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: l.status === "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-success",
										children: "success"
									}) : l.status === "failed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-destructive",
										children: "failed"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-warning",
										children: l.status
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-right font-mono",
									children: l.items_synced ?? 0
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-2 text-right font-mono",
									children: [l.duration_ms ?? 0, "ms"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-destructive max-w-xs truncate",
									title: l.error ?? "",
									children: l.error ?? ""
								})
							]
						}, l.id)) })]
					})
				})]
			})
		]
	});
}
//#endregion
export { SyncActivityPage as component };
