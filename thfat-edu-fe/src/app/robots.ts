import { siteConfig } from "@/config/site.config";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/admin/*", "/login", "/exams/*/room", "/exams/*/result", "/api/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
