export const SESSION_HINT_COOKIE_NAME = "has_session";

/** Cookie báo hiệu có Session (không chứa token) để tránh gọi /auth/me khi là Guest. */
export function hasSessionHint(): boolean {
  if (typeof document === "undefined") return false;

  return document.cookie.split("; ").some((entry) => entry === `${SESSION_HINT_COOKIE_NAME}=1`);
}

export function clearSessionHint(): void {
  if (typeof document === "undefined") return;

  document.cookie = `${SESSION_HINT_COOKIE_NAME}=; path=/; max-age=0`;
}
