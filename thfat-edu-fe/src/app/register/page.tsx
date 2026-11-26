import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { Card } from "@/components/ui/card";
import { RegisterCard } from "@/features/invite-codes/components/register-card";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Đăng ký | TH FAT EDU",
  description: "Đăng ký tài khoản học sinh bằng link mời trên hệ thống TH FAT EDU",
  // Mã mời nằm trong URL: không gửi Referer sang trang khác.
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};

type TRegisterPageProps = {
  searchParams: Promise<{ code?: string | string[] }>;
};

async function RegisterContent({ searchParams }: TRegisterPageProps) {
  const { code } = await searchParams;
  const inviteCode = typeof code === "string" ? code.trim() : "";

  return <RegisterCard code={inviteCode} />;
}

export default function RegisterPage({ searchParams }: TRegisterPageProps) {
  return (
    <AuthSplitLayout>
      <Suspense
        fallback={
          <Card className="flex h-96 w-full max-w-[440px] items-center justify-center rounded-2xl shadow-xl">
            <span className="text-caption text-muted-foreground animate-pulse">
              Đang tải giao diện đăng ký...
            </span>
          </Card>
        }
      >
        <RegisterContent searchParams={searchParams} />
      </Suspense>
    </AuthSplitLayout>
  );
}
