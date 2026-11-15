"use client";

import { BaseAvatar } from "@/components/base";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ADMIN_ROUTE_LABELS } from "@/config/admin-nav.config";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { ChevronDown, Home, LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

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
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/"
              className="hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 text-neutral-500 transition-colors dark:text-neutral-400"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="sr-only">Trang chủ</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <Fragment key={crumb.path}>
              <BreadcrumbSeparator className="text-neutral-400" />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-primary-900 font-semibold dark:text-neutral-100">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={crumb.path}
                      className="hover:text-primary-700 dark:hover:text-primary-300 text-neutral-500 transition-colors dark:text-neutral-400"
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

function AdminUserMenu() {
  const { data: user } = useAuthUser();
  const logoutMutation = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 rounded-full px-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <div className="ring-primary-500/20 relative rounded-full ring-2">
            <BaseAvatar name={user?.fullName ?? undefined} size="sm" />
          </div>
          <span className="hidden max-w-[120px] truncate text-sm font-medium text-neutral-800 md:inline-block dark:text-neutral-200">
            {user?.fullName || "Admin"}
          </span>
          <Badge
            variant="outline"
            className="border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300 hidden text-[10px] font-semibold sm:inline-flex"
          >
            Admin
          </Badge>
          <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">{user?.fullName || "Quản trị viên"}</p>
              <ShieldCheck className="text-primary-700 dark:text-primary-400 h-3.5 w-3.5" />
            </div>
            <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/">Về trang học tập</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logoutMutation.mutate()}
          className="text-destructive focus:text-destructive flex cursor-pointer items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-neutral-200/80 bg-white/80 px-4 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="hover:text-primary-700 -ml-1 text-neutral-600 dark:text-neutral-400" />
        <Separator orientation="vertical" className="mr-2 h-4 bg-neutral-200 dark:bg-neutral-800" />
        <AdminBreadcrumbs />
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <AdminUserMenu />
      </div>
    </header>
  );
}
