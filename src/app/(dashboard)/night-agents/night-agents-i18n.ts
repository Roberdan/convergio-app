/**
 * Localized strings for Night Agents page.
 */
import { useLanguage, type SupportedLocale } from "@/lib/i18n/language-provider";

export interface NightAgentsLocale {
  title: string;
  totalAgents: string;
  activeRuns: string;
  trackedProjects: string;
  lastRun: string;
  running: string;
  loading: string;
}

const locales: Record<SupportedLocale, NightAgentsLocale> = {
  en: {
    title: "Night Agents",
    totalAgents: "Total Agents",
    activeRuns: "Active Runs",
    trackedProjects: "Tracked Projects",
    lastRun: "Last Run",
    running: "running",
    loading: "Loading night agents...",
  },
  it: {
    title: "Agenti Notturni",
    totalAgents: "Agenti Totali",
    activeRuns: "Esecuzioni Attive",
    trackedProjects: "Progetti Tracciati",
    lastRun: "Ultima Esecuzione",
    running: "in esecuzione",
    loading: "Caricamento agenti notturni...",
  },
  es: {
    title: "Agentes Nocturnos",
    totalAgents: "Total Agentes",
    activeRuns: "Ejecuciones Activas",
    trackedProjects: "Proyectos Rastreados",
    lastRun: "Ultima Ejecucion",
    running: "en ejecucion",
    loading: "Cargando agentes nocturnos...",
  },
  zh: {
    title: "夜间代理",
    totalAgents: "代理总数",
    activeRuns: "活跃执行",
    trackedProjects: "跟踪项目",
    lastRun: "最后执行",
    running: "运行中",
    loading: "加载夜间代理...",
  },
};

export function useNightAgentsLocale(): NightAgentsLocale {
  const { locale } = useLanguage();
  return locales[locale];
}
