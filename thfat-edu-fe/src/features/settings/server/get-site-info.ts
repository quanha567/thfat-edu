import { getApiBaseUrl } from "@/lib/api";
import { cacheLife, cacheTag } from "next/cache";

import { DEFAULT_SITE_INFO, SITE_INFO_CACHE_TAG } from "../constants/site-info.constants";
import { type TSiteInfoValues } from "../types/settings.types";

function pickString(source: Record<string, unknown>, key: keyof TSiteInfoValues): string {
  const raw = source[key];

  return typeof raw === "string" ? raw : DEFAULT_SITE_INFO[key];
}

function parseSiteInfo(data: unknown): TSiteInfoValues {
  if (typeof data !== "object" || data === null) {
    return DEFAULT_SITE_INFO;
  }

  const source = data as Record<string, unknown>;
  const siteName = pickString(source, "siteName").trim();

  return {
    siteName: siteName || DEFAULT_SITE_INFO.siteName,
    slogan: pickString(source, "slogan"),
    contactEmail: pickString(source, "contactEmail"),
    facebookUrl: pickString(source, "facebookUrl"),
    youtubeUrl: pickString(source, "youtubeUrl"),
    zaloUrl: pickString(source, "zaloUrl"),
    tiktokUrl: pickString(source, "tiktokUrl"),
    telegramUrl: pickString(source, "telegramUrl"),
    instagramUrl: pickString(source, "instagramUrl"),
  };
}

/**
 * Reads the public Site Info for the footer. Falls back to defaults on any failure so a backend
 * outage never breaks public pages.
 */
export async function getSiteInfo(): Promise<TSiteInfoValues> {
  "use cache";

  cacheTag(SITE_INFO_CACHE_TAG);
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });

  try {
    const res = await fetch(`${getApiBaseUrl()}/site-info`);

    if (!res.ok) {
      return DEFAULT_SITE_INFO;
    }

    return parseSiteInfo(await res.json());
  } catch {
    return DEFAULT_SITE_INFO;
  }
}
