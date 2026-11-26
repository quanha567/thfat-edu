import { type WithChildren } from "@thfat-edu/shared";

import { AuthHero } from "./auth-hero";

/** Khung chia hai cột dùng chung cho các trang đăng nhập và đăng ký: hero bên trái, form bên phải. */
export function AuthSplitLayout({ children }: WithChildren) {
  return (
    <main className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left Column: Visual Brand & Hero Section */}
      <AuthHero />

      {/* Right Column: Card & Form */}
      <section className="bg-background relative flex min-h-screen w-full items-center justify-center overflow-hidden p-6 sm:p-10 lg:w-1/2">
        {/* Soft decorative background blurs using Design System tokens */}
        <div className="bg-primary-100/40 dark:bg-primary-950/20 pointer-events-none absolute -top-40 -right-40 size-96 rounded-full blur-3xl" />
        <div className="bg-accent/40 dark:bg-accent/10 pointer-events-none absolute -bottom-40 -left-40 size-96 rounded-full blur-3xl" />

        <div className="relative z-10 flex w-full justify-center">{children}</div>
      </section>
    </main>
  );
}
