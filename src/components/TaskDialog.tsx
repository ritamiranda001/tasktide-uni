import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useT } from "@/lib/i18n";
import type { Course, Priority, Status, Task } from "@/lib/storage";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  courses: Course[];
  onSave: (id: string, patch: Partial<Task>) => void;
};

export function TaskDialog({ open, onOpenChange, task, courses, onSave }: Props) {
  const { t } = useT();
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [priority, setPriority] = useState<Priority>("mid");
  const [status, setStatus] = useState<Status>("todo");
  const [due, setDue] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setCourseId(task.courseId);
      setPriority(task.priority);
      setStatus(task.status);
      setDue(task.due ? new Date(task.due) : undefined);
    }
  }, [task]);

  if (!task) return null;

  const save = () => {
    onSave(task.id, {
      title: title.trim() || task.title,
      courseId,
      priority,
      status,
      due: due ? due.toISOString() : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("edit")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest text-muted">{t("title")}</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest text-muted">{t("course")}</Label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest text-muted">{t("deadline")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start font-normal", !due && "text-muted")}>
                    <CalendarIcon className="mr-2 size-4" />
                    {due ? format(due, "dd MMM yyyy") : t("pickDate")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={due} onSelect={setDue} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest text-muted">{t("priority")}</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">{t("high")}</SelectItem>
                  <SelectItem value="mid">{t("mid")}</SelectItem>
                  <SelectItem value="low">{t("low")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest text-muted">{t("status")}</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">{t("todo")}</SelectItem>
                  <SelectItem value="in-progress">{t("inProgress")}</SelectItem>
                  <SelectItem value="done">{t("done")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
          <Button onClick={save}>{t("save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
