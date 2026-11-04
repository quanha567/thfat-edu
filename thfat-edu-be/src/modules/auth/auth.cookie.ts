import { type Cookie, Elysia } from "elysia";

export const SESSION_COOKIE_NAME = "session_token";
export const SESSION_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export const SESSION_COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: SESSION_COOKIE_MAX_AGE,
  path: "/",
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

export function clearSessionCookie(cookie: Cookie<unknown>): void {
  cookie.remove();
}

export const authCookiePlugin = new Elysia({ name: "auth-cookie" }).derive(
  { as: "scoped" },
  ({ cookie }) => {
    const sessionCookie = cookie[SESSION_COOKIE_NAME];
    const token = extractSessionToken(sessionCookie?.value);

    return {
      sessionToken: token,
      authSession: {
        token,
        set: (newToken: string) => {
          setSessionCookie(sessionCookie, newToken);
        },
        clear: () => {
          clearSessionCookie(sessionCookie);
        },
      },
    };
  },
);
