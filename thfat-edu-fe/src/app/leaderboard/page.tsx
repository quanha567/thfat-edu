import { MainFooter, MainNavbar } from "@/components/layout";
import type { Metadata } from "next";
import { Suspense } from "react";

import { LeaderboardClient } from "./leaderboard-client";

export const metadata: Metadata = {
  title: "Bảng Vàng Thành Tích & Xếp Hạng",
  description:
    "Vinh danh những học sinh đạt điểm số cao nhất trong các kỳ khảo thí Hóa học tại TH FAT EDU.",
  alternates: {
    canonical: "/leaderboard",
  },
};

export default function LeaderboardPage() {
  return (
    <div className="bg-background text-foreground selection:bg-primary-600 flex min-h-dvh min-h-screen flex-col selection:text-white">
      <MainNavbar />
      <main className="flex flex-1 flex-col bg-white dark:bg-neutral-950">
        <Suspense>
          <LeaderboardClient />
        </Suspense>
      </main>
      <MainFooter />
    </div>
  );
}
