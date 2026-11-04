import { Elysia } from "elysia";

import { authCookiePlugin, type TAuthSession } from "./auth.cookie";
import {
  AuthSuccessResponseSchema,
  LoginBodySchema,
  LogoutResponseSchema,
  type TLoginBody,
  UserResponseSchema,
} from "./auth.model";
import { AuthService } from "./auth.service";

// ── Context Types ─────────────────────────────────────────────────────
type TClientInfo = {
  userAgent?: string;
  ipAddress?: string;
};

type TLoginHandlerOptions = {
  body: TLoginBody;
  authService: AuthService;
  clientInfo: TClientInfo;
  authSession: TAuthSession;
};

type TGetCurrentUserHandlerOptions = {
  authService: AuthService;
  sessionToken: string;
};

type TLogoutHandlerOptions = {
  authService: AuthService;
  sessionToken: string;
  authSession: TAuthSession;
};

// ── Route Configurations ──────────────────────────────────────────────
const loginRouteConfig = {
  body: LoginBodySchema,
  response: AuthSuccessResponseSchema,
  detail: {
    tags: ["Auth"],
    summary: "Đăng nhập bằng Firebase ID Token",
    description:
      "Xác thực Firebase ID Token, kiểm tra whitelist trong cơ sở dữ liệu và cấp HttpOnly Cookie phiên",
  },
};

const getCurrentUserRouteConfig = {
  response: UserResponseSchema,
  detail: {
    tags: ["Auth"],
    summary: "Lấy thông tin người dùng hiện tại",
    description: "Lấy thông tin người dùng từ HttpOnly session cookie",
  },
};

const logoutRouteConfig = {
  response: LogoutResponseSchema,
  detail: {
    tags: ["Auth"],
    summary: "Đăng xuất tài khoản",
    description: "Hủy phiên trong DB và xóa cookie phiên của người dùng",
  },
};

// ── Helpers ───────────────────────────────────────────────────────────
function extractClientInfo(request: Request): TClientInfo {
  return {
    userAgent: request.headers.get("user-agent") || undefined,
    ipAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("cf-connecting-ip") ||
      undefined,
  };
}

// ── Route Handlers (Controller) ──────────────────────────────────────
export async function handleLogin({
  body,
  authService,
  clientInfo,
  authSession,
}: TLoginHandlerOptions) {
  const { user, sessionToken } = await authService.login({
    idToken: body.idToken,
    ...clientInfo,
  });

  authSession.set(sessionToken);

  return {
    user,
    message: "Đăng nhập thành công",
  };
}

export async function handleGetCurrentUser({
  authService,
  sessionToken,
}: TGetCurrentUserHandlerOptions) {
  const user = await authService.getCurrentUser(sessionToken);

  return user;
}

export async function handleLogout({
  authService,
  sessionToken,
  authSession,
}: TLogoutHandlerOptions) {
  if (sessionToken) {
    await authService.logout(sessionToken);
  }

  authSession.clear();

  return {
    message: "Đăng xuất thành công",
  };
}

// ── Route Definition ──────────────────────────────────────────────────
export const authRoutes = new Elysia({ prefix: "/auth" })
  .decorate("authService", new AuthService())
  .use(authCookiePlugin)
  .derive(({ request }) => ({
    clientInfo: extractClientInfo(request),
  }))
  .post("/login", handleLogin, loginRouteConfig)
  .get("/me", handleGetCurrentUser, getCurrentUserRouteConfig)
  .post("/logout", handleLogout, logoutRouteConfig);
