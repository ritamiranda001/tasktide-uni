import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "pt" | "en";

const dict = {
  pt: {
    appName: "Scholar OS",
    semester: "v1.0 / Semestre",
    courses: "Cadeiras",
    coursesAlt: "Courses",
    addCourse: "+ Nova cadeira",
    context: "Contexto",
    overview: "Visão Geral",
    overviewAlt: "Overview",
    addTask: "Adicionar tarefa...",
    activeTasks: "Tarefas Ativas",
    activeTasksAlt: "Active Tasks",
    upcoming: "Próximas Datas",
    upcomingAlt: "Upcoming",
    allCourses: "Todas as cadeiras",
    deadline: "Prazo",
    today: "Hoje",
    tomorrow: "Amanhã",
    noDate: "Sem prazo",
    priority: "Prioridade",
    status: "Estado",
    high: "Alta",
    mid: "Média",
    low: "Baixa",
    todo: "A fazer",
    inProgress: "Em curso",
    done: "Concluído",
    course: "Cadeira",
    title: "Título",
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Apagar",
    edit: "Editar",
    courseName: "Nome da cadeira",
    courseCode: "Código",
    noTasks: "Sem tarefas. Adiciona uma acima.",
    noUpcoming: "Sem datas próximas.",
    pickDate: "Escolher data",
    empty: "Nada por aqui ainda",
    confirmDelete: "Apagar este item?",
  },
  en: {
    appName: "Scholar OS",
    semester: "v1.0 / Semester",
    courses: "Courses",
    coursesAlt: "Cadeiras",
    addCourse: "+ New course",
    context: "Context",
    overview: "Overview",
    overviewAlt: "Visão Geral",
    addTask: "Add task...",
    activeTasks: "Active Tasks",
    activeTasksAlt: "Tarefas Ativas",
    upcoming: "Upcoming",
    upcomingAlt: "Próximas Datas",
    allCourses: "All courses",
    deadline: "Deadline",
    today: "Today",
    tomorrow: "Tomorrow",
    noDate: "No deadline",
    priority: "Priority",
    status: "Status",
    high: "High",
    mid: "Medium",
    low: "Low",
    todo: "To do",
    inProgress: "In progress",
    done: "Done",
    course: "Course",
    title: "Title",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    courseName: "Course name",
    courseCode: "Code",
    noTasks: "No tasks. Add one above.",
    noUpcoming: "No upcoming deadlines.",
    pickDate: "Pick a date",
    empty: "Nothing here yet",
    confirmDelete: "Delete this item?",
  },
} as const;

export type TKey = keyof typeof dict["pt"];

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string };
const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  useEffect(() => {
    const stored = localStorage.getItem("scholar.lang") as Lang | null;
    if (stored === "pt" || stored === "en") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("scholar.lang", l);
  };

  const t = (k: TKey) => dict[lang][k];

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export function useT() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useT must be used inside LangProvider");
  return ctx;
}
