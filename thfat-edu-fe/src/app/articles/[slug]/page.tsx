import { MainFooter, MainNavbar } from "@/components/layout";
import { JsonLd } from "@/components/seo/json-ld";
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
      cache: "no-store",
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

async function ArticleDetailLoader({ params }: TArticlePageProps) {
  const { slug } = await params;
  const article = await fetchArticleServer(slug);

  if (!article) {
    notFound();
  }

  const rawArticle = article as unknown as {
    summary?: string;
    author?: { name?: string };
  };

  const articleDescription =
    rawArticle.summary ||
    article.excerpt ||
    article.content
      .slice(0, 160)
      .replace(/[#*`_~]/g, "")
      .trim();

  const articleSchemas = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.title,
        description: articleDescription,
        image: [article.thumbnailUrl || `${siteConfig.url}${siteConfig.ogImage}`],
        datePublished: article.createdAt,
        dateModified: article.updatedAt || article.createdAt,
        author: {
          "@type": "Person",
          name: rawArticle.author?.name || article.author?.fullName || siteConfig.author.name,
        },
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          logo: {
            "@type": "ImageObject",
            url: `${siteConfig.url}/brand/logo-full.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${siteConfig.url}/articles/${slug}`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Trang chủ",
            item: siteConfig.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Bài viết",
            item: `${siteConfig.url}/articles`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: `${siteConfig.url}/articles/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={articleSchemas} />
      <ArticleDetailClient params={params} initialData={article} />
    </>
  );
}

export default function ArticlePage({ params }: TArticlePageProps) {
  return (
    <div className="bg-background text-foreground selection:bg-primary-600 flex min-h-screen flex-col selection:text-white">
      <Suspense fallback={<div className="h-16" />}>
        <MainNavbar />
      </Suspense>
      <main className="flex-1 bg-neutral-50/60 pt-16 dark:bg-neutral-950/60">
        <Suspense
          fallback={
            <div className="mx-auto max-w-4xl px-4 py-8">
              <div className="bg-muted h-8 w-2/3 animate-pulse rounded" />
              <div className="bg-muted mt-4 h-4 w-1/3 animate-pulse rounded" />
              <div className="mt-8 space-y-3">
                <div className="bg-muted h-4 w-full animate-pulse rounded" />
                <div className="bg-muted h-4 w-full animate-pulse rounded" />
                <div className="bg-muted h-4 w-4/5 animate-pulse rounded" />
              </div>
            </div>
          }
        >
          <ArticleDetailLoader params={params} />
        </Suspense>
      </main>
      <MainFooter />
    </div>
  );
}
