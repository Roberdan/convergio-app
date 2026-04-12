/**
 * Localized strings for Doctor page.
 */
import { useLanguage, type SupportedLocale } from "@/lib/i18n/language-provider";

export interface DoctorLocale {
  title: string;
  runDoctor: string;
  running: string;
  summary: string;
  issues: string;
  totalChecks: string;
  passed: string;
  warned: string;
  failed: string;
  lastRun: string;
  checkName: string;
  severity: string;
  message: string;
  detectedAt: string;
  noIssues: string;
  loading: string;
  allPassed: string;
}

const locales: Record<SupportedLocale, DoctorLocale> = {
  en: {
    title: "Doctor",
    runDoctor: "Run Doctor",
    running: "Running...",
    summary: "Summary",
    issues: "Issues",
    totalChecks: "Total Checks",
    passed: "Passed",
    warned: "Warned",
    failed: "Failed",
    lastRun: "Last Run",
    checkName: "Check",
    severity: "Severity",
    message: "Message",
    detectedAt: "Detected At",
    noIssues: "No issues found",
    loading: "Loading doctor data...",
    allPassed: "All checks passed",
  },
  it: {
    title: "Dottore",
    runDoctor: "Esegui Dottore",
    running: "In esecuzione...",
    summary: "Riepilogo",
    issues: "Problemi",
    totalChecks: "Controlli Totali",
    passed: "Superati",
    warned: "Avvertimenti",
    failed: "Falliti",
    lastRun: "Ultima Esecuzione",
    checkName: "Controllo",
    severity: "Gravita",
    message: "Messaggio",
    detectedAt: "Rilevato Il",
    noIssues: "Nessun problema trovato",
    loading: "Caricamento dati dottore...",
    allPassed: "Tutti i controlli superati",
  },
  es: {
    title: "Doctor",
    runDoctor: "Ejecutar Doctor",
    running: "Ejecutando...",
    summary: "Resumen",
    issues: "Problemas",
    totalChecks: "Comprobaciones Totales",
    passed: "Aprobados",
    warned: "Advertencias",
    failed: "Fallidos",
    lastRun: "Ultima Ejecucion",
    checkName: "Comprobacion",
    severity: "Gravedad",
    message: "Mensaje",
    detectedAt: "Detectado El",
    noIssues: "Sin problemas encontrados",
    loading: "Cargando datos del doctor...",
    allPassed: "Todas las comprobaciones superadas",
  },
  zh: {
    title: "诊断",
    runDoctor: "运行诊断",
    running: "运行中...",
    summary: "概要",
    issues: "问题",
    totalChecks: "总检查数",
    passed: "通过",
    warned: "警告",
    failed: "失败",
    lastRun: "最后执行",
    checkName: "检查项",
    severity: "严重性",
    message: "消息",
    detectedAt: "检测时间",
    noIssues: "没有发现问题",
    loading: "加载诊断数据...",
    allPassed: "所有检查通过",
  },
};

export function useDoctorLocale(): DoctorLocale {
  const { locale } = useLanguage();
  return locales[locale];
}
