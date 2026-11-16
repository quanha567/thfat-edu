"use client";

import { BaseAvatar } from "@/components/base";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { useLogout } from "@/features/auth/hooks/use-logout";
import type { TAuthUser, TUserRole } from "@/features/auth/types";
import { cn } from "cn";
import {
  ChevronDown,
  ChevronsUpDown,
  FileText,
  GraduationCap,
  LogOut,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export type TUserDropdownVariant = "admin" | "navbar" | "sidebar";

export type TUserDropdownProps = {
  variant?: TUserDropdownVariant;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  className?: string;
};

function getRoleLabel(role: TUserRole): string {
  if (role === "admin") {
    return "Quản trị viên";
  }

  if (role === "teacher") {
    return "Giáo viên";
  }

  return "Học viên";
}

function renderRoleBadge(role: TUserRole): ReactNode {
  if (role === "admin") {
    return (
      <Badge
        variant="outline"
        className="border-primary-200/80 bg-primary-50 text-primary-700 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300 text-[10px] font-semibold tracking-wide"
      >
        Admin
      </Badge>
    );
  }

  if (role === "teacher") {
    return (
      <Badge
        variant="outline"
        className="border-purple-200/80 bg-purple-50 text-[10px] font-semibold tracking-wide text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300"
      >
        Giáo viên
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="border-sky-200/80 bg-sky-50 text-[10px] font-semibold tracking-wide text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300"
    >
      Học viên
    </Badge>
  );
}

function renderTrigger(
  variant: TUserDropdownVariant,
  user: TAuthUser,
  className?: string,
): ReactNode {
  if (variant === "sidebar") {
    return (
      <SidebarMenuButton
        size="lg"
        className={cn(
          "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group/user-sidebar",
          className,
        )}
      >
        <div className="ring-primary-500/20 dark:ring-primary-400/30 relative flex size-8 shrink-0 items-center justify-center rounded-full shadow-2xs ring-2">
          <BaseAvatar src={user.avatarUrl} name={user.fullName ?? undefined} size="default" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
          <span className="text-sidebar-foreground truncate font-semibold">
            {user.fullName || "Tài khoản"}
          </span>
          <span className="text-sidebar-foreground/70 truncate text-xs">{user.email}</span>
        </div>
        <ChevronsUpDown className="text-sidebar-foreground/60 ml-auto size-4 group-data-[collapsible=icon]:hidden" />
      </SidebarMenuButton>
    );
  }

  if (variant === "navbar") {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "group flex h-9.5 cursor-pointer items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1 pr-3 pl-1.5 text-white transition-colors",
          "hover:border-white/20 hover:bg-white/10 data-[state=open]:border-white/25 data-[state=open]:bg-white/15",
          className,
        )}
      >
        <BaseAvatar
          src={user.avatarUrl}
          name={user.fullName ?? undefined}
          size="default"
          className="ring-1 ring-white/20"
        />
        <span className="max-w-[140px] truncate text-sm font-medium text-white">
          {user.fullName || "Tài khoản"}
        </span>
        <ChevronDown className="size-3.5 text-white/60 transition-transform duration-200 group-hover:text-white group-data-[state=open]:rotate-180" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      className={cn(
        "group flex h-9.5 cursor-pointer items-center gap-2.5 rounded-full border border-border/60 bg-background/50 py-1 pr-3 pl-1.5 shadow-2xs transition-all",
        "hover:border-border hover:bg-muted/60 data-[state=open]:border-border data-[state=open]:bg-muted/80",
        className,
      )}
    >
      <div className="ring-primary-500/20 dark:ring-primary-400/30 relative flex size-7.5 shrink-0 items-center justify-center rounded-full shadow-2xs ring-2">
        <BaseAvatar src={user.avatarUrl} name={user.fullName ?? undefined} size="default" />
      </div>
      <div className="hidden flex-col text-left md:flex">
        <span className="text-foreground text-xs leading-tight font-semibold">
          {user.fullName || "Admin"}
        </span>
        <span className="text-primary-700 dark:text-primary-300 text-[10px] leading-tight font-medium">
          {getRoleLabel(user.role)}
        </span>
      </div>
      <ChevronDown className="text-muted-foreground group-hover:text-foreground size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
    </Button>
  );
}

export function UserDropdown({
  variant = "admin",
  align = "end",
  side,
  sideOffset = 8,
  className,
}: TUserDropdownProps) {
  const { data: user } = useAuthUser();
  const logoutMutation = useLogout();

  if (!user) {
    return null;
  }

  const resolvedSide = side ?? (variant === "sidebar" ? "right" : "bottom");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{renderTrigger(variant, user, className)}</DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        side={resolvedSide}
        sideOffset={sideOffset}
        className="border-border bg-popover text-popover-foreground w-64 rounded-xl p-1.5 shadow-lg"
      >
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex items-center gap-3">
            <div className="ring-primary-500/20 dark:ring-primary-400/30 relative flex size-9 shrink-0 items-center justify-center rounded-full shadow-2xs ring-2">
              <BaseAvatar src={user.avatarUrl} name={user.fullName ?? undefined} size="md" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-foreground truncate text-sm font-semibold">
                  {user.fullName || "Người dùng"}
                </span>
                {renderRoleBadge(user.role)}
              </div>
              <span className="text-muted-foreground truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1" />

        {user.role === "admin" && (
          <DropdownMenuItem asChild className="cursor-pointer gap-2.5 px-2.5 py-2 text-sm">
            <Link href="/admin" className="flex w-full items-center gap-2.5">
              <ShieldCheck className="text-primary-700 dark:text-primary-400 size-4" />
              <span>Quản trị hệ thống</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild className="cursor-pointer gap-2.5 px-2.5 py-2 text-sm">
          <Link href="/" className="flex w-full items-center gap-2.5">
            <GraduationCap className="text-muted-foreground size-4" />
            <span>Trang chủ học tập</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer gap-2.5 px-2.5 py-2 text-sm">
          <Link href="/exams" className="flex w-full items-center gap-2.5">
            <FileText className="text-muted-foreground size-4" />
            <span>Kỳ thi & Luyện đề</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer gap-2.5 px-2.5 py-2 text-sm">
          <Link href="/leaderboard" className="flex w-full items-center gap-2.5">
            <Trophy className="text-muted-foreground size-4" />
            <span>Bảng vàng vinh danh</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          onClick={() => logoutMutation.mutate()}
          className="text-destructive focus:text-destructive flex cursor-pointer items-center gap-2.5 px-2.5 py-2 text-sm"
        >
          <LogOut className="size-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
