"use server";

import { updateTag } from "next/cache";

import { SITE_INFO_CACHE_TAG } from "../constants/site-info.constants";

export async function revalidateSiteInfo(): Promise<void> {
  updateTag(SITE_INFO_CACHE_TAG);
}
