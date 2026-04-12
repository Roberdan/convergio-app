import { useLanguage, type SupportedLocale } from "@/lib/i18n/language-provider";

export interface OrgsLocale {
  title: string;
  newOrg: string;
  allOrgs: string;
  orgChart: string;
  budgetDist: string;
  interOrgPeers: string;
  name: string;
  status: string;
  agents: string;
  budget: string;
  spent: string;
  created: string;
  edit: string;
  delete: string;
  cancel: string;
  create: string;
  save: string;
  saving: string;
  creating: string;
  description: string;
  budgetUsd: string;
  noOrgs: string;
  noPeers: string;
  noBudget: string;
  deleteConfirm: (name: string) => string;
  budgetUsage: string;
  allowed: string;
  blocked: string;
  loading: string;
  editOrg: string;
  required: string;
}

const locales: Record<SupportedLocale, OrgsLocale> = {
  en: {
    title: "Organizations",
    newOrg: "New Organization",
    allOrgs: "All Organizations",
    orgChart: "Org Chart",
    budgetDist: "Budget Distribution",
    interOrgPeers: "Inter-Org Peers",
    name: "Name",
    status: "Status",
    agents: "Agents",
    budget: "Budget ($)",
    spent: "Spent ($)",
    created: "Created",
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    create: "Create",
    save: "Save",
    saving: "Saving...",
    creating: "Creating...",
    description: "Description",
    budgetUsd: "Budget (USD)",
    noOrgs: "No organizations found",
    noPeers: "No peer connections",
    noBudget: "No budget data",
    deleteConfirm: (n) => `Delete organization "${n}"?`,
    budgetUsage: "Budget usage",
    allowed: "Allowed",
    blocked: "Blocked",
    loading: "Loading organizations...",
    editOrg: "Edit Organization",
    required: "Required",
  },
  it: {
    title: "Organizzazioni",
    newOrg: "Nuova Organizzazione",
    allOrgs: "Tutte le Organizzazioni",
    orgChart: "Organigramma",
    budgetDist: "Distribuzione Budget",
    interOrgPeers: "Peer Inter-Org",
    name: "Nome",
    status: "Stato",
    agents: "Agenti",
    budget: "Budget ($)",
    spent: "Speso ($)",
    created: "Creato",
    edit: "Modifica",
    delete: "Elimina",
    cancel: "Annulla",
    create: "Crea",
    save: "Salva",
    saving: "Salvataggio...",
    creating: "Creazione...",
    description: "Descrizione",
    budgetUsd: "Budget (USD)",
    noOrgs: "Nessuna organizzazione trovata",
    noPeers: "Nessuna connessione peer",
    noBudget: "Nessun dato di budget",
    deleteConfirm: (n) => `Eliminare l'organizzazione "${n}"?`,
    budgetUsage: "Utilizzo budget",
    allowed: "Consentito",
    blocked: "Bloccato",
    loading: "Caricamento organizzazioni...",
    editOrg: "Modifica Organizzazione",
    required: "Obbligatorio",
  },
  es: {
    title: "Organizaciones",
    newOrg: "Nueva Organizacion",
    allOrgs: "Todas las Organizaciones",
    orgChart: "Organigrama",
    budgetDist: "Distribucion de Presupuesto",
    interOrgPeers: "Peers Inter-Org",
    name: "Nombre",
    status: "Estado",
    agents: "Agentes",
    budget: "Presupuesto ($)",
    spent: "Gastado ($)",
    created: "Creado",
    edit: "Editar",
    delete: "Eliminar",
    cancel: "Cancelar",
    create: "Crear",
    save: "Guardar",
    saving: "Guardando...",
    creating: "Creando...",
    description: "Descripcion",
    budgetUsd: "Presupuesto (USD)",
    noOrgs: "No se encontraron organizaciones",
    noPeers: "Sin conexiones peer",
    noBudget: "Sin datos de presupuesto",
    deleteConfirm: (n) => `Eliminar organizacion "${n}"?`,
    budgetUsage: "Uso de presupuesto",
    allowed: "Permitido",
    blocked: "Bloqueado",
    loading: "Cargando organizaciones...",
    editOrg: "Editar Organizacion",
    required: "Obligatorio",
  },
  zh: {
    title: "组织",
    newOrg: "新建组织",
    allOrgs: "所有组织",
    orgChart: "组织架构图",
    budgetDist: "预算分配",
    interOrgPeers: "组织间节点",
    name: "名称",
    status: "状态",
    agents: "代理",
    budget: "预算 ($)",
    spent: "已花费 ($)",
    created: "创建时间",
    edit: "编辑",
    delete: "删除",
    cancel: "取消",
    create: "创建",
    save: "保存",
    saving: "保存中...",
    creating: "创建中...",
    description: "描述",
    budgetUsd: "预算 (USD)",
    noOrgs: "未找到组织",
    noPeers: "无节点连接",
    noBudget: "无预算数据",
    deleteConfirm: (n) => `确定删除组织 "${n}" 吗?`,
    budgetUsage: "预算使用",
    allowed: "已允许",
    blocked: "已阻止",
    loading: "加载组织...",
    editOrg: "编辑组织",
    required: "必填",
  },
};

export function useOrgsLocale(): OrgsLocale {
  const { locale } = useLanguage();
  return locales[locale];
}
