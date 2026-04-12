import { useLanguage, type SupportedLocale } from "@/lib/i18n/language-provider";

export interface MeshLocale {
  title: string;
  totalPeers: string;
  online: string;
  offline: string;
  totalSynced: string;
  networkTopology: string;
  peerVersions: string;
  allPeers: string;
  recentActivity: string;
  nodeReadiness: string;
  noPeers: string;
  noPeerActivity: string;
  unknown: string;
  loading: string;
  thisNode: string;
  ready: string;
  notReady: string;
  check: string;
  onlineCount: (on: number, total: number) => string;
}

const locales: Record<SupportedLocale, MeshLocale> = {
  en: {
    title: "Mesh Network",
    totalPeers: "Total Peers",
    online: "Online",
    offline: "Offline",
    totalSynced: "Total Synced",
    networkTopology: "Network Topology",
    peerVersions: "Peer Versions",
    allPeers: "All Peers",
    recentActivity: "Recent Activity",
    nodeReadiness: "Node Readiness",
    noPeers: "No peers discovered",
    noPeerActivity: "No peer activity",
    unknown: "unknown",
    loading: "Loading mesh peers...",
    thisNode: "This Node",
    ready: "Ready",
    notReady: "Not Ready",
    check: "Check",
    onlineCount: (on, total) => `${on}/${total} online`,
  },
  it: {
    title: "Rete Mesh",
    totalPeers: "Peer Totali",
    online: "Online",
    offline: "Offline",
    totalSynced: "Sincronizzati",
    networkTopology: "Topologia di Rete",
    peerVersions: "Versioni Peer",
    allPeers: "Tutti i Peer",
    recentActivity: "Attivita Recente",
    nodeReadiness: "Prontezza Nodo",
    noPeers: "Nessun peer trovato",
    noPeerActivity: "Nessuna attivita peer",
    unknown: "sconosciuto",
    loading: "Caricamento peer mesh...",
    thisNode: "Questo Nodo",
    ready: "Pronto",
    notReady: "Non Pronto",
    check: "Controllo",
    onlineCount: (on, total) => `${on}/${total} online`,
  },
  es: {
    title: "Red Mesh",
    totalPeers: "Peers Totales",
    online: "En linea",
    offline: "Desconectado",
    totalSynced: "Sincronizados",
    networkTopology: "Topologia de Red",
    peerVersions: "Versiones de Peer",
    allPeers: "Todos los Peers",
    recentActivity: "Actividad Reciente",
    nodeReadiness: "Disponibilidad del Nodo",
    noPeers: "No se encontraron peers",
    noPeerActivity: "Sin actividad de peers",
    unknown: "desconocido",
    loading: "Cargando peers mesh...",
    thisNode: "Este Nodo",
    ready: "Listo",
    notReady: "No Listo",
    check: "Verificacion",
    onlineCount: (on, total) => `${on}/${total} en linea`,
  },
  zh: {
    title: "Mesh 网络",
    totalPeers: "总节点数",
    online: "在线",
    offline: "离线",
    totalSynced: "已同步",
    networkTopology: "网络拓扑",
    peerVersions: "节点版本",
    allPeers: "所有节点",
    recentActivity: "最近活动",
    nodeReadiness: "节点就绪状态",
    noPeers: "未发现节点",
    noPeerActivity: "无节点活动",
    unknown: "未知",
    loading: "加载 mesh 节点...",
    thisNode: "本节点",
    ready: "就绪",
    notReady: "未就绪",
    check: "检查",
    onlineCount: (on, total) => `${on}/${total} 在线`,
  },
};

export function useMeshLocale(): MeshLocale {
  const { locale } = useLanguage();
  return locales[locale];
}
