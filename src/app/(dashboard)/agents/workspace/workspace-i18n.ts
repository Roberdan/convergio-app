/**
 * Localized strings for Agent Workspace page.
 */
import { useLanguage, type SupportedLocale } from "@/lib/i18n/language-provider";

export interface WorkspaceLocale {
  title: string;
  agentList: string;
  agentDetail: string;
  noAgents: string;
  selectAgent: string;
  name: string;
  status: string;
  org: string;
  budget: string;
  spent: string;
  model: string;
  node: string;
  currentTask: string;
  noTask: string;
  stage: string;
  priority: string;
  events: string;
  noEvents: string;
  active: string;
  stale: string;
  idle: string;
  online: string;
  offline: string;
  queueDepth: string;
  totalBudget: string;
  totalSpent: string;
  commandPanel: string;
  commandPlaceholder: string;
  sendCommand: string;
  responses: string;
  noResponses: string;
  sending: string;
  lastActivity: string;
}

const locales: Record<SupportedLocale, WorkspaceLocale> = {
  en: {
    title: "Agent Workspace",
    agentList: "Active Agents",
    agentDetail: "Agent Detail",
    noAgents: "No active agents",
    selectAgent: "Select an agent to view details",
    name: "Name",
    status: "Status",
    org: "Organization",
    budget: "Budget",
    spent: "Spent",
    model: "Model",
    node: "Node",
    currentTask: "Current Task",
    noTask: "No task assigned",
    stage: "Stage",
    priority: "Priority",
    events: "Recent Events",
    noEvents: "No recent events",
    active: "Active",
    stale: "Stale",
    idle: "Idle",
    online: "Online",
    offline: "Offline",
    queueDepth: "Queue Depth",
    totalBudget: "Total Budget",
    totalSpent: "Total Spent",
    commandPanel: "Send Command",
    commandPlaceholder: "Type a command or ask a question...",
    sendCommand: "Send",
    responses: "Responses",
    noResponses: "No responses yet",
    sending: "Sending...",
    lastActivity: "Last Activity",
  },
  it: {
    title: "Area di Lavoro Agenti",
    agentList: "Agenti Attivi",
    agentDetail: "Dettaglio Agente",
    noAgents: "Nessun agente attivo",
    selectAgent: "Seleziona un agente per i dettagli",
    name: "Nome",
    status: "Stato",
    org: "Organizzazione",
    budget: "Budget",
    spent: "Speso",
    model: "Modello",
    node: "Nodo",
    currentTask: "Task Corrente",
    noTask: "Nessun task assegnato",
    stage: "Fase",
    priority: "Priorita",
    events: "Eventi Recenti",
    noEvents: "Nessun evento recente",
    active: "Attivo",
    stale: "Stallo",
    idle: "Inattivo",
    online: "Online",
    offline: "Offline",
    queueDepth: "Profondita Coda",
    totalBudget: "Budget Totale",
    totalSpent: "Spesa Totale",
    commandPanel: "Invia Comando",
    commandPlaceholder: "Scrivi un comando o fai una domanda...",
    sendCommand: "Invia",
    responses: "Risposte",
    noResponses: "Nessuna risposta ancora",
    sending: "Invio in corso...",
    lastActivity: "Ultima Attivita",
  },
  es: {
    title: "Espacio de Trabajo de Agentes",
    agentList: "Agentes Activos",
    agentDetail: "Detalle del Agente",
    noAgents: "Sin agentes activos",
    selectAgent: "Seleccione un agente para ver detalles",
    name: "Nombre",
    status: "Estado",
    org: "Organizacion",
    budget: "Presupuesto",
    spent: "Gastado",
    model: "Modelo",
    node: "Nodo",
    currentTask: "Tarea Actual",
    noTask: "Sin tarea asignada",
    stage: "Etapa",
    priority: "Prioridad",
    events: "Eventos Recientes",
    noEvents: "Sin eventos recientes",
    active: "Activo",
    stale: "Estancado",
    idle: "Inactivo",
    online: "En linea",
    offline: "Fuera de linea",
    queueDepth: "Profundidad de Cola",
    totalBudget: "Presupuesto Total",
    totalSpent: "Gasto Total",
    commandPanel: "Enviar Comando",
    commandPlaceholder: "Escribe un comando o haz una pregunta...",
    sendCommand: "Enviar",
    responses: "Respuestas",
    noResponses: "Sin respuestas aun",
    sending: "Enviando...",
    lastActivity: "Ultima Actividad",
  },
  zh: {
    title: "代理工作区",
    agentList: "活跃代理",
    agentDetail: "代理详情",
    noAgents: "没有活跃代理",
    selectAgent: "选择代理查看详情",
    name: "名称",
    status: "状态",
    org: "组织",
    budget: "预算",
    spent: "已花费",
    model: "模型",
    node: "节点",
    currentTask: "当前任务",
    noTask: "未分配任务",
    stage: "阶段",
    priority: "优先级",
    events: "最近事件",
    noEvents: "没有最近事件",
    active: "活跃",
    stale: "停滞",
    idle: "空闲",
    online: "在线",
    offline: "离线",
    queueDepth: "队列深度",
    totalBudget: "总预算",
    totalSpent: "总花费",
    commandPanel: "发送命令",
    commandPlaceholder: "输入命令或提问...",
    sendCommand: "发送",
    responses: "回复",
    noResponses: "暂无回复",
    sending: "发送中...",
    lastActivity: "最近活动",
  },
};

export function useWorkspaceLocale(): WorkspaceLocale {
  const { locale } = useLanguage();
  return locales[locale];
}
