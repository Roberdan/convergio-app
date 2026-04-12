/**
 * Localized strings for Deployments page.
 */
import { useLanguage, type SupportedLocale } from "@/lib/i18n/language-provider";

export interface DeployLocale {
  title: string;
  currentStatus: string;
  version: string;
  status: string;
  uptime: string;
  lastDeploy: string;
  environment: string;
  upgrade: string;
  upgrading: string;
  upgradeConfirm: string;
  history: string;
  duration: string;
  triggeredBy: string;
  deployedAt: string;
  noHistory: string;
  loading: string;
  rollback: string;
  rollingBack: string;
  rollbackConfirmTitle: string;
  rollbackConfirmBody: string;
  rollbackConfirm: string;
  rollbackCancel: string;
  rollbackSuccess: string;
  rollbackError: string;
  actions: string;
}

const locales: Record<SupportedLocale, DeployLocale> = {
  en: {
    title: "Deployments",
    currentStatus: "Current Status",
    version: "Version",
    status: "Status",
    uptime: "Uptime",
    lastDeploy: "Last Deploy",
    environment: "Environment",
    upgrade: "Upgrade",
    upgrading: "Upgrading...",
    upgradeConfirm: "Start upgrade to latest version?",
    history: "Deploy History",
    duration: "Duration (s)",
    triggeredBy: "Triggered By",
    deployedAt: "Deployed At",
    noHistory: "No deployment history",
    loading: "Loading deploy status...",
    rollback: "Rollback",
    rollingBack: "Rolling back...",
    rollbackConfirmTitle: "Confirm Rollback",
    rollbackConfirmBody: "Are you sure you want to rollback to version",
    rollbackConfirm: "Confirm Rollback",
    rollbackCancel: "Cancel",
    rollbackSuccess: "Rollback initiated successfully",
    rollbackError: "Failed to initiate rollback",
    actions: "Actions",
  },
  it: {
    title: "Distribuzioni",
    currentStatus: "Stato Attuale",
    version: "Versione",
    status: "Stato",
    uptime: "Uptime",
    lastDeploy: "Ultimo Deploy",
    environment: "Ambiente",
    upgrade: "Aggiorna",
    upgrading: "Aggiornamento...",
    upgradeConfirm: "Avviare aggiornamento all'ultima versione?",
    history: "Storico Deploy",
    duration: "Durata (s)",
    triggeredBy: "Avviato Da",
    deployedAt: "Data Deploy",
    noHistory: "Nessuno storico deploy",
    loading: "Caricamento stato deploy...",
    rollback: "Rollback",
    rollingBack: "Rollback in corso...",
    rollbackConfirmTitle: "Conferma Rollback",
    rollbackConfirmBody: "Sei sicuro di voler fare rollback alla versione",
    rollbackConfirm: "Conferma Rollback",
    rollbackCancel: "Annulla",
    rollbackSuccess: "Rollback avviato con successo",
    rollbackError: "Errore nell'avvio del rollback",
    actions: "Azioni",
  },
  es: {
    title: "Despliegues",
    currentStatus: "Estado Actual",
    version: "Version",
    status: "Estado",
    uptime: "Tiempo Activo",
    lastDeploy: "Ultimo Despliegue",
    environment: "Entorno",
    upgrade: "Actualizar",
    upgrading: "Actualizando...",
    upgradeConfirm: "Iniciar actualizacion a la ultima version?",
    history: "Historial de Despliegues",
    duration: "Duracion (s)",
    triggeredBy: "Iniciado Por",
    deployedAt: "Fecha Despliegue",
    noHistory: "Sin historial de despliegues",
    loading: "Cargando estado de despliegue...",
    rollback: "Revertir",
    rollingBack: "Revirtiendo...",
    rollbackConfirmTitle: "Confirmar Reversion",
    rollbackConfirmBody: "Esta seguro de que desea revertir a la version",
    rollbackConfirm: "Confirmar Reversion",
    rollbackCancel: "Cancelar",
    rollbackSuccess: "Reversion iniciada correctamente",
    rollbackError: "Error al iniciar la reversion",
    actions: "Acciones",
  },
  zh: {
    title: "部署",
    currentStatus: "当前状态",
    version: "版本",
    status: "状态",
    uptime: "运行时间",
    lastDeploy: "最后部署",
    environment: "环境",
    upgrade: "升级",
    upgrading: "升级中...",
    upgradeConfirm: "确认升级到最新版本?",
    history: "部署历史",
    duration: "持续时间 (秒)",
    triggeredBy: "触发者",
    deployedAt: "部署时间",
    noHistory: "没有部署历史",
    loading: "加载部署状态...",
    rollback: "回滚",
    rollingBack: "回滚中...",
    rollbackConfirmTitle: "确认回滚",
    rollbackConfirmBody: "确定要回滚到版本",
    rollbackConfirm: "确认回滚",
    rollbackCancel: "取消",
    rollbackSuccess: "回滚已成功启动",
    rollbackError: "启动回滚失败",
    actions: "操作",
  },
};

export function useDeployLocale(): DeployLocale {
  const { locale } = useLanguage();
  return locales[locale];
}
