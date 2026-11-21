"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { ProfileEditForm } from "@/features/profile/components/profile-edit-form";
import { ProfileInfoCard } from "@/features/profile/components/profile-info-card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProfileClient() {
  const { data: user, isLoading } = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="mt-1.5 h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-foreground text-2xl font-bold">Thông tin cá nhân</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Quản lý thông tin hồ sơ và bảo mật tài khoản của bạn.
        </p>
      </div>

      {/* 2-col layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <ProfileInfoCard user={user} />
        <ProfileEditForm user={user} />
      </div>
    </div>
  );
}
