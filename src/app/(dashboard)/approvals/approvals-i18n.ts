/**
 * Localized strings for Approvals page.
 */
import { useLanguage, type SupportedLocale } from "@/lib/i18n/language-provider";

export interface ApprovalsLocale {
  title: string;
  pending: string;
  action: string;
  requester: string;
  context: string;
  created: string;
  approve: string;
  reject: string;
  approving: string;
  rejecting: string;
  noApprovals: string;
  noEndpoint: string;
  approved: string;
  rejected: string;
  error: string;
}

const locales: Record<SupportedLocale, ApprovalsLocale> = {
  en: {
    title: "Approvals",
    pending: "Pending Approvals",
    action: "Action",
    requester: "Requester",
    context: "Context",
    created: "Created",
    approve: "Approve",
    reject: "Reject",
    approving: "Approving...",
    rejecting: "Rejecting...",
    noApprovals: "No pending approvals",
    noEndpoint: "No approvals endpoint available",
    approved: "Approved",
    rejected: "Rejected",
    error: "Error",
  },
  it: {
    title: "Approvazioni",
    pending: "Approvazioni in Attesa",
    action: "Azione",
    requester: "Richiedente",
    context: "Contesto",
    created: "Creato",
    approve: "Approva",
    reject: "Rifiuta",
    approving: "Approvazione...",
    rejecting: "Rifiuto...",
    noApprovals: "Nessuna approvazione in attesa",
    noEndpoint: "Endpoint approvazioni non disponibile",
    approved: "Approvato",
    rejected: "Rifiutato",
    error: "Errore",
  },
  es: {
    title: "Aprobaciones",
    pending: "Aprobaciones Pendientes",
    action: "Accion",
    requester: "Solicitante",
    context: "Contexto",
    created: "Creado",
    approve: "Aprobar",
    reject: "Rechazar",
    approving: "Aprobando...",
    rejecting: "Rechazando...",
    noApprovals: "Sin aprobaciones pendientes",
    noEndpoint: "Endpoint de aprobaciones no disponible",
    approved: "Aprobado",
    rejected: "Rechazado",
    error: "Error",
  },
  zh: {
    title: "审批",
    pending: "待审批",
    action: "操作",
    requester: "请求者",
    context: "上下文",
    created: "创建时间",
    approve: "批准",
    reject: "拒绝",
    approving: "批准中...",
    rejecting: "拒绝中...",
    noApprovals: "没有待审批项",
    noEndpoint: "审批端点不可用",
    approved: "已批准",
    rejected: "已拒绝",
    error: "错误",
  },
};

export function useApprovalsLocale(): ApprovalsLocale {
  const { locale } = useLanguage();
  return locales[locale];
}
