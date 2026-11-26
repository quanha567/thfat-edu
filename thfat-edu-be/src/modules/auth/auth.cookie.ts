import { type Cookie, Elysia } from "elysia";

export const SESSION_COOKIE_NAME = "session_token";
export const SESSION_HINT_COOKIE_NAME = "has_session";
export const SESSION_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export const SESSION_COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: SESSION_COOKIE_MAX_AGE,
  path: "/",
};

/**
 * Cookie không httpOnly chỉ báo "có Session" để FE biết có nên gọi /auth/me hay không (không chứa
 * token).
 */
export const SESSION_HINT_COOKIE_CONFIG = {
  ...SESSION_COOKIE_CONFIG,
  httpOnly: false,
};

export type TAuthSession = {
  token: string;
  set: (token: string) => void;
  clear: () => void;
};

export function extractSessionToken(cookieValue: unknown): string {
  return typeof cookieValue === "string" ? cookieValue : "";
}

export function setSessionCookie(cookie: Cookie<unknown>, token: string): void {
  cookie.set({
    ...SESSION_COOKIE_CONFIG,
    value: token,
  });
}

export function setSessionHintCookie(cookie: Cookie<unknown>): void {
  cookie.set({
    ...SESSION_HINT_COOKIE_CONFIG,
    value: "1",
  });
}

export function clearSessionCookie(cookie: Cookie<unknown>): void {
  cookie.remove();
}

export const authCookiePlugin = new Elysia({ name: "auth-cookie" }).derive(
  { as: "scoped" },
  ({ cookie, request }) => {
    const sessionCookie = cookie[SESSION_COOKIE_NAME];
    const hintCookie = cookie[SESSION_HINT_COOKIE_NAME];
    let token = extractSessionToken(sessionCookie?.value);

    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.slice(7).trim();
      }
    }

    return {
      sessionToken: token,
      authSession: {
        token,
        set: (newToken: string) => {
          setSessionCookie(sessionCookie, newToken);
          setSessionHintCookie(hintCookie);
        },
        clear: () => {
          clearSessionCookie(sessionCookie);
          clearSessionCookie(hintCookie);
        },
      },
    };
  },
);
