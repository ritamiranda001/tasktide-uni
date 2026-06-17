import { useT } from "@/lib/i18n";
import type { Task } from "@/lib/storage";
import { format, isToday, isTomorrow } from "date-fns";
import { CalendarClock, Sparkles } from "lucide-react";

type Props = {
  tasks: Task[];
};

export function UpcomingPanel({ tasks }: Props) {
  const { t } = useT();
  const upcoming = tasks
    .filter((x) => x.due && x.status !== "done")
    .sort((a, b) => new Date(a.due!).getTime() - new Date(b.due!).getTime())
    .slice(0, 6);

  return (
    <section>
      <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted mb-6 flex items-center gap-2">
        <CalendarClock className="size-3" />
        {t("upcoming")}{" "}
        <span className="font-normal opacity-50">/ {t("upcomingAlt")}</span>
      </h3>
      {upcoming.length === 0 ? (
        <p className="text-xs text-muted italic inline-flex items-center gap-2">
          <Sparkles className="size-3" />
          {t("noUpcoming")}
        </p>
      ) : (
        <div className="space-y-4">
          {upcoming.map((task) => {
            const d = new Date(task.due!);
            const label = isToday(d)
              ? t("today")
              : isTomorrow(d)
                ? t("tomorrow")
                : format(d, "dd MMM").toUpperCase();
            const highlight = isToday(d) || isTomorrow(d);
            return (
              <div
                key={task.id}
                className="relative pl-6 before:absolute before:left-0 before:top-1 before:bottom-1 before:w-px before:bg-border"
              >
                <p
                  className={`text-[10px] font-mono uppercase mb-1 ${highlight ? "text-primary font-bold" : "text-muted"}`}
                >
                  {label}
                </p>
                <p className="text-xs font-medium">{task.title}</p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
