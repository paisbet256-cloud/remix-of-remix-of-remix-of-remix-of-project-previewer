import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-rgEw8wDd.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { d as Link, m as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { O as Plus, S as Search, W as Link2, f as Trash2, gt as ChevronDown, j as Pencil, rt as Eye } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { i as deleteClient } from "./admin.functions-DJtfy5At.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clients-CnlIWzuq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function initials(name) {
	return (name || "?").trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}
function fmtUSD(n) {
	return `$${(Number(n) || 0).toLocaleString(void 0, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	})}`;
}
function fmtBDT(n) {
	return `৳${Math.round(Number(n) || 0).toLocaleString()}`;
}
function ClientsPage() {
	const qc = useQueryClient();
	const navigate = useNavigate();
	const deleteFn = useServerFn(deleteClient);
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const { data: clients } = useQuery({
		queryKey: ["clients"],
		queryFn: async () => {
			const { data } = await supabase.from("clients").select("*, ad_accounts(id,total_spend,currency)").order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	const filtered = (clients ?? []).filter((c) => {
		if (statusFilter !== "all" && c.status !== statusFilter) return false;
		if (!search) return true;
		const q = search.toLowerCase();
		return c.name?.toLowerCase().includes(q) || c.slug?.includes(q) || c.company?.toLowerCase().includes(q);
	});
	const onDelete = async (id, name) => {
		if (!confirm(`Delete partner "${name}"? This removes all their ad accounts and data.`)) return;
		await deleteFn({ data: { id } });
		toast.success("Deleted");
		qc.invalidateQueries({ queryKey: ["clients"] });
	};
	const copyPortal = async (client) => {
		const code = client.client_code || client.slug;
		const url = `${window.location.origin}/client/${code}`;
		await navigator.clipboard.writeText(url);
		toast.success("Portal link copied");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold",
					children: "Clients"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground text-sm mt-1",
					children: "Manage your agency's clients"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/clients/new",
					className: "inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2.5 text-sm font-semibold shadow-lg shadow-emerald-500/20 hover:opacity-95",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add new client"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card p-3 flex items-center gap-3 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 min-w-[240px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Search clients…",
						className: "w-full rounded-lg bg-surface border border-border pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: statusFilter,
						onChange: (e) => setStatusFilter(e.target.value),
						className: "appearance-none rounded-lg bg-surface border border-border pl-3 pr-9 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 min-w-[160px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "active",
								children: "Active"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "paused",
								children: "Paused"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "archived",
								children: "Archived"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-surface/60 text-[11px] uppercase tracking-wider text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-4 py-3 w-10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										className: "rounded"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-4 py-3",
									children: "Client"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-4 py-3",
									children: "Website"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-4 py-3",
									children: "Client ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-4 py-3",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right px-4 py-3",
									children: "Total Deposit"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right px-4 py-3",
									children: "Total Spent"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right px-4 py-3",
									children: "Remaining Balance"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right px-4 py-3",
									children: "Actions"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: 9,
							className: "px-4 py-16 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-14 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 grid place-items-center mb-3",
									children: "👥"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold",
									children: "No clients yet"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-1",
									children: "Add your first client to start tracking ads."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/clients/new",
									className: "mt-4 inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add new client"]
								})
							]
						}) }) : filtered.map((c) => {
							const totalSpentUsd = (c.ad_accounts ?? []).reduce((s, a) => s + (Number(a.total_spend) || 0), 0);
							const deposit = Number(c.deposit_amount) || 0;
							const remaining = deposit - totalSpentUsd;
							const acctCount = c.ad_accounts?.length ?? 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border/40 hover:bg-surface/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											className: "rounded"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "size-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 grid place-items-center font-bold text-white text-sm",
												children: initials(c.name)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-semibold truncate",
													children: c.name
												}), c.company && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-muted-foreground truncate",
													children: c.company
												})]
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-4 text-muted-foreground",
										children: c.website ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: c.website.startsWith("http") ? c.website : `https://${c.website}`,
											target: "_blank",
											rel: "noreferrer",
											className: "text-primary hover:underline",
											children: c.website.replace(/^https?:\/\//, "")
										}) : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono",
											children: c.client_code ?? c.slug?.slice(0, 8).toUpperCase()
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${c.status === "active" ? "bg-emerald-500/15 text-emerald-400" : c.status === "paused" ? "bg-amber-500/15 text-amber-400" : "bg-muted/40 text-muted-foreground"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-1.5 rounded-full ${c.status === "active" ? "bg-emerald-400" : c.status === "paused" ? "bg-amber-400" : "bg-muted-foreground"}` }), c.status.charAt(0).toUpperCase() + c.status.slice(1)]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-4 text-right",
										children: c.deposit_currency === "BDT" && c.bdt_rate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-bold",
											children: fmtBDT(deposit * Number(c.bdt_rate))
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground",
											children: fmtUSD(deposit)
										})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-bold",
											children: fmtUSD(deposit)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-4 text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-bold",
											children: fmtUSD(totalSpentUsd)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground",
											children: [
												acctCount,
												" ad acct",
												acctCount !== 1 ? "s" : ""
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-4 text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `font-bold ${remaining < 0 ? "text-destructive" : "text-emerald-400"}`,
											children: fmtUSD(remaining)
										}), c.deposit_currency === "BDT" && c.bdt_rate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground",
											children: fmtBDT(remaining * Number(c.bdt_rate))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-1.5 rounded-xl border border-border/60 bg-surface/40 p-1.5 w-fit ml-auto",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => navigate({
														to: "/clients/$slug/report",
														params: { slug: c.slug }
													}),
													title: "View general report",
													className: "inline-flex items-center justify-center size-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30 hover:opacity-90 transition",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => copyPortal(c),
													title: "Copy shareable portal link",
													className: "inline-flex items-center justify-center size-9 rounded-lg border border-border bg-surface text-muted-foreground hover:text-primary hover:border-primary/50 transition",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => navigate({
														to: "/clients/new",
														search: { edit: c.id }
													}),
													title: "Edit client",
													className: "inline-flex items-center justify-center size-9 rounded-lg border border-border bg-surface text-muted-foreground hover:text-amber-400 hover:border-amber-400/50 transition",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => onDelete(c.id, c.name),
													title: "Delete client",
													className: "inline-flex items-center justify-center size-9 rounded-lg border border-border bg-surface text-muted-foreground hover:text-destructive hover:border-destructive/50 hover:bg-destructive/10 transition",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
												})
											]
										})
									})
								]
							}, c.id);
						}) })]
					})
				}), filtered.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 py-3 text-xs text-muted-foreground border-t border-border/40",
					children: [
						filtered.length,
						" of ",
						clients?.length ?? 0,
						" client",
						(clients?.length ?? 0) !== 1 ? "s" : ""
					]
				})]
			})
		]
	});
}
//#endregion
export { ClientsPage as component };
