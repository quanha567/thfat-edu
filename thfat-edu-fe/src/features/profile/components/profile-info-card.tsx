"use client";

import { BaseAvatar } from "@/components/base";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { TAuthUser } from "@/features/auth/types";
import { Mail, Shield, GraduationCap, BookOpen, User } from "lucide-react";

import { useSendResetPasswordEmail } from "../hooks/use-send-reset-password-email";

const GENDER_LABELS: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
};

type TProfileInfoCardProps = {
  user: TAuthUser;
};

function RoleInfo({ role }: { role: TAuthUser["role"] }) {
  if (role === "admin") {
    return (
      <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <Shield className="size-4 shrink-0" />
        <span>Quản trị viên</span>
      </div>
    );
  }

  if (role === "teacher") {
    return (
      <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <BookOpen className="size-4 shrink-0" />
        <span>Giáo viên</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
      <GraduationCap className="size-4 shrink-0" />
      <span>Học viên</span>
    </div>
  );
}

function RoleBadge({ role }: { role: TAuthUser["role"] }) {
  if (role === "admin") {
    return (
      <Badge
        variant="outline"
        className="border-primary-200/80 bg-primary-50 text-primary-700 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300 text-xxs font-semibold tracking-wide"
      >
        Admin
      </Badge>
    );
  }

  if (role === "teacher") {
    return (
      <Badge
        variant="outline"
        className="border-primary-200/80 bg-primary-50 text-primary-700 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300 text-xxs font-semibold tracking-wide"
      >
        Giáo viên
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="border-muted bg-muted text-muted-foreground dark:border-border text-xxs font-semibold tracking-wide dark:bg-neutral-800 dark:text-neutral-300"
    >
      Học viên
    </Badge>
  );
}

export function ProfileInfoCard({ user }: TProfileInfoCardProps) {
  const resetPasswordMutation = useSendResetPasswordEmail({ email: user.email });

  return (
    <Card className="h-fit">
      <CardContent className="flex flex-col items-center gap-5 p-6">
        {/* Avatar */}
        <div className="ring-primary-500/20 dark:ring-primary-400/30 relative flex size-24 shrink-0 items-center justify-center rounded-full shadow-md ring-4">
          <BaseAvatar
            src={user.avatarUrl}
            name={user.fullName}
            gender={user.gender}
            size="xl"
            className="size-24 text-2xl"
          />
        </div>

        {/* Name + Role badge */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <span className="text-foreground text-lg leading-tight font-bold">{user.fullName}</span>
          <RoleBadge role={user.role} />
        </div>

        <Separator />

        {/* Info rows */}
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <Mail className="size-4 shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
          {user.gender && (
            <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
              <User className="size-4 shrink-0" />
              <span>Giới tính: {GENDER_LABELS[user.gender] ?? "Khác"}</span>
            </div>
          )}
          <RoleInfo role={user.role} />
        </div>

        <Separator />

        {/* Security section */}
        <div className="flex w-full flex-col gap-2">
          <p className="text-foreground text-xs font-semibold tracking-wider uppercase">Bảo mật</p>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            disabled={resetPasswordMutation.isPending}
            onClick={() => resetPasswordMutation.mutate()}
          >
            {resetPasswordMutation.isPending ? "Đang gửi..." : "Gửi email đổi mật khẩu"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
