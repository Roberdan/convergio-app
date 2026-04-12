/**
 * Localized strings for Backup page.
 */
import { useLanguage, type SupportedLocale } from "@/lib/i18n/language-provider";

export interface BackupLocale {
  title: string;
  snapshots: string;
  createSnapshot: string;
  creating: string;
  retentionRules: string;
  noSnapshots: string;
  noRules: string;
  loading: string;
  id: string;
  label: string;
  createdAt: string;
  size: string;
  name: string;
  keepCount: string;
  maxAgeDays: string;
  enabled: string;
  totalSnapshots: string;
  totalSize: string;
  rulesActive: string;
  // Actions
  verify: string;
  restore: string;
  delete: string;
  purgeOld: string;
  actions: string;
  // Confirmation modals
  confirmRestore: string;
  confirmRestoreBody: string;
  confirmDelete: string;
  confirmDeleteBody: string;
  confirmPurge: string;
  confirmPurgeBody: string;
  confirm: string;
  cancel: string;
  // Toast messages
  verifyOk: string;
  verifyFail: string;
  restoreOk: string;
  restoreFail: string;
  deleteOk: string;
  deleteFail: string;
  purgeOkMsg: string;
  purgeFail: string;
  // Retention edit
  editRule: string;
  saveRule: string;
  saving: string;
  saveOk: string;
  saveFail: string;
}

const locales: Record<SupportedLocale, BackupLocale> = {
  en: {
    title: "Backup",
    snapshots: "Snapshots",
    createSnapshot: "Create Snapshot",
    creating: "Creating...",
    retentionRules: "Retention Rules",
    noSnapshots: "No snapshots available",
    noRules: "No retention rules configured",
    loading: "Loading backup data...",
    id: "ID",
    label: "Label",
    createdAt: "Created At",
    size: "Size",
    name: "Name",
    keepCount: "Keep Count",
    maxAgeDays: "Max Age (days)",
    enabled: "Enabled",
    totalSnapshots: "Total Snapshots",
    totalSize: "Total Size",
    rulesActive: "Rules Active",
    verify: "Verify",
    restore: "Restore",
    delete: "Delete",
    purgeOld: "Purge Old",
    actions: "Actions",
    confirmRestore: "Confirm Restore",
    confirmRestoreBody: "This will restore the selected snapshot. All current data will be replaced. Continue?",
    confirmDelete: "Confirm Delete",
    confirmDeleteBody: "This snapshot will be permanently deleted. This action cannot be undone.",
    confirmPurge: "Confirm Purge",
    confirmPurgeBody: "All snapshots exceeding retention rules will be deleted permanently.",
    confirm: "Confirm",
    cancel: "Cancel",
    verifyOk: "Snapshot verified successfully",
    verifyFail: "Verification failed",
    restoreOk: "Restore completed successfully",
    restoreFail: "Restore failed",
    deleteOk: "Snapshot deleted",
    deleteFail: "Delete failed",
    purgeOkMsg: "Purge completed",
    purgeFail: "Purge failed",
    editRule: "Edit",
    saveRule: "Save",
    saving: "Saving...",
    saveOk: "Rule updated",
    saveFail: "Save failed",
  },
  it: {
    title: "Backup",
    snapshots: "Snapshot",
    createSnapshot: "Crea Snapshot",
    creating: "Creazione...",
    retentionRules: "Regole di Conservazione",
    noSnapshots: "Nessuno snapshot disponibile",
    noRules: "Nessuna regola di conservazione configurata",
    loading: "Caricamento dati backup...",
    id: "ID",
    label: "Etichetta",
    createdAt: "Creato Il",
    size: "Dimensione",
    name: "Nome",
    keepCount: "Numero Copie",
    maxAgeDays: "Eta Massima (giorni)",
    enabled: "Attivo",
    totalSnapshots: "Snapshot Totali",
    totalSize: "Dimensione Totale",
    rulesActive: "Regole Attive",
    verify: "Verifica",
    restore: "Ripristina",
    delete: "Elimina",
    purgeOld: "Elimina Vecchi",
    actions: "Azioni",
    confirmRestore: "Conferma Ripristino",
    confirmRestoreBody: "Questo ripristinera lo snapshot selezionato. Tutti i dati attuali saranno sostituiti. Continuare?",
    confirmDelete: "Conferma Eliminazione",
    confirmDeleteBody: "Questo snapshot sara eliminato definitivamente. L'azione non puo essere annullata.",
    confirmPurge: "Conferma Pulizia",
    confirmPurgeBody: "Tutti gli snapshot che superano le regole di conservazione saranno eliminati definitivamente.",
    confirm: "Conferma",
    cancel: "Annulla",
    verifyOk: "Snapshot verificato con successo",
    verifyFail: "Verifica fallita",
    restoreOk: "Ripristino completato con successo",
    restoreFail: "Ripristino fallito",
    deleteOk: "Snapshot eliminato",
    deleteFail: "Eliminazione fallita",
    purgeOkMsg: "Pulizia completata",
    purgeFail: "Pulizia fallita",
    editRule: "Modifica",
    saveRule: "Salva",
    saving: "Salvataggio...",
    saveOk: "Regola aggiornata",
    saveFail: "Salvataggio fallito",
  },
  es: {
    title: "Respaldo",
    snapshots: "Instantaneas",
    createSnapshot: "Crear Instantanea",
    creating: "Creando...",
    retentionRules: "Reglas de Retencion",
    noSnapshots: "Sin instantaneas disponibles",
    noRules: "Sin reglas de retencion configuradas",
    loading: "Cargando datos de respaldo...",
    id: "ID",
    label: "Etiqueta",
    createdAt: "Creado El",
    size: "Tamano",
    name: "Nombre",
    keepCount: "Copias a Mantener",
    maxAgeDays: "Edad Maxima (dias)",
    enabled: "Activo",
    totalSnapshots: "Instantaneas Totales",
    totalSize: "Tamano Total",
    rulesActive: "Reglas Activas",
    verify: "Verificar",
    restore: "Restaurar",
    delete: "Eliminar",
    purgeOld: "Purgar Antiguos",
    actions: "Acciones",
    confirmRestore: "Confirmar Restauracion",
    confirmRestoreBody: "Esto restaurara la instantanea seleccionada. Todos los datos actuales seran reemplazados.",
    confirmDelete: "Confirmar Eliminacion",
    confirmDeleteBody: "Esta instantanea sera eliminada permanentemente. Esta accion no se puede deshacer.",
    confirmPurge: "Confirmar Purga",
    confirmPurgeBody: "Todas las instantaneas que superen las reglas de retencion seran eliminadas permanentemente.",
    confirm: "Confirmar",
    cancel: "Cancelar",
    verifyOk: "Instantanea verificada correctamente",
    verifyFail: "Verificacion fallida",
    restoreOk: "Restauracion completada",
    restoreFail: "Restauracion fallida",
    deleteOk: "Instantanea eliminada",
    deleteFail: "Eliminacion fallida",
    purgeOkMsg: "Purga completada",
    purgeFail: "Purga fallida",
    editRule: "Editar",
    saveRule: "Guardar",
    saving: "Guardando...",
    saveOk: "Regla actualizada",
    saveFail: "Error al guardar",
  },
  zh: {
    title: "备份",
    snapshots: "快照",
    createSnapshot: "创建快照",
    creating: "创建中...",
    retentionRules: "保留规则",
    noSnapshots: "没有可用快照",
    noRules: "没有配置保留规则",
    loading: "加载备份数据...",
    id: "ID",
    label: "标签",
    createdAt: "创建时间",
    size: "大小",
    name: "名称",
    keepCount: "保留数量",
    maxAgeDays: "最大天数",
    enabled: "启用",
    totalSnapshots: "快照总数",
    totalSize: "总大小",
    rulesActive: "活跃规则",
    verify: "验证",
    restore: "恢复",
    delete: "删除",
    purgeOld: "清理旧数据",
    actions: "操作",
    confirmRestore: "确认恢复",
    confirmRestoreBody: "这将恢复所选快照，当前所有数据将被替换。是否继续？",
    confirmDelete: "确认删除",
    confirmDeleteBody: "此快照将被永久删除，此操作无法撤销。",
    confirmPurge: "确认清理",
    confirmPurgeBody: "超出保留规则的所有快照将被永久删除。",
    confirm: "确认",
    cancel: "取消",
    verifyOk: "快照验证成功",
    verifyFail: "验证失败",
    restoreOk: "恢复完成",
    restoreFail: "恢复失败",
    deleteOk: "快照已删除",
    deleteFail: "删除失败",
    purgeOkMsg: "清理完成",
    purgeFail: "清理失败",
    editRule: "编辑",
    saveRule: "保存",
    saving: "保存中...",
    saveOk: "规则已更新",
    saveFail: "保存失败",
  },
};

export function useBackupLocale(): BackupLocale {
  const { locale } = useLanguage();
  return locales[locale];
}
