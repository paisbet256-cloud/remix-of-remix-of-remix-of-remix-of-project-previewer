import { t as supabase } from "./client-rgEw8wDd.mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { d as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ct as ArrowLeft, P as MousePointerClick, R as MapPin, W as Link2, a as Wallet, d as TrendingDown, it as ExternalLink, j as Pencil, k as Phone, o as Users, ot as DollarSign, p as Target, rt as Eye, st as Copy, tt as FileDown, z as Mail } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./clients_._slug.report-CdQK7wTL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clients_._slug.report-CuuYg7K0.js
var import_jsx_runtime = require_jsx_runtime();
function fmtUSD(n) {
	return `$${(Number(n) || 0).toLocaleString(void 0, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	})}`;
}
function fmtInt(n) {
	return (Number(n) || 0).toLocaleString();
}
function ClientReportPage() {
	const { slug } = Route.useParams();
	const { data, isLoading } = useQuery({
		queryKey: ["client-report", slug],
		queryFn: async () => {
			const { data: client } = await supabase.from("clients").select("*").eq("slug", slug).maybeSingle();
			if (!client) return null;
			const { data: accounts } = await supabase.from("ad_accounts").select("*").eq("client_id", client.id);
			const acctIds = (accounts ?? []).map((a) => a.id);
			const { data: assigned } = await supabase.from("client_campaigns").select("campaign_id").eq("client_id", client.id);
			const assignedIds = (assigned ?? []).map((r) => r.campaign_id);
			let campaigns = [];
			if (assignedIds.length) {
				const { data } = await supabase.from("campaigns").select("*").in("id", assignedIds);
				campaigns = data ?? [];
			} else if (acctIds.length) {
				const { data } = await supabase.from("campaigns").select("*").in("ad_account_id", acctIds);
				campaigns = data ?? [];
			}
			const campIds = campaigns.map((c) => c.id);
			let ads = [];
			if (campIds.length) {
				const { data } = await supabase.from("ads").select("id,name,fb_ad_id,effective_status,campaign_id,ad_account_id,spend,impressions,reach,clicks,results").in("campaign_id", campIds).order("spend", { ascending: false }).limit(200);
				ads = data ?? [];
			}
			const acctById = new Map((accounts ?? []).map((a) => [a.id, a]));
			return {
				client,
				accounts: accounts ?? [],
				campaigns,
				ads,
				acctById
			};
		}
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-[60vh] grid place-items-center text-muted-foreground",
		children: "Loading report…"
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/clients",
			className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " Back to clients"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "glass-card p-10 text-center",
			children: "Client not found."
		})]
	});
	const { client, accounts, campaigns, ads, acctById } = data;
	const clientIdShort = client.client_code ?? (client.slug ?? "").slice(0, 8).toUpperCase();
	const portalUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/client/${clientIdShort}${client.portal_token ? `?token=${client.portal_token}` : ""}`;
	const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&bgcolor=0f172a&color=10b981&data=${encodeURIComponent(portalUrl)}`;
	const totals = (campaigns.length ? campaigns : accounts).reduce((acc, r) => ({
		spend: acc.spend + (Number(r.spend ?? r.total_spend) || 0),
		impressions: acc.impressions + (Number(r.impressions ?? r.total_impressions) || 0),
		reach: acc.reach + (Number(r.reach ?? r.total_reach) || 0),
		clicks: acc.clicks + (Number(r.clicks ?? r.total_clicks) || 0),
		results: acc.results + (Number(r.results ?? r.total_results) || 0)
	}), {
		spend: 0,
		impressions: 0,
		reach: 0,
		clicks: 0,
		results: 0
	});
	const deposit = Number(client.deposit_amount) || 0;
	const remaining = deposit - totals.spend;
	const costPerResult = totals.results > 0 ? totals.spend / totals.results : 0;
	const copy = async (text, label = "Copied") => {
		await navigator.clipboard.writeText(text);
		toast.success(label);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/clients",
				className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " Back to clients"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 min-w-0 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight break-words",
						children: client.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: `inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${client.status === "active" ? "bg-emerald-500/15 text-emerald-400" : client.status === "paused" ? "bg-amber-500/15 text-amber-400" : "bg-muted/40 text-muted-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-1.5 rounded-full ${client.status === "active" ? "bg-emerald-400" : "bg-muted-foreground"}` }), String(client.status).charAt(0).toUpperCase() + String(client.status).slice(1)]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/clients/new",
						search: { edit: client.id },
						className: "inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-semibold hover:bg-surface-elevated",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), " Edit Client"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => window.print(),
						className: "inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 text-sm font-semibold shadow-lg shadow-emerald-500/20 hover:opacity-95",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "size-4" }), " Generate Report"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card p-3 inline-flex items-center gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground text-xs uppercase tracking-wider",
						children: "Client ID:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "font-mono text-emerald-400",
						children: clientIdShort
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => copy(clientIdShort, "Client ID copied"),
						className: "inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-xs hover:bg-surface-elevated",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" }), " Copy"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-3.5 text-emerald-400" }), " Client share link (no login required)"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid md:grid-cols-[1fr_auto] gap-5 items-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "flex-1 min-w-0 truncate text-xs sm:text-sm rounded-lg border border-border bg-surface px-3 py-2 font-mono text-emerald-300",
									children: portalUrl
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => copy(portalUrl, "Link copied"),
									className: "inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 text-white px-3 py-2 text-xs font-semibold hover:bg-emerald-600",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), " Copy"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: portalUrl,
									target: "_blank",
									rel: "noreferrer",
									className: "inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold hover:bg-surface-elevated",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" }), " Open"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Send this link to your client — they'll see their ad details instantly, without logging in. Scan the QR code with a phone to open."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl bg-white p-2 shadow-lg shadow-emerald-500/10 mx-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: qrUrl,
							alt: "Portal QR",
							width: 160,
							height: 160,
							className: "block"
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPI, {
						icon: Wallet,
						tone: "emerald",
						label: "Total Deposit (USD)",
						value: fmtUSD(deposit)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPI, {
						icon: DollarSign,
						tone: "cyan",
						label: "Total Spend",
						value: fmtUSD(totals.spend)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPI, {
						icon: TrendingDown,
						tone: "amber",
						label: "Remaining Balance",
						value: fmtUSD(remaining),
						sub: "Remaining"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPI, {
						icon: Eye,
						tone: "violet",
						label: "Impressions",
						value: fmtInt(totals.impressions),
						compact: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPI, {
						icon: Users,
						tone: "sky",
						label: "Reach",
						value: fmtInt(totals.reach),
						compact: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPI, {
						icon: Target,
						tone: "rose",
						label: "Results",
						value: fmtInt(totals.results),
						compact: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPI, {
						icon: MousePointerClick,
						tone: "emerald",
						label: "Cost / Result",
						value: costPerResult ? fmtUSD(costPerResult) : "$0",
						compact: true
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[260px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "glass-card p-4 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-2",
							children: "Contact Info"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							icon: Mail,
							label: "Email Address",
							value: client.contact_email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							icon: Phone,
							label: "Phone Number",
							value: client.contact_phone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							icon: MapPin,
							label: "Address",
							value: client.address
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5",
							children: "Access Portal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: portalUrl,
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" }), " Campaign Lookup"]
						})] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-card overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-4 py-3 border-b border-border/40 text-xs text-emerald-400",
							children: [
								"✓ Loaded ",
								ads.length,
								" assigned ad",
								ads.length !== 1 ? "s" : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-4 py-3 border-b border-border/40 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold",
								children: "Assigned Ads"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [ads.length, " ADS"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "text-[11px] uppercase tracking-wider text-muted-foreground bg-surface/40",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-left px-4 py-2.5",
											children: "Ad Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-left px-4 py-2.5",
											children: "Ad ID"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-left px-4 py-2.5",
											children: "Ad Account"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-left px-4 py-2.5",
											children: "Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-right px-4 py-2.5",
											children: "Spend"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "text-right px-4 py-2.5",
											children: "Results"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: ads.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 6,
									className: "text-center py-12 text-muted-foreground text-sm",
									children: "No assigned ads."
								}) }) : ads.map((a) => {
									const acct = acctById.get(a.ad_account_id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-border/40 hover:bg-surface/40",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 max-w-[260px]",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-medium truncate",
													children: a.name
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
													className: "text-xs font-mono text-muted-foreground",
													children: a.fb_ad_id
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-muted-foreground",
												children: acct?.account_name ?? acct?.fb_account_id ?? "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-semibold uppercase rounded-full px-2 py-0.5 bg-surface text-muted-foreground",
													children: a.effective_status ?? "—"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-right font-medium",
												children: fmtUSD(a.spend)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-right text-primary font-medium",
												children: fmtInt(a.results)
											})
										]
									}, a.id);
								}) })]
							})
						})
					]
				})]
			})
		]
	});
}
function KPI({ icon: Icon, label, value, sub, tone = "emerald", compact = false }) {
	const tones = {
		emerald: "from-emerald-500/20 to-emerald-500/0 text-emerald-400",
		cyan: "from-cyan-500/20 to-cyan-500/0 text-cyan-400",
		amber: "from-amber-500/20 to-amber-500/0 text-amber-400",
		violet: "from-violet-500/20 to-violet-500/0 text-violet-400",
		sky: "from-sky-500/20 to-sky-500/0 text-sky-400",
		rose: "from-rose-500/20 to-rose-500/0 text-rose-400"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-card p-4 relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute -top-10 -right-10 size-28 rounded-full bg-gradient-to-br ${tones[tone]} blur-2xl pointer-events-none` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `size-9 rounded-xl grid place-items-center bg-gradient-to-br ${tones[tone]}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] uppercase tracking-wider text-muted-foreground mt-3",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `${compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"} font-extrabold mt-1 break-words`,
				children: value
			}),
			sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] text-muted-foreground mt-0.5",
				children: sub
			})
		]
	});
}
function Field({ icon: Icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-[11px] uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3" }),
			" ",
			label
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-sm truncate",
		children: value || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: "—"
		})
	})] });
}
//#endregion
export { ClientReportPage as component };
