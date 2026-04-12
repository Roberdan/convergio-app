/**
 * Localized strings for Inbox/Notifications page.
 */
import { useLanguage, type SupportedLocale } from "@/lib/i18n/language-provider";

export interface InboxLocale {
  title: string;
  queue: string;
  sendNotification: string;
  testTelegram: string;
  testing: string;
  channel: string;
  subject: string;
  body: string;
  recipient: string;
  status: string;
  createdAt: string;
  noNotifications: string;
  loading: string;
  send: string;
  sending: string;
  cancel: string;
  pending: string;
  sent: string;
  failed: string;
  totalPending: string;
  totalSent: string;
  totalFailed: string;
  channelPlaceholder: string;
  subjectPlaceholder: string;
  bodyPlaceholder: string;
  recipientPlaceholder: string;
}

const locales: Record<SupportedLocale, InboxLocale> = {
  en: {
    title: "Inbox",
    queue: "Notification Queue",
    sendNotification: "Send Notification",
    testTelegram: "Test Telegram",
    testing: "Testing...",
    channel: "Channel",
    subject: "Subject",
    body: "Body",
    recipient: "Recipient",
    status: "Status",
    createdAt: "Created At",
    noNotifications: "No notifications in queue",
    loading: "Loading notifications...",
    send: "Send",
    sending: "Sending...",
    cancel: "Cancel",
    pending: "Pending",
    sent: "Sent",
    failed: "Failed",
    totalPending: "Pending",
    totalSent: "Sent",
    totalFailed: "Failed",
    channelPlaceholder: "e.g. telegram, email, webhook",
    subjectPlaceholder: "Notification subject",
    bodyPlaceholder: "Notification message body...",
    recipientPlaceholder: "Optional recipient ID",
  },
  it: {
    title: "Posta",
    queue: "Coda Notifiche",
    sendNotification: "Invia Notifica",
    testTelegram: "Test Telegram",
    testing: "Test in corso...",
    channel: "Canale",
    subject: "Oggetto",
    body: "Corpo",
    recipient: "Destinatario",
    status: "Stato",
    createdAt: "Creato Il",
    noNotifications: "Nessuna notifica in coda",
    loading: "Caricamento notifiche...",
    send: "Invia",
    sending: "Invio...",
    cancel: "Annulla",
    pending: "In attesa",
    sent: "Inviato",
    failed: "Fallito",
    totalPending: "In Attesa",
    totalSent: "Inviati",
    totalFailed: "Falliti",
    channelPlaceholder: "es. telegram, email, webhook",
    subjectPlaceholder: "Oggetto notifica",
    bodyPlaceholder: "Corpo del messaggio di notifica...",
    recipientPlaceholder: "ID destinatario opzionale",
  },
  es: {
    title: "Bandeja",
    queue: "Cola de Notificaciones",
    sendNotification: "Enviar Notificacion",
    testTelegram: "Probar Telegram",
    testing: "Probando...",
    channel: "Canal",
    subject: "Asunto",
    body: "Cuerpo",
    recipient: "Destinatario",
    status: "Estado",
    createdAt: "Creado El",
    noNotifications: "Sin notificaciones en cola",
    loading: "Cargando notificaciones...",
    send: "Enviar",
    sending: "Enviando...",
    cancel: "Cancelar",
    pending: "Pendiente",
    sent: "Enviado",
    failed: "Fallido",
    totalPending: "Pendientes",
    totalSent: "Enviados",
    totalFailed: "Fallidos",
    channelPlaceholder: "ej. telegram, email, webhook",
    subjectPlaceholder: "Asunto de notificacion",
    bodyPlaceholder: "Cuerpo del mensaje de notificacion...",
    recipientPlaceholder: "ID de destinatario opcional",
  },
  zh: {
    title: "收件箱",
    queue: "通知队列",
    sendNotification: "发送通知",
    testTelegram: "测试 Telegram",
    testing: "测试中...",
    channel: "渠道",
    subject: "主题",
    body: "内容",
    recipient: "接收者",
    status: "状态",
    createdAt: "创建时间",
    noNotifications: "队列中没有通知",
    loading: "加载通知...",
    send: "发送",
    sending: "发送中...",
    cancel: "取消",
    pending: "待处理",
    sent: "已发送",
    failed: "失败",
    totalPending: "待处理",
    totalSent: "已发送",
    totalFailed: "失败",
    channelPlaceholder: "例如 telegram, email, webhook",
    subjectPlaceholder: "通知主题",
    bodyPlaceholder: "通知消息内容...",
    recipientPlaceholder: "可选接收者 ID",
  },
};

export function useInboxLocale(): InboxLocale {
  const { locale } = useLanguage();
  return locales[locale];
}
