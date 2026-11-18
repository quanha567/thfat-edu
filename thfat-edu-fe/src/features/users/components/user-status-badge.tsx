import { cn } from "cn";

export type TUserStatusBadgeProps = {
  isActive: boolean;
  deletedAt: string | null;
  className?: string;
};

export function UserStatusBadge({ isActive, deletedAt, className }: TUserStatusBadgeProps) {
  if (deletedAt) {
    return (
      <div
        className={cn(
          "border-border bg-muted/40 text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
          className,
        )}
      >
        <span className="size-1.5 shrink-0 rounded-full bg-neutral-400" />
        <span>Đã xóa</span>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div
        className={cn(
          "border-border bg-muted/40 inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium text-error-600 dark:text-error-400",
          className,
        )}
      >
        <span className="bg-error-500 size-1.5 shrink-0 rounded-full" />
        <span>Đã khóa</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-border bg-muted/40 text-foreground inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        className,
      )}
    >
      <span className="bg-success-500 size-1.5 shrink-0 rounded-full" />
      <span>Hoạt động</span>
    </div>
  );
}
