/**
 * Localized strings for Plans page.
 */
import { useLanguage, type SupportedLocale } from "@/lib/i18n/language-provider";

export interface PlansLocale {
  title: string;
  allPlans: string;
  newPlan: string;
  executionTree: string;
  plan: string;
  project: string;
  status: string;
  done: string;
  total: string;
  created: string;
  name: string;
  projectId: string;
  cancel: string;
  create: string;
  creating: string;
  noPlans: string;
  noWaves: string;
  progress: string;
  tasks: string;
  createPlan: string;
}

const locales: Record<SupportedLocale, PlansLocale> = {
  en: {
    title: "Plans & Tasks",
    allPlans: "All Plans",
    newPlan: "New Plan",
    executionTree: "Execution Tree",
    plan: "Plan",
    project: "Project",
    status: "Status",
    done: "Done",
    total: "Total",
    created: "Created",
    name: "Name",
    projectId: "Project ID",
    cancel: "Cancel",
    create: "Create",
    creating: "Creating...",
    noPlans: "No plans found",
    noWaves: "No waves in this plan",
    progress: "Progress",
    tasks: "tasks",
    createPlan: "Create Plan",
  },
  it: {
    title: "Piani e Task",
    allPlans: "Tutti i Piani",
    newPlan: "Nuovo Piano",
    executionTree: "Albero di Esecuzione",
    plan: "Piano",
    project: "Progetto",
    status: "Stato",
    done: "Fatti",
    total: "Totale",
    created: "Creato",
    name: "Nome",
    projectId: "ID Progetto",
    cancel: "Annulla",
    create: "Crea",
    creating: "Creazione...",
    noPlans: "Nessun piano trovato",
    noWaves: "Nessuna wave in questo piano",
    progress: "Progresso",
    tasks: "task",
    createPlan: "Crea Piano",
  },
  es: {
    title: "Planes y Tareas",
    allPlans: "Todos los Planes",
    newPlan: "Nuevo Plan",
    executionTree: "Arbol de Ejecucion",
    plan: "Plan",
    project: "Proyecto",
    status: "Estado",
    done: "Hechos",
    total: "Total",
    created: "Creado",
    name: "Nombre",
    projectId: "ID de Proyecto",
    cancel: "Cancelar",
    create: "Crear",
    creating: "Creando...",
    noPlans: "Sin planes",
    noWaves: "Sin waves en este plan",
    progress: "Progreso",
    tasks: "tareas",
    createPlan: "Crear Plan",
  },
  zh: {
    title: "计划和任务",
    allPlans: "所有计划",
    newPlan: "新计划",
    executionTree: "执行树",
    plan: "计划",
    project: "项目",
    status: "状态",
    done: "完成",
    total: "总计",
    created: "创建时间",
    name: "名称",
    projectId: "项目ID",
    cancel: "取消",
    create: "创建",
    creating: "创建中...",
    noPlans: "没有找到计划",
    noWaves: "此计划中没有wave",
    progress: "进度",
    tasks: "任务",
    createPlan: "创建计划",
  },
};

export function usePlansLocale(): PlansLocale {
  const { locale } = useLanguage();
  return locales[locale];
}
