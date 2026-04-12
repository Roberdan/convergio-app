import { useLanguage, type SupportedLocale } from "@/lib/i18n/language-provider";

export interface SecurityLocale {
  title: string;
  trustLevels: string;
  secretsFilters: string;
  tenancyResources: string;
  entity: string;
  type: string;
  score: string;
  level: string;
  lastEvaluated: string;
  pattern: string;
  scope: string;
  action: string;
  enabled: string;
  resource: string;
  current: string;
  max: string;
  usage: string;
  noTrust: string;
  noSecrets: string;
  noResources: string;
  loading: string;
  orgFilter: string;
  allOrgs: string;
  high: string;
  medium: string;
  low: string;
  untrusted: string;
  redact: string;
  block: string;
  warn: string;
  cpuSeconds: string;
  memoryMb: string;
  storageMb: string;
  concurrentAgents: string;
  apiCalls: string;
  sandboxPolicies: string;
  noSandbox: string;
  save: string;
  add: string;
  edit: string;
  delete: string;
  cancel: string;
  remove: string;
  value: string;
  addSecret: string;
  secretName: string;
  maskedValue: string;
  addTrustEntry: string;
  editTrustEntry: string;
  entityId: string;
  entityType: string;
  trustScore: string;
}

const locales: Record<SupportedLocale, SecurityLocale> = {
  en: {
    title: "Security",
    trustLevels: "Trust Levels",
    secretsFilters: "Secrets Filters",
    tenancyResources: "Tenancy Resources",
    entity: "Entity",
    type: "Type",
    score: "Score",
    level: "Level",
    lastEvaluated: "Last Evaluated",
    pattern: "Pattern",
    scope: "Scope",
    action: "Action",
    enabled: "Enabled",
    resource: "Resource",
    current: "Current",
    max: "Max",
    usage: "Usage",
    noTrust: "No trust data available",
    noSecrets: "No secret filters configured",
    noResources: "No resource data available",
    loading: "Loading security data...",
    orgFilter: "Filter by org...",
    allOrgs: "All Organizations",
    high: "High",
    medium: "Medium",
    low: "Low",
    untrusted: "Untrusted",
    redact: "Redact",
    block: "Block",
    warn: "Warn",
    cpuSeconds: "CPU Seconds/hr",
    memoryMb: "Memory (MB)",
    storageMb: "Storage (MB)",
    concurrentAgents: "Concurrent Agents",
    apiCalls: "API Calls/min",
    sandboxPolicies: "Sandbox Policies",
    noSandbox: "No sandbox policies configured",
    save: "Save",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    remove: "Remove",
    value: "Value",
    addSecret: "Add Secret",
    secretName: "Secret Name",
    maskedValue: "Masked Value",
    addTrustEntry: "Add Trust Entry",
    editTrustEntry: "Edit Trust Entry",
    entityId: "Entity ID",
    entityType: "Entity Type",
    trustScore: "Trust Score",
  },
  it: {
    title: "Sicurezza",
    trustLevels: "Livelli di Fiducia",
    secretsFilters: "Filtri Segreti",
    tenancyResources: "Risorse Tenancy",
    entity: "Entita",
    type: "Tipo",
    score: "Punteggio",
    level: "Livello",
    lastEvaluated: "Ultima Valutazione",
    pattern: "Pattern",
    scope: "Ambito",
    action: "Azione",
    enabled: "Attivo",
    resource: "Risorsa",
    current: "Attuale",
    max: "Max",
    usage: "Utilizzo",
    noTrust: "Nessun dato di fiducia",
    noSecrets: "Nessun filtro segreti configurato",
    noResources: "Nessun dato risorse",
    loading: "Caricamento dati sicurezza...",
    orgFilter: "Filtra per org...",
    allOrgs: "Tutte le Organizzazioni",
    high: "Alto",
    medium: "Medio",
    low: "Basso",
    untrusted: "Non fidato",
    redact: "Oscura",
    block: "Blocca",
    warn: "Avvisa",
    cpuSeconds: "Secondi CPU/ora",
    memoryMb: "Memoria (MB)",
    storageMb: "Storage (MB)",
    concurrentAgents: "Agenti Concorrenti",
    apiCalls: "Chiamate API/min",
    sandboxPolicies: "Policy Sandbox",
    noSandbox: "Nessuna policy sandbox configurata",
    save: "Salva",
    add: "Aggiungi",
    edit: "Modifica",
    delete: "Elimina",
    cancel: "Annulla",
    remove: "Rimuovi",
    value: "Valore",
    addSecret: "Aggiungi Segreto",
    secretName: "Nome Segreto",
    maskedValue: "Valore Mascherato",
    addTrustEntry: "Aggiungi Voce Fiducia",
    editTrustEntry: "Modifica Voce Fiducia",
    entityId: "ID Entita",
    entityType: "Tipo Entita",
    trustScore: "Punteggio Fiducia",
  },
  es: {
    title: "Seguridad",
    trustLevels: "Niveles de Confianza",
    secretsFilters: "Filtros de Secretos",
    tenancyResources: "Recursos de Tenencia",
    entity: "Entidad",
    type: "Tipo",
    score: "Puntuacion",
    level: "Nivel",
    lastEvaluated: "Ultima Evaluacion",
    pattern: "Patron",
    scope: "Alcance",
    action: "Accion",
    enabled: "Activo",
    resource: "Recurso",
    current: "Actual",
    max: "Max",
    usage: "Uso",
    noTrust: "Sin datos de confianza",
    noSecrets: "Sin filtros de secretos",
    noResources: "Sin datos de recursos",
    loading: "Cargando datos de seguridad...",
    orgFilter: "Filtrar por org...",
    allOrgs: "Todas las Organizaciones",
    high: "Alto",
    medium: "Medio",
    low: "Bajo",
    untrusted: "No confiable",
    redact: "Ocultar",
    block: "Bloquear",
    warn: "Advertir",
    cpuSeconds: "Segundos CPU/hora",
    memoryMb: "Memoria (MB)",
    storageMb: "Almacenamiento (MB)",
    concurrentAgents: "Agentes Concurrentes",
    apiCalls: "Llamadas API/min",
    sandboxPolicies: "Politicas de Sandbox",
    noSandbox: "Sin politicas de sandbox",
    save: "Guardar",
    add: "Agregar",
    edit: "Editar",
    delete: "Eliminar",
    cancel: "Cancelar",
    remove: "Eliminar",
    value: "Valor",
    addSecret: "Agregar Secreto",
    secretName: "Nombre del Secreto",
    maskedValue: "Valor Oculto",
    addTrustEntry: "Agregar Entrada de Confianza",
    editTrustEntry: "Editar Entrada de Confianza",
    entityId: "ID de Entidad",
    entityType: "Tipo de Entidad",
    trustScore: "Puntuacion de Confianza",
  },
  zh: {
    title: "安全",
    trustLevels: "信任等级",
    secretsFilters: "密钥过滤器",
    tenancyResources: "租户资源",
    entity: "实体",
    type: "类型",
    score: "评分",
    level: "等级",
    lastEvaluated: "最后评估",
    pattern: "模式",
    scope: "范围",
    action: "操作",
    enabled: "已启用",
    resource: "资源",
    current: "当前",
    max: "最大",
    usage: "使用率",
    noTrust: "无信任数据",
    noSecrets: "未配置密钥过滤器",
    noResources: "无资源数据",
    loading: "加载安全数据...",
    orgFilter: "按组织筛选...",
    allOrgs: "所有组织",
    high: "高",
    medium: "中",
    low: "低",
    untrusted: "不可信",
    redact: "脱敏",
    block: "阻止",
    warn: "警告",
    cpuSeconds: "CPU秒/小时",
    memoryMb: "内存 (MB)",
    storageMb: "存储 (MB)",
    concurrentAgents: "并发代理",
    apiCalls: "API调用/分钟",
    sandboxPolicies: "沙箱策略",
    noSandbox: "未配置沙箱策略",
    save: "保存",
    add: "添加",
    edit: "编辑",
    delete: "删除",
    cancel: "取消",
    remove: "移除",
    value: "值",
    addSecret: "添加密钥",
    secretName: "密钥名称",
    maskedValue: "掩码值",
    addTrustEntry: "添加信任条目",
    editTrustEntry: "编辑信任条目",
    entityId: "实体ID",
    entityType: "实体类型",
    trustScore: "信任评分",
  },
};

export function useSecurityLocale(): SecurityLocale {
  const { locale } = useLanguage();
  return locales[locale];
}
