import { i as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { C as Save, E as RefreshCw, H as LoaderCircle, J as Info, O as Plus, Q as FlaskConical, Tt as Activity, U as ListChecks, X as GitCompare, bt as Building2, dt as CircleX, f as Trash2, gt as ChevronDown, ht as ChevronUp, it as ExternalLink, j as Pencil, l as TriangleAlert, lt as CloudDownload, n as X, pt as CircleCheck, ut as Clock, w as RotateCw, wt as Archive, y as ShieldCheck } from "../_libs/lucide-react.mjs";
import { c as createServerFn } from "./esm-I6x-3bX5.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bcxi9eKV.mjs";
import { n as booleanType, o as objectType, r as enumType, s as stringType } from "../_libs/zod.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DZQxRd04.mjs";
import { _ as testFbToken, a as detectBusinessesFromToken, h as saveSettings, o as getSettingsPublic, s as importVisibleAdAccounts, t as checkTokenHealthNow } from "./admin.functions-DJtfy5At.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/facebook-marketing-api-BnP5X5OG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var listConnections = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("4c1bcd92431cf5d8d1001c1634e5831392d874ac7525f3c1fd2f82284c320cc1"));
var connectionInput = objectType({
	id: stringType().uuid().optional(),
	label: stringType().min(1).max(120),
	fb_app_id: stringType().max(120).optional().nullable(),
	fb_app_secret: stringType().max(400).optional().nullable(),
	fb_business_id: stringType().max(120).optional().nullable(),
	fb_system_user_token: stringType().max(2e3).optional().nullable(),
	is_active: booleanType().optional()
});
var upsertConnection = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => connectionInput.parse(d)).handler(createSsrRpc("b0584ace399179106129fc0734431e0c4e1eecd6bcb0b2efcb9e8d1cbac3c475"));
var removeConnection = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("ce2fb4e6be38238fd2e7baa2795299a958c9c059b3b001fe7159f62aad99b542"));
var testConnection = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("0028c9d9b0020dce5c1a99863b62a3e4e8d12426f6d5a73258ca0b05c70b17a6"));
var checkConnectionHealth = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("06788101f525a6e5f6273296f0ded44dda839cfc75dd83f278a4ba0ec194ab90"));
var syncConnection = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("12c9a5b05305a22dd418f8e2ebddd29ed3ba2516d22a2a7f73cb312fb9d59b6d"));
var importVisibleForConnection = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("ce0ec2b67550d2a9e6bf1784245f0ba1c4e59af7741632f079d3103a6abf3eb1"));
var getConnectionAccountsStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("a4ee4afab47ded345c89f543901c97523cc13c35a394bf3ee87013594a54beb3"));
var matchCheckConnection = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	date_preset: enumType([
		"today",
		"yesterday",
		"last_7d",
		"last_30d",
		"this_month",
		"last_month",
		"maximum"
	]).optional()
}).parse(d)).handler(createSsrRpc("a950f095e5fce52e7372ca427df657a2c47f37ec75a9144a47cd650a2f6c6613"));
function BusinessManagersSection() {
	const qc = useQueryClient();
	const listFn = useServerFn(listConnections);
	const { data: connections = [] } = useQuery({
		queryKey: ["meta-connections"],
		queryFn: () => listFn({ data: void 0 })
	});
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [adding, setAdding] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-card p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold text-lg",
						children: "Business Managers"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setAdding(true);
						setEditing(null);
					},
					className: "inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-3 py-1.5 text-xs font-semibold hover:opacity-90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " Add Business Manager"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mb-4",
				children: "একটার বেশি Business Manager যোগ করতে পারবেন। প্রতিটার নিজস্ব App ID, App Secret, Business ID আর System User Token হবে। প্রতিটা ad account সবসময় তার নিজের BM-এর token দিয়েই sync হবে — Ads Manager-এর সাথে data 1:1 match থাকবে।"
			}),
			connections.length === 0 && !adding && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border border-dashed border-border bg-surface/40 p-6 text-center text-sm text-muted-foreground",
				children: "এখনো কোনো Business Manager add করা হয়নি। উপরে \"Add Business Manager\" চাপুন।"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: connections.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConnectionCard, {
					c,
					onEdit: () => {
						setEditing(c);
						setAdding(false);
					}
				}, c.id))
			}),
			(adding || editing) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConnectionForm, {
				initial: editing ?? null,
				onClose: () => {
					setAdding(false);
					setEditing(null);
				},
				onSaved: () => {
					setAdding(false);
					setEditing(null);
					qc.invalidateQueries({ queryKey: ["meta-connections"] });
				}
			})
		]
	});
}
function ConnectionCard({ c, onEdit }) {
	const qc = useQueryClient();
	const testFn = useServerFn(testConnection);
	const healthFn = useServerFn(checkConnectionHealth);
	const syncFn = useServerFn(syncConnection);
	const importFn = useServerFn(importVisibleForConnection);
	const removeFn = useServerFn(removeConnection);
	const statusFn = useServerFn(getConnectionAccountsStatus);
	const matchFn = useServerFn(matchCheckConnection);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [statusOpen, setStatusOpen] = (0, import_react.useState)(false);
	const [matchOpen, setMatchOpen] = (0, import_react.useState)(false);
	const [accounts, setAccounts] = (0, import_react.useState)(null);
	const [matchResult, setMatchResult] = (0, import_react.useState)(null);
	const [matchPreset, setMatchPreset] = (0, import_react.useState)("last_7d");
	const run = async (key, fn, successMsg) => {
		setBusy(key);
		try {
			const r = await fn();
			toast.success(successMsg(r));
			qc.invalidateQueries({ queryKey: ["meta-connections"] });
		} catch (e) {
			toast.error(e?.message ?? "Failed");
		} finally {
			setBusy(null);
		}
	};
	const statusColor = c.token_status === "ok" ? "text-success" : c.token_status === "missing_scopes" || c.token_status === "expiring" ? "text-warning" : c.token_status === "invalid" ? "text-destructive" : "text-muted-foreground";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface/60 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3 mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold truncate",
									children: c.label
								}),
								!c.is_active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase rounded bg-muted px-1.5 py-0.5",
									children: "Disabled"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `text-xs inline-flex items-center gap-1 ${statusColor}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5" }), c.token_status ?? "Not checked"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-0.5",
							children: [
								c.fb_business_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["BM: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "text-foreground",
									children: c.fb_business_id
								})] }),
								c.fb_app_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["App: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "text-foreground",
									children: c.fb_app_id
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Token: ", c.has_token ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-success",
									children: "✓"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-destructive",
									children: "missing"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Ad accounts: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground font-medium",
									children: c.account_count
								})] }),
								c.token_user_name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["System user: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: c.token_user_name
								})] })
							]
						}),
						c.token_error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 text-xs text-destructive flex items-start gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3.5 mt-0.5 shrink-0" }),
								" ",
								c.token_error
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: onEdit,
						className: "rounded-md border border-border bg-surface px-2 py-1 text-xs hover:bg-surface-elevated inline-flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3" }), " Edit"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							if (confirm(`Remove "${c.label}"? Ad accounts will be unlinked but kept.`)) run("remove", () => removeFn({ data: { id: c.id } }), () => "Connection removed");
						},
						disabled: busy === "remove",
						className: "rounded-md border border-destructive/30 bg-destructive/10 px-2 py-1 text-xs text-destructive hover:bg-destructive/20 inline-flex items-center gap-1 disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" }), " Remove"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => run("health", () => healthFn({ data: { id: c.id } }), (r) => `Status: ${r.status}${r.missing?.length ? " · missing " + r.missing.join(", ") : ""}`),
						disabled: !!busy || !c.has_token,
						className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs hover:bg-surface-elevated disabled:opacity-50",
						children: [busy === "health" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3" }), " Check health"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => run("test", () => testFn({ data: { id: c.id } }), (r) => r.ok ? `Connected as ${r.user?.name} · ${r.accounts?.length ?? 0} ad accounts` : r.error ?? "Failed"),
						disabled: !!busy || !c.has_token,
						className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs hover:bg-surface-elevated disabled:opacity-50",
						children: [busy === "test" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlaskConical, { className: "size-3" }), " Test"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => run("import", () => importFn({ data: { id: c.id } }), (r) => `Imported ${r.imported} ad accounts`),
						disabled: !!busy || !c.has_token,
						className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs hover:bg-surface-elevated disabled:opacity-50",
						children: [busy === "import" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudDownload, { className: "size-3" }), " Import accounts"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => run("sync", () => syncFn({ data: { id: c.id } }), (r) => `Synced ${r.count} accounts`),
						disabled: !!busy || c.account_count === 0,
						className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs hover:bg-surface-elevated disabled:opacity-50",
						children: [busy === "sync" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "size-3" }), " Sync now"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: async () => {
							const next = !statusOpen;
							setStatusOpen(next);
							if (next && !accounts) {
								setBusy("status");
								try {
									setAccounts(await statusFn({ data: { id: c.id } }));
								} catch (e) {
									toast.error(e?.message ?? "Failed");
								} finally {
									setBusy(null);
								}
							}
						},
						disabled: c.account_count === 0,
						className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs hover:bg-surface-elevated disabled:opacity-50",
						children: [busy === "status" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-3" }), " Sync status"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: async () => {
							setMatchOpen(true);
							setBusy("match");
							try {
								setMatchResult(await matchFn({ data: {
									id: c.id,
									date_preset: matchPreset
								} }));
							} catch (e) {
								toast.error(e?.message ?? "Failed");
								setMatchOpen(false);
							} finally {
								setBusy(null);
							}
						},
						disabled: !!busy || !c.has_token || c.account_count === 0,
						className: "inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-xs text-primary hover:bg-primary/20 disabled:opacity-50",
						children: [busy === "match" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitCompare, { className: "size-3" }), " Match check"]
					})
				]
			}),
			statusOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 rounded-md border border-border bg-surface/40 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs font-semibold mb-2 flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5" }), " Real-time sync status"]
				}), !accounts ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: "Loading…"
				}) : accounts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: "No ad accounts linked yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-1.5",
					children: accounts.map((a) => {
						const ok = a.last_sync_status === "ok" || a.last_sync_status === "success";
						const stale = a.last_sync_at ? (Date.now() - new Date(a.last_sync_at).getTime()) / 6e4 : null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 text-xs border-b border-border/40 last:border-0 pb-1.5 last:pb-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate font-medium",
									children: a.account_name ?? a.fb_account_id
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground text-[10px]",
									children: a.fb_account_id
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: ok ? "text-success" : a.last_sync_status ? "text-destructive" : "text-muted-foreground",
									children: [ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 inline" }) : a.last_sync_status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3.5 inline" }) : "—", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-1",
										children: a.last_sync_status ?? "never"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground text-[10px]",
									children: a.last_sync_at ? `${stale.toFixed(0)}m ago` : "—"
								})]
							})]
						}, a.id);
					})
				})]
			}),
			matchOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 rounded-md border border-primary/30 bg-primary/5 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs font-semibold flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitCompare, { className: "size-3.5" }), " Match check — Ads Manager ↔ Local DB"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: matchPreset,
							onChange: async (e) => {
								const p = e.target.value;
								setMatchPreset(p);
								setBusy("match");
								try {
									setMatchResult(await matchFn({ data: {
										id: c.id,
										date_preset: p
									} }));
								} catch (err) {
									toast.error(err?.message ?? "Failed");
								} finally {
									setBusy(null);
								}
							},
							className: "text-[10px] rounded bg-input border border-border px-1.5 py-0.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "today",
									children: "Today"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "yesterday",
									children: "Yesterday"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "last_7d",
									children: "Last 7d"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "last_30d",
									children: "Last 30d"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "this_month",
									children: "This month"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "last_month",
									children: "Last month"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "maximum",
									children: "Maximum"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setMatchOpen(false);
								setMatchResult(null);
							},
							className: "rounded p-0.5 hover:bg-surface",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
						})]
					})]
				}), busy === "match" || !matchResult ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: "Comparing…"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-12 text-[10px] uppercase text-muted-foreground border-b border-border pb-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-span-5",
									children: "Account"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-span-2 text-right",
									children: "Live spend"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-span-2 text-right",
									children: "DB spend"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-span-2 text-right",
									children: "Δ"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-span-1 text-right",
									children: "OK"
								})
							]
						}),
						matchResult.results.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-12 text-xs py-1 border-b border-border/30 last:border-0 items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-span-5 truncate",
									children: r.account_name ?? r.fb_account_id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 text-right font-mono",
									children: [
										r.live_spend.toFixed(2),
										" ",
										r.currency ?? ""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-span-2 text-right font-mono",
									children: r.db_spend.toFixed(2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `col-span-2 text-right font-mono ${Math.abs(r.diff_pct) < 1 ? "text-success" : "text-warning"}`,
									children: [
										r.diff >= 0 ? "+" : "",
										r.diff.toFixed(2),
										" (",
										r.diff_pct.toFixed(1),
										"%)"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-span-1 text-right",
									children: r.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										title: r.error,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3.5 text-destructive inline" })
									}) : r.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-success inline" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3.5 text-warning inline" })
								})
							]
						}, r.ad_account_id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted-foreground mt-2",
							children: "Note: DB spend uses cumulative campaign spend (maximum window). \"Maximum\" preset is the most accurate 1:1 check; other presets show approximation until per-day storage is enabled."
						})
					]
				})]
			})
		]
	});
}
function ConnectionForm({ initial, onClose, onSaved }) {
	const saveFn = useServerFn(upsertConnection);
	const [label, setLabel] = (0, import_react.useState)(initial?.label ?? "");
	const [appId, setAppId] = (0, import_react.useState)(initial?.fb_app_id ?? "");
	const [appSecret, setAppSecret] = (0, import_react.useState)("");
	const [businessId, setBusinessId] = (0, import_react.useState)(initial?.fb_business_id ?? "");
	const [token, setToken] = (0, import_react.useState)("");
	const [active, setActive] = (0, import_react.useState)(initial?.is_active ?? true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const onSave = async () => {
		if (!label.trim()) {
			toast.error("Label is required");
			return;
		}
		setSaving(true);
		try {
			await saveFn({ data: {
				id: initial?.id,
				label: label.trim(),
				fb_app_id: appId.trim() || null,
				fb_business_id: businessId.trim() || null,
				fb_app_secret: appSecret || null,
				fb_system_user_token: token || null,
				is_active: active
			} });
			toast.success(initial ? "Connection updated" : "Connection added");
			onSaved();
		} catch (e) {
			toast.error(e?.message ?? "Save failed");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold text-sm",
					children: initial ? `Edit "${initial.label}"` : "Add Business Manager"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "rounded-md p-1 hover:bg-surface",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid sm:grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "Label (your nickname for this BM)",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: label,
							onChange: (e) => setLabel(e.target.value),
							placeholder: "e.g. Main BM, Client X BM",
							className: "w-full rounded-lg bg-input border border-border px-3 py-2 text-sm"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "Business Manager ID",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: businessId,
							onChange: (e) => setBusinessId(e.target.value),
							placeholder: "123456789",
							className: "w-full rounded-lg bg-input border border-border px-3 py-2 text-sm"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "App ID",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: appId,
							onChange: (e) => setAppId(e.target.value),
							placeholder: "123456789",
							className: "w-full rounded-lg bg-input border border-border px-3 py-2 text-sm"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: `App Secret ${initial?.has_app_secret ? "(saved — leave blank to keep)" : ""}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							value: appSecret,
							onChange: (e) => setAppSecret(e.target.value),
							placeholder: initial?.has_app_secret ? "••••••" : "",
							className: "w-full rounded-lg bg-input border border-border px-3 py-2 text-sm font-mono"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: `System User Access Token ${initial?.has_token ? "(saved — leave blank to keep)" : ""}`,
						className: "sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							value: token,
							onChange: (e) => setToken(e.target.value),
							placeholder: initial?.has_token ? "•••••••• (leave blank to keep current)" : "EAA…",
							className: "w-full rounded-lg bg-input border border-border px-3 py-2 text-sm font-mono"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "inline-flex items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: active,
						onChange: (e) => setActive(e.target.checked),
						className: "size-4 accent-primary"
					}), "Active (include in auto-sync)"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onSave,
					disabled: saving,
					className: "inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50",
					children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" }), " Save"]
				})]
			})
		]
	});
}
function Field$1({ label, children, required, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "text-xs font-medium block mb-1",
			children: [
				label,
				" ",
				required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-destructive",
					children: "*"
				})
			]
		}), children]
	});
}
function LegacySettingsSection() {
	const qc = useQueryClient();
	const getFn = useServerFn(getSettingsPublic);
	const saveFn = useServerFn(saveSettings);
	const testFn = useServerFn(testFbToken);
	const importFn = useServerFn(importVisibleAdAccounts);
	const healthFn = useServerFn(checkTokenHealthNow);
	const detectFn = useServerFn(detectBusinessesFromToken);
	const { data: s } = useQuery({
		queryKey: ["settings"],
		queryFn: () => getFn({ data: void 0 })
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [token, setToken] = (0, import_react.useState)("");
	const [appId, setAppId] = (0, import_react.useState)("");
	const [appSecret, setAppSecret] = (0, import_react.useState)("");
	const [businessId, setBusinessId] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [businesses, setBusinesses] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (s) {
			setAppId(s.fb_app_id ?? "");
			setBusinessId(s.fb_business_id ?? "");
		}
	}, [s]);
	const run = async (key, fn, success) => {
		setBusy(key);
		try {
			const r = await fn();
			toast.success(success(r));
			qc.invalidateQueries({ queryKey: ["settings"] });
			return r;
		} catch (e) {
			toast.error(e?.message ?? "Failed");
		} finally {
			setBusy(null);
		}
	};
	const onSave = () => run("save", () => saveFn({ data: {
		token: token || void 0,
		fb_app_id: appId,
		fb_business_id: businessId,
		fb_app_secret: appSecret || void 0
	} }), () => "Legacy settings saved");
	const onDetect = async () => {
		const r = await run("detect", () => detectFn({ data: void 0 }), (r) => r?.ok ? `Found ${r.businesses?.length ?? 0} BM(s)` : r?.error ?? "Failed");
		if (r?.businesses) setBusinesses(r.businesses);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-card p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setOpen(!open),
			className: "flex items-center justify-between w-full text-left",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "size-5 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold text-lg",
						children: "Legacy single Business Manager"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] uppercase rounded bg-muted px-1.5 py-0.5 text-muted-foreground",
						children: "Legacy"
					}),
					s?.has_token && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-success",
						children: "● configured"
					})
				]
			}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "পুরানো single-BM setup এখনো কাজ করছে। নতুন BM যোগ করতে চাইলে উপরের \"Business Managers\" section ব্যবহার করুন — multi-BM সবসময় সঠিক token দিয়ে sync করবে।"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid sm:grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "App ID",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: appId,
								onChange: (e) => setAppId(e.target.value),
								className: "w-full rounded-lg bg-input border border-border px-3 py-2 text-sm"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
							label: "Business Manager ID",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: businessId,
									onChange: (e) => setBusinessId(e.target.value),
									className: "flex-1 rounded-lg bg-input border border-border px-3 py-2 text-sm"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: onDetect,
									disabled: !!busy,
									className: "rounded-md border border-border bg-surface px-2 text-xs hover:bg-surface-elevated disabled:opacity-50 inline-flex items-center gap-1",
									children: [busy === "detect" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-3" }), " Detect"]
								})]
							}), businesses.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1.5 flex flex-wrap gap-1",
								children: businesses.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setBusinessId(b.id),
									className: "text-[10px] rounded border border-border px-1.5 py-0.5 hover:bg-surface-elevated",
									children: [
										b.name,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", {
											className: "opacity-60",
											children: [
												"(",
												b.id,
												")"
											]
										})
									]
								}, b.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: `App Secret ${s?.has_app_secret ? "(saved — leave blank to keep)" : ""}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								value: appSecret,
								onChange: (e) => setAppSecret(e.target.value),
								placeholder: s?.has_app_secret ? "••••••" : "",
								className: "w-full rounded-lg bg-input border border-border px-3 py-2 text-sm font-mono"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: `System User Token ${s?.has_token ? "(saved — leave blank to keep)" : ""}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								value: token,
								onChange: (e) => setToken(e.target.value),
								placeholder: s?.has_token ? "•••••••• (leave blank to keep)" : "EAA…",
								className: "w-full rounded-lg bg-input border border-border px-3 py-2 text-sm font-mono"
							})
						})
					]
				}),
				s?.token_status && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs flex items-center gap-2 text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5" }),
						"Token status: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: s.token_status === "ok" ? "text-success" : "text-warning",
							children: s.token_status
						}),
						s.token_user_name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["· user: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground",
							children: s.token_user_name
						})] }),
						s.token_checked_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["· checked: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground",
							children: new Date(s.token_checked_at).toLocaleString()
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2 pt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: onSave,
							disabled: !!busy,
							className: "inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50",
							children: [busy === "save" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), " Save"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => run("test", () => testFn({ data: void 0 }), (r) => r?.ok ? `Connected · ${r.accounts?.length ?? 0} ad accounts` : r?.error ?? "Failed"),
							disabled: !!busy,
							className: "inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:bg-surface-elevated disabled:opacity-50",
							children: [busy === "test" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlaskConical, { className: "size-4" }), " Test"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => run("health", () => healthFn({ data: void 0 }), (r) => `Status: ${r?.status}`),
							disabled: !!busy,
							className: "inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:bg-surface-elevated disabled:opacity-50",
							children: [busy === "health" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }), " Check health"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => run("import", () => importFn({ data: void 0 }), (r) => `Imported ${r?.imported ?? 0} accounts`),
							disabled: !!busy,
							className: "inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:bg-surface-elevated disabled:opacity-50",
							children: [busy === "import" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudDownload, { className: "size-4" }), " Import & sync"]
						})
					]
				})
			]
		})]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "text-xs font-medium block mb-1",
		children: label
	}), children] });
}
var CHECKLIST_STEPS = [
	"Business Settings → Users → System Users → আপনার system user select করুন।",
	"Add Assets → Ad Accounts → যেই ad account গুলো track করতে চান সেগুলো tick দিন।",
	"প্রতিটা ad account-এ Full Control toggle on করে Save Changes দিন।",
	"এর পর উপরের Business Manager card-এ \"Test\" → \"Import accounts\" → \"Sync now\" চাপুন।"
];
function SettingsPage() {
	const qc = useQueryClient();
	const getFn = useServerFn(getSettingsPublic);
	const saveFn = useServerFn(saveSettings);
	const { data: settings } = useQuery({
		queryKey: ["settings"],
		queryFn: () => getFn({ data: void 0 })
	});
	const [interval, setInterval] = (0, import_react.useState)(5);
	const [autoSync, setAutoSync] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (settings) {
			setInterval(settings.sync_interval_minutes ?? 5);
			setAutoSync(settings.auto_sync_enabled ?? true);
		}
	}, [settings]);
	const onSaveSync = async () => {
		setSaving(true);
		try {
			await saveFn({ data: {
				sync_interval_minutes: interval,
				auto_sync_enabled: autoSync
			} });
			toast.success("Auto-sync settings saved");
			qc.invalidateQueries({ queryKey: ["settings"] });
		} catch (e) {
			toast.error(e?.message ?? "Save failed");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-4xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold",
				children: "Facebook Marketing API"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground text-sm",
				children: "একাধিক Business Manager connect করুন। প্রতিটা ad account সবসময় তার নিজের BM-এর token দিয়েই sync হবে — Ads Manager-এর সাথে data 100% match থাকবে।"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessManagersSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegacySettingsSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold text-lg",
						children: "System User Token কোথা থেকে পাবেন"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "space-y-1.5 list-decimal list-inside text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							className: "text-primary underline inline-flex items-center gap-1",
							href: "https://business.facebook.com/settings/system-users",
							target: "_blank",
							rel: "noreferrer",
							children: ["Meta Business Settings → System Users ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" })]
						}), " open করুন।"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"একটা System User add করুন ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Admin" }),
							" access সহ। ad account গুলো assign করুন।"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Generate New Token" }),
							" → আপনার app select করুন → scopes: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "bg-input px-1.5 py-0.5 rounded",
								children: "ads_read"
							}),
							", ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "bg-input px-1.5 py-0.5 rounded",
								children: "ads_management"
							}),
							", ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "bg-input px-1.5 py-0.5 rounded",
								children: "business_management"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"Token expiry ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Never" }),
							" দিন, copy করে উপরের \"Add Business Manager\" form-এ paste করুন।"
						] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold text-lg",
						children: "Ad account assign করার পর checklist"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: CHECKLIST_STEPS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-3 rounded-lg border border-border/50 bg-surface/60 px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-semibold text-primary",
							children: [i + 1, "."]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s })]
					}, i))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold text-lg mb-3",
						children: "Auto-sync"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid sm:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium",
								children: "Sync frequency"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1.5 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: [
										5,
										15,
										30,
										60,
										180,
										360,
										720,
										1440
									].includes(interval) ? String(interval) : "custom",
									onChange: (e) => {
										if (e.target.value !== "custom") setInterval(Number(e.target.value));
									},
									className: "flex-1 rounded-lg bg-input border border-border px-3 py-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "5",
											children: "Every 5 minutes"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "15",
											children: "Every 15 minutes"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "30",
											children: "Every 30 minutes"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "60",
											children: "Hourly"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "180",
											children: "Every 3 hours"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "360",
											children: "Every 6 hours"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "720",
											children: "Every 12 hours"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "1440",
											children: "Daily"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "custom",
											children: "Custom (minutes)…"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 1,
									max: 1440,
									value: interval,
									onChange: (e) => setInterval(Number(e.target.value)),
									className: "w-24 rounded-lg bg-input border border-border px-3 py-2 text-sm"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: "Facebook updates insights every 15–60 min. Custom range: 1–1440 minutes."
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "auto",
								type: "checkbox",
								checked: autoSync,
								onChange: (e) => setAutoSync(e.target.checked),
								className: "size-4 accent-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "auto",
								className: "text-sm",
								children: "Enable scheduled auto-sync"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: onSaveSync,
						disabled: saving,
						className: "mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-50",
						children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), " Save auto-sync"]
					})
				]
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
