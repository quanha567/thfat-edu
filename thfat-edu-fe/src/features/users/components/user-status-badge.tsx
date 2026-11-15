import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock, Trash2 } from "lucide-react";

export type TUserStatusBadgeProps = {
  isActive: boolean;
  deletedAt: string | null;
};

export function UserStatusBadge({ isActive, deletedAt }: TUserStatusBadgeProps) {
  if (deletedAt) {
    return (
      <Badge
        variant="outline"
        className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
      >
        <Trash2 className="mr-1 h-3 w-3 text-red-600 dark:text-red-400" />
        Đã xóa mềm
      </Badge>
    );
  }

  if (!isActive) {
    return (
      <Badge
        variant="outline"
        className="border-neutral-300 bg-neutral-100 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
      >
        <Lock className="mr-1 h-3 w-3 text-neutral-500" />
        Đã bị khóa
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
    >
      <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-600 dark:text-emerald-400" />
      Hoạt động
    </Badge>
  );
}
