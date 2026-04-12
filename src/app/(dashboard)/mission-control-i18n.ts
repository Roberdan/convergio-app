/**
 * Localized strings for Mission Control page.
 * Uses the language provider to return strings in the active locale.
 */
import { useLanguage, type SupportedLocale } from "@/lib/i18n/language-provider";

export interface MCLocale {
  systemHealth: string;
  health: string;
  activePlans: string;
  noActivePlans: string;
  tasks: string;
  recentActivity: string;
  spawnAgent: string;
  createPlan: string;
  runDoctor: string;
  status: string;
  agents: string;
  budget: string;
  extensions: string;
  healthy: string;
  unknown: string;
  summaryLine: (plans: number, agents: number, healthy: number, total: number) => string;
}

const locales: Record<SupportedLocale, MCLocale> = {
  en: {
    systemHealth: "System Health",
    health: "Health",
    activePlans: "Active Plans",
    noActivePlans: "No active plans",
    tasks: "tasks",
    recentActivity: "Recent activity",
    spawnAgent: "Spawn Agent",
    createPlan: "Create Plan",
    runDoctor: "Run Doctor",
    status: "Status",
    agents: "Agents",
    budget: "Budget",
    extensions: "Extensions",
    healthy: "Healthy",
    unknown: "Unknown",
    summaryLine: (p, a, h, t) =>
      `${p} active plan${p !== 1 ? "s" : ""}, ${a} agent${a !== 1 ? "s" : ""} online, ${h}/${t} services healthy`,
  },
  it: {
    systemHealth: "Salute del Sistema",
    health: "Salute",
    activePlans: "Piani Attivi",
    noActivePlans: "Nessun piano attivo",
    tasks: "task",
    recentActivity: "Attivita recente",
    spawnAgent: "Avvia Agente",
    createPlan: "Crea Piano",
    runDoctor: "Esegui Dottore",
    status: "Stato",
    agents: "Agenti",
    budget: "Budget",
    extensions: "Estensioni",
    healthy: "Operativo",
    unknown: "Sconosciuto",
    summaryLine: (p, a, h, t) =>
      `${p} pian${p !== 1 ? "i" : "o"} attiv${p !== 1 ? "i" : "o"}, ${a} agent${a !== 1 ? "i" : "e"} online, ${h}/${t} servizi operativi`,
  },
  es: {
    systemHealth: "Salud del Sistema",
    health: "Salud",
    activePlans: "Planes Activos",
    noActivePlans: "Sin planes activos",
    tasks: "tareas",
    recentActivity: "Actividad reciente",
    spawnAgent: "Lanzar Agente",
    createPlan: "Crear Plan",
    runDoctor: "Ejecutar Doctor",
    status: "Estado",
    agents: "Agentes",
    budget: "Presupuesto",
    extensions: "Extensiones",
    healthy: "Operativo",
    unknown: "Desconocido",
    summaryLine: (p, a, h, t) =>
      `${p} plan${p !== 1 ? "es" : ""} activo${p !== 1 ? "s" : ""}, ${a} agente${a !== 1 ? "s" : ""} en linea, ${h}/${t} servicios operativos`,
  },
  zh: {
    systemHealth: "系统健康",
    health: "健康",
    activePlans: "活跃计划",
    noActivePlans: "没有活跃计划",
    tasks: "任务",
    recentActivity: "最近活动",
    spawnAgent: "启动代理",
    createPlan: "创建计划",
    runDoctor: "运行诊断",
    status: "状态",
    agents: "代理",
    budget: "预算",
    extensions: "扩展",
    healthy: "健康",
    unknown: "未知",
    summaryLine: (p, a, h, t) =>
      `${p}个活跃计划, ${a}个代理在线, ${h}/${t}个服务正常`,
  },
};

export function useMissionControlLocale(): MCLocale {
  const { locale } = useLanguage();
  return locales[locale];
}
