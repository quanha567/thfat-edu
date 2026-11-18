"use client";

import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { UserDropdown } from "./user-dropdown";

export function NavbarAuthAction() {
  const { data: user } = useAuthUser();

  if (user) {
    return <UserDropdown variant="navbar" />;
  }

  return (
    <Button
      asChild
      className="bg-primary-500 hover:bg-primary-400 shadow-primary-500/25 rounded-full px-5 py-2 font-medium text-white shadow-md transition-all"
    >
      <Link href="/login" className="flex items-center gap-2">
        <span>Đăng nhập</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}
