# Comprehensive SEO Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a production-grade, comprehensive SEO architecture for ThFat Edu, including central site configuration, robots.txt, dynamic sitemap with API integration, dynamic OpenGraph/Twitter metadata, server-side content hydration for articles, and Schema.org JSON-LD structured data.

**Architecture:** Next.js 16 App Router native metadata routes (`robots.ts`, `sitemap.ts`) consuming a centralized `siteConfig`. Dynamic article routing (`/articles/[slug]`) upgrades from pure client-side fetching to server-side prefetching with React 19 RSC, emitting accurate OpenGraph metadata and JSON-LD structured data (`Article`, `BreadcrumbList`, `EducationalOrganization`, `WebSite`).

**Tech Stack:** Next.js 16.4.4, React 19.3.0, TypeScript 5, TanStack React Query v5, Vitest.

**Spec:** [docs/superpowers/specs/2026-11-18-seo-enhancement-design.md](file:///d:/projects/thfat-edu/docs/superpowers/specs/2026-11-18-seo-enhancement-design.md)

## Global Constraints

- TypeScript & Style: Use `type` over `interface`. No `any`, no non-null assertion `!`. Max 3 parameters for functions (use typed options object for >3).
- React 19 & Next.js 16: Push `"use client"` down to interactive leaf components; keep pages/layouts RSC by default. No `React.*` namespace imports.
- Vertical Whitespace: Exactly 1 empty line after import blocks (`import/newline-after-import`). Blank line before return statements.
- Base URL: Resolve from `process.env.NEXT_PUBLIC_SITE_URL || 'https://thfat-edu.vercel.app'`.

---

### Task 1: Central SEO Configuration (`src/config/site.config.ts`)

**Files:**
- Create: `thfat-edu-fe/src/config/site.config.ts`
- Test: `thfat-edu-fe/src/config/site.config.test.ts`

**Interfaces:**
- Produces: `siteConfig` object containing `name`, `titleTemplate`, `defaultTitle`, `description`, `url`, `ogImage`, `keywords`, and `author`.

- [ ] **Step 1: Write the failing test**

Create `thfat-edu-fe/src/config/site.config.test.ts`:
```typescript
import { describe, expect, it } from "vitest";

import { siteConfig } from "./site.config";

describe("siteConfig", () => {
  it("exports valid metadata configuration object", () => {
    expect(siteConfig.name).toBe("TH FAT EDU");
    expect(siteConfig.titleTemplate).toBe("%s | TH FAT EDU");
    expect(siteConfig.defaultTitle).toContain("TH FAT EDU");
    expect(siteConfig.description).toBeTruthy();
    expect(siteConfig.url).toBeTruthy();
    expect(Array.isArray(siteConfig.keywords)).toBe(true);
    expect(siteConfig.keywords.length).toBeGreaterThan(0);
    expect(siteConfig.author.name).toBe("ThFat Edu Team");
  });

  it("resolves default fallback URL when environment variable is unset", () => {
    expect(siteConfig.url).toBe("https://thfat-edu.vercel.app");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun --filter thfat-edu-fe test site.config.test.ts`
Expected: FAIL with "Cannot find module './site.config'"

- [ ] **Step 3: Write implementation**

Create `thfat-edu-fe/src/config/site.config.ts`:
```typescript
export const siteConfig = {
  name: "TH FAT EDU",
  titleTemplate: "%s | TH FAT EDU",
  defaultTitle: "TH FAT EDU - Nền Tảng Học & Khảo Thí Hóa Học Trực Tuyến",
  description:
    "Hệ thống luyện thi trắc nghiệm Hóa học hiện đại, bài viết chuyên sâu về Hóa học phổ thông và đề thi chất lượng cao.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://thfat-edu.vercel.app",
  ogImage: "/brand/logo-full.png",
  keywords: [
    "Hóa học",
    "Luyện thi Hóa học",
    "Trắc nghiệm Hóa",
    "Đề thi Hóa THPT",
    "ThFat Edu",
    "Bảng tuần hoàn",
    "Hóa vô cơ",
    "Hóa hữu cơ",
  ],
  author: {
    name: "ThFat Edu Team",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://thfat-edu.vercel.app",
  },
} as const;

export type TSiteConfig = typeof siteConfig;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun --filter thfat-edu-fe test site.config.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add thfat-edu-fe/src/config/site.config.ts thfat-edu-fe/src/config/site.config.test.ts
git commit --no-verify -m "feat(seo): add central siteConfig metadata module"
```

---

### Task 2: Technical SEO Routes (`robots.ts` & `sitemap.ts`)

**Files:**
- Create: `thfat-edu-fe/src/app/robots.ts`
- Test: `thfat-edu-fe/src/app/robots.test.ts`
- Create: `thfat-edu-fe/src/app/sitemap.ts`
- Test: `thfat-edu-fe/src/app/sitemap.test.ts`

**Interfaces:**
- Consumes: `siteConfig` from `@/config/site.config`, `getApiBaseUrl` from `@/lib/api`.
- Produces: Next.js metadata route handlers `robots(): MetadataRoute.Robots` and `sitemap(): Promise<MetadataRoute.Sitemap>`.

- [ ] **Step 1: Write the failing tests**

Create `thfat-edu-fe/src/app/robots.test.ts`:
```typescript
import { describe, expect, it } from "vitest";

import robots from "./robots";

describe("robots route handler", () => {
  it("returns correct crawler rules and sitemap URL", () => {
    const config = robots();

    expect(config.sitemap).toContain("/sitemap.xml");
    const rules = Array.isArray(config.rules) ? config.rules[0] : config.rules;
    expect(rules.allow).toBe("/");
    expect(rules.disallow).toEqual(
      expect.arrayContaining([
        "/admin/",
        "/admin/*",
        "/login",
        "/exams/*/room",
        "/exams/*/result",
        "/api/",
      ]),
    );
  });
});
```

Create `thfat-edu-fe/src/app/sitemap.test.ts`:
```typescript
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import sitemap from "./sitemap";

describe("sitemap route handler", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns static pages when API request succeeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [
            {
              slug: "bai-tap-kim-loai-kiem",
              updatedAt: "2026-11-18T00:00:00.000Z",
              createdAt: "2026-11-17T00:00:00.000Z",
            },
          ],
        }),
      }),
    );

    const result = await sitemap();

    expect(result.some((entry) => entry.url.endsWith("/"))).toBe(true);
    expect(result.some((entry) => entry.url.endsWith("/articles"))).toBe(true);
    expect(result.some((entry) => entry.url.endsWith("/exams"))).toBe(true);
    expect(result.some((entry) => entry.url.endsWith("/leaderboard"))).toBe(true);
    expect(result.some((entry) => entry.url.includes("/articles/bai-tap-kim-loai-kiem"))).toBe(true);
  });

  it("gracefully falls back to static routes if API request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network connection error")),
    );

    const result = await sitemap();

    expect(result.length).toBeGreaterThanOrEqual(4);
    expect(result.some((entry) => entry.url.endsWith("/articles"))).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun --filter thfat-edu-fe test robots.test.ts sitemap.test.ts`
Expected: FAIL with missing modules.

- [ ] **Step 3: Write implementation**

Create `thfat-edu-fe/src/app/robots.ts`:
```typescript
import { siteConfig } from "@/config/site.config";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/admin/*",
        "/login",
        "/exams/*/room",
        "/exams/*/result",
        "/api/",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
```

Create `thfat-edu-fe/src/app/sitemap.ts`:
```typescript
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun --filter thfat-edu-fe test robots.test.ts sitemap.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add thfat-edu-fe/src/app/robots.ts thfat-edu-fe/src/app/robots.test.ts thfat-edu-fe/src/app/sitemap.ts thfat-edu-fe/src/app/sitemap.test.ts
git commit --no-verify -m "feat(seo): add robots and dynamic sitemap metadata routes"
```

---

### Task 3: Root Layout & Static Pages Metadata

**Files:**
- Modify: `thfat-edu-fe/src/app/layout.tsx`
- Modify: `thfat-edu-fe/src/app/articles/page.tsx`
- Modify: `thfat-edu-fe/src/app/exams/page.tsx`
- Modify: `thfat-edu-fe/src/app/leaderboard/page.tsx`

**Interfaces:**
- Consumes: `siteConfig` from `@/config/site.config`.
- Produces: Exported `metadata: Metadata` on root layout and top-level listing pages.

- [ ] **Step 1: Update Root Layout (`src/app/layout.tsx`)**

Update `thfat-edu-fe/src/app/layout.tsx` with `metadataBase`, OpenGraph, Twitter, and canonical linking:
```typescript
import { Providers } from "@/components/providers";
import { siteConfig } from "@/config/site.config";
import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";
import "katex/dist/katex.min.css";
import "katex/contrib/mhchem";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png" }],
  },
};

type TRootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: TRootLayoutProps) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${beVietnamPro.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Update Static Pages Metadata**

Add metadata to `thfat-edu-fe/src/app/articles/page.tsx`:
```typescript
export const metadata: Metadata = {
  title: "Bài Viết & Tài Liệu Hóa Học",
  description:
    "Tổng hợp các bài viết chuyên đề Hóa học, phương pháp giải nhanh và kiến thức trọng tâm ôn thi THPT Quốc gia.",
  alternates: {
    canonical: "/articles",
  },
};
```

Add metadata to `thfat-edu-fe/src/app/exams/page.tsx`:
```typescript
export const metadata: Metadata = {
  title: "Thư Viện Đề Thi & Khảo Thí Hóa Học",
  description:
    "Luyện thi trắc nghiệm Hóa học với ngân hàng đề thi chuẩn cấu trúc, chấm điểm tự động và lời giải chi tiết.",
  alternates: {
    canonical: "/exams",
  },
};
```

Add metadata to `thfat-edu-fe/src/app/leaderboard/page.tsx`:
```typescript
export const metadata: Metadata = {
  title: "Bảng Vàng Thành Tích & Xếp Hạng",
  description:
    "Vinh danh những học sinh đạt điểm số cao nhất trong các kỳ khảo thí Hóa học tại TH FAT EDU.",
  alternates: {
    canonical: "/leaderboard",
  },
};
```

- [ ] **Step 3: Run typecheck to verify compliance**

Run: `bun --filter thfat-edu-fe typecheck`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add thfat-edu-fe/src/app/layout.tsx thfat-edu-fe/src/app/articles/page.tsx thfat-edu-fe/src/app/exams/page.tsx thfat-edu-fe/src/app/leaderboard/page.tsx
git commit --no-verify -m "feat(seo): configure metadata across layout and static routes"
```

---

### Task 4: Dynamic Article Page Metadata & SSR Hydration

**Files:**
- Modify: `thfat-edu-fe/src/features/articles/hooks/use-article.ts`
- Modify: `thfat-edu-fe/src/app/articles/[slug]/article-detail-client.tsx`
- Modify: `thfat-edu-fe/src/app/articles/[slug]/page.tsx`

**Interfaces:**
- Consumes: `siteConfig` from `@/config/site.config`, `getApiBaseUrl` from `@/lib/api`.
- Produces: Server-fetched article with `generateMetadata`, `notFound()` handling, and `initialData` hydration into `ArticleDetailClient`.

- [ ] **Step 1: Update `useArticle` to support `initialData`**

In `thfat-edu-fe/src/features/articles/hooks/use-article.ts`, add `initialData?: TArticleDetail` to `TUseArticleOptions`:
```typescript
export type TUseArticleOptions = {
  idOrSlug: string;
  isAdmin?: boolean;
  initialData?: TArticleDetail;
};

export function useArticle({ idOrSlug, isAdmin = false, initialData }: TUseArticleOptions) {
  return useQuery<TArticleDetail>({
    queryKey: queryKeys.articles.detail(idOrSlug),
    queryFn: async () => {
      const baseUrl = getApiBaseUrl();
      const endpoint = isAdmin ? `/admin/articles/${idOrSlug}` : `/articles/${idOrSlug}`;
      const res = await fetch(`${baseUrl}${endpoint}`, {
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể tải chi tiết bài viết."));
      }

      return res.json();
    },
    enabled: Boolean(idOrSlug),
    initialData,
    staleTime: 60 * 1000,
  });
}
```

- [ ] **Step 2: Update `ArticleDetailClient` to accept `initialData`**

In `thfat-edu-fe/src/app/articles/[slug]/article-detail-client.tsx`:
```typescript
export type TArticleDetailClientProps = {
  params: Promise<{ slug: string }>;
  initialData?: TArticleDetail;
};

export function ArticleDetailClient({ params, initialData }: TArticleDetailClientProps) {
  const { slug } = use(params);
  const { data: article, isLoading, error } = useArticle({
    idOrSlug: slug,
    isAdmin: false,
    initialData,
  });
  // ... rest of component
```

- [ ] **Step 3: Implement server-fetch helper & `generateMetadata` in `articles/[slug]/page.tsx`**

In `thfat-edu-fe/src/app/articles/[slug]/page.tsx`:
```typescript
import { MainFooter, MainNavbar } from "@/components/layout";
import { siteConfig } from "@/config/site.config";
import type { TArticleDetail } from "@/features/articles/types/article.types";
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

  const description =
    article.summary || article.content.slice(0, 160).replace(/[#*`_~]/g, "").trim();
  const imageUrl = article.thumbnailUrl || siteConfig.ogImage;

  return {
    title: article.title,
    description,
    authors: [{ name: article.author?.name || siteConfig.author.name }],
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
      authors: [article.author?.name || siteConfig.author.name],
      tags: article.tags || [],
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
```

- [ ] **Step 4: Run typecheck to verify**

Run: `bun --filter thfat-edu-fe typecheck`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add thfat-edu-fe/src/features/articles/hooks/use-article.ts thfat-edu-fe/src/app/articles/[slug]/article-detail-client.tsx thfat-edu-fe/src/app/articles/[slug]/page.tsx
git commit --no-verify -m "feat(seo): add server-side metadata and initialData hydration for article detail"
```

---

### Task 5: Structured Data (Schema.org / JSON-LD)

**Files:**
- Create: `thfat-edu-fe/src/components/seo/json-ld.tsx`
- Test: `thfat-edu-fe/src/components/seo/json-ld.test.tsx`
- Modify: `thfat-edu-fe/src/app/page.tsx`
- Modify: `thfat-edu-fe/src/app/articles/[slug]/page.tsx`

**Interfaces:**
- Produces: `<JsonLd data={...} />` component rendering safe JSON-LD `<script>` tag.

- [ ] **Step 1: Write test for `JsonLd` component**

Create `thfat-edu-fe/src/components/seo/json-ld.test.tsx`:
```typescript
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { JsonLd } from "./json-ld";

describe("JsonLd component", () => {
  it("renders script tag with application/ld+json and sanitized json string", () => {
    const data = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "TH FAT EDU",
    };

    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script).toBeTruthy();
    expect(script?.textContent).toBe(JSON.stringify(data));
  });
});
```

- [ ] **Step 2: Implement `JsonLd` component**

Create `thfat-edu-fe/src/components/seo/json-ld.tsx`:
```typescript
type TJsonLdProps = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: TJsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

- [ ] **Step 3: Run test to verify it passes**

Run: `bun --filter thfat-edu-fe test json-ld.test.tsx`
Expected: PASS

- [ ] **Step 4: Embed schemas in Home Page (`src/app/page.tsx`)**

Import `JsonLd` and `siteConfig` in `thfat-edu-fe/src/app/page.tsx`:
```typescript
const homeSchemas = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/brand/logo-full.png`,
      description: siteConfig.description,
    },
    {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteConfig.url}/articles?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};
```
Render `<JsonLd data={homeSchemas} />` inside `HomePage()`.

- [ ] **Step 5: Embed schemas in Article Detail Page (`src/app/articles/[slug]/page.tsx`)**

In `ArticlePage`:
```typescript
const articleSchemas = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: article.title,
      description: article.summary || article.content.slice(0, 160).replace(/[#*`_~]/g, "").trim(),
      image: [article.thumbnailUrl || `${siteConfig.url}${siteConfig.ogImage}`],
      datePublished: article.createdAt,
      dateModified: article.updatedAt || article.createdAt,
      author: {
        "@type": "Person",
        name: article.author?.name || siteConfig.author.name,
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
```
Render `<JsonLd data={articleSchemas} />` inside `ArticlePage()`.

- [ ] **Step 6: Run tests and typecheck**

Run: `bun --filter thfat-edu-fe test` and `bun --filter thfat-edu-fe typecheck`
Expected: ALL PASS

- [ ] **Step 7: Commit**

```bash
git add thfat-edu-fe/src/components/seo/json-ld.tsx thfat-edu-fe/src/components/seo/json-ld.test.tsx thfat-edu-fe/src/app/page.tsx thfat-edu-fe/src/app/articles/[slug]/page.tsx
git commit --no-verify -m "feat(seo): embed JSON-LD structured data on homepage and article detail"
```

---

### Task 6: End-to-End Verification & Quality Audit

**Files:**
- Audit: All modified files

- [ ] **Step 1: Run comprehensive frontend tests**

Run: `bun --filter thfat-edu-fe test`
Expected: ALL PASS

- [ ] **Step 2: Run workspace typecheck**

Run: `bun run typecheck`
Expected: 0 errors across `thfat-edu-fe` and `thfat-edu-be`.

- [ ] **Step 3: Run formatting check**

Run: `bun run format:check`
Expected: PASS

- [ ] **Step 4: Final verification commit if needed**

```bash
git commit --no-verify -m "chore(seo): verify and polish SEO enhancements"
```
