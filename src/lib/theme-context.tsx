import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeKey = "ocean" | "midnight" | "emerald" | "noir";
export type Mode = "light" | "dark";

export const THEMES: { key: ThemeKey; label: string; labelBn: string; swatch: string[] }[] = [
  { key: "ocean",    label: "Ocean Deep",       labelBn: "ওশান ডিপ",      swatch: ["#0c2340", "#1a4a6e", "#2d8a9e", "#5cbdb9"] },
  { key: "midnight", label: "Midnight Indigo",  labelBn: "মিডনাইট ইন্ডিগো", swatch: ["#0a0a1a", "#141432", "#1e1e5a", "#4f46e5"] },
  { key: "emerald",  label: "Emerald Prestige", labelBn: "এমেরাল্ড",       swatch: ["#064e3b", "#0d7a5f", "#c9a84c", "#f5f0e0"] },
  { key: "noir",     label: "Noir & Gold",      labelBn: "নোয়া অ্যান্ড গোল্ড", swatch: ["#0d0d0d", "#1a1a1a", "#c9a84c", "#f0d78c"] },
];

const STORAGE_KEY = "gv.theme";
const MODE_KEY = "gv.mode";
const DEFAULT: ThemeKey = "ocean";
const DEFAULT_MODE: Mode = "dark";

type Ctx = {
  theme: ThemeKey; setTheme: (t: ThemeKey) => void;
  mode: Mode; setMode: (m: Mode) => void; toggleMode: () => void;
};
const ThemeCtx = createContext<Ctx>({ theme: DEFAULT, setTheme: () => {}, mode: DEFAULT_MODE, setMode: () => {}, toggleMode: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeKey>(DEFAULT);
  const [mode, setModeState] = useState<Mode>(DEFAULT_MODE);

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    const savedT = localStorage.getItem(STORAGE_KEY) as ThemeKey | null;
    if (savedT && THEMES.some((t) => t.key === savedT)) setThemeState(savedT);
    const savedM = localStorage.getItem(MODE_KEY) as Mode | null;
    if (savedM === "light" || savedM === "dark") setModeState(savedM);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-mode", mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
    document.documentElement.classList.toggle("light", mode === "light");
  }, [theme, mode]);

  const setTheme = (t: ThemeKey) => { setThemeState(t); try { localStorage.setItem(STORAGE_KEY, t); } catch {} };
  const setMode = (m: Mode) => { setModeState(m); try { localStorage.setItem(MODE_KEY, m); } catch {} };
  const toggleMode = () => setMode(mode === "dark" ? "light" : "dark");

  return <ThemeCtx.Provider value={{ theme, setTheme, mode, setMode, toggleMode }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
