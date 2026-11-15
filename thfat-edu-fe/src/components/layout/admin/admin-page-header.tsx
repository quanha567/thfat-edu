import type { ReactNode } from "react";

export type TAdminPageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function AdminPageHeader({ title, description, actions }: TAdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-neutral-200/60 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800/80">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl dark:text-neutral-50">
          {title}
        </h1>
        {description && (
          <p className="text-body-sm text-neutral-500 dark:text-neutral-400">{description}</p>
        )}
      </div>

      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </div>
  );
}
