import { cn } from "cn";

import { USER_ROLE_LABELS } from "../constants";
import { type TUserRole } from "../types";

export type TUserRoleBadgeProps = {
  role: TUserRole;
  className?: string;
};

export function UserRoleBadge({ role, className }: TUserRoleBadgeProps) {
  return (
    <span
      className={cn(
        "border-border bg-secondary/60 text-secondary-foreground inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        className,
      )}
    >
      {USER_ROLE_LABELS[role] ?? role}
    </span>
  );
}
