import { useT } from "@/lib/i18n";
import type { Course } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { Plus, Trash2, GraduationCap, BookMarked, Languages } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  courses: Course[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onAdd: (name: string) => void;
  onDelete: (id: string) => void;
};

export function CourseSidebar({ courses, selectedId, onSelect, onAdd, onDelete }: Props) {
  const { t, lang, setLang } = useT();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    onAdd(name);
    setName("");
    setOpen(false);
  };

  return (
    <aside className="w-72 border-r border-border flex flex-col p-6 sticky top-0 h-screen shrink-0">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="size-7 rounded-sm bg-foreground text-background flex items-center justify-center">
            <GraduationCap className="size-4" strokeWidth={2.2} />
          </div>
          <h1 className="text-xs font-bold tracking-widest uppercase">{t("appName")}</h1>
        </div>
        <p className="text-[10px] font-mono text-muted uppercase tracking-tighter italic pl-9">
          {t("semester")}
        </p>
      </div>

      <nav className="flex-1 space-y-8 overflow-y-auto">
        <section>
          <header className="flex justify-between items-end mb-4 border-b border-border pb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <BookMarked className="size-3" />
              {t("courses")}{" "}
              <span className="text-muted/60 font-normal italic">/ {t("coursesAlt")}</span>
            </span>
            <span className="font-mono text-[10px] text-muted">
              {String(courses.length).padStart(2, "0")}
            </span>
          </header>
          <ul className="space-y-1">
            <li
              className={cn(
                "group flex items-center justify-between py-1.5 px-2 rounded-sm cursor-pointer transition-colors",
                selectedId === null
                  ? "bg-foreground text-background"
                  : "hover:bg-black/5 text-muted",
              )}
              onClick={() => onSelect(null)}
            >
              <span className="text-sm font-medium">{t("allCourses")}</span>
              <span className="font-mono text-[10px] opacity-50">ALL</span>
            </li>
            {courses.map((c) => {
              const active = selectedId === c.id;
              return (
                <li
                  key={c.id}
                  className={cn(
                    "group flex items-center justify-between py-1.5 px-2 rounded-sm cursor-pointer transition-colors",
                    active ? "bg-foreground text-background" : "hover:bg-black/5 text-muted",
                  )}
                  onClick={() => onSelect(c.id)}
                >
                  <span className="text-sm font-medium truncate">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{c.code}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(c.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="delete"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="mt-4 w-full text-left text-[11px] font-mono text-muted hover:text-foreground flex items-center gap-1.5 px-2 py-1.5">
                <Plus className="size-3" />
                {t("addCourse")}
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("addCourse")}</DialogTitle>
              </DialogHeader>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("courseName")}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                autoFocus
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  {t("cancel")}
                </Button>
                <Button onClick={submit}>{t("save")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>
      </nav>

      <div className="mt-auto pt-6 border-t border-border flex justify-between items-center">
        <button
          onClick={() => setLang(lang === "pt" ? "en" : "pt")}
          className="text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 px-2 py-1 ring-1 ring-border rounded hover:bg-black/5"
        >
          <Languages className="size-3" />
          <span className={cn(lang === "pt" ? "text-foreground" : "text-muted")}>PT</span>
          <span className="w-px h-2 bg-border" />
          <span className={cn(lang === "en" ? "text-foreground" : "text-muted")}>EN</span>
        </button>
      </div>
    </aside>
  );
}
