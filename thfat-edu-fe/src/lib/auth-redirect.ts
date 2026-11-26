import { isProtectedPath } from "./protected-routes";

export type TUnauthorizedHandler = () => void;

const AUTH_API_SEGMENT = "/auth/";

function resolveRequestUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;

  return input.url;
}

function isAppApiRequest(url: string): boolean {
  try {
    const { origin, pathname } = new URL(url, window.location.origin);

    return origin === window.location.origin && pathname.startsWith("/api/");
  } catch {
    return false;
  }
}

/**
 * Khi API của ứng dụng trả 401 (Session hết hạn/bị thu hồi) lúc đang ở trang cần đăng nhập: gọi
 * `onUnauthorized` (xóa cache người dùng) rồi chuyển tới `/login?redirect=...`. Bỏ qua các lời gọi
 * `/auth/*` (login, me, logout) để không tạo vòng lặp. Trả về hàm gỡ bỏ.
 */
export function installUnauthorizedRedirect(onUnauthorized: TUnauthorizedHandler): () => void {
  const originalFetch = window.fetch;
  let redirecting = false;

  window.fetch = async (input, init) => {
    const response = await originalFetch(input, init);
    const url = resolveRequestUrl(input);

    if (
      response.status !== 401 ||
      redirecting ||
      !isAppApiRequest(url) ||
      url.includes(AUTH_API_SEGMENT) ||
      !isProtectedPath(window.location.pathname)
    ) {
      return response;
    }

    redirecting = true;
    onUnauthorized();

    const target = `${window.location.pathname}${window.location.search}`;
    // Xóa cookie phiên cũ (httpOnly) để proxy không đẩy /login về trang chủ.
    void originalFetch("/api/auth/logout", { method: "POST", credentials: "include" })
      .catch(() => undefined)
      .finally(() => {
        window.location.assign(`/login?redirect=${encodeURIComponent(target)}`);
      });

    return response;
  };

  return () => {
    window.fetch = originalFetch;
  };
}
