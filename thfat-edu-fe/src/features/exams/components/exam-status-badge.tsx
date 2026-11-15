import { Switch } from "@/components/ui/switch";
import { cn } from "cn";

import { EXAM_STATUS_CONFIG } from "../constants/exam.constants";
import { type TExamStatus } from "../types";

export type TExamStatusBadgeProps = {
  status: TExamStatus;
  className?: string;
  onToggleStatus?: () => void;
};

export function ExamStatusBadge({ status, className, onToggleStatus }: TExamStatusBadgeProps) {
  if (status === "archived") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 text-xs font-medium text-muted-foreground",
          className,
        )}
      >
        <Switch checked={false} onCheckedChange={onToggleStatus} size="sm" />
        <span>Tạm dừng</span>
      </div>
    );
  }

  const config = EXAM_STATUS_CONFIG[status] ?? EXAM_STATUS_CONFIG.published;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        config.badgeClass,
        className,
      )}
    >
      <span className={cn("size-2 shrink-0 rounded-full", config.dotClass)} />
      <span>{config.label}</span>
    </div>
  );
}
