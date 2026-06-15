import { useCallback, useEffect, useState } from "react";

export type Priority = "high" | "mid" | "low";
export type Status = "todo" | "in-progress" | "done";

export type Course = {
  id: string;
  name: string;
  code: string;
};

export type Task = {
  id: string;
  title: string;
  courseId: string;
  due?: string; // ISO date
  priority: Priority;
  status: Status;
  createdAt: string;
};

const COURSES_KEY = "scholar.courses";
const TASKS_KEY = "scholar.tasks";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function makeCode(name: string): string {
  const cleaned = name.trim().replace(/[^a-zA-ZÀ-ÿ0-9 ]/g, "");
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "GEN";
  if (words.length === 1) return words[0].slice(0, 4).toUpperCase();
  return words.slice(0, 2).map((w) => w[0]).join("").toUpperCase() + words[0].slice(1, 3).toUpperCase();
}

const seedCourses: Course[] = [
  { id: "c-calc", name: "Cálculo II", code: "CALC" },
  { id: "c-prog", name: "Programação I", code: "PROG" },
  { id: "c-hist", name: "História da Arte", code: "HIST" },
  { id: "c-fis", name: "Física Quântica", code: "FISQ" },
];

function isoOffset(days: number) {
  const d = new Date();
  d.setHours(23, 59, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const seedTasks: Task[] = [
  { id: "t1", title: "Resolver Lista de Exercícios 04", courseId: "c-calc", due: isoOffset(0), priority: "high", status: "todo", createdAt: new Date().toISOString() },
  { id: "t2", title: "Implementar Árvore Binária de Busca", courseId: "c-prog", due: isoOffset(1), priority: "mid", status: "in-progress", createdAt: new Date().toISOString() },
  { id: "t3", title: "Leitura: O Renascimento em Itália", courseId: "c-hist", due: isoOffset(-2), priority: "low", status: "done", createdAt: new Date().toISOString() },
  { id: "t4", title: "Entrega de Projeto: Mecânica", courseId: "c-fis", due: isoOffset(5), priority: "high", status: "todo", createdAt: new Date().toISOString() },
  { id: "t5", title: "Exame Intermédio Cálculo", courseId: "c-calc", due: isoOffset(7), priority: "high", status: "todo", createdAt: new Date().toISOString() },
  { id: "t6", title: "Apresentação Seminário", courseId: "c-hist", due: isoOffset(12), priority: "mid", status: "todo", createdAt: new Date().toISOString() },
];

function ensureSeed() {
  if (!localStorage.getItem(COURSES_KEY)) write(COURSES_KEY, seedCourses);
  if (!localStorage.getItem(TASKS_KEY)) write(TASKS_KEY, seedTasks);
}

export function useStore() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    ensureSeed();
    setCourses(read<Course[]>(COURSES_KEY, []));
    setTasks(read<Task[]>(TASKS_KEY, []));
    setReady(true);
  }, []);

  const persistCourses = useCallback((c: Course[]) => {
    setCourses(c);
    write(COURSES_KEY, c);
  }, []);

  const persistTasks = useCallback((t: Task[]) => {
    setTasks(t);
    write(TASKS_KEY, t);
  }, []);

  const addCourse = (name: string) => {
    const c: Course = { id: crypto.randomUUID(), name: name.trim(), code: makeCode(name) };
    persistCourses([...courses, c]);
    return c;
  };
  const updateCourse = (id: string, patch: Partial<Course>) => {
    persistCourses(courses.map((c) => (c.id === id ? { ...c, ...patch, code: patch.name ? makeCode(patch.name) : c.code } : c)));
  };
  const deleteCourse = (id: string) => {
    persistCourses(courses.filter((c) => c.id !== id));
    persistTasks(tasks.filter((t) => t.courseId !== id));
  };

  const addTask = (input: Omit<Task, "id" | "createdAt">) => {
    const t: Task = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    persistTasks([t, ...tasks]);
    return t;
  };
  const updateTask = (id: string, patch: Partial<Task>) => {
    persistTasks(tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };
  const deleteTask = (id: string) => {
    persistTasks(tasks.filter((t) => t.id !== id));
  };
  const cycleStatus = (id: string) => {
    const order: Status[] = ["todo", "in-progress", "done"];
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    const next = order[(order.indexOf(t.status) + 1) % order.length];
    updateTask(id, { status: next });
  };

  return { ready, courses, tasks, addCourse, updateCourse, deleteCourse, addTask, updateTask, deleteTask, cycleStatus };
}
