"use client";

import { BaseAvatar } from "@/components/base";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { ArrowRight, ChevronDown, LogOut, User } from "lucide-react";
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
            className="flex items-center gap-2 rounded-full pr-3 pl-2 text-white hover:bg-white/10"
          >
            <BaseAvatar
              name={user.fullName ?? undefined}
              size="default"
              className="border-primary-400/30 border"
            />
            <span className="max-w-[120px] truncate text-sm font-medium text-white">
              {user.fullName || "Tài khoản"}
            </span>
            <ChevronDown className="text-primary-300 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-primary-950 w-56 border-white/15 text-white">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold">{user.fullName || "Học viên"}</p>
              <p className="text-caption text-primary-200/70 truncate">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10">
            <Link href="/dashboard" className="flex items-center gap-2">
              <User className="text-primary-300 h-4 w-4" />
              <span>Trang cá nhân & Kỳ thi</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem
            onClick={() => logoutMutation.mutate()}
            className="text-error-400 hover:bg-error-500/10 hover:text-error-300 flex cursor-pointer items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Đăng xuất</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      asChild
      className="bg-primary text-primary-foreground hover:bg-primary-800 shadow-primary-950/30 rounded-full px-5 py-2 font-medium shadow-md transition-all"
    >
      <Link href="/login" className="flex items-center gap-2">
        <span>Đăng nhập</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}
