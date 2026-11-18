# Comprehensive SEO Enhancement Specification

- **Date**: 2026-11-18
- **Status**: Approved
- **Topic**: Comprehensive SEO Architecture (Technical SEO, Dynamic Metadata, SSR Hydration, JSON-LD Schemas)

---

## 1. Overview & Objectives

This specification outlines the comprehensive SEO architecture for the **TH FAT EDU** platform (`thfat-edu-fe` built with Next.js 16 App Router and React 19).

### Primary Objectives
1. **Centralized SEO Configuration**: Establish a single source of truth for site-wide metadata, canonical domain handling, branding keywords, and OpenGraph/Twitter definitions in `src/config/site.config.ts`.
2. **Technical SEO Foundation**:
   - Provide a dynamic `src/app/robots.ts` defining crawl policies (allowing public pages, disallowing admin, authentication, exam testing rooms, and private user result pages), linked directly to the XML sitemap.
   - Provide a dynamic `src/app/sitemap.ts` that includes core static routes (`/`, `/articles`, `/exams`, `/leaderboard`) and dynamically indexed published article slugs (`/articles/[slug]`) with resilient error fallback and revalidation.
3. **Dynamic Metadata & Social Preview**:
   - Establish `metadataBase`, title template (`%s | TH FAT EDU`), canonical URL linking, Vietnamese OpenGraph locale (`vi_VN`), and Twitter large image cards in `src/app/layout.tsx`.
   - Implement custom page-level metadata across `/articles`, `/exams`, and `/leaderboard`.
   - Upgrade `/articles/[slug]/page.tsx` with dynamic `generateMetadata` reading article properties (title, description, tags, thumbnail, published/modified dates).
4. **Server-Side Hydration (RSC for Search Bots)**:
   - Upgrade `/articles/[slug]/page.tsx` to prefetch article details on the server before passing initial data to the interactive client component.
   - Respond with HTTP 404 (`notFound()`) when an article is nonexistent or unpublished, ensuring search engines do not index soft-404 error pages.
5. **Structured Data (Schema.org / JSON-LD)**:
   - Provide a reusable, type-safe `JsonLd` component in `src/components/seo/json-ld.tsx`.
   - Embed `EducationalOrganization` and `WebSite` (with `SearchAction`) schemas on the homepage (`/`).
   - Embed `Article` and `BreadcrumbList` schemas on `/articles/[slug]`.

---

## 2. Configuration & Technical Routing

### 2.1 Central SEO Configuration (`src/config/site.config.ts`)
A dedicated configuration module consolidating site metadata:

```typescript
export const siteConfig = {
  name: "TH FAT EDU",
  titleTemplate: "%s | TH FAT EDU",
  defaultTitle: "TH FAT EDU - Nền Tảng Học & Khảo Thí Hóa Học Trực Tuyến",
  description:
    "Hệ thống luyện thi trắc nghiệm Hóa học hiện đại, bài viết chuyên sâu về Hóa học phổ thông và đề thi chất lượng cao.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://thfat-edu.vercel.app",
  ogImage: "/images/og-default.png",
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
    url: "https://thfat-edu.vercel.app",
  },
} as const;
```

### 2.2 Robots File (`src/app/robots.ts`)
Export standard `MetadataRoute.Robots`:
- **Allowed**: `/`, `/articles`, `/articles/*`, `/exams`, `/leaderboard`
- **Disallowed**:
  - `/admin/`
  - `/admin/*`
  - `/login`
  - `/exams/*/room`
  - `/exams/*/result`
  - `/api/`
- **Sitemap**: `${siteConfig.url}/sitemap.xml`

### 2.3 Dynamic Sitemap (`src/app/sitemap.ts`)
Export standard `MetadataRoute.Sitemap`:
- **Static Routes**:
  - `/` (Priority: 1.0, ChangeFrequency: 'daily')
  - `/articles` (Priority: 0.9, ChangeFrequency: 'daily')
  - `/exams` (Priority: 0.8, ChangeFrequency: 'daily')
  - `/leaderboard` (Priority: 0.7, ChangeFrequency: 'daily')
- **Dynamic Routes**:
  - Fetches published articles via internal API endpoint (`/articles?status=published&limit=100`).
  - Maps each article to `${siteConfig.url}/articles/${article.slug}` with `lastModified: new Date(article.updatedAt || article.createdAt)`.
  - Encapsulated in `try/catch` with fallback returning static routes to prevent build-time crashes if the backend is unreachable during deployment.

---

## 3. Metadata & Page-Level Upgrades

### 3.1 Root Layout (`src/app/layout.tsx`)
Update `metadata` object:
- `metadataBase`: `new URL(siteConfig.url)`
- `title`: `{ default: siteConfig.defaultTitle, template: siteConfig.titleTemplate }`
- `description`: `siteConfig.description`
- `keywords`: `siteConfig.keywords`
- `authors`: `[{ name: siteConfig.author.name, url: siteConfig.author.url }]`
- `creator`: `siteConfig.author.name`
- `publisher`: `siteConfig.name`
- `alternates`: `{ canonical: "./" }`
- `openGraph`:
  - `type`: `"website"`
  - `locale`: `"vi_VN"`
  - `url`: `siteConfig.url`
  - `siteName`: `siteConfig.name`
  - `title`: `siteConfig.defaultTitle`
  - `description`: `siteConfig.description`
  - `images`: `[{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }]`
- `twitter`:
  - `card`: `"summary_large_image"`
  - `title`: `siteConfig.defaultTitle`
  - `description`: `siteConfig.description`
  - `images`: `[siteConfig.ogImage]`
- `robots`:
  - `index`: `true`
  - `follow`: `true`
  - `googleBot`: `{ index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 }`

### 3.2 Static Page Metadata
Add exported `metadata: Metadata` to:
- `src/app/articles/page.tsx`:
  - Title: `"Bài Viết & Tài Liệu Hóa Học"`
  - Description: `"Tổng hợp các bài viết chuyên đề Hóa học, phương pháp giải nhanh và kiến thức trọng tâm ôn thi THPT Quốc gia."`
  - Canonical: `"/articles"`
- `src/app/exams/page.tsx`:
  - Title: `"Thư Viện Đề Thi & Khảo Thí Hóa Học"`
  - Description: `"Luyện thi trắc nghiệm Hóa học với ngân hàng đề thi chuẩn cấu trúc, chấm điểm tự động và lời giải chi tiết."`
  - Canonical: `"/exams"`
- `src/app/leaderboard/page.tsx`:
  - Title: `"Bảng Vàng Thành Tích & Xếp Hạng"`
  - Description: `"Vinh danh những học sinh đạt điểm số cao nhất trong các kỳ khảo thí Hóa học tại TH FAT EDU."`
  - Canonical: `"/leaderboard"`

### 3.3 Dynamic Article Page (`src/app/articles/[slug]/page.tsx`)
1. **Server Fetch Helper (`fetchArticleServer`)**:
   - Queries `GET /api/articles/${slug}` with error handling.
   - If not found or error, returns `null`.
2. **`generateMetadata` Implementation**:
   - Fetches article data server-side.
   - Fallback metadata if article is not found: Title `"Không tìm thấy bài viết"`.
   - Rich metadata when found:
     - Title: `article.title`
     - Description: `article.summary || article.content.slice(0, 160)`
     - OpenGraph:
       - `type`: `"article"`
       - `publishedTime`: `article.createdAt`
       - `modifiedTime`: `article.updatedAt || article.createdAt`
       - `authors`: `[article.author?.name || siteConfig.author.name]`
       - `tags`: `article.tags || []`
       - `images`: `[{ url: article.thumbnailUrl || siteConfig.ogImage, width: 1200, height: 630, alt: article.title }]`
     - Alternates: `{ canonical: `/articles/${slug}` }`
3. **Server Component & Hydration**:
   - Invokes `notFound()` if `!article` to return HTTP 404 status.
   - Passes `initialData={article}` into `ArticleDetailClient`.
   - Updates `ArticleDetailClient` to accept `initialData?: TArticleDetail` in `useArticle` React Query options (`initialData: initialData`), providing immediate server-rendered HTML for search crawlers while maintaining client interactivity.

---

## 4. Structured Data (Schema.org / JSON-LD)

### 4.1 Component `JsonLd` (`src/components/seo/json-ld.tsx`)
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

### 4.2 Homepage Schema (`src/app/page.tsx`)
Embeds schema graphs:
- `EducationalOrganization`:
  - `@context`: `"https://schema.org"`
  - `@type`: `"EducationalOrganization"`
  - `name`: `siteConfig.name`
  - `url`: `siteConfig.url`
  - `logo`: `${siteConfig.url}/brand/logo.png`
  - `description`: `siteConfig.description`
- `WebSite`:
  - `@context`: `"https://schema.org"`
  - `@type`: `"WebSite"`
  - `name`: `siteConfig.name`
  - `url`: `siteConfig.url`
  - `potentialAction`:
    - `@type`: `"SearchAction"`
    - `target`: `${siteConfig.url}/articles?search={search_term_string}`
    - `query-input`: `"required name=search_term_string"`

### 4.3 Article Detail Schema (`src/app/articles/[slug]/page.tsx`)
- `Article`:
  - `@context`: `"https://schema.org"`
  - `@type`: `"Article"`
  - `headline`: `article.title`
  - `description`: `article.summary || article.content.slice(0, 160)`
  - `image`: `[article.thumbnailUrl || `${siteConfig.url}${siteConfig.ogImage}`]`
  - `datePublished`: `article.createdAt`
  - `dateModified`: `article.updatedAt || article.createdAt`
  - `author`: `{ "@type": "Person", "name": article.author?.name || siteConfig.author.name }`
  - `publisher`: `{ "@type": "Organization", "name": siteConfig.name, "logo": { "@type": "ImageObject", "url": `${siteConfig.url}/brand/logo.png` } }`
  - `mainEntityOfPage`: `{ "@type": "WebPage", "@id": `${siteConfig.url}/articles/${article.slug}` }`
- `BreadcrumbList`:
  - `@context`: `"https://schema.org"`
  - `@type`: `"BreadcrumbList"`
  - `itemListElement`:
    1. Position 1: Name "Trang chủ", Item `${siteConfig.url}`
    2. Position 2: Name "Bài viết", Item `${siteConfig.url}/articles`
    3. Position 3: Name `article.title`, Item `${siteConfig.url}/articles/${article.slug}`

---

## 5. Verification & Testing Plan

1. **Route Outputs Verification**:
   - `curl -I http://localhost:3000/robots.txt` -> confirms text/plain, valid crawler rules, references sitemap.
   - `curl -I http://localhost:3000/sitemap.xml` -> confirms application/xml, valid XML schema containing static and dynamic URLs.
2. **Raw HTML Inspection**:
   - Verify `<title>`, meta description, `og:image`, `og:title`, `twitter:card`, and canonical tags exist in initial SSR HTML payload.
   - Verify JSON-LD script blocks are correctly rendered and valid JSON without character escape errors.
3. **Type Checking & Code Quality**:
   - Run `bun run typecheck` across both `thfat-edu-fe` and workspace.
   - Ensure strict compliance with `CODING_STANDARDS.md` (no `any`, `type` over `interface`, max 3 parameters, 1 empty line after imports).
