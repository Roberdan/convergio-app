/**
 * @convergio/core — main barrel export.
 *
 * Re-exports shell, config, theme, hooks, blocks, block-registry,
 * and page-renderer from the framework source.
 *
 * Consumer usage:
 * ```ts
 * import { AppShell, loadNavSections, PageRenderer } from "@convergio/core";
 * ```
 */

export { AppShell, type AppShellProps } from "@/components/shell/app-shell";
export { Sidebar, type NavSection, type NavItem } from "@/components/shell/sidebar";
export { Header } from "@/components/shell/header";
export { SearchCombobox } from "@/components/shell/search-combobox";

export {
  loadAppConfig,
  loadNavSections,
  loadPageConfig,
  loadAIConfig,
  loadPageRoutes,
  loadLocaleOverrides,
} from "@/lib/config-loader";

export { ThemeProvider } from "@/components/theme/theme-provider";
export { ThemeSwitcher } from "@/components/theme/theme-switcher";
export { ThemeScript } from "@/components/theme/theme-script";

export { useApiQuery } from "@/hooks/use-api-query";
export { useEventSource } from "@/hooks/use-event-source";
export { useSSEAdapter } from "@/hooks/use-sse-adapter";

export { registerBlock, lazyBlock, getBlock, hasBlock, registeredBlockTypes } from "@/lib/block-registry";
export { PageRenderer } from "@/components/page-renderer";
