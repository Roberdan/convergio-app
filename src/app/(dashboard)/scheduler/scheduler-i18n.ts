/**
 * Localized strings for Scheduler page.
 */
import { useLanguage, type SupportedLocale } from "@/lib/i18n/language-provider";

export interface SchedulerLocale {
  title: string;
  policy: string;
  editPolicy: string;
  savePolicy: string;
  savingPolicy: string;
  policySaved: string;
  policySaveError: string;
  history: string;
  testDecision: string;
  strategy: string;
  maxConcurrent: string;
  priorityBoost: string;
  enabled: string;
  disabled: string;
  agentId: string;
  model: string;
  reason: string;
  decidedAt: string;
  costEstimate: string;
  noHistory: string;
  loading: string;
  prompt: string;
  tier: string;
  submit: string;
  submitting: string;
  result: string;
  promptPlaceholder: string;
  policyName: string;
  cancel: string;
  rollbackCancel: string;
}

const locales: Record<SupportedLocale, SchedulerLocale> = {
  en: {
    title: "Scheduler",
    policy: "Policy",
    editPolicy: "Edit Policy",
    savePolicy: "Save Policy",
    savingPolicy: "Saving...",
    policySaved: "Policy saved successfully",
    policySaveError: "Failed to save policy",
    history: "Decision History",
    testDecision: "Test Decision",
    strategy: "Strategy",
    maxConcurrent: "Max Concurrent",
    priorityBoost: "Priority Boost",
    enabled: "Enabled",
    disabled: "Disabled",
    agentId: "Agent",
    model: "Model",
    reason: "Reason",
    decidedAt: "Decided At",
    costEstimate: "Cost Est. ($)",
    noHistory: "No decisions recorded",
    loading: "Loading scheduler...",
    prompt: "Prompt",
    tier: "Tier",
    submit: "Decide",
    submitting: "Deciding...",
    result: "Result",
    promptPlaceholder: "Enter a test prompt for scheduling decision...",
    policyName: "Policy Name",
    cancel: "Cancel",
    rollbackCancel: "Cancel",
  },
  it: {
    title: "Schedulatore",
    policy: "Policy",
    editPolicy: "Modifica Policy",
    savePolicy: "Salva Policy",
    savingPolicy: "Salvataggio...",
    policySaved: "Policy salvata con successo",
    policySaveError: "Errore nel salvataggio della policy",
    history: "Storico Decisioni",
    testDecision: "Test Decisione",
    strategy: "Strategia",
    maxConcurrent: "Max Concorrenti",
    priorityBoost: "Boost Priorita",
    enabled: "Attivo",
    disabled: "Disattivo",
    agentId: "Agente",
    model: "Modello",
    reason: "Motivo",
    decidedAt: "Deciso Il",
    costEstimate: "Costo Est. ($)",
    noHistory: "Nessuna decisione registrata",
    loading: "Caricamento schedulatore...",
    prompt: "Prompt",
    tier: "Livello",
    submit: "Decidi",
    submitting: "Decidendo...",
    result: "Risultato",
    promptPlaceholder: "Inserisci un prompt di test per la decisione...",
    policyName: "Nome Policy",
    cancel: "Annulla",
    rollbackCancel: "Annulla",
  },
  es: {
    title: "Planificador",
    policy: "Politica",
    editPolicy: "Editar Politica",
    savePolicy: "Guardar Politica",
    savingPolicy: "Guardando...",
    policySaved: "Politica guardada correctamente",
    policySaveError: "Error al guardar la politica",
    history: "Historial de Decisiones",
    testDecision: "Probar Decision",
    strategy: "Estrategia",
    maxConcurrent: "Max Concurrentes",
    priorityBoost: "Prioridad Extra",
    enabled: "Activo",
    disabled: "Inactivo",
    agentId: "Agente",
    model: "Modelo",
    reason: "Razon",
    decidedAt: "Decidido El",
    costEstimate: "Costo Est. ($)",
    noHistory: "Sin decisiones registradas",
    loading: "Cargando planificador...",
    prompt: "Prompt",
    tier: "Nivel",
    submit: "Decidir",
    submitting: "Decidiendo...",
    result: "Resultado",
    promptPlaceholder: "Ingresa un prompt de prueba...",
    policyName: "Nombre de Politica",
    cancel: "Cancelar",
    rollbackCancel: "Cancelar",
  },
  zh: {
    title: "调度器",
    policy: "策略",
    editPolicy: "编辑策略",
    savePolicy: "保存策略",
    savingPolicy: "保存中...",
    policySaved: "策略保存成功",
    policySaveError: "策略保存失败",
    history: "决策历史",
    testDecision: "测试决策",
    strategy: "策略",
    maxConcurrent: "最大并发",
    priorityBoost: "优先级提升",
    enabled: "已启用",
    disabled: "已禁用",
    agentId: "代理",
    model: "模型",
    reason: "原因",
    decidedAt: "决策时间",
    costEstimate: "成本估算 ($)",
    noHistory: "没有决策记录",
    loading: "加载调度器...",
    prompt: "提示",
    tier: "层级",
    submit: "决策",
    submitting: "决策中...",
    result: "结果",
    promptPlaceholder: "输入测试提示进行调度决策...",
    policyName: "策略名称",
    cancel: "取消",
    rollbackCancel: "取消",
  },
};

export function useSchedulerLocale(): SchedulerLocale {
  const { locale } = useLanguage();
  return locales[locale];
}
