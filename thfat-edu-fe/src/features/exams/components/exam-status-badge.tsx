import { cn } from "cn";

import { EXAM_STATUS_CONFIG } from "../constants/exam.constants";
import { type TExamStatus } from "../types";

export type TExamStatusBadgeProps = {
  status: TExamStatus;
  className?: string;
  onToggleStatus?: () => void;
};

export function ExamStatusBadge({ status, className }: TExamStatusBadgeProps) {
  const config = EXAM_STATUS_CONFIG[status] ?? EXAM_STATUS_CONFIG.published;

  return (
    <div
      className={cn(
        "border-border bg-muted/40 inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        config.badgeClass,
        className,
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", config.dotClass)} />
      <span>{config.label}</span>
    </div>
  );
}
