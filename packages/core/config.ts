/** @convergio/core/config — Config loading and validation. */
export {
  loadAppConfig,
  loadNavSections,
  loadPageConfig,
  loadAIConfig,
  loadPageRoutes,
  loadLocaleOverrides,
} from "@/lib/config-loader";
export { rawConfigSchema, type ValidatedConfig } from "@/lib/config-schema";
export { blockSchema } from "@/lib/config-block-schemas";
