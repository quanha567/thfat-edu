import { getApiBaseUrl } from "@/lib/api";

export function getInviteCodesApiUrl(path = ""): string {
  const baseUrl = getApiBaseUrl();
  const cleanBase = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;

  return `${cleanBase}${path}`;
}

/** Link mời gửi cho Guest. Mã nằm trong query của trang đăng ký. */
export function buildInviteLink(code: string): string {
  return `${window.location.origin}/register?code=${encodeURIComponent(code)}`;
}
