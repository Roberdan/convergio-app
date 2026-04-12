import { useLanguage, type SupportedLocale } from "@/lib/i18n/language-provider";

export interface ReportsLocale {
  title: string;
  allReports: string;
  generate: string;
  viewReport: string;
  name: string;
  type: string;
  status: string;
  format: string;
  created: string;
  reportType: string;
  depth: string;
  outputFormat: string;
  noReports: string;
  generating: string;
  pending: string;
  completed: string;
  failed: string;
  summary: string;
  detailed: string;
  full: string;
  markdown: string;
  json: string;
  html: string;
  loading: string;
  generateReport: string;
  selectType: string;
  noContent: string;
  close: string;
  download: string;
  downloadFailed: string;
  actions: string;
}

const locales: Record<SupportedLocale, ReportsLocale> = {
  en: {
    title: "Reports",
    allReports: "All Reports",
    generate: "Generate",
    viewReport: "View Report",
    name: "Name",
    type: "Type",
    status: "Status",
    format: "Format",
    created: "Created",
    reportType: "Report Type",
    depth: "Depth",
    outputFormat: "Output Format",
    noReports: "No reports found",
    generating: "Generating...",
    pending: "Pending",
    completed: "Completed",
    failed: "Failed",
    summary: "Summary",
    detailed: "Detailed",
    full: "Full",
    markdown: "Markdown",
    json: "JSON",
    html: "HTML",
    loading: "Loading reports...",
    generateReport: "Generate Report",
    selectType: "Select report type",
    noContent: "Report content not available",
    close: "Close",
    download: "Download",
    downloadFailed: "Download failed",
    actions: "Actions",
  },
  it: {
    title: "Rapporti",
    allReports: "Tutti i Rapporti",
    generate: "Genera",
    viewReport: "Visualizza Rapporto",
    name: "Nome",
    type: "Tipo",
    status: "Stato",
    format: "Formato",
    created: "Creato",
    reportType: "Tipo di Rapporto",
    depth: "Profondita",
    outputFormat: "Formato Output",
    noReports: "Nessun rapporto trovato",
    generating: "Generazione...",
    pending: "In attesa",
    completed: "Completato",
    failed: "Fallito",
    summary: "Riepilogo",
    detailed: "Dettagliato",
    full: "Completo",
    markdown: "Markdown",
    json: "JSON",
    html: "HTML",
    loading: "Caricamento rapporti...",
    generateReport: "Genera Rapporto",
    selectType: "Seleziona tipo di rapporto",
    noContent: "Contenuto del rapporto non disponibile",
    close: "Chiudi",
    download: "Scarica",
    downloadFailed: "Scaricamento fallito",
    actions: "Azioni",
  },
  es: {
    title: "Informes",
    allReports: "Todos los Informes",
    generate: "Generar",
    viewReport: "Ver Informe",
    name: "Nombre",
    type: "Tipo",
    status: "Estado",
    format: "Formato",
    created: "Creado",
    reportType: "Tipo de Informe",
    depth: "Profundidad",
    outputFormat: "Formato de Salida",
    noReports: "No se encontraron informes",
    generating: "Generando...",
    pending: "Pendiente",
    completed: "Completado",
    failed: "Fallido",
    summary: "Resumen",
    detailed: "Detallado",
    full: "Completo",
    markdown: "Markdown",
    json: "JSON",
    html: "HTML",
    loading: "Cargando informes...",
    generateReport: "Generar Informe",
    selectType: "Seleccionar tipo de informe",
    noContent: "Contenido del informe no disponible",
    close: "Cerrar",
    download: "Descargar",
    downloadFailed: "Descarga fallida",
    actions: "Acciones",
  },
  zh: {
    title: "报告",
    allReports: "所有报告",
    generate: "生成",
    viewReport: "查看报告",
    name: "名称",
    type: "类型",
    status: "状态",
    format: "格式",
    created: "创建时间",
    reportType: "报告类型",
    depth: "深度",
    outputFormat: "输出格式",
    noReports: "未找到报告",
    generating: "生成中...",
    pending: "待处理",
    completed: "已完成",
    failed: "失败",
    summary: "摘要",
    detailed: "详细",
    full: "完整",
    markdown: "Markdown",
    json: "JSON",
    html: "HTML",
    loading: "加载报告...",
    generateReport: "生成报告",
    selectType: "选择报告类型",
    noContent: "报告内容不可用",
    close: "关闭",
    download: "下载",
    downloadFailed: "下载失败",
    actions: "操作",
  },
};

export function useReportsLocale(): ReportsLocale {
  const { locale } = useLanguage();
  return locales[locale];
}
