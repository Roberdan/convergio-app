/**
 * Localized strings for Agent Catalog page.
 */
import { useLanguage, type SupportedLocale } from "@/lib/i18n/language-provider";

export interface AgentsLocale {
  title: string;
  catalog: string;
  spawnAgent: string;
  active: string;
  queue: string;
  delegations: string;
  stale: string;
  network: string;
  name: string;
  model: string;
  tier: string;
  budget: string;
  category: string;
  description: string;
  capabilities: string;
  none: string;
  cancel: string;
  spawn: string;
  spawning: string;
  noAgents: string;
  deleteConfirm: (name: string) => string;
  lastHeartbeat: string;
  kill: string;
  editAgent: string;
  edit: string;
  editing: string;
  saveChanges: string;
  editSuccess: string;
  editError: string;
}

const locales: Record<SupportedLocale, AgentsLocale> = {
  en: {
    title: "Agents",
    catalog: "Agent Catalog",
    spawnAgent: "Spawn Agent",
    active: "Active",
    queue: "Queue",
    delegations: "Delegations",
    stale: "Stale",
    network: "Agent Network",
    name: "Name",
    model: "Model",
    tier: "Tier",
    budget: "Budget ($)",
    category: "Category",
    description: "Description",
    capabilities: "Capabilities",
    none: "None",
    cancel: "Cancel",
    spawn: "Spawn",
    spawning: "Spawning...",
    noAgents: "No agents registered",
    deleteConfirm: (name: string) => `Delete agent "${name}"?`,
    lastHeartbeat: "Last heartbeat",
    kill: "Kill",
    editAgent: "Edit Agent",
    edit: "Save",
    editing: "Saving...",
    saveChanges: "Save Changes",
    editSuccess: "Agent updated successfully",
    editError: "Failed to update agent",
  },
  it: {
    title: "Agenti",
    catalog: "Catalogo Agenti",
    spawnAgent: "Avvia Agente",
    active: "Attivi",
    queue: "Coda",
    delegations: "Deleghe",
    stale: "Stallo",
    network: "Rete Agenti",
    name: "Nome",
    model: "Modello",
    tier: "Livello",
    budget: "Budget ($)",
    category: "Categoria",
    description: "Descrizione",
    capabilities: "Capacita",
    none: "Nessuna",
    cancel: "Annulla",
    spawn: "Avvia",
    spawning: "Avvio...",
    noAgents: "Nessun agente registrato",
    deleteConfirm: (name: string) => `Eliminare l'agente "${name}"?`,
    lastHeartbeat: "Ultimo heartbeat",
    kill: "Termina",
    editAgent: "Modifica Agente",
    edit: "Salva",
    editing: "Salvataggio...",
    saveChanges: "Salva Modifiche",
    editSuccess: "Agente aggiornato con successo",
    editError: "Errore durante l'aggiornamento",
  },
  es: {
    title: "Agentes",
    catalog: "Catalogo de Agentes",
    spawnAgent: "Lanzar Agente",
    active: "Activos",
    queue: "Cola",
    delegations: "Delegaciones",
    stale: "Estancados",
    network: "Red de Agentes",
    name: "Nombre",
    model: "Modelo",
    tier: "Nivel",
    budget: "Presupuesto ($)",
    category: "Categoria",
    description: "Descripcion",
    capabilities: "Capacidades",
    none: "Ninguna",
    cancel: "Cancelar",
    spawn: "Lanzar",
    spawning: "Lanzando...",
    noAgents: "Sin agentes registrados",
    deleteConfirm: (name: string) => `Eliminar agente "${name}"?`,
    lastHeartbeat: "Ultimo latido",
    kill: "Terminar",
    editAgent: "Editar Agente",
    edit: "Guardar",
    editing: "Guardando...",
    saveChanges: "Guardar Cambios",
    editSuccess: "Agente actualizado correctamente",
    editError: "Error al actualizar el agente",
  },
  zh: {
    title: "代理",
    catalog: "代理目录",
    spawnAgent: "启动代理",
    active: "活跃",
    queue: "队列",
    delegations: "委托",
    stale: "停滞",
    network: "代理网络",
    name: "名称",
    model: "模型",
    tier: "层级",
    budget: "预算 ($)",
    category: "类别",
    description: "描述",
    capabilities: "能力",
    none: "无",
    cancel: "取消",
    spawn: "启动",
    spawning: "启动中...",
    noAgents: "没有注册的代理",
    deleteConfirm: (name: string) => `删除代理 "${name}"?`,
    lastHeartbeat: "最后心跳",
    kill: "终止",
    editAgent: "编辑代理",
    edit: "保存",
    editing: "保存中...",
    saveChanges: "保存更改",
    editSuccess: "代理更新成功",
    editError: "更新代理失败",
  },
};

export function useAgentsLocale(): AgentsLocale {
  const { locale } = useLanguage();
  return locales[locale];
}
