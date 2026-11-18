import { MainFooter, MainNavbar } from "@/components/layout";
import { type Metadata } from "next";
import { Suspense } from "react";

import { LeaderboardClient } from "./leaderboard-client";

export const metadata: Metadata = {
  title: "Bảng Xếp Hạng | ThFat Edu",
  description: "Bảng xếp hạng thành tích học viên thi thử trực tuyến tại ThFat Edu.",
};

export default function LeaderboardPage() {
  return (
    <div className="bg-background text-foreground selection:bg-primary-600 flex min-h-screen min-h-dvh flex-col selection:text-white">
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
