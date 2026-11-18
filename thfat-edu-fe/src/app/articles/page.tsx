import { MainFooter, MainNavbar } from "@/components/layout";
import { PublicArticlesContainer } from "@/features/articles";
import { type Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tin Tức & Cẩm Nang Ôn Thi | ThFat Edu",
  description: "Cập nhật tin tức khảo thí, quy chế thi, đề cương và cẩm nang học tập mới nhất từ ThFat Edu",
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
