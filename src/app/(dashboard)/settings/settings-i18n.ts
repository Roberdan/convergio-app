/**
 * Localized strings for Settings page.
 */
import { useLanguage, type SupportedLocale } from "@/lib/i18n/language-provider";

export interface SettingsLocale {
  title: string;
  configuration: string;
  extensions: string;
  dependencies: string;
  security: string;
  platformConfig: string;
  daemonUrl: string;
  theme: string;
  language: string;
  sseEndpoint: string;
  authMode: string;
  maxConcurrentAgents: string;
  rateLimit: string;
  hotReload: string;
  restartRequired: string;
  healthy: string;
  noExtensions: string;
  refresh: string;
  depGraph: string;
  nodes: string;
  edges: string;
  validation: string;
  valid: string;
  invalid: string;
  auditTrail: string;
  noAudit: string;
  time: string;
  action: string;
  actor: string;
  org: string;
  versionInfo: string;
  version: string;
  build: string;
  commit: string;
  rustVersion: string;
  capabilities: string;
  enabled: string;
  disabled: string;
  loading: string;
}

const locales: Record<SupportedLocale, SettingsLocale> = {
  en: {
    title: "Settings",
    configuration: "Configuration",
    extensions: "Extensions",
    dependencies: "Dependencies",
    security: "Security",
    platformConfig: "Platform Configuration",
    daemonUrl: "API Base URL",
    theme: "Theme",
    language: "Language",
    sseEndpoint: "SSE Endpoint",
    authMode: "Auth Mode",
    maxConcurrentAgents: "Max Concurrent Agents",
    rateLimit: "Rate Limit",
    hotReload: "Hot reload",
    restartRequired: "Restart required",
    healthy: "healthy",
    noExtensions: "No extensions registered",
    refresh: "Refresh",
    depGraph: "Dependency Graph",
    nodes: "nodes",
    edges: "edges",
    validation: "Validation",
    valid: "Valid",
    invalid: "Invalid",
    auditTrail: "Audit Trail",
    noAudit: "No audit entries",
    time: "Time",
    action: "Action",
    actor: "Actor",
    org: "Org",
    versionInfo: "Version Info",
    version: "Version",
    build: "Build",
    commit: "Commit",
    rustVersion: "Rust Version",
    capabilities: "Capabilities",
    enabled: "Enabled",
    disabled: "Disabled",
    loading: "Loading settings...",
  },
  it: {
    title: "Impostazioni",
    configuration: "Configurazione",
    extensions: "Estensioni",
    dependencies: "Dipendenze",
    security: "Sicurezza",
    platformConfig: "Configurazione Piattaforma",
    daemonUrl: "URL Base API",
    theme: "Tema",
    language: "Lingua",
    sseEndpoint: "Endpoint SSE",
    authMode: "Modalita Auth",
    maxConcurrentAgents: "Max Agenti Concorrenti",
    rateLimit: "Limite Richieste",
    hotReload: "Ricarica a caldo",
    restartRequired: "Riavvio necessario",
    healthy: "sani",
    noExtensions: "Nessuna estensione registrata",
    refresh: "Aggiorna",
    depGraph: "Grafo Dipendenze",
    nodes: "nodi",
    edges: "archi",
    validation: "Validazione",
    valid: "Valido",
    invalid: "Non valido",
    auditTrail: "Registro Audit",
    noAudit: "Nessun record audit",
    time: "Ora",
    action: "Azione",
    actor: "Attore",
    org: "Org",
    versionInfo: "Info Versione",
    version: "Versione",
    build: "Build",
    commit: "Commit",
    rustVersion: "Versione Rust",
    capabilities: "Capacita",
    enabled: "Attivo",
    disabled: "Disattivo",
    loading: "Caricamento impostazioni...",
  },
  es: {
    title: "Configuracion",
    configuration: "Configuracion",
    extensions: "Extensiones",
    dependencies: "Dependencias",
    security: "Seguridad",
    platformConfig: "Configuracion de Plataforma",
    daemonUrl: "URL Base API",
    theme: "Tema",
    language: "Idioma",
    sseEndpoint: "Endpoint SSE",
    authMode: "Modo Auth",
    maxConcurrentAgents: "Max Agentes Concurrentes",
    rateLimit: "Limite de Velocidad",
    hotReload: "Recarga en caliente",
    restartRequired: "Reinicio necesario",
    healthy: "saludables",
    noExtensions: "Sin extensiones registradas",
    refresh: "Actualizar",
    depGraph: "Grafo de Dependencias",
    nodes: "nodos",
    edges: "aristas",
    validation: "Validacion",
    valid: "Valido",
    invalid: "Invalido",
    auditTrail: "Registro de Auditoria",
    noAudit: "Sin registros de auditoria",
    time: "Hora",
    action: "Accion",
    actor: "Actor",
    org: "Org",
    versionInfo: "Info de Version",
    version: "Version",
    build: "Build",
    commit: "Commit",
    rustVersion: "Version Rust",
    capabilities: "Capacidades",
    enabled: "Activo",
    disabled: "Inactivo",
    loading: "Cargando configuracion...",
  },
  zh: {
    title: "设置",
    configuration: "配置",
    extensions: "扩展",
    dependencies: "依赖",
    security: "安全",
    platformConfig: "平台配置",
    daemonUrl: "API 基础 URL",
    theme: "主题",
    language: "语言",
    sseEndpoint: "SSE 端点",
    authMode: "认证模式",
    maxConcurrentAgents: "最大并发代理",
    rateLimit: "速率限制",
    hotReload: "热重载",
    restartRequired: "需要重启",
    healthy: "健康",
    noExtensions: "没有注册的扩展",
    refresh: "刷新",
    depGraph: "依赖图",
    nodes: "节点",
    edges: "边",
    validation: "验证",
    valid: "有效",
    invalid: "无效",
    auditTrail: "审计日志",
    noAudit: "没有审计记录",
    time: "时间",
    action: "操作",
    actor: "操作者",
    org: "组织",
    versionInfo: "版本信息",
    version: "版本",
    build: "构建",
    commit: "提交",
    rustVersion: "Rust 版本",
    capabilities: "能力",
    enabled: "已启用",
    disabled: "已禁用",
    loading: "加载设置...",
  },
};

export function useSettingsLocale(): SettingsLocale {
  const { locale } = useLanguage();
  return locales[locale];
}
