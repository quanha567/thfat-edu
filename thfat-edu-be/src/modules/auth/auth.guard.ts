import { Elysia } from "elysia";

import { ForbiddenError, UnauthorizedError } from "../../middlewares/error-handler";
import { extractSessionToken, SESSION_COOKIE_NAME } from "./auth.cookie";
import { type TUserResponse } from "./auth.model";
import { type AuthService, authService as defaultAuthService } from "./auth.service";

export type TUserRole = TUserResponse["role"];

export type TRequireAuthOptions = {
  roles?: readonly TUserRole[];
  unauthorizedMessage?: string;
  forbiddenMessage?: string;
};

export type TRequireRoleOptions = {
  roles: readonly TUserRole[];
  forbiddenMessage?: string;
};

const DEFAULT_UNAUTHORIZED_MESSAGE = "Bạn cần đăng nhập để thực hiện thao tác này.";
const DEFAULT_FORBIDDEN_MESSAGE = "Bạn không có quyền truy cập chức năng này.";

function assertRole({
  user,
  roles,
  forbiddenMessage,
}: {
  user: TUserResponse;
  roles: readonly TUserRole[] | undefined;
  forbiddenMessage: string;
}): void {
  if (!roles || roles.includes(user.role)) {
    return;
  }

  throw new ForbiddenError(forbiddenMessage);
}

/**
 * Yêu cầu Session hợp lệ (cookie hoặc Bearer). Tuỳ chọn giới hạn theo role. Chỉ áp dụng cho các
 * route được khai báo SAU khi `.use(requireAuth(...))`. Cung cấp `currentUser` (đã đăng nhập) và
 * `sessionToken` cho handler.
 */
export function requireAuth(options: TRequireAuthOptions = {}) {
  const {
    roles,
    unauthorizedMessage = DEFAULT_UNAUTHORIZED_MESSAGE,
    forbiddenMessage = DEFAULT_FORBIDDEN_MESSAGE,
  } = options;

  return new Elysia().derive({ as: "scoped" }, async (context) => {
    const sessionToken = readSessionToken(context);
    const authService = resolveAuthService(context);

    if (!sessionToken) {
      throw new UnauthorizedError(unauthorizedMessage);
    }

    const currentUser = await authService.getCurrentUser(sessionToken);

    assertRole({ user: currentUser, roles, forbiddenMessage });

    return { currentUser, sessionToken };
  });
}

/** Optional Auth: Guest vẫn đi qua với `currentUser = null`; Session hợp lệ cho `currentUser`. */
export function optionalAuth() {
  return new Elysia().derive({ as: "scoped" }, async (context) => {
    const sessionToken = readSessionToken(context);
    const authService = resolveAuthService(context);

    if (!sessionToken) {
      return { currentUser: null as TUserResponse | null };
    }

    try {
      const currentUser = await authService.getCurrentUser(sessionToken);

      return { currentUser: currentUser as TUserResponse | null };
    } catch {
      return { currentUser: null as TUserResponse | null };
    }
  });
}

/**
 * Siết thêm role cho các route khai báo SAU nó, dựa trên `currentUser` do `requireAuth()` đã tạo
 * trước đó (không truy vấn DB lần nữa).
 */
export function requireRole({ roles, forbiddenMessage }: TRequireRoleOptions) {
  return new Elysia().onBeforeHandle({ as: "scoped" }, (context) => {
    const { currentUser } = context as { currentUser?: TUserResponse };

    if (!currentUser) {
      throw new UnauthorizedError(DEFAULT_UNAUTHORIZED_MESSAGE);
    }

    assertRole({
      user: currentUser,
      roles,
      forbiddenMessage: forbiddenMessage ?? DEFAULT_FORBIDDEN_MESSAGE,
    });
  });
}

function resolveAuthService(context: unknown): AuthService {
  const { authService } = context as { authService?: AuthService };

  return authService ?? defaultAuthService;
}

function readSessionToken(context: unknown): string {
  const { cookie, request } = context as {
    cookie?: Record<string, { value?: unknown } | undefined>;
    request: Request;
  };
  const fromCookie = extractSessionToken(cookie?.[SESSION_COOKIE_NAME]?.value);

  if (fromCookie) {
    return fromCookie;
  }

  const authHeader = request.headers.get("authorization");

  return authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
}
