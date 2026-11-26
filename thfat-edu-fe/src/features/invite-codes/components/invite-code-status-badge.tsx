import { cn } from "cn";

import { INVITE_CODE_STATUS_LABELS } from "../constants";
import { type TInviteCodeStatus } from "../types";

const DOT_CLASSES: Record<TInviteCodeStatus, string> = {
  active: "bg-success-500",
  used: "bg-primary-500",
  expired: "bg-neutral-400",
  revoked: "bg-error-500",
};

export type TInviteCodeStatusBadgeProps = {
  status: TInviteCodeStatus;
  className?: string;
};

export function InviteCodeStatusBadge({ status, className }: TInviteCodeStatusBadgeProps) {
  return (
    <div
      className={cn(
        "border-border bg-muted/40 text-foreground inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        className,
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", DOT_CLASSES[status])} />
      <span>{INVITE_CODE_STATUS_LABELS[status]}</span>
    </div>
  );
}
