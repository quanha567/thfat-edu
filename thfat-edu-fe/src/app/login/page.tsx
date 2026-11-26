import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { Card } from "@/components/ui/card";
import { LoginCard } from "@/features/auth/components/login-card";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Đăng nhập | TH FAT EDU",
  description: "Trang đăng nhập hệ thống khảo thí và học tập Hóa học trực tuyến TH FAT EDU",
};

export default function LoginPage() {
  return (
    <AuthSplitLayout>
      <Suspense
        fallback={
          <Card className="flex h-96 w-full max-w-[440px] items-center justify-center rounded-2xl shadow-xl">
            <span className="text-caption text-muted-foreground animate-pulse">
              Đang tải giao diện đăng nhập...
            </span>
          </Card>
        }
      >
        <LoginCard />
      </Suspense>
    </AuthSplitLayout>
  );
}
