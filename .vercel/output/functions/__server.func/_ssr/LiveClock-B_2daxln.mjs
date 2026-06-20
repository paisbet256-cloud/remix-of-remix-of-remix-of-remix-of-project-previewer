import { i as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { F as Moon, M as Palette, _t as Check, m as Sun, q as Languages, ut as Clock } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/LiveClock-B_2daxln.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var THEMES = [
	{
		key: "ocean",
		label: "Ocean Deep",
		labelBn: "ওশান ডিপ",
		swatch: [
			"#0c2340",
			"#1a4a6e",
			"#2d8a9e",
			"#5cbdb9"
		]
	},
	{
		key: "midnight",
		label: "Midnight Indigo",
		labelBn: "মিডনাইট ইন্ডিগো",
		swatch: [
			"#0a0a1a",
			"#141432",
			"#1e1e5a",
			"#4f46e5"
		]
	},
	{
		key: "emerald",
		label: "Emerald Prestige",
		labelBn: "এমেরাল্ড",
		swatch: [
			"#064e3b",
			"#0d7a5f",
			"#c9a84c",
			"#f5f0e0"
		]
	},
	{
		key: "noir",
		label: "Noir & Gold",
		labelBn: "নোয়া অ্যান্ড গোল্ড",
		swatch: [
			"#0d0d0d",
			"#1a1a1a",
			"#c9a84c",
			"#f0d78c"
		]
	}
];
var STORAGE_KEY$1 = "gv.theme";
var MODE_KEY = "gv.mode";
var DEFAULT = "ocean";
var DEFAULT_MODE = "dark";
var ThemeCtx = (0, import_react.createContext)({
	theme: DEFAULT,
	setTheme: () => {},
	mode: DEFAULT_MODE,
	setMode: () => {},
	toggleMode: () => {}
});
function ThemeProvider({ children }) {
	const [theme, setThemeState] = (0, import_react.useState)(DEFAULT);
	const [mode, setModeState] = (0, import_react.useState)(DEFAULT_MODE);
	(0, import_react.useEffect)(() => {
		if (typeof localStorage === "undefined") return;
		const savedT = localStorage.getItem(STORAGE_KEY$1);
		if (savedT && THEMES.some((t) => t.key === savedT)) setThemeState(savedT);
		const savedM = localStorage.getItem(MODE_KEY);
		if (savedM === "light" || savedM === "dark") setModeState(savedM);
	}, []);
	(0, import_react.useEffect)(() => {
		if (typeof document === "undefined") return;
		document.documentElement.setAttribute("data-theme", theme);
		document.documentElement.setAttribute("data-mode", mode);
		document.documentElement.classList.toggle("dark", mode === "dark");
		document.documentElement.classList.toggle("light", mode === "light");
	}, [theme, mode]);
	const setTheme = (t) => {
		setThemeState(t);
		try {
			localStorage.setItem(STORAGE_KEY$1, t);
		} catch {}
	};
	const setMode = (m) => {
		setModeState(m);
		try {
			localStorage.setItem(MODE_KEY, m);
		} catch {}
	};
	const toggleMode = () => setMode(mode === "dark" ? "light" : "dark");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeCtx.Provider, {
		value: {
			theme,
			setTheme,
			mode,
			setMode,
			toggleMode
		},
		children
	});
}
var useTheme = () => (0, import_react.useContext)(ThemeCtx);
var STORAGE_KEY = "gv.lang";
var DICT = {
	"brand.tagline": {
		en: "Command Center",
		bn: "কমান্ড সেন্টার"
	},
	"nav.main": {
		en: "Main",
		bn: "প্রধান"
	},
	"nav.management": {
		en: "Management",
		bn: "ম্যানেজমেন্ট"
	},
	"nav.system": {
		en: "System",
		bn: "সিস্টেম"
	},
	"nav.dashboard": {
		en: "Dashboard",
		bn: "ড্যাশবোর্ড"
	},
	"nav.campaigns": {
		en: "Campaigns",
		bn: "ক্যাম্পেইন"
	},
	"nav.adsets": {
		en: "Ad Sets",
		bn: "অ্যাড সেট"
	},
	"nav.ads": {
		en: "Ads",
		bn: "বিজ্ঞাপন"
	},
	"nav.insights": {
		en: "Insights",
		bn: "ইনসাইটস"
	},
	"nav.clients": {
		en: "Clients",
		bn: "ক্লায়েন্ট"
	},
	"nav.reports": {
		en: "Reports",
		bn: "রিপোর্ট"
	},
	"nav.budget": {
		en: "Budget Tracker",
		bn: "বাজেট ট্র্যাকার"
	},
	"nav.alerts": {
		en: "Alerts",
		bn: "অ্যালার্ট"
	},
	"nav.sync": {
		en: "Sync Activity",
		bn: "সিঙ্ক অ্যাক্টিভিটি"
	},
	"nav.fbapi": {
		en: "Facebook Marketing API",
		bn: "ফেসবুক মার্কেটিং API"
	},
	"nav.settings": {
		en: "Settings",
		bn: "সেটিংস"
	},
	"header.newClient": {
		en: "New Client",
		bn: "নতুন ক্লায়েন্ট"
	},
	"header.logout": {
		en: "Logout",
		bn: "লগ আউট"
	},
	"header.theme": {
		en: "Theme",
		bn: "থিম"
	},
	"header.language": {
		en: "Language",
		bn: "ভাষা"
	},
	"status.checking": {
		en: "Checking...",
		bn: "চেক করা হচ্ছে..."
	},
	"status.noAccounts": {
		en: "No accounts connected",
		bn: "কোনো অ্যাকাউন্ট সংযুক্ত নয়"
	},
	"status.live": {
		en: "live",
		bn: "লাইভ"
	},
	"role.admin": {
		en: "Super Admin",
		bn: "সুপার অ্যাডমিন"
	},
	"role.member": {
		en: "Member",
		bn: "সদস্য"
	},
	"user.default": {
		en: "User",
		bn: "ইউজার"
	},
	"time.bd": {
		en: "Dhaka",
		bn: "ঢাকা"
	},
	"portal.tagline": {
		en: "Live Ads Dashboard",
		bn: "লাইভ অ্যাড ড্যাশবোর্ড"
	},
	"portal.welcome": {
		en: "Welcome",
		bn: "স্বাগতম"
	},
	"portal.subtitle": {
		en: "Real-time Facebook Ads performance for",
		bn: "রিয়েল-টাইম ফেসবুক অ্যাডস পারফরম্যান্স —"
	},
	"portal.accounts": {
		en: "ad account(s)",
		bn: "অ্যাড অ্যাকাউন্ট"
	},
	"portal.liveStatus": {
		en: "Live Status & Alerts",
		bn: "লাইভ স্ট্যাটাস ও অ্যালার্ট"
	},
	"portal.liveAuto": {
		en: "Live · auto-refresh",
		bn: "লাইভ · অটো-রিফ্রেশ"
	},
	"portal.refresh": {
		en: "Refresh",
		bn: "রিফ্রেশ"
	},
	"portal.totalSpend": {
		en: "Total Spend",
		bn: "মোট খরচ"
	},
	"portal.reach": {
		en: "Reach",
		bn: "রিচ"
	},
	"portal.impressions": {
		en: "Impressions",
		bn: "ইম্প্রেশন"
	},
	"portal.clicks": {
		en: "Clicks",
		bn: "ক্লিক"
	},
	"portal.results": {
		en: "Results",
		bn: "রেজাল্ট"
	},
	"portal.activeCamps": {
		en: "Active Campaigns",
		bn: "চলমান ক্যাম্পেইন"
	},
	"portal.ctr": {
		en: "CTR",
		bn: "সিটিআর"
	},
	"portal.costPerResult": {
		en: "Cost / Result",
		bn: "প্রতি রেজাল্টে খরচ"
	},
	"portal.budgetPace": {
		en: "Budget pacing & forecast",
		bn: "বাজেট পেসিং ও পূর্বাভাস"
	},
	"portal.avgDaily": {
		en: "Avg daily spend (7d)",
		bn: "গড় দৈনিক খরচ (৭ দিন)"
	},
	"portal.weeklyProj": {
		en: "Weekly projection",
		bn: "সাপ্তাহিক পূর্বাভাস"
	},
	"portal.monthProj": {
		en: "Month-end projection",
		bn: "মাস শেষের পূর্বাভাস"
	},
	"portal.perf30": {
		en: "Performance — last 30 days",
		bn: "পারফরম্যান্স — শেষ ৩০ দিন"
	},
	"portal.topCamps": {
		en: "Top campaigns",
		bn: "সেরা ক্যাম্পেইন"
	},
	"portal.export": {
		en: "Export",
		bn: "এক্সপোর্ট"
	},
	"portal.poweredBy": {
		en: "Powered by",
		bn: "পরিচালিত —"
	},
	"portal.lastSync": {
		en: "Last sync",
		bn: "শেষ সিঙ্ক"
	},
	"portal.campaign": {
		en: "Campaign",
		bn: "ক্যাম্পেইন"
	},
	"portal.status": {
		en: "Status",
		bn: "স্ট্যাটাস"
	},
	"portal.spend": {
		en: "Spend",
		bn: "খরচ"
	},
	"portal.noCamps": {
		en: "No campaigns yet — sync in progress.",
		bn: "এখনো কোনো ক্যাম্পেইন নেই — সিঙ্ক চলছে।"
	},
	"portal.print": {
		en: "Print",
		bn: "প্রিন্ট"
	},
	"portal.autoUpdated": {
		en: "Data updated automatically",
		bn: "ডেটা স্বয়ংক্রিয়ভাবে আপডেট হচ্ছে"
	},
	"action.save": {
		en: "Save",
		bn: "সংরক্ষণ"
	},
	"action.cancel": {
		en: "Cancel",
		bn: "বাতিল"
	},
	"action.delete": {
		en: "Delete",
		bn: "ডিলিট"
	},
	"action.edit": {
		en: "Edit",
		bn: "এডিট"
	},
	"action.create": {
		en: "Create",
		bn: "তৈরি করুন"
	},
	"action.search": {
		en: "Search",
		bn: "অনুসন্ধান"
	},
	"action.filter": {
		en: "Filter",
		bn: "ফিল্টার"
	},
	"action.export": {
		en: "Export",
		bn: "এক্সপোর্ট"
	},
	"action.refresh": {
		en: "Refresh",
		bn: "রিফ্রেশ"
	},
	"action.loading": {
		en: "Loading...",
		bn: "লোড হচ্ছে..."
	},
	"action.viewAll": {
		en: "View all",
		bn: "সব দেখুন"
	},
	"action.back": {
		en: "Back",
		bn: "ফিরে যান"
	},
	"action.next": {
		en: "Next",
		bn: "পরবর্তী"
	},
	"action.submit": {
		en: "Submit",
		bn: "জমা দিন"
	},
	"common.total": {
		en: "Total",
		bn: "মোট"
	},
	"common.active": {
		en: "Active",
		bn: "সক্রিয়"
	},
	"common.paused": {
		en: "Paused",
		bn: "বন্ধ"
	},
	"common.name": {
		en: "Name",
		bn: "নাম"
	},
	"common.email": {
		en: "Email",
		bn: "ইমেইল"
	},
	"common.password": {
		en: "Password",
		bn: "পাসওয়ার্ড"
	},
	"common.status": {
		en: "Status",
		bn: "স্ট্যাটাস"
	},
	"common.actions": {
		en: "Actions",
		bn: "অ্যাকশন"
	},
	"common.today": {
		en: "Today",
		bn: "আজ"
	},
	"common.yesterday": {
		en: "Yesterday",
		bn: "গতকাল"
	},
	"common.last7": {
		en: "Last 7 days",
		bn: "শেষ ৭ দিন"
	},
	"common.last30": {
		en: "Last 30 days",
		bn: "শেষ ৩০ দিন"
	}
};
var I18nCtx = (0, import_react.createContext)({
	lang: "en",
	setLang: () => {},
	t: (k) => k
});
function I18nProvider({ children }) {
	const [lang, setLangState] = (0, import_react.useState)("en");
	(0, import_react.useEffect)(() => {
		const saved = typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY);
		if (saved === "en" || saved === "bn") setLangState(saved);
	}, []);
	(0, import_react.useEffect)(() => {
		if (typeof document !== "undefined") document.documentElement.setAttribute("lang", lang);
	}, [lang]);
	const setLang = (l) => {
		setLangState(l);
		try {
			localStorage.setItem(STORAGE_KEY, l);
		} catch {}
	};
	const t = (key) => DICT[key]?.[lang] ?? key;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nCtx.Provider, {
		value: {
			lang,
			setLang,
			t
		},
		children
	});
}
var useI18n = () => (0, import_react.useContext)(I18nCtx);
function ModeToggle() {
	const { mode, toggleMode } = useTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: toggleMode,
		title: mode === "dark" ? "Switch to light mode" : "Switch to dark mode",
		"aria-label": "Toggle light/dark mode",
		className: "inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-surface/60 px-2.5 py-1.5 text-xs font-medium hover:bg-surface-elevated transition-all",
		children: [mode === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-3.5 text-amber-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-3.5 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "hidden sm:inline font-semibold uppercase",
			children: mode === "dark" ? "Light" : "Dark"
		})]
	});
}
function useClickOutside(onClose) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const handler = (e) => {
			if (ref.current && !ref.current.contains(e.target)) onClose();
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [onClose]);
	return ref;
}
function ThemePicker() {
	const { theme, setTheme } = useTheme();
	const { lang, t } = useI18n();
	const [open, setOpen] = (0, import_react.useState)(false);
	const ref = useClickOutside(() => setOpen(false));
	const current = THEMES.find((x) => x.key === theme);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setOpen((v) => !v),
			className: "inline-flex items-center gap-2 rounded-lg border border-border/60 bg-surface/60 px-2.5 py-1.5 text-xs font-medium hover:bg-surface-elevated",
			"aria-label": t("header.theme"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "size-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden sm:flex items-center gap-1",
				children: current?.swatch.slice(0, 4).map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "size-2.5 rounded-full ring-1 ring-white/10",
					style: { background: c }
				}, i))
			})]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute right-0 mt-2 w-64 rounded-xl border border-border bg-popover shadow-elevated p-2 z-50",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-2 py-1.5 text-[10px] tracking-[0.18em] uppercase text-muted-foreground font-semibold",
				children: t("header.theme")
			}), THEMES.map((th) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => {
					setTheme(th.key);
					setOpen(false);
				},
				className: `w-full flex items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-surface ${theme === th.key ? "bg-surface" : ""}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-0.5",
						children: th.swatch.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "size-4 first:rounded-l-md last:rounded-r-md ring-1 ring-white/10",
							style: { background: c }
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1 text-left",
						children: lang === "bn" ? th.labelBn : th.label
					}),
					theme === th.key && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-primary" })
				]
			}, th.key))]
		})]
	});
}
function LanguageToggle() {
	const { lang, setLang, t } = useI18n();
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: useClickOutside(() => setOpen(false)),
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setOpen((v) => !v),
			className: "inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-surface/60 px-2.5 py-1.5 text-xs font-medium hover:bg-surface-elevated",
			"aria-label": t("header.language"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, { className: "size-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold uppercase",
				children: lang
			})]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute right-0 mt-2 w-40 rounded-xl border border-border bg-popover shadow-elevated p-1 z-50",
			children: [{
				key: "en",
				label: "English"
			}, {
				key: "bn",
				label: "বাংলা"
			}].map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => {
					setLang(o.key);
					setOpen(false);
				},
				className: `w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-sm hover:bg-surface ${lang === o.key ? "bg-surface" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: o.label }), lang === o.key && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-primary" })]
			}, o.key))
		})]
	});
}
function formatBD(d, lang) {
	const locale = lang === "bn" ? "bn-BD" : "en-GB";
	return {
		time: new Intl.DateTimeFormat(locale, {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: true,
			timeZone: "Asia/Dhaka"
		}).format(d),
		date
	};
}
function LiveClock() {
	const { lang, t } = useI18n();
	const [now, setNow] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setNow(/* @__PURE__ */ new Date());
		const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
		return () => clearInterval(id);
	}, []);
	if (!now) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1.5 sm:gap-2 rounded-lg border border-border/60 bg-surface/60 px-2 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3 sm:size-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono tabular-nums text-muted-foreground",
			children: "--:--:--"
		})]
	});
	const { time, date } = formatBD(now, lang);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1.5 sm:gap-2.5 rounded-lg border border-border/60 bg-surface/60 px-2 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3 sm:size-3.5 text-primary animate-pulse shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "leading-tight",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-mono tabular-nums font-semibold text-foreground",
				children: time
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-[9px] sm:text-[10px] text-muted-foreground",
				children: [date, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "hidden sm:inline",
					children: [" · ", t("time.bd")]
				})]
			})]
		})]
	});
}
//#endregion
export { ThemePicker as a, ModeToggle as i, LanguageToggle as n, ThemeProvider as o, LiveClock as r, useI18n as s, I18nProvider as t };
