import { type TSiteInfoValues } from "../types/settings.types";

export const SITE_INFO_CACHE_TAG = "site-info";

export const DEFAULT_SITE_INFO: TSiteInfoValues = {
  siteName: "ThFat Edu",
  slogan: "Học chắc bản chất, vững vàng phòng thi",
  contactEmail: "",
  facebookUrl: "",
  youtubeUrl: "",
  zaloUrl: "",
  tiktokUrl: "",
  telegramUrl: "",
  instagramUrl: "",
};

export const SOCIAL_FIELDS = [
  { name: "facebookUrl", label: "Facebook", placeholder: "https://facebook.com/..." },
  { name: "youtubeUrl", label: "YouTube", placeholder: "https://youtube.com/@..." },
  { name: "zaloUrl", label: "Zalo", placeholder: "https://zalo.me/..." },
  { name: "tiktokUrl", label: "TikTok", placeholder: "https://tiktok.com/@..." },
  { name: "telegramUrl", label: "Telegram", placeholder: "https://t.me/..." },
  { name: "instagramUrl", label: "Instagram", placeholder: "https://instagram.com/..." },
] as const;
