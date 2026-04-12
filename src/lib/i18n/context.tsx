"use client";

import * as React from "react";
import type { LocaleMessages, PartialLocaleMessages } from "./types";
import { DEFAULT_MESSAGES } from "./defaults";

const LocaleContext = React.createContext<PartialLocaleMessages | null>(null);

/**
 * Provides locale overrides to all Maranello components.
 *
 * Wrap your app (or dashboard layout) with this provider and pass
 * partial overrides — English defaults fill any gaps automatically.
 *
 * @example
 * // From YAML config (server component passes to client):
 * <MnLocaleProvider messages={localeFromYaml}>
 *   {children}
 * </MnLocaleProvider>
 *
 * @example
 * // From an app-level i18n system:
 * const { locale } = useI18n();
 * <MnLocaleProvider messages={locale === "es" ? esOverrides : undefined}>
 *   {children}
 * </MnLocaleProvider>
 */
function MnLocaleProvider({
  messages,
  children,
}: {
  messages?: PartialLocaleMessages;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={messages ?? null}>
      {children}
    </LocaleContext.Provider>
  );
}

/**
 * Returns the merged labels for a given namespace.
 *
 * Priority: context overrides > English defaults.
 * Safe to call without a provider — returns defaults.
 *
 * @example
 * const t = useLocale("dataTable");
 * <span>{t.loading}</span>
 */
function useLocale<K extends keyof LocaleMessages>(ns: K): LocaleMessages[K] {
  const overrides = React.useContext(LocaleContext);
  return React.useMemo(() => {
    const base = DEFAULT_MESSAGES[ns];
    const patch = overrides?.[ns];
    if (!patch) return base;
    return { ...base, ...patch } as LocaleMessages[K];
  }, [ns, overrides]);
}

/**
 * Returns the full merged messages object (all namespaces).
 * Useful when you need labels from multiple namespaces in one component.
 */
function useLocaleAll(): LocaleMessages {
  const overrides = React.useContext(LocaleContext);
  return React.useMemo(() => {
    if (!overrides) return DEFAULT_MESSAGES;
    const merged = { ...DEFAULT_MESSAGES };
    for (const key of Object.keys(overrides) as (keyof LocaleMessages)[]) {
      const patch = overrides[key];
      if (patch) {
        (merged as Record<string, unknown>)[key] = { ...merged[key], ...patch };
      }
    }
    return merged;
  }, [overrides]);
}

/**
 * Server-side helper: merge partial overrides with defaults.
 * Use in server components that can't use hooks.
 *
 * @deprecated Import from "@/lib/i18n/resolve" directly for server components.
 */
function resolveLocale<K extends keyof LocaleMessages>(
  ns: K,
  overrides?: PartialLocaleMessages,
): LocaleMessages[K] {
  const base = DEFAULT_MESSAGES[ns];
  const patch = overrides?.[ns];
  if (!patch) return base;
  return { ...base, ...patch } as LocaleMessages[K];
}

export { MnLocaleProvider, useLocale, useLocaleAll, resolveLocale };
