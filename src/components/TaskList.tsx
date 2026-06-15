import { useT } from "@/lib/i18n";
import type { Course, Priority, Task } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { Trash2 } from "lucide-react";

type Props = {
  tasks: Task[];
  courses: Course[];
  onCycle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
};

const priorityClasses: Record<Priority, string> = {
  high: "text-priority-high",
  mid: "text-priority-mid",
  low: "text-priority-low",
};

function formatDue(iso: string, t: (k: any) => string) {
  const d = new Date(iso);
  if (isToday(d)) return `${t("today")}, ${format(d, "HH:mm")}`;
  if (isTomorrow(d)) return t("tomorrow");
  return format(d, "dd MMM");
}

export function TaskList({ tasks, courses, onCycle, onEdit, onDelete }: Props) {
  const { t } = useT();
  const courseMap = new Map(courses.map((c) => [c.id, c]));

  if (tasks.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-sm p-12 text-center text-sm text-muted">
        {t("noTasks")}
      </div>
    );
  }

  return (
    <div className="space-y-0.5 border border-border bg-border rounded-sm overflow-hidden">
      {tasks.map((task) => {
        const course = courseMap.get(task.courseId);
        const isDone = task.status === "done";
        const inProgress = task.status === "in-progress";
        const overdue = task.due && !isDone && isPast(new Date(task.due)) && !isToday(new Date(task.due));

        return (
          <div
            key={task.id}
            className={cn(
              "bg-white p-4 flex items-center group hover:bg-stone-50 transition-colors",
              isDone && "opacity-60",
            )}
          >
            <button
              onClick={() => onCycle(task.id)}
              className={cn(
                "w-6 h-6 rounded flex items-center justify-center mr-4 shrink-0 border-2 transition-colors",
                isDone
                  ? "bg-stone-100 border-stone-200"
                  : inProgress
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary",
              )}
              aria-label="toggle status"
            >
              {isDone && <span className="text-[10px] text-stone-500">✓</span>}
              {inProgress && <div className="size-2 bg-primary" />}
            </button>

            <button
              onClick={() => onEdit(task)}
              className="flex-1 text-left min-w-0"
            >
              <p className={cn("text-sm font-medium truncate", isDone && "line-through")}>
                {task.title}
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                {course && (
                  <span className="text-[9px] font-mono bg-stone-100 px-1.5 py-0.5 rounded text-muted">
                    {course.code}
                  </span>
                )}
                <span
                  className={cn(
                    "text-[9px] font-mono uppercase tracking-tighter",
                    isDone ? "text-stone-400" : priorityClasses[task.priority],
                  )}
                >
                  {t(task.priority === "high" ? "high" : task.priority === "mid" ? "mid" : "low")}
                </span>
                <span className="text-[9px] font-mono uppercase tracking-tighter text-muted">
                  {task.status === "todo"
                    ? t("todo")
                    : task.status === "in-progress"
                      ? t("inProgress")
                      : t("done")}
                </span>
              </div>
            </button>

            <div className="text-right font-mono mr-4">
              {task.due ? (
                <>
                  <p className="text-[10px] text-muted uppercase">{t("deadline")}</p>
                  <p
                    className={cn(
                      "text-xs",
                      overdue ? "font-bold text-priority-high" : "text-foreground",
                    )}
                  >
                    {formatDue(task.due, t)}
                  </p>
                </>
              ) : (
                <p className="text-[10px] text-muted italic">{t("noDate")}</p>
              )}
            </div>

            <button
              onClick={() => onDelete(task.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-priority-high"
              aria-label="delete"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
