"use client";

import { BaseAvatar } from "@/components/base";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { ArrowRight, ChevronDown, FileText, LogOut, ShieldCheck, Trophy } from "lucide-react";
import Link from "next/link";

export function NavbarAuthAction() {
  const { data: user } = useAuthUser();
  const logoutMutation = useLogout();

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="group flex h-9 cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pr-3 pl-1.5 text-white transition-colors hover:border-white/20 hover:bg-white/10 data-[state=open]:border-white/25 data-[state=open]:bg-white/15"
          >
            <BaseAvatar
              src={user.avatarUrl}
              name={user.fullName ?? undefined}
              size="sm"
              className="ring-1 ring-white/20"
            />

            <span className="max-w-[140px] truncate text-sm font-medium text-white">
              {user.fullName || "Tài khoản"}
            </span>

            <ChevronDown className="h-3.5 w-3.5 text-white/60 transition-transform duration-200 group-hover:text-white group-data-[state=open]:rotate-180" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="bg-primary-950/95 w-64 rounded-xl border border-white/10 p-1.5 text-white shadow-xl backdrop-blur-md"
        >
          {/* User Info Header */}
          <div className="flex items-center gap-3 px-2 py-2">
            <BaseAvatar
              src={user.avatarUrl}
              name={user.fullName ?? undefined}
              size="md"
              className="ring-1 ring-white/20"
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-semibold text-white">
                  {user.fullName || "Tài khoản"}
                </span>
                {user.role === "admin" && (
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/70">
                    Admin
                  </span>
                )}
              </div>
              <span className="truncate text-xs text-white/50">{user.email}</span>
            </div>
          </div>

          <DropdownMenuSeparator className="my-1 bg-white/10" />

          {/* Navigation Links */}
          {user.role === "admin" && (
            <DropdownMenuItem
              asChild
              className="cursor-pointer rounded-lg px-2.5 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
            >
              <Link href="/admin" className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-white/60" />
                <span>Quản trị hệ thống</span>
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            asChild
            className="cursor-pointer rounded-lg px-2.5 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
          >
            <Link href="/exams" className="flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-white/60" />
              <span>Kỳ thi & Luyện đề</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="cursor-pointer rounded-lg px-2.5 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
          >
            <Link href="/leaderboard" className="flex items-center gap-2.5">
              <Trophy className="h-4 w-4 text-white/60" />
              <span>Bảng vàng vinh danh</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 bg-white/10" />

          {/* Logout Action */}
          <DropdownMenuItem
            onClick={() => logoutMutation.mutate()}
            className="text-error-400 hover:bg-error-500/10 hover:text-error-300 focus:bg-error-500/10 focus:text-error-300 flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors"
          >
            <LogOut className="text-error-400 h-4 w-4" />
            <span>Đăng xuất</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      asChild
      className="bg-primary text-primary-foreground hover:bg-primary-800 rounded-full px-5 py-2 font-medium shadow-md transition-all"
    >
      <Link href="/login" className="flex items-center gap-2">
        <span>Đăng nhập</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}
