import type { ReactNode } from "react";

export type TAdminPageHeaderProps = {
  title: string;
  badge?: ReactNode;
  description?: string;
  actions?: ReactNode;
};

export function AdminPageHeader({ title, badge, description, actions }: TAdminPageHeaderProps) {
  return (
    <div className="border-border/70 flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">{title}</h1>
          {badge}
        </div>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>

      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
