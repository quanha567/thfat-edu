"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ADMIN_ROUTE_LABELS } from "@/config/admin-nav.config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import { UserDropdown } from "../user-dropdown";

function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = segments.map((_, index) => {
    const path = `/${segments.slice(0, index + 1).join("/")}`;
    const label = ADMIN_ROUTE_LABELS[path] || segments[index];

    return { path, label };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList className="gap-1.5 sm:gap-2">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <Fragment key={crumb.path}>
              {index > 0 && (
                <BreadcrumbSeparator className="text-muted-foreground/50 [&>svg]:size-3.5" />
              )}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-foreground text-sm font-semibold tracking-tight">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={crumb.path}
                      className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function AdminHeader() {
  return (
    <header className="border-border/80 bg-background/95 sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b px-4 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground hover:bg-muted/60 -ml-1 size-8 rounded-lg transition-colors" />
        <Separator orientation="vertical" className="bg-border mr-2 h-4" />
        <AdminBreadcrumbs />
      </div>

      <div className="flex items-center gap-2">
        <UserDropdown variant="admin" />
      </div>
    </header>
  );
}
