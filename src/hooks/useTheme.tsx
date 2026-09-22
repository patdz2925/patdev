import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type ThemePref = "light" | "dark" | "system";

interface ThemeCtx {
  pref: ThemePref;
  isDark: boolean;
  setPref: (p: ThemePref) => void;
}

const Ctx = createContext<ThemeCtx>({ pref: "system", isDark: false, setPref: () => {} });
const KEY = "portfolio-theme";

function resolveDark(pref: ThemePref): boolean {
  if (pref === "dark") return true;
  if (pref === "light") return false;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [pref, setPrefState] = useState<ThemePref>(() => {
    try {
      const v = localStorage.getItem(KEY);
      return v === "dark" || v === "light" || v === "system" ? v : "system";
    } catch {
      return "system";
    }
  });
  const [isDark, setIsDark] = useState(() => {
    try {
      return document.documentElement.classList.contains("dark");
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const dark = resolveDark(pref);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem(KEY, pref);
      document.documentElement.dataset.themePref = pref;
    } catch {}
  }, [pref]);

  // Follow OS changes when on "system"
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const onChange = () => {
      try {
        const stored = localStorage.getItem(KEY) || "system";
        if (stored === "system") {
          document.documentElement.classList.toggle("dark", mq.matches);
          setIsDark(mq.matches);
        }
      } catch {}
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setPref = useCallback((p: ThemePref) => setPrefState(p), []);

  return <Ctx.Provider value={{ pref, isDark, setPref }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  return useContext(Ctx);
}
