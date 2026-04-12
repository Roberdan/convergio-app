import { useLanguage, type SupportedLocale } from "@/lib/i18n/language-provider";

export interface KnowledgeLocale {
  title: string;
  search: string;
  write: string;
  searchPlaceholder: string;
  key: string;
  value: string;
  namespace: string;
  created: string;
  updated: string;
  noResults: string;
  writeEntry: string;
  searchResults: string;
  submit: string;
  submitting: string;
  loading: string;
  writeSuccess: string;
  keyPlaceholder: string;
  valuePlaceholder: string;
  namespacePlaceholder: string;
  required: string;
  searchHint: string;
}

const locales: Record<SupportedLocale, KnowledgeLocale> = {
  en: {
    title: "Knowledge Base",
    search: "Search",
    write: "Write",
    searchPlaceholder: "Search knowledge entries...",
    key: "Key",
    value: "Value",
    namespace: "Namespace",
    created: "Created",
    updated: "Updated",
    noResults: "No results found",
    writeEntry: "Write Entry",
    searchResults: "Search Results",
    submit: "Save Entry",
    submitting: "Saving...",
    loading: "Loading knowledge base...",
    writeSuccess: "Entry saved successfully",
    keyPlaceholder: "e.g. project.config.timeout",
    valuePlaceholder: "Enter the value...",
    namespacePlaceholder: "e.g. default",
    required: "Required",
    searchHint: "Type at least 2 characters to search",
  },
  it: {
    title: "Base di Conoscenza",
    search: "Cerca",
    write: "Scrivi",
    searchPlaceholder: "Cerca nelle voci di conoscenza...",
    key: "Chiave",
    value: "Valore",
    namespace: "Namespace",
    created: "Creato",
    updated: "Aggiornato",
    noResults: "Nessun risultato trovato",
    writeEntry: "Scrivi Voce",
    searchResults: "Risultati Ricerca",
    submit: "Salva Voce",
    submitting: "Salvataggio...",
    loading: "Caricamento base di conoscenza...",
    writeSuccess: "Voce salvata con successo",
    keyPlaceholder: "es. project.config.timeout",
    valuePlaceholder: "Inserisci il valore...",
    namespacePlaceholder: "es. default",
    required: "Obbligatorio",
    searchHint: "Digita almeno 2 caratteri per cercare",
  },
  es: {
    title: "Base de Conocimiento",
    search: "Buscar",
    write: "Escribir",
    searchPlaceholder: "Buscar entradas de conocimiento...",
    key: "Clave",
    value: "Valor",
    namespace: "Espacio de nombres",
    created: "Creado",
    updated: "Actualizado",
    noResults: "Sin resultados",
    writeEntry: "Escribir Entrada",
    searchResults: "Resultados de Busqueda",
    submit: "Guardar Entrada",
    submitting: "Guardando...",
    loading: "Cargando base de conocimiento...",
    writeSuccess: "Entrada guardada exitosamente",
    keyPlaceholder: "ej. project.config.timeout",
    valuePlaceholder: "Ingresa el valor...",
    namespacePlaceholder: "ej. default",
    required: "Obligatorio",
    searchHint: "Escribe al menos 2 caracteres para buscar",
  },
  zh: {
    title: "知识库",
    search: "搜索",
    write: "写入",
    searchPlaceholder: "搜索知识条目...",
    key: "键",
    value: "值",
    namespace: "命名空间",
    created: "创建时间",
    updated: "更新时间",
    noResults: "未找到结果",
    writeEntry: "写入条目",
    searchResults: "搜索结果",
    submit: "保存条目",
    submitting: "保存中...",
    loading: "加载知识库...",
    writeSuccess: "条目保存成功",
    keyPlaceholder: "例如 project.config.timeout",
    valuePlaceholder: "输入值...",
    namespacePlaceholder: "例如 default",
    required: "必填",
    searchHint: "输入至少2个字符进行搜索",
  },
};

export function useKnowledgeLocale(): KnowledgeLocale {
  const { locale } = useLanguage();
  return locales[locale];
}
