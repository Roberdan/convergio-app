/**
 * Localized strings for Billing page.
 */
import { useLanguage, type SupportedLocale } from "@/lib/i18n/language-provider";

export interface BillingLocale {
  title: string;
  selectOrg: string;
  allOrgs: string;
  dailyCost: string;
  monthlyCost: string;
  categories: string;
  costByCategory: string;
  rateCards: string;
  invoices: string;
  budgetHierarchy: string;
  noOrgs: string;
  noRateCards: string;
  noInvoices: string;
  noCategoryData: string;
  loading: string;
  invoice: string;
  amount: string;
  currency: string;
  status: string;
  periodStart: string;
  periodEnd: string;
  capability: string;
  unit: string;
  rate: string;
  // Alerts section
  alerts: string;
  addAlert: string;
  noAlerts: string;
  alertThreshold: string;
  alertOrg: string;
  alertChannel: string;
  alertCreated: string;
  alertSaved: string;
  alertSaveFailed: string;
  save: string;
  cancel: string;
  addAlertTitle: string;
}

const locales: Record<SupportedLocale, BillingLocale> = {
  en: {
    title: "Billing",
    selectOrg: "Select Organization",
    allOrgs: "All Orgs",
    dailyCost: "Daily Cost",
    monthlyCost: "Monthly Cost",
    categories: "Categories",
    costByCategory: "Cost by Category",
    rateCards: "Rate Cards",
    invoices: "Invoices",
    budgetHierarchy: "Budget Hierarchy",
    noOrgs: "No organizations found",
    noRateCards: "No rate cards",
    noInvoices: "No invoices",
    noCategoryData: "No category data",
    loading: "Loading billing data...",
    invoice: "Invoice",
    amount: "Amount ($)",
    currency: "Currency",
    status: "Status",
    periodStart: "Period Start",
    periodEnd: "Period End",
    capability: "Capability",
    unit: "Unit",
    rate: "Rate ($)",
    alerts: "Budget Alerts",
    addAlert: "Add Alert",
    noAlerts: "No budget alerts configured",
    alertThreshold: "Threshold (USD)",
    alertOrg: "Organization",
    alertChannel: "Notification Channel",
    alertCreated: "Created",
    alertSaved: "Alert created successfully",
    alertSaveFailed: "Failed to create alert",
    save: "Save",
    cancel: "Cancel",
    addAlertTitle: "Add Budget Alert",
  },
  it: {
    title: "Fatturazione",
    selectOrg: "Seleziona Organizzazione",
    allOrgs: "Tutte le Org",
    dailyCost: "Costo Giornaliero",
    monthlyCost: "Costo Mensile",
    categories: "Categorie",
    costByCategory: "Costo per Categoria",
    rateCards: "Tariffario",
    invoices: "Fatture",
    budgetHierarchy: "Gerarchia Budget",
    noOrgs: "Nessuna organizzazione trovata",
    noRateCards: "Nessun tariffario",
    noInvoices: "Nessuna fattura",
    noCategoryData: "Nessun dato per categoria",
    loading: "Caricamento dati fatturazione...",
    invoice: "Fattura",
    amount: "Importo ($)",
    currency: "Valuta",
    status: "Stato",
    periodStart: "Inizio Periodo",
    periodEnd: "Fine Periodo",
    capability: "Capacita",
    unit: "Unita",
    rate: "Tariffa ($)",
    alerts: "Avvisi Budget",
    addAlert: "Aggiungi Avviso",
    noAlerts: "Nessun avviso budget configurato",
    alertThreshold: "Soglia (USD)",
    alertOrg: "Organizzazione",
    alertChannel: "Canale di Notifica",
    alertCreated: "Creato",
    alertSaved: "Avviso creato con successo",
    alertSaveFailed: "Creazione avviso fallita",
    save: "Salva",
    cancel: "Annulla",
    addAlertTitle: "Aggiungi Avviso Budget",
  },
  es: {
    title: "Facturacion",
    selectOrg: "Seleccionar Organizacion",
    allOrgs: "Todas las Org",
    dailyCost: "Costo Diario",
    monthlyCost: "Costo Mensual",
    categories: "Categorias",
    costByCategory: "Costo por Categoria",
    rateCards: "Tarifas",
    invoices: "Facturas",
    budgetHierarchy: "Jerarquia de Presupuesto",
    noOrgs: "Sin organizaciones",
    noRateCards: "Sin tarifas",
    noInvoices: "Sin facturas",
    noCategoryData: "Sin datos de categoria",
    loading: "Cargando datos de facturacion...",
    invoice: "Factura",
    amount: "Monto ($)",
    currency: "Moneda",
    status: "Estado",
    periodStart: "Inicio Periodo",
    periodEnd: "Fin Periodo",
    capability: "Capacidad",
    unit: "Unidad",
    rate: "Tarifa ($)",
    alerts: "Alertas de Presupuesto",
    addAlert: "Agregar Alerta",
    noAlerts: "Sin alertas de presupuesto configuradas",
    alertThreshold: "Umbral (USD)",
    alertOrg: "Organizacion",
    alertChannel: "Canal de Notificacion",
    alertCreated: "Creado",
    alertSaved: "Alerta creada exitosamente",
    alertSaveFailed: "Error al crear la alerta",
    save: "Guardar",
    cancel: "Cancelar",
    addAlertTitle: "Agregar Alerta de Presupuesto",
  },
  zh: {
    title: "计费",
    selectOrg: "选择组织",
    allOrgs: "全部组织",
    dailyCost: "日成本",
    monthlyCost: "月成本",
    categories: "类别",
    costByCategory: "按类别成本",
    rateCards: "费率卡",
    invoices: "发票",
    budgetHierarchy: "预算层级",
    noOrgs: "没有组织",
    noRateCards: "没有费率卡",
    noInvoices: "没有发票",
    noCategoryData: "没有类别数据",
    loading: "加载计费数据...",
    invoice: "发票",
    amount: "金额 ($)",
    currency: "货币",
    status: "状态",
    periodStart: "开始日期",
    periodEnd: "结束日期",
    capability: "能力",
    unit: "单位",
    rate: "费率 ($)",
    alerts: "预算提醒",
    addAlert: "添加提醒",
    noAlerts: "未配置预算提醒",
    alertThreshold: "阈值 (USD)",
    alertOrg: "组织",
    alertChannel: "通知渠道",
    alertCreated: "创建时间",
    alertSaved: "提醒创建成功",
    alertSaveFailed: "创建提醒失败",
    save: "保存",
    cancel: "取消",
    addAlertTitle: "添加预算提醒",
  },
};

export function useBillingLocale(): BillingLocale {
  const { locale } = useLanguage();
  return locales[locale];
}
