import { Badge } from "@/components/ui/badge";
import { GraduationCap, ShieldCheck, UserCheck } from "lucide-react";

import { USER_ROLE_LABELS } from "../constants";
import { type TUserRole } from "../types";

export type TUserRoleBadgeProps = {
  role: TUserRole;
};

export function UserRoleBadge({ role }: TUserRoleBadgeProps) {
  if (role === "admin") {
    return (
      <Badge
        variant="outline"
        className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
      >
        <ShieldCheck className="mr-1 h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
        {USER_ROLE_LABELS.admin}
      </Badge>
    );
  }

  if (role === "teacher") {
    return (
      <Badge
        variant="outline"
        className="border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300"
      >
        <GraduationCap className="mr-1 h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
        {USER_ROLE_LABELS.teacher}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300"
    >
      <UserCheck className="mr-1 h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
      {USER_ROLE_LABELS.student}
    </Badge>
  );
}
