"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

const THEMES = ["light", "dark", "navy", "colorblind"] as const;
export type Theme = (typeof THEMES)[number];

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: readonly Theme[];
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyDarkClass(theme: string | undefined) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  if (theme === "dark" || theme === "navy" || theme === "colorblind") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
}

function ThemeBridge({ children }: { children: React.ReactNode }) {
  const { theme: rawTheme, setTheme: setNextTheme } = useNextTheme();
  const theme = (THEMES.includes(rawTheme as Theme) ? rawTheme : "navy") as Theme;

  const setTheme = useCallback((next: Theme) => {
    setNextTheme(next);
    applyDarkClass(next);
  }, [setNextTheme]);

  const value = useMemo(() => ({ theme, setTheme, themes: THEMES }), [theme, setTheme]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function ThemeProvider({ children, defaultTheme = "navy" }: {
  children: React.ReactNode;
  defaultTheme?: Theme;
}) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme={defaultTheme}
      themes={[...THEMES]}
      disableTransitionOnChange={false}
      enableSystem={false}
      storageKey="convergio-theme"
    >
      <ThemeBridge>{children}</ThemeBridge>
    </NextThemesProvider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
