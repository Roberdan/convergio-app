/**
 * Localized strings for Prompt Studio page.
 */
import { useLanguage, type SupportedLocale } from "@/lib/i18n/language-provider";

export interface PromptsLocale {
  title: string;
  newPrompt: string;
  prompts: string;
  skills: string;
  promptTemplates: string;
  skillRegistry: string;
  name: string;
  version: string;
  active: string;
  inactive: string;
  created: string;
  skill: string;
  description: string;
  category: string;
  noPrompts: string;
  noSkills: string;
  searchSkills: string;
  template: string;
  estimatedTokens: string;
  cancel: string;
  create: string;
  creating: string;
  delete: string;
  deleteConfirm: string;
  namePlaceholder: string;
  templatePlaceholder: string;
}

const locales: Record<SupportedLocale, PromptsLocale> = {
  en: {
    title: "Prompt Studio",
    newPrompt: "New Prompt",
    prompts: "Prompts",
    skills: "Skills",
    promptTemplates: "Prompt Templates",
    skillRegistry: "Skill Registry",
    name: "Name",
    version: "Version",
    active: "Active",
    inactive: "Inactive",
    created: "Created",
    skill: "Skill",
    description: "Description",
    category: "Category",
    noPrompts: "No prompt templates",
    noSkills: "No skills found",
    searchSkills: "Search skills...",
    template: "Template",
    estimatedTokens: "estimated tokens",
    cancel: "Cancel",
    create: "Create",
    creating: "Creating...",
    delete: "Delete",
    deleteConfirm: "Delete this prompt template?",
    namePlaceholder: "e.g. research-agent-v2",
    templatePlaceholder: "You are a {{role}} agent. Your task is to...",
  },
  it: {
    title: "Studio Prompt",
    newPrompt: "Nuovo Prompt",
    prompts: "Prompt",
    skills: "Competenze",
    promptTemplates: "Template Prompt",
    skillRegistry: "Registro Competenze",
    name: "Nome",
    version: "Versione",
    active: "Attivo",
    inactive: "Inattivo",
    created: "Creato",
    skill: "Competenza",
    description: "Descrizione",
    category: "Categoria",
    noPrompts: "Nessun template prompt",
    noSkills: "Nessuna competenza trovata",
    searchSkills: "Cerca competenze...",
    template: "Template",
    estimatedTokens: "token stimati",
    cancel: "Annulla",
    create: "Crea",
    creating: "Creazione...",
    delete: "Elimina",
    deleteConfirm: "Eliminare questo template prompt?",
    namePlaceholder: "es. research-agent-v2",
    templatePlaceholder: "Sei un agente {{role}}. Il tuo compito e...",
  },
  es: {
    title: "Estudio de Prompts",
    newPrompt: "Nuevo Prompt",
    prompts: "Prompts",
    skills: "Habilidades",
    promptTemplates: "Plantillas de Prompt",
    skillRegistry: "Registro de Habilidades",
    name: "Nombre",
    version: "Version",
    active: "Activo",
    inactive: "Inactivo",
    created: "Creado",
    skill: "Habilidad",
    description: "Descripcion",
    category: "Categoria",
    noPrompts: "Sin plantillas de prompt",
    noSkills: "Sin habilidades encontradas",
    searchSkills: "Buscar habilidades...",
    template: "Plantilla",
    estimatedTokens: "tokens estimados",
    cancel: "Cancelar",
    create: "Crear",
    creating: "Creando...",
    delete: "Eliminar",
    deleteConfirm: "Eliminar esta plantilla?",
    namePlaceholder: "ej. research-agent-v2",
    templatePlaceholder: "Eres un agente {{role}}. Tu tarea es...",
  },
  zh: {
    title: "提示工作室",
    newPrompt: "新建提示",
    prompts: "提示",
    skills: "技能",
    promptTemplates: "提示模板",
    skillRegistry: "技能注册表",
    name: "名称",
    version: "版本",
    active: "活跃",
    inactive: "未激活",
    created: "创建时间",
    skill: "技能",
    description: "描述",
    category: "类别",
    noPrompts: "没有提示模板",
    noSkills: "没有找到技能",
    searchSkills: "搜索技能...",
    template: "模板",
    estimatedTokens: "预估令牌",
    cancel: "取消",
    create: "创建",
    creating: "创建中...",
    delete: "删除",
    deleteConfirm: "删除此提示模板?",
    namePlaceholder: "例如 research-agent-v2",
    templatePlaceholder: "你是一个 {{role}} 代理. 你的任务是...",
  },
};

export function usePromptsLocale(): PromptsLocale {
  const { locale } = useLanguage();
  return locales[locale];
}
