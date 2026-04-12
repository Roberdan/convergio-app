import { useLanguage, type SupportedLocale } from "@/lib/i18n/language-provider";

export interface InferenceLocale {
  title: string;
  costByModel: string;
  routingDecision: string;
  costBreakdown: string;
  budgetAlerts: string;
  prompt: string;
  tier: string;
  entity: string;
  type: string;
  model: string;
  dailyCost: string;
  monthlyCost: string;
  any: string;
  standard: string;
  premium: string;
  economy: string;
  decision: string;
  noCostData: string;
  noAlerts: string;
  highSpend: string;
  loading: string;
  describeTask: string;
}

const locales: Record<SupportedLocale, InferenceLocale> = {
  en: {
    title: "Inference",
    costByModel: "Cost by Model",
    routingDecision: "Routing Decision",
    costBreakdown: "Cost Breakdown",
    budgetAlerts: "Budget Alerts",
    prompt: "Prompt",
    tier: "Tier",
    entity: "Entity",
    type: "Type",
    model: "Model",
    dailyCost: "Daily ($)",
    monthlyCost: "Monthly ($)",
    any: "Any",
    standard: "Standard",
    premium: "Premium",
    economy: "Economy",
    decision: "Decision",
    noCostData: "No cost data",
    noAlerts: "No budget alerts",
    highSpend: "High spend",
    loading: "Loading inference data...",
    describeTask: "Describe the task...",
  },
  it: {
    title: "Inferenza",
    costByModel: "Costo per Modello",
    routingDecision: "Decisione di Routing",
    costBreakdown: "Dettaglio Costi",
    budgetAlerts: "Avvisi Budget",
    prompt: "Prompt",
    tier: "Livello",
    entity: "Entita",
    type: "Tipo",
    model: "Modello",
    dailyCost: "Giornaliero ($)",
    monthlyCost: "Mensile ($)",
    any: "Qualsiasi",
    standard: "Standard",
    premium: "Premium",
    economy: "Economy",
    decision: "Decisione",
    noCostData: "Nessun dato di costo",
    noAlerts: "Nessun avviso di budget",
    highSpend: "Spesa elevata",
    loading: "Caricamento dati inferenza...",
    describeTask: "Descrivi il task...",
  },
  es: {
    title: "Inferencia",
    costByModel: "Costo por Modelo",
    routingDecision: "Decision de Enrutamiento",
    costBreakdown: "Desglose de Costos",
    budgetAlerts: "Alertas de Presupuesto",
    prompt: "Prompt",
    tier: "Nivel",
    entity: "Entidad",
    type: "Tipo",
    model: "Modelo",
    dailyCost: "Diario ($)",
    monthlyCost: "Mensual ($)",
    any: "Cualquiera",
    standard: "Estandar",
    premium: "Premium",
    economy: "Economico",
    decision: "Decision",
    noCostData: "Sin datos de costo",
    noAlerts: "Sin alertas de presupuesto",
    highSpend: "Gasto alto",
    loading: "Cargando datos de inferencia...",
    describeTask: "Describe la tarea...",
  },
  zh: {
    title: "推理",
    costByModel: "按模型成本",
    routingDecision: "路由决策",
    costBreakdown: "成本明细",
    budgetAlerts: "预算告警",
    prompt: "提示词",
    tier: "层级",
    entity: "实体",
    type: "类型",
    model: "模型",
    dailyCost: "日费用 ($)",
    monthlyCost: "月费用 ($)",
    any: "任意",
    standard: "标准",
    premium: "高级",
    economy: "经济",
    decision: "决策",
    noCostData: "无成本数据",
    noAlerts: "无预算告警",
    highSpend: "高消费",
    loading: "加载推理数据...",
    describeTask: "描述任务...",
  },
};

export function useInferenceLocale(): InferenceLocale {
  const { locale } = useLanguage();
  return locales[locale];
}
