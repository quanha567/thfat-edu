import { MainFooter, MainNavbar } from "@/components/layout";
import type { Metadata } from "next";

import { ProfileClient } from "./profile-client";

export const metadata: Metadata = {
  title: "Thông tin cá nhân | ThFat Edu",
  description: "Quản lý thông tin hồ sơ và bảo mật tài khoản của bạn.",
  alternates: {
    canonical: "/profile",
  },
};

export default function ProfilePage() {
  return (
    <div className="bg-background text-foreground selection:bg-primary-600 flex min-h-screen flex-col selection:text-white">
      <MainNavbar />
      <main className="flex-1 bg-neutral-50/60 pt-16 dark:bg-neutral-950/60">
        <ProfileClient />
      </main>
      <MainFooter />
    </div>
  );
}
