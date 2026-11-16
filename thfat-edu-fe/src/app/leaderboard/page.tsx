import { MainFooter, MainNavbar } from "@/components/layout";
import { type Metadata } from "next";
import { Suspense } from "react";

import { LeaderboardClient } from "./leaderboard-client";

export const metadata: Metadata = {
  title: "Bảng Vinh Danh | ThFat Edu",
  description: "Bảng xếp hạng thành tích học viên thi thử trực tuyến tại ThFat Edu.",
};

export default function LeaderboardPage() {
  return (
    <div className="bg-background text-foreground selection:bg-primary-600 flex min-h-screen flex-col selection:text-white">
      <MainNavbar />
      <main className="flex-1 bg-neutral-50/60 px-4 py-10 sm:px-6 lg:px-8 dark:bg-neutral-950/60">
        <div className="mx-auto max-w-5xl">
          <Suspense>
            <LeaderboardClient />
          </Suspense>
        </div>
      </main>
      <MainFooter />
    </div>
  );
}
