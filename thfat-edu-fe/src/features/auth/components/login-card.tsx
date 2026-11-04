"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter, useSearchParams } from "next/navigation";

import { type TAuthUser } from "../types";
import { GoogleLoginButton } from "./google-login-button";
import { LoginForm } from "./login-form";

export function LoginCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  function handleLoginSuccess(user: TAuthUser) {
    if (redirectUrl && redirectUrl.startsWith("/")) {
      router.push(redirectUrl);

      return;
    }

    if (user.role === "admin") {
      router.push("/admin");
    } else if (user.role === "teacher") {
      router.push("/teacher");
    } else {
      router.push("/");
    }
  }

  return (
    <div className="flex w-full max-w-[440px] flex-col items-center">
      {/* Shadcn Card container */}
      <Card className="border-border/80 bg-card w-full rounded-2xl p-8 shadow-xl shadow-neutral-200/50 sm:p-10 dark:shadow-none">
        <CardHeader className="p-0 pb-6 text-left">
          <CardTitle className="text-h2 text-card-foreground font-bold tracking-tight">
            Đăng nhập
          </CardTitle>
          <CardDescription className="text-body-sm text-muted-foreground mt-1.5">
            Nhập thông tin tài khoản của bạn để bắt đầu học tập
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 p-0">
          {/* Google sign-in */}
          <GoogleLoginButton onSuccess={handleLoginSuccess} />

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <Separator className="bg-border w-full" />
            <span className="bg-card text-caption text-muted-foreground absolute px-3 font-semibold tracking-wider uppercase">
              Hoặc đăng nhập bằng email
            </span>
          </div>

          {/* Credentials Form */}
          <LoginForm onSuccess={handleLoginSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}
