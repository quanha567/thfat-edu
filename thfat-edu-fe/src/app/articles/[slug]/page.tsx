import { MainFooter, MainNavbar } from "@/components/layout";
import { type Metadata } from "next";

import { ArticleDetailClient } from "./article-detail-client";

export type TArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: TArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Bài viết | ThFat Edu`,
    description: `Chi tiết bài viết ${slug} trên nền tảng khảo thí ThFat Edu`,
  };
}

export default async function ArticlePage({ params }: TArticlePageProps) {
  const { slug } = await params;

  return (
    <div className="bg-background text-foreground selection:bg-primary-600 flex min-h-screen flex-col selection:text-white">
      <MainNavbar />
      <main className="flex-1 bg-neutral-50/60 dark:bg-neutral-950/60">
        <ArticleDetailClient slug={slug} />
      </main>
      <MainFooter />
    </div>
  );
}
