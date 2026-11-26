"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCheckInviteCode } from "../hooks/use-check-invite-code";
import { RegisterForm } from "./register-form";

export type TRegisterCardProps = {
  code: string;
};

export function RegisterCard({ code }: TRegisterCardProps) {
  const router = useRouter();
  const { data, isLoading, error } = useCheckInviteCode(code);

  const isValid = Boolean(data?.valid);
  const hasNoCode = code.length === 0;

  return (
    <Card className="border-border/80 bg-card w-full max-w-[440px] rounded-2xl p-8 shadow-xl shadow-neutral-200/50 sm:p-10 dark:shadow-none">
      <CardHeader className="flex flex-col gap-1.5 p-0 pb-6 text-left">
        <CardTitle className="text-h2 text-card-foreground font-bold tracking-tight">
          Đăng ký tài khoản
        </CardTitle>
        <CardDescription className="text-body-sm text-muted-foreground">
          Tạo tài khoản học sinh bằng link mời bạn được cấp
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-0">
        {isLoading && !hasNoCode && (
          <div className="text-muted-foreground flex items-center justify-center gap-2 py-8 text-sm">
            <Loader2 className="size-4 animate-spin" />
            <span>Đang kiểm tra link mời...</span>
          </div>
        )}

        {(hasNoCode || error) && (
          <Alert
            variant="destructive"
            className="border-destructive/20 bg-destructive/10 rounded-lg py-2.5"
          >
            <AlertCircle className="size-4" />
            <AlertDescription className="text-destructive text-xs">
              {hasNoCode
                ? "Thiếu mã mời. Vui lòng dùng đúng link mời được gửi cho bạn."
                : "Link mời không hợp lệ, đã hết hạn hoặc đã được sử dụng. Vui lòng liên hệ giáo viên hoặc quản trị viên để nhận link mới."}
            </AlertDescription>
          </Alert>
        )}

        {isValid && <RegisterForm code={code} onSuccess={() => router.push("/")} />}

        <p className="text-muted-foreground text-center text-xs">
          Đã có tài khoản?{" "}
          <Button asChild variant="link" className="h-auto p-0 text-xs font-medium">
            <Link href="/login">Đăng nhập</Link>
          </Button>
        </p>
      </CardContent>
    </Card>
  );
}
