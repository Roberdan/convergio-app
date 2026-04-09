import type { LocaleMessages, PartialLocaleMessages } from "./types";
import { DEFAULT_MESSAGES } from "./defaults";

/**
 * Server-safe helper: merge partial overrides with defaults.
 * Use in server components that can't use React hooks/context.
 */
export function resolveLocale<K extends keyof LocaleMessages>(
  ns: K,
  overrides?: PartialLocaleMessages,
): LocaleMessages[K] {
  const base = DEFAULT_MESSAGES[ns];
  const patch = overrides?.[ns];
  if (!patch) return base;
  return { ...base, ...patch } as LocaleMessages[K];
}
