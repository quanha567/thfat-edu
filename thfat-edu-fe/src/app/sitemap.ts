import { siteConfig } from "@/config/site.config";
import { getApiBaseUrl } from "@/lib/api";
import type { MetadataRoute } from "next";

type TArticleSitemapItem = {
  slug: string;
  createdAt: string;
  updatedAt?: string | null;
};

type TArticleApiResponse = {
  items?: TArticleSitemapItem[];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.url}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/articles`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/exams`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/leaderboard`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];

  try {
    const apiUrl = `${getApiBaseUrl()}/articles?limit=100&status=published`;
    const res = await fetch(apiUrl, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return staticRoutes;
    }

    const data = (await res.json()) as TArticleApiResponse;
    const articles = data.items || [];

    const dynamicRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
      url: `${siteConfig.url}/articles/${article.slug}`,
      lastModified: new Date(article.updatedAt || article.createdAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    return staticRoutes;
  }
}
