import { useLanguage, type SupportedLocale } from "@/lib/i18n/language-provider";

export interface ObservatoryLocale {
  title: string;
  live: string;
  polling: string;
  anomalies: string;
  costPerHour: string;
  tasksPerDay: string;
  avgLatency: string;
  models: string;
  searchPlaceholder: string;
  filterOrg: string;
  filterSource: string;
  allTypes: string;
  messages: string;
  tasks: string;
  delegations: string;
  budgetAlerts: string;
  health: string;
  searchResults: string;
  eventTimeline: string;
  modelBreakdown: string;
  anomalyDetection: string;
  resolve: string;
  noModelData: string;
  noAnomalies: string;
  loading: string;
}

const locales: Record<SupportedLocale, ObservatoryLocale> = {
  en: {
    title: "Observatory",
    live: "Live",
    polling: "Polling",
    anomalies: "anomalies",
    costPerHour: "Cost/Hour",
    tasksPerDay: "Tasks/Day",
    avgLatency: "Avg Latency",
    models: "Models",
    searchPlaceholder: "Search events, messages, audit...",
    filterOrg: "Filter by org...",
    filterSource: "Filter by source...",
    allTypes: "All types",
    messages: "Messages",
    tasks: "Tasks",
    delegations: "Delegations",
    budgetAlerts: "Budget alerts",
    health: "Health",
    searchResults: "Search Results",
    eventTimeline: "Event Timeline",
    modelBreakdown: "Model Breakdown",
    anomalyDetection: "Anomaly Detection",
    resolve: "Resolve",
    noModelData: "No model data",
    noAnomalies: "No active anomalies",
    loading: "Loading observatory...",
  },
  it: {
    title: "Osservatorio",
    live: "Live",
    polling: "Polling",
    anomalies: "anomalie",
    costPerHour: "Costo/Ora",
    tasksPerDay: "Task/Giorno",
    avgLatency: "Latenza Media",
    models: "Modelli",
    searchPlaceholder: "Cerca eventi, messaggi, audit...",
    filterOrg: "Filtra per org...",
    filterSource: "Filtra per sorgente...",
    allTypes: "Tutti i tipi",
    messages: "Messaggi",
    tasks: "Task",
    delegations: "Deleghe",
    budgetAlerts: "Avvisi budget",
    health: "Salute",
    searchResults: "Risultati Ricerca",
    eventTimeline: "Timeline Eventi",
    modelBreakdown: "Distribuzione Modelli",
    anomalyDetection: "Rilevamento Anomalie",
    resolve: "Risolvi",
    noModelData: "Nessun dato modello",
    noAnomalies: "Nessuna anomalia attiva",
    loading: "Caricamento osservatorio...",
  },
  es: {
    title: "Observatorio",
    live: "En vivo",
    polling: "Polling",
    anomalies: "anomalias",
    costPerHour: "Costo/Hora",
    tasksPerDay: "Tareas/Dia",
    avgLatency: "Latencia Prom.",
    models: "Modelos",
    searchPlaceholder: "Buscar eventos, mensajes, auditoria...",
    filterOrg: "Filtrar por org...",
    filterSource: "Filtrar por fuente...",
    allTypes: "Todos los tipos",
    messages: "Mensajes",
    tasks: "Tareas",
    delegations: "Delegaciones",
    budgetAlerts: "Alertas de presupuesto",
    health: "Salud",
    searchResults: "Resultados de Busqueda",
    eventTimeline: "Linea de Tiempo",
    modelBreakdown: "Distribucion de Modelos",
    anomalyDetection: "Deteccion de Anomalias",
    resolve: "Resolver",
    noModelData: "Sin datos de modelo",
    noAnomalies: "Sin anomalias activas",
    loading: "Cargando observatorio...",
  },
  zh: {
    title: "观测台",
    live: "实时",
    polling: "轮询",
    anomalies: "个异常",
    costPerHour: "成本/小时",
    tasksPerDay: "任务/天",
    avgLatency: "平均延迟",
    models: "模型",
    searchPlaceholder: "搜索事件、消息、审计...",
    filterOrg: "按组织筛选...",
    filterSource: "按来源筛选...",
    allTypes: "所有类型",
    messages: "消息",
    tasks: "任务",
    delegations: "委派",
    budgetAlerts: "预算告警",
    health: "健康",
    searchResults: "搜索结果",
    eventTimeline: "事件时间线",
    modelBreakdown: "模型分布",
    anomalyDetection: "异常检测",
    resolve: "解决",
    noModelData: "无模型数据",
    noAnomalies: "无活跃异常",
    loading: "加载观测台...",
  },
};

export function useObservatoryLocale(): ObservatoryLocale {
  const { locale } = useLanguage();
  return locales[locale];
}
