import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CourseSidebar } from "@/components/CourseSidebar";
import { TaskList } from "@/components/TaskList";
import { UpcomingPanel } from "@/components/UpcomingPanel";
import { TaskDialog } from "@/components/TaskDialog";
import { useStore, type Task } from "@/lib/storage";
import { useT } from "@/lib/i18n";
import { Plus, ListChecks, Compass } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Scholar OS — Gestão de Tarefas para Estudantes" },
      { name: "description", content: "Gestor bilingue de tarefas, cadeiras e prazos para estudantes universitários. Funciona localmente, sem conta." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { t } = useT();
  const store = useStore();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [quickAdd, setQuickAdd] = useState("");
  const [editing, setEditing] = useState<Task | null>(null);

  const filtered = useMemo(() => {
    const arr = selectedCourse
      ? store.tasks.filter((task) => task.courseId === selectedCourse)
      : store.tasks;
    return [...arr].sort((a, b) => {
      if (a.status === "done" && b.status !== "done") return 1;
      if (b.status === "done" && a.status !== "done") return -1;
      const ad = a.due ? new Date(a.due).getTime() : Infinity;
      const bd = b.due ? new Date(b.due).getTime() : Infinity;
      return ad - bd;
    });
  }, [store.tasks, selectedCourse]);

  const selectedCourseObj = selectedCourse
    ? store.courses.find((c) => c.id === selectedCourse)
    : null;

  const handleQuickAdd = () => {
    const title = quickAdd.trim();
    if (!title) return;
    const courseId = selectedCourse ?? store.courses[0]?.id;
    if (!courseId) return;
    store.addTask({ title, courseId, priority: "mid", status: "todo" });
    setQuickAdd("");
  };

  if (!store.ready) return null;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 flex">
      <CourseSidebar
        courses={store.courses}
        selectedId={selectedCourse}
        onSelect={setSelectedCourse}
        onAdd={(name) => store.addCourse(name)}
        onDelete={(id) => {
          if (selectedCourse === id) setSelectedCourse(null);
          store.deleteCourse(id);
        }}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-border flex items-center justify-between px-10 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-muted uppercase leading-none mb-1 flex items-center gap-1.5">
              <Compass className="size-3" />
              {t("context")} <span className="italic text-[9px]">/ Context</span>
            </span>
            <h2 className="text-lg font-semibold tracking-tight">
              {selectedCourseObj?.name ?? t("overview")}{" "}
              {!selectedCourseObj && (
                <span className="text-muted/40 font-normal">/ {t("overviewAlt")}</span>
              )}
            </h2>
          </div>
          <div className="h-10 px-4 ring-1 ring-border rounded-sm flex items-center bg-white shadow-sm focus-within:ring-primary/60 transition">
            <Plus className="size-3.5 text-muted mr-2.5" />
            <input
              type="text"
              value={quickAdd}
              onChange={(e) => setQuickAdd(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
              placeholder={t("addTask")}
              className="text-sm bg-transparent outline-none w-72 placeholder:italic placeholder:text-muted/40"
            />
          </div>
        </header>

        <div className="p-10 flex gap-10 animate-in-up flex-1">
          <div className="flex-1 min-w-0 space-y-12">
            <section>
              <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted mb-6 flex items-center gap-4">
                <span className="inline-flex items-center gap-2">
                  <ListChecks className="size-3" />
                  {t("activeTasks")}{" "}
                  <span className="font-normal opacity-50">/ {t("activeTasksAlt")}</span>
                </span>
                <div className="h-px flex-1 bg-border/60" />
              </h3>
              <TaskList
                tasks={filtered}
                courses={store.courses}
                onCycle={store.cycleStatus}
                onEdit={setEditing}
                onDelete={store.deleteTask}
              />
            </section>
          </div>

          <div className="w-80 shrink-0 space-y-10">
            <UpcomingPanel tasks={store.tasks} />
          </div>
        </div>
      </main>

      <TaskDialog
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        task={editing}
        courses={store.courses}
        onSave={store.updateTask}
      />
    </div>
  );
}
