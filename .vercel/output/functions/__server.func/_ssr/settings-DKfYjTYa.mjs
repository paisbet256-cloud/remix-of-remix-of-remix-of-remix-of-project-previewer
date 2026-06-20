import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-rgEw8wDd.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { C as Save, H as LoaderCircle, M as Palette, V as Lock, _ as SlidersVertical, bt as Building2, c as Upload, l as TriangleAlert, s as UserCog } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { f as saveBranding, m as savePreferences, n as clearAllData, o as getSettingsPublic, p as saveOrgInfo, v as updateMyProfile } from "./admin.functions-DJtfy5At.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-DKfYjTYa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TIMEZONES = [
	"Asia/Dhaka",
	"Asia/Kolkata",
	"Asia/Karachi",
	"Asia/Dubai",
	"Europe/London",
	"America/New_York",
	"America/Los_Angeles",
	"UTC"
];
var CURRENCIES = [
	"USD ($)",
	"EUR (€)",
	"GBP (£)",
	"BDT (৳)",
	"INR (₹)",
	"AED (د.إ)"
];
var LANGUAGES = [
	"English",
	"বাংলা",
	"हिन्दी",
	"العربية",
	"Español"
];
var ATTRIBUTION = [
	"1 Day Click",
	"7 Day Click",
	"28 Day Click",
	"1 Day View",
	"7 Day View"
];
function SettingsPage() {
	const qc = useQueryClient();
	const getFn = useServerFn(getSettingsPublic);
	const saveOrgFn = useServerFn(saveOrgInfo);
	const saveBrandFn = useServerFn(saveBranding);
	const savePrefFn = useServerFn(savePreferences);
	const updateProfileFn = useServerFn(updateMyProfile);
	const clearFn = useServerFn(clearAllData);
	const { data: settings } = useQuery({
		queryKey: ["settings"],
		queryFn: () => getFn({ data: void 0 })
	});
	const [orgName, setOrgName] = (0, import_react.useState)("");
	const [orgEmail, setOrgEmail] = (0, import_react.useState)("");
	const [orgPhone, setOrgPhone] = (0, import_react.useState)("");
	const [orgAddress, setOrgAddress] = (0, import_react.useState)("");
	const [savingOrg, setSavingOrg] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [currentPw, setCurrentPw] = (0, import_react.useState)("");
	const [newPw, setNewPw] = (0, import_react.useState)("");
	const [confirmPw, setConfirmPw] = (0, import_react.useState)("");
	const [savingProfile, setSavingProfile] = (0, import_react.useState)(false);
	const [logoUrl, setLogoUrl] = (0, import_react.useState)("");
	const [primary, setPrimary] = (0, import_react.useState)("#1F2240");
	const [secondary, setSecondary] = (0, import_react.useState)("#8B5CF6");
	const [savingBrand, setSavingBrand] = (0, import_react.useState)(false);
	const [tz, setTz] = (0, import_react.useState)("Asia/Dhaka");
	const [currency, setCurrency] = (0, import_react.useState)("USD ($)");
	const [language, setLanguage] = (0, import_react.useState)("English");
	const [attribution, setAttribution] = (0, import_react.useState)("28 Day Click");
	const [savingPref, setSavingPref] = (0, import_react.useState)(false);
	const [confirmText, setConfirmText] = (0, import_react.useState)("");
	const [clearing, setClearing] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (settings) {
			setOrgName(settings.org_name ?? "");
			setOrgEmail(settings.org_email ?? "");
			setOrgPhone(settings.org_phone ?? "");
			setOrgAddress(settings.org_address ?? "");
			setLogoUrl(settings.brand_logo_url ?? "");
			setPrimary(settings.brand_primary_color ?? "#1F2240");
			setSecondary(settings.brand_secondary_color ?? "#8B5CF6");
			setTz(settings.pref_timezone ?? "Asia/Dhaka");
			setCurrency(settings.pref_currency ?? "USD ($)");
			setLanguage(settings.pref_language ?? "English");
			setAttribution(settings.pref_attribution_window ?? "28 Day Click");
		}
	}, [settings]);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) return;
			setEmail(user.email ?? "");
			const { data: prof } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
			setName(prof?.full_name ?? "");
		})();
	}, []);
	const onSaveOrg = async () => {
		setSavingOrg(true);
		try {
			await saveOrgFn({ data: {
				org_name: orgName,
				org_email: orgEmail,
				org_phone: orgPhone,
				org_address: orgAddress
			} });
			toast.success("Organization info saved");
			qc.invalidateQueries({ queryKey: ["settings"] });
		} catch (e) {
			toast.error(e?.message ?? "Save failed");
		} finally {
			setSavingOrg(false);
		}
	};
	const onSaveProfile = async () => {
		if (newPw && newPw !== confirmPw) {
			toast.error("Passwords do not match");
			return;
		}
		if (newPw && newPw.length < 8) {
			toast.error("Password must be at least 8 characters");
			return;
		}
		setSavingProfile(true);
		try {
			await updateProfileFn({ data: {
				full_name: name,
				new_password: newPw || void 0,
				current_password: currentPw || void 0
			} });
			toast.success("Profile updated");
			setCurrentPw("");
			setNewPw("");
			setConfirmPw("");
		} catch (e) {
			toast.error(e?.message ?? "Update failed");
		} finally {
			setSavingProfile(false);
		}
	};
	const onSaveBrand = async () => {
		setSavingBrand(true);
		try {
			await saveBrandFn({ data: {
				brand_logo_url: logoUrl,
				brand_primary_color: primary,
				brand_secondary_color: secondary
			} });
			toast.success("Branding saved");
			qc.invalidateQueries({ queryKey: ["settings"] });
		} catch (e) {
			toast.error(e?.message ?? "Save failed");
		} finally {
			setSavingBrand(false);
		}
	};
	const onSavePref = async () => {
		setSavingPref(true);
		try {
			await savePrefFn({ data: {
				pref_timezone: tz,
				pref_currency: currency,
				pref_language: language,
				pref_attribution_window: attribution
			} });
			toast.success("Preferences saved");
			qc.invalidateQueries({ queryKey: ["settings"] });
		} catch (e) {
			toast.error(e?.message ?? "Save failed");
		} finally {
			setSavingPref(false);
		}
	};
	const onClearAll = async () => {
		if (confirmText !== "CLEAR ALL DATA") {
			toast.error("Type \"CLEAR ALL DATA\" exactly to confirm");
			return;
		}
		setClearing(true);
		try {
			await clearFn({ data: { confirm: "CLEAR ALL DATA" } });
			toast.success("All operational data cleared");
			setConfirmText("");
			qc.invalidateQueries();
		} catch (e) {
			toast.error(e?.message ?? "Clear failed");
		} finally {
			setClearing(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-5xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold",
				children: "Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground text-sm",
				children: "Manage organization details, profile, branding, preferences, and data."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				icon: Building2,
				title: "General Information",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Organization Name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: orgName,
								onChange: (e) => setOrgName(e.target.value),
								placeholder: "Enter organization name",
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								value: orgEmail,
								onChange: (e) => setOrgEmail(e.target.value),
								placeholder: "sales@example.com",
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Phone",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: orgPhone,
								onChange: (e) => setOrgPhone(e.target.value),
								placeholder: "+8801XXXXXXXXX",
								className: inputCls
							})
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Address",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: orgAddress,
							onChange: (e) => setOrgAddress(e.target.value),
							placeholder: "Your business address",
							rows: 3,
							className: inputCls + " resize-y"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterButton, {
						onClick: onSaveOrg,
						loading: savingOrg,
						label: "Save Changes"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				icon: UserCog,
				title: "Your Profile",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "Your name",
							className: inputCls
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email Address",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: email,
							disabled: true,
							className: inputCls + " opacity-60 cursor-not-allowed"
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm font-semibold mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4 text-primary" }), "Change Password"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Current Password",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									value: currentPw,
									onChange: (e) => setCurrentPw(e.target.value),
									placeholder: "Required only if changing password",
									className: inputCls
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, {
								className: "mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "New Password",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "password",
										value: newPw,
										onChange: (e) => setNewPw(e.target.value),
										placeholder: "Min 8 characters",
										className: inputCls
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Confirm Password",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "password",
										value: confirmPw,
										onChange: (e) => setConfirmPw(e.target.value),
										placeholder: "Repeat new password",
										className: inputCls
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterButton, {
						onClick: onSaveProfile,
						loading: savingProfile,
						label: "Update Profile"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				icon: Palette,
				title: "Branding",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Logo",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-12 rounded-md bg-surface border border-border grid place-items-center overflow-hidden",
									children: logoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: logoUrl,
										alt: "logo",
										className: "size-full object-contain"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "size-5 text-muted-foreground" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: logoUrl,
									onChange: (e) => setLogoUrl(e.target.value),
									placeholder: "https://… (paste a logo URL)",
									className: inputCls + " flex-1"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => toast.info("Paste a hosted image URL above"),
									className: "inline-flex items-center gap-2 rounded-lg border border-border bg-surface hover:bg-surface-elevated px-3 py-2 text-xs font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }), " Upload new logo"]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Primary Color",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorInput, {
								value: primary,
								onChange: setPrimary
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Secondary Color",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorInput, {
								value: secondary,
								onChange: setSecondary
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterButton, {
						onClick: onSaveBrand,
						loading: savingBrand,
						label: "Save Branding"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				icon: SlidersVertical,
				title: "Preferences",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Timezone",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: tz,
							onChange: (e) => setTz(e.target.value),
							className: inputCls,
							children: TIMEZONES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: t,
								children: t
							}, t))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Currency",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: currency,
							onChange: (e) => setCurrency(e.target.value),
							className: inputCls,
							children: CURRENCIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c,
								children: c
							}, c))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Language",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: language,
							onChange: (e) => setLanguage(e.target.value),
							className: inputCls,
							children: LANGUAGES.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: l,
								children: l
							}, l))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Attribution Window",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: attribution,
							onChange: (e) => setAttribution(e.target.value),
							className: inputCls,
							children: ATTRIBUTION.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: a,
								children: a
							}, a))
						})
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterButton, {
					onClick: onSavePref,
					loading: savingPref,
					label: "Save Preferences"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-destructive/40 bg-destructive/5 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-destructive font-semibold mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-5" }), " Danger Zone — Clear All Data"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							"This will ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "permanently delete EVERYTHING" }),
							" from this theme and rebuild it fresh:"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 space-y-1 text-sm list-disc list-inside text-foreground/85",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"All ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Clients" }),
								" & client portals"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"All ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Ad Accounts" }),
								" (Meta + manual)"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"All ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Campaigns" }),
								", ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Ad Sets" }),
								", ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Ads" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"All ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Insights" }),
								", ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Reports" }),
								", ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Budget" }),
								" & ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Deposits" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"All ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Alerts" }),
								" & activity log"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"All ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "cached numbers" }),
								" shown on the Dashboard (Total Spend, Reach, Results, etc.)"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Meta access token" }), " & account mapping"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["All ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "locally saved preferences" })] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs text-muted-foreground",
						children: "This action cannot be undone."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-col sm:flex-row sm:items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: confirmText,
							onChange: (e) => setConfirmText(e.target.value),
							placeholder: "Type \"CLEAR ALL DATA\" to confirm",
							className: inputCls + " sm:max-w-xs"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: onClearAll,
							disabled: clearing || confirmText !== "CLEAR ALL DATA",
							className: "inline-flex items-center gap-2 rounded-lg bg-destructive text-destructive-foreground px-4 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-50",
							children: [clearing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4" }), " Clear All Data"]
						})]
					})
				]
			})
		]
	});
}
var inputCls = "w-full rounded-lg bg-input border border-border px-3 py-2.5 text-sm";
function Section({ icon: Icon, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-card p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-semibold text-lg",
				children: title
			})]
		}), children]
	});
}
function Grid({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `grid sm:grid-cols-2 gap-4 ${className}`,
		children
	});
}
function Field({ label, children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1.5",
			children
		})]
	});
}
function ColorInput({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "color",
			value,
			onChange: (e) => onChange(e.target.value),
			className: "size-10 rounded-md border border-border bg-input cursor-pointer"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value,
			onChange: (e) => onChange(e.target.value),
			className: "w-full rounded-lg bg-input border border-border px-3 py-2.5 text-sm flex-1 font-mono"
		})]
	});
}
function FooterButton({ onClick, loading, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-5 flex justify-end",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick,
			disabled: loading,
			className: "inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-50",
			children: [
				loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }),
				" ",
				label
			]
		})
	});
}
//#endregion
export { SettingsPage as component };
