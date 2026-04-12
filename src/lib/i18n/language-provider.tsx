"use client";

import * as React from "react";
import type { PartialLocaleMessages } from "./types";

export type SupportedLocale = "en" | "it" | "es" | "zh";

const LOCALE_STORAGE_KEY = "convergio-locale";

const LanguageContext = React.createContext<{
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  messages: PartialLocaleMessages | undefined;
}>({
  locale: "en",
  setLocale: () => {},
  messages: undefined,
});

function detectBrowserLocale(): SupportedLocale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored && ["en", "it", "es", "zh"].includes(stored)) {
    return stored as SupportedLocale;
  }
  const browserLang = navigator.language.slice(0, 2);
  if (["en", "it", "es", "zh"].includes(browserLang)) {
    return browserLang as SupportedLocale;
  }
  return "en";
}

const loaders: Record<SupportedLocale, () => Promise<PartialLocaleMessages>> = {
  en: () => import("./locales/en.json").then((m) => m.default as unknown as PartialLocaleMessages),
  it: () => import("./locales/it.json").then((m) => m.default as unknown as PartialLocaleMessages),
  es: () => import("./locales/es.json").then((m) => m.default as unknown as PartialLocaleMessages),
  zh: () => import("./locales/zh.json").then((m) => m.default as unknown as PartialLocaleMessages),
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<SupportedLocale>("en");
  const [messages, setMessages] = React.useState<PartialLocaleMessages | undefined>();

  React.useEffect(() => {
    const detected = detectBrowserLocale();
    setLocaleState(detected);
    loaders[detected]().then(setMessages);
  }, []);

  const setLocale = React.useCallback((newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    loaders[newLocale]().then(setMessages);
  }, []);

  const value = React.useMemo(
    () => ({ locale, setLocale, messages }),
    [locale, setLocale, messages],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return React.useContext(LanguageContext);
}
