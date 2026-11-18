import { MainFooter, MainNavbar } from "@/components/layout";
import { PublicArticlesContainer } from "@/features/articles";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Bài Viết & Tài Liệu Hóa Học",
  description:
    "Tổng hợp các bài viết chuyên đề Hóa học, phương pháp giải nhanh và kiến thức trọng tâm ôn thi THPT Quốc gia.",
  alternates: {
    canonical: "/articles",
  },
};

export default function ArticlesPage() {
  return (
    <div className="bg-background text-foreground selection:bg-primary-600 flex min-h-screen flex-col selection:text-white">
      <MainNavbar />
      <main className="flex-1 bg-neutral-50/60 pt-16 dark:bg-neutral-950/60">
        <Suspense>
          <PublicArticlesContainer />
        </Suspense>
      </main>
      <MainFooter />
    </div>
  );
}
