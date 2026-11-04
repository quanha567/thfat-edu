import { LoginCard } from "@/features/auth/components/login-card";
import { LoginHero } from "@/features/auth/components/login-hero";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Đăng nhập | TH FAT EDU",
  description: "Trang đăng nhập hệ thống khảo thí và học tập Hóa học trực tuyến TH FAT EDU",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left Column: Visual Brand & Hero Section */}
      <LoginHero />

      {/* Right Column: Login Card & Form */}
      <section className="bg-background relative flex min-h-screen w-full items-center justify-center overflow-hidden p-6 sm:p-10 lg:w-1/2">
        {/* Soft decorative background blurs using Design System tokens */}
        <div className="bg-primary-100/40 dark:bg-primary-950/20 pointer-events-none absolute -top-40 -right-40 size-96 rounded-full blur-3xl" />
        <div className="bg-accent/40 dark:bg-accent/10 pointer-events-none absolute -bottom-40 -left-40 size-96 rounded-full blur-3xl" />

        <div className="relative z-10 flex w-full justify-center">
          <Suspense
            fallback={
              <div className="border-border bg-card flex h-96 w-full max-w-[440px] items-center justify-center rounded-2xl border shadow-xl">
                <span className="text-caption text-muted-foreground animate-pulse">
                  Đang tải giao diện đăng nhập...
                </span>
              </div>
            }
          >
            <LoginCard />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
