import { i as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient } from "../_libs/react+tanstack__react-query.mjs";
import { d as Link, m as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ct as ArrowLeft, E as RefreshCw, H as LoaderCircle, S as Search, V as Lock, _t as Check, gt as ChevronDown, i as WifiOff, mt as CircleAlert, r as Wifi, ut as Clock, y as ShieldCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { c as listAvailableAdAccounts, g as syncAllAccountsNow, l as listAvailableAdSets, r as createClient } from "./admin.functions-DJtfy5At.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clients_.new-BlyCuMq8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AddPartnerPage() {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const createFn = useServerFn(createClient);
	const listAccountsFn = useServerFn(listAvailableAdAccounts);
	const listAdSetsFn = useServerFn(listAvailableAdSets);
	const syncNowFn = useServerFn(syncAllAccountsNow);
	const [name, setName] = (0, import_react.useState)("");
	const [company, setCompany] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [website, setWebsite] = (0, import_react.useState)("");
	const [address, setAddress] = (0, import_react.useState)("");
	const [depositAmount, setDepositAmount] = (0, import_react.useState)("");
	const [showConverter, setShowConverter] = (0, import_react.useState)(false);
	const [bdtAmount, setBdtAmount] = (0, import_react.useState)("");
	const [bdtRate, setBdtRate] = (0, import_react.useState)("");
	const [commissionEnabled, setCommissionEnabled] = (0, import_react.useState)(false);
	const [commissionPct, setCommissionPct] = (0, import_react.useState)("");
	const [commissionNotes, setCommissionNotes] = (0, import_react.useState)("");
	const [accounts, setAccounts] = (0, import_react.useState)([]);
	const [adsets, setAdsets] = (0, import_react.useState)([]);
	const [adsetMeta, setAdsetMeta] = (0, import_react.useState)({
		totalAccounts: 0,
		truncatedAccounts: 0,
		perAccountErrors: []
	});
	const [loadingAccounts, setLoadingAccounts] = (0, import_react.useState)(true);
	const [accountLoadError, setAccountLoadError] = (0, import_react.useState)(null);
	const [liveError, setLiveError] = (0, import_react.useState)(null);
	const [lastLoadedAt, setLastLoadedAt] = (0, import_react.useState)(null);
	const [syncing, setSyncing] = (0, import_react.useState)(false);
	const [selectedAdsets, setSelectedAdsets] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [accountSearch, setAccountSearch] = (0, import_react.useState)("");
	const [accountStatus, setAccountStatus] = (0, import_react.useState)("all");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const loadAccounts = async () => {
		setLoadingAccounts(true);
		setAccountLoadError(null);
		try {
			const [accountsRes, adsetsRes] = await Promise.all([listAccountsFn({ data: void 0 }), listAdSetsFn({ data: void 0 })]);
			const accList = accountsRes ?? [];
			setAccounts(accList);
			setAdsets(adsetsRes?.adsets ?? []);
			setAdsetMeta({
				totalAccounts: adsetsRes?.totalAccounts ?? 0,
				truncatedAccounts: adsetsRes?.truncatedAccounts ?? 0,
				perAccountErrors: adsetsRes?.perAccountErrors ?? []
			});
			setLiveError(adsetsRes?.liveError ?? accList[0]?.liveError ?? null);
			setLastLoadedAt(/* @__PURE__ */ new Date());
		} catch (e) {
			setAccountLoadError(e?.message ?? "Could not load Meta ad sets");
		} finally {
			setLoadingAccounts(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadAccounts();
	}, []);
	const runSyncNow = async () => {
		setSyncing(true);
		const tId = toast.loading("Refreshing campaigns from Meta…");
		try {
			const res = await syncNowFn({ data: void 0 });
			toast.dismiss(tId);
			if (res?.ok === false) toast.error(res.error ?? "Sync failed");
			else toast.success(`Synced ${res?.synced ?? 0} accounts`);
			await loadAccounts();
		} catch (e) {
			toast.dismiss(tId);
			toast.error(e?.message ?? "Sync failed");
		} finally {
			setSyncing(false);
		}
	};
	const applyConverter = () => {
		const amt = Number(bdtAmount);
		const rate = Number(bdtRate);
		if (!amt || !rate) {
			toast.error("Enter BDT amount and rate");
			return;
		}
		const usd = amt / rate;
		setDepositAmount(usd.toFixed(2));
		toast.success(`Converted ৳${amt.toLocaleString()} → $${usd.toFixed(2)}`);
	};
	const toggleAdset = (id) => {
		setSelectedAdsets((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};
	const filteredAdsets = adsets.filter((a) => {
		if (accountStatus === "active" && a.status !== "ACTIVE") return false;
		if (accountStatus !== "all" && accountStatus !== "active" && a.status !== accountStatus) return false;
		if (accountSearch) {
			const q = accountSearch.toLowerCase();
			if (!`${a.name} ${a.campaign_name} ${a.account_name} ${a.id} ${a.campaign_id}`.toLowerCase().includes(q)) return false;
		}
		return true;
	});
	const groupedByAccount = (() => {
		const groups = /* @__PURE__ */ new Map();
		for (const a of filteredAdsets) {
			const key = a.account_id;
			const g = groups.get(key) ?? {
				account_id: a.account_id,
				account_name: a.account_name,
				currency: a.currency,
				items: []
			};
			g.items.push(a);
			groups.set(key, g);
		}
		return Array.from(groups.values()).sort((x, y) => y.items.length - x.items.length || x.account_name.localeCompare(y.account_name));
	})();
	const onSave = async () => {
		if (!name.trim()) {
			toast.error("Client name is required");
			return;
		}
		setSaving(true);
		try {
			await createFn({ data: {
				name: name.trim(),
				company: company || void 0,
				contact_email: email || void 0,
				contact_phone: phone || void 0,
				website: website || void 0,
				address: address || void 0,
				deposit_amount: Number(depositAmount) || 0,
				deposit_currency: bdtRate && Number(bdtRate) > 0 ? "BDT" : "USD",
				bdt_rate: bdtRate ? Number(bdtRate) : null,
				commission_enabled: commissionEnabled,
				commission_percent: Number(commissionPct) || 0,
				commission_notes: commissionNotes || void 0,
				ad_account_ids: Array.from(new Set(adsets.filter((a) => selectedAdsets.has(a.id)).map((a) => a.account_id))),
				campaign_ids: Array.from(new Set(adsets.filter((a) => selectedAdsets.has(a.id) && a.internal_campaign_id).map((a) => a.internal_campaign_id)))
			} });
			toast.success("Partner saved");
			qc.invalidateQueries({ queryKey: ["clients"] });
			navigate({ to: "/clients" });
		} catch (e) {
			toast.error(e?.message ?? "Failed to save");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl sm:text-3xl font-bold",
					children: "Add New Partner"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground text-sm mt-1",
					children: "Create a new client profile and assign campaign access"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/clients",
					className: "inline-flex items-center gap-2 rounded-lg border border-border bg-surface hover:bg-surface-elevated px-4 py-2 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " Back to Clients"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid lg:grid-cols-2 gap-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "glass-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-7 rounded-lg bg-emerald-500/15 text-emerald-400 grid place-items-center text-xs font-bold",
								children: "P"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-semibold",
								children: "Profile Details"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Client Name *",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: name,
										onChange: (e) => setName(e.target.value),
										className: "input",
										placeholder: "e.g. Jamie Doe"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Company Name",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: company,
										onChange: (e) => setCompany(e.target.value),
										className: "input",
										placeholder: "Acme Enterprises"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Email Address",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "email",
										value: email,
										onChange: (e) => setEmail(e.target.value),
										className: "input",
										placeholder: "client@example.com"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Phone Number",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: phone,
										onChange: (e) => setPhone(e.target.value),
										className: "input",
										placeholder: "+1 (555) 000-0000"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Website",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: website,
										onChange: (e) => setWebsite(e.target.value),
										className: "input",
										placeholder: "example.com"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Address",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: address,
										onChange: (e) => setAddress(e.target.value),
										className: "input",
										placeholder: "Street, City, Country"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Deposit Amount ($ USD) *",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										step: "0.01",
										value: depositAmount,
										onChange: (e) => setDepositAmount(e.target.value),
										className: "input",
										placeholder: "e.g. 1000"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border/60 bg-surface/40 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-sm font-medium cursor-pointer",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: showConverter,
												onChange: (e) => setShowConverter(e.target.checked),
												className: "rounded accent-emerald-500"
											}),
											"BDT → USD CONVERTER ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] text-muted-foreground font-normal",
												children: "Optional helper"
											})
										]
									}), showConverter && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-[1fr_1fr_auto] gap-2 mt-3 items-end",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] uppercase text-muted-foreground mb-1",
												children: "Amount (BDT)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												value: bdtAmount,
												onChange: (e) => setBdtAmount(e.target.value),
												className: "input",
												placeholder: "e.g. 50000"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] uppercase text-muted-foreground mb-1",
												children: "Rate"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												step: "0.01",
												value: bdtRate,
												onChange: (e) => setBdtRate(e.target.value),
												className: "input",
												placeholder: "120"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: applyConverter,
												className: "rounded-lg bg-emerald-500 text-white px-4 py-2 text-sm font-semibold",
												children: "Apply →"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground mt-2",
										children: "Enter BDT amount & rate to auto-fill USD deposit."
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border/60 bg-surface/40 p-3 space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-sm font-medium cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: commissionEnabled,
											onChange: (e) => setCommissionEnabled(e.target.checked),
											className: "rounded accent-emerald-500"
										}), "Enable Commission"]
									}), commissionEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Commission (%) — Custom — Agency markup hidden from client",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												step: "0.01",
												min: "0",
												max: "100",
												value: commissionPct,
												onChange: (e) => setCommissionPct(e.target.value),
												className: "input",
												placeholder: "Enter any % e.g. 25, 30, 42.5"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground -mt-2",
											children: "The agency reduces Meta ad budget by this %, but the client portal still shows the original daily/total budget the client paid for."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: commissionNotes,
											onChange: (e) => setCommissionNotes(e.target.value),
											placeholder: "Internal commission notes (not shown to client)",
											className: "input min-h-[80px] resize-y"
										})
									] })]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-2xl p-5 border border-purple-500/30 bg-gradient-to-br from-purple-600/20 via-indigo-600/15 to-blue-600/20 relative overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-7 rounded-lg bg-white/10 grid place-items-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3.5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold",
									children: "Secure Access"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "The client will receive a unique secure access link. They can view their campaign dashboard instantly without a password."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5" }), " Protected with encryption"]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "glass-card p-5 sticky top-20",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-7 rounded-lg bg-blue-500/15 text-blue-400 grid place-items-center text-xs font-bold",
									children: "C"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-semibold",
									children: "Campaign Assignment"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground font-semibold",
								children: "Step 2 of 2"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 mb-3 rounded-lg border border-border/60 bg-surface/40 px-3 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 min-w-0",
								children: [liveError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "size-3.5 text-amber-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber-300 truncate",
									children: "Live Meta unreachable — showing cached"
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "size-3.5 text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-emerald-300",
									children: "Meta connected"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground flex items-center gap-1 ml-2 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }), lastLoadedAt ? `Updated ${lastLoadedAt.toLocaleTimeString()}` : "—"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: runSyncNow,
								disabled: syncing || loadingAccounts,
								className: "inline-flex items-center gap-1.5 rounded-md bg-primary/15 hover:bg-primary/25 text-primary px-2.5 py-1 font-semibold disabled:opacity-60",
								title: "Pull latest campaigns from Meta now",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `size-3.5 ${syncing ? "animate-spin" : ""}` }), syncing ? "Syncing…" : "Sync now"]
							})]
						}),
						liveError && accounts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-[11px] text-amber-200",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-semibold mb-0.5 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-3.5" }), " Live Meta call failed"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-amber-200/80",
									children: liveError
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-amber-200/70 mt-1",
									children: [
										"Showing cached campaigns. Click ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Sync now" }),
										" or check the token in ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/facebook-marketing-api",
											className: "underline",
											children: "Meta connection settings"
										}),
										"."
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: accountSearch,
									onChange: (e) => setAccountSearch(e.target.value),
									placeholder: "Search by ad set, campaign or account name…",
									className: "w-full rounded-lg bg-surface border border-border pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: accountStatus,
									onChange: (e) => setAccountStatus(e.target.value),
									className: "appearance-none rounded-lg bg-surface border border-border pl-3 pr-9 py-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											children: "All Statuses"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "ACTIVE",
											children: "Active"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "PAUSED",
											children: "Paused"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "ADSET_PAUSED",
											children: "Ad set paused"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "CAMPAIGN_PAUSED",
											children: "Campaign paused"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "ARCHIVED",
											children: "Archived"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" })]
							})]
						}),
						loadingAccounts ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-12 grid place-items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-primary" })
						}) : accountLoadError && accounts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-12 text-center text-sm space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-7 mx-auto text-amber-400" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-foreground",
									children: "Could not load Meta accounts"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: accountLoadError
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border/60 bg-surface/40 p-3 text-left text-xs text-muted-foreground space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold text-foreground",
										children: "How to fix:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
										className: "list-decimal ml-4 space-y-0.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
												"Open ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: "/facebook-marketing-api",
													className: "text-primary hover:underline",
													children: "Meta connection settings"
												}),
												"."
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Paste a valid System User token and Business ID." }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Assign Ad Accounts to the System User (Full control)." }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
												"Come back and click ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Sync now" }),
												"."
											] })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: runSyncNow,
									disabled: syncing,
									className: "inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold disabled:opacity-60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `size-3.5 ${syncing ? "animate-spin" : ""}` }), " Retry / Sync now"]
								})
							]
						}) : groupedByAccount.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-12 text-center text-sm text-muted-foreground space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "No matching ad sets found." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs",
								children: [
									"Try a different search, or click ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Sync now" }),
									" above to refresh from Meta."
								]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 max-h-[560px] overflow-y-auto pr-1",
							children: [
								groupedByAccount.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border/60 bg-surface/40 overflow-hidden",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2 px-3 py-2 border-b border-border/40 bg-surface/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-semibold truncate",
												children: group.account_name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] text-muted-foreground truncate",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: group.account_id }),
													group.currency ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · ", group.currency] }) : null,
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
														" · ",
														group.items.length,
														" ad set",
														group.items.length !== 1 ? "s" : ""
													] })
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												const allIds = group.items.map((i) => i.id);
												const allSelected = allIds.every((id) => selectedAdsets.has(id));
												setSelectedAdsets((prev) => {
													const next = new Set(prev);
													if (allSelected) allIds.forEach((id) => next.delete(id));
													else allIds.forEach((id) => next.add(id));
													return next;
												});
											},
											className: "text-[11px] rounded-md bg-primary/15 hover:bg-primary/25 text-primary px-2 py-1 font-semibold shrink-0",
											children: group.items.every((i) => selectedAdsets.has(i.id)) ? "Clear all" : "Select all"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid sm:grid-cols-2 gap-2 p-3",
										children: group.items.map((a) => {
											const checked = selectedAdsets.has(a.id);
											const status = (a.status || "").toUpperCase();
											const statusColor = status === "ACTIVE" ? "text-emerald-300 bg-emerald-500/15" : status === "PAUSED" || status === "CAMPAIGN_PAUSED" || status === "ADSET_PAUSED" ? "text-amber-300 bg-amber-500/15" : status === "ARCHIVED" ? "text-muted-foreground bg-muted/30" : status === "COMPLETED" ? "text-blue-300 bg-blue-500/15" : "text-foreground/70 bg-surface";
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => toggleAdset(a.id),
												className: `text-left rounded-lg border p-2 transition flex items-start gap-2 ${checked ? "border-emerald-500/60 bg-emerald-500/10" : "border-border bg-surface hover:bg-surface-elevated"}`,
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: `mt-0.5 size-4 rounded border grid place-items-center shrink-0 ${checked ? "bg-emerald-500 border-emerald-500" : "border-border"}`,
														children: checked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3 text-white" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "size-10 rounded-md overflow-hidden bg-surface-elevated shrink-0 grid place-items-center",
														children: a.thumbnail_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
															src: a.thumbnail_url,
															alt: "",
															loading: "lazy",
															className: "size-full object-cover"
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] text-muted-foreground",
															children: "No img"
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "min-w-0 flex-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-[13px] font-medium leading-tight truncate",
																title: a.name,
																children: a.name
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-[10px] text-muted-foreground truncate",
																title: a.campaign_name,
																children: a.campaign_name
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "mt-1 flex items-center gap-1",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: `text-[9px] uppercase tracking-wide rounded px-1.5 py-0.5 font-semibold ${statusColor}`,
																	children: status.replace(/_/g, " ")
																})
															})
														]
													})
												]
											}, a.id);
										})
									})]
								}, group.account_id)),
								adsetMeta.truncatedAccounts > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted-foreground text-center py-2",
									children: [
										"Showing first ",
										adsetMeta.totalAccounts - adsetMeta.truncatedAccounts,
										" of ",
										adsetMeta.totalAccounts,
										" ad accounts. Narrow with search to find ad sets in other accounts."
									]
								}),
								adsetMeta.perAccountErrors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-[11px] text-amber-200",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-semibold mb-1",
										children: [
											"Some accounts failed to load (",
											adsetMeta.perAccountErrors.length,
											"):"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-0.5 max-h-24 overflow-y-auto",
										children: adsetMeta.perAccountErrors.slice(0, 6).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "truncate",
											children: [
												"• ",
												e.account_name,
												": ",
												e.error
											]
										}, e.account_id))
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 pt-3 border-t border-border/40 text-xs text-muted-foreground flex items-center justify-between gap-2 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selectedAdsets.size > 0 ? `${selectedAdsets.size} ad set${selectedAdsets.size !== 1 ? "s" : ""} selected` : `${adsets.length} ad set${adsets.length !== 1 ? "s" : ""} loaded from ${adsetMeta.totalAccounts} ad account${adsetMeta.totalAccounts !== 1 ? "s" : ""}.` }), selectedAdsets.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSelectedAdsets(/* @__PURE__ */ new Set()),
								className: "text-[11px] underline text-muted-foreground hover:text-foreground",
								children: "Clear selection"
							})]
						})
					]
				}) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky bottom-0 -mx-4 lg:-mx-6 mt-6 px-4 lg:px-6 py-3 bg-background/80 backdrop-blur-md border-t border-border/60 flex items-center justify-end gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/clients",
					className: "rounded-lg border border-border bg-surface hover:bg-surface-elevated px-5 py-2.5 text-sm font-semibold",
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onSave,
					disabled: saving,
					className: "inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2.5 text-sm font-semibold shadow-lg shadow-emerald-500/20 disabled:opacity-60",
					children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), "Save Partner"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.input{width:100%;border-radius:.5rem;background:var(--input);border:1px solid var(--border);padding:.6rem .8rem;font-size:.875rem;outline:none;color:var(--foreground)}.input:focus{box-shadow:0 0 0 2px color-mix(in oklab, var(--primary) 40%, transparent)}.input::placeholder{color:color-mix(in oklab, var(--muted-foreground) 80%, transparent)}` })
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5",
			children: label
		}), children]
	});
}
//#endregion
export { AddPartnerPage as component };
