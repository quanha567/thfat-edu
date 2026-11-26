import { isProtectedPath } from "@/lib/protected-routes";
import { SESSION_HINT_COOKIE_NAME } from "@/lib/session-hint";
import { NextResponse, type NextRequest } from "next/server";

const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

function syncSessionHint({
  request,
  response,
  hasSession,
}: {
  request: NextRequest;
  response: NextResponse;
  hasSession: boolean;
}): NextResponse {
  const hasHint = request.cookies.get(SESSION_HINT_COOKIE_NAME)?.value === "1";

  if (hasSession && !hasHint) {
    response.cookies.set(SESSION_HINT_COOKIE_NAME, "1", {
      path: "/",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SECONDS,
      secure: process.env.NODE_ENV === "production",
    });
  }

  if (!hasSession && hasHint) {
    response.cookies.delete(SESSION_HINT_COOKIE_NAME);
  }

  return response;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const sessionToken = request.cookies.get("session_token")?.value;
  const hasSession = Boolean(sessionToken);

  if (isProtectedPath(pathname) && !hasSession) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", `${pathname}${search}`);

    return syncSessionHint({ request, response: NextResponse.redirect(redirectUrl), hasSession });
  }

  if (pathname === "/login" && hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return syncSessionHint({ request, response: NextResponse.next(), hasSession });
}

export const config = {
  // Mọi trang (trừ API, tài nguyên tĩnh) để đồng bộ cookie báo hiệu Session.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
