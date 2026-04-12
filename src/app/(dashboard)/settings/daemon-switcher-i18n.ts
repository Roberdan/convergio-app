/**
 * Localized strings for the Daemon Switcher component.
 */
import { useLanguage, type SupportedLocale } from '@/lib/i18n/language-provider';

export interface DaemonSwitcherLocale {
  title: string;
  noDaemons: string;
  active: string;
  switchTo: string;
  remove: string;
  addNew: string;
  labelPlaceholder: string;
  urlPlaceholder: string;
  add: string;
  fillBoth: string;
  connectionFailed: string;
}

const locales: Record<SupportedLocale, DaemonSwitcherLocale> = {
  en: {
    title: 'Daemon Connections',
    noDaemons: 'No daemon connections configured. Add one below.',
    active: 'Active',
    switchTo: 'Switch',
    remove: 'Remove connection',
    addNew: 'Add Connection',
    labelPlaceholder: 'Label (e.g. Production)',
    urlPlaceholder: 'http://localhost:8420',
    add: 'Add',
    fillBoth: 'Please fill in both label and URL.',
    connectionFailed: 'Connection test failed. Check the URL and try again.',
  },
  it: {
    title: 'Connessioni Daemon',
    noDaemons: 'Nessuna connessione daemon configurata. Aggiungine una.',
    active: 'Attivo',
    switchTo: 'Cambia',
    remove: 'Rimuovi connessione',
    addNew: 'Aggiungi Connessione',
    labelPlaceholder: 'Etichetta (es. Produzione)',
    urlPlaceholder: 'http://localhost:8420',
    add: 'Aggiungi',
    fillBoth: 'Compila sia etichetta che URL.',
    connectionFailed: 'Test di connessione fallito. Verifica l\'URL e riprova.',
  },
  es: {
    title: 'Conexiones Daemon',
    noDaemons: 'Sin conexiones daemon configuradas. Agrega una abajo.',
    active: 'Activo',
    switchTo: 'Cambiar',
    remove: 'Eliminar conexion',
    addNew: 'Agregar Conexion',
    labelPlaceholder: 'Etiqueta (ej. Produccion)',
    urlPlaceholder: 'http://localhost:8420',
    add: 'Agregar',
    fillBoth: 'Complete tanto la etiqueta como la URL.',
    connectionFailed: 'Prueba de conexion fallida. Verifique la URL e intente de nuevo.',
  },
  zh: {
    title: '守护进程连接',
    noDaemons: '未配置守护进程连接。在下方添加一个。',
    active: '活跃',
    switchTo: '切换',
    remove: '移除连接',
    addNew: '添加连接',
    labelPlaceholder: '标签（例如 生产环境）',
    urlPlaceholder: 'http://localhost:8420',
    add: '添加',
    fillBoth: '请填写标签和URL。',
    connectionFailed: '连接测试失败。请检查URL后重试。',
  },
};

export function useDaemonSwitcherLocale(): DaemonSwitcherLocale {
  const { locale } = useLanguage();
  return locales[locale];
}
