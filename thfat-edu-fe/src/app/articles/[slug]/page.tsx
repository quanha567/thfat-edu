import { MainFooter, MainNavbar } from "@/components/layout";
import { siteConfig } from "@/config/site.config";
import type { TArticleDetail } from "@/features/articles";
import { getApiBaseUrl } from "@/lib/api";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ArticleDetailClient } from "./article-detail-client";

export type TArticlePageProps = {
  params: Promise<{ slug: string }>;
};

async function fetchArticleServer(slug: string): Promise<TArticleDetail | null> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/articles/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as TArticleDetail;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: TArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleServer(slug);

  if (!article) {
    return {
      title: "Không tìm thấy bài viết",
      description: "Bài viết bạn tìm kiếm không tồn tại hoặc đã bị xóa.",
    };
  }

  const rawArticle = article as unknown as {
    summary?: string;
    tags?: string[];
    author?: { name?: string; fullName?: string };
  };

  const description =
    rawArticle.summary ||
    article.excerpt ||
    article.content
      .slice(0, 160)
      .replace(/[#*`_~]/g, "")
      .trim();

  const imageUrl = article.thumbnailUrl || siteConfig.ogImage;
  const authorName = rawArticle.author?.name || article.author?.fullName || siteConfig.author.name;
  const tags = rawArticle.tags || (article.category?.name ? [article.category.name] : []);

  return {
    title: article.title,
    description,
    authors: [{ name: authorName }],
    alternates: {
      canonical: `/articles/${slug}`,
    },
    openGraph: {
      type: "article",
      title: article.title,
      description,
      url: `${siteConfig.url}/articles/${slug}`,
      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt || article.createdAt,
      authors: [authorName],
      tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ArticlePage({ params }: TArticlePageProps) {
  const { slug } = await params;
  const article = await fetchArticleServer(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="bg-background text-foreground selection:bg-primary-600 flex min-h-screen flex-col selection:text-white">
      <Suspense fallback={<div className="h-16" />}>
        <MainNavbar />
      </Suspense>
      <main className="flex-1 bg-neutral-50/60 pt-16 dark:bg-neutral-950/60">
        <Suspense>
          <ArticleDetailClient params={params} initialData={article} />
        </Suspense>
      </main>
      <MainFooter />
    </div>
  );
}
