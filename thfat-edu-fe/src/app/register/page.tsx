import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { RegisterCard } from "@/features/invite-codes/components/register-card";
import type { Metadata } from "next";

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

export default async function RegisterPage({ searchParams }: TRegisterPageProps) {
  const { code } = await searchParams;
  const inviteCode = typeof code === "string" ? code.trim() : "";

  return (
    <AuthSplitLayout>
      <RegisterCard code={inviteCode} />
    </AuthSplitLayout>
  );
}
