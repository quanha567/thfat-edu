import { Elysia, t } from "elysia";

import { authCookiePlugin } from "../auth/auth.cookie";
import { requireAuth } from "../auth/auth.guard";
import { authService } from "../auth/auth.service";
import {
  CheckInviteCodeResponseSchema,
  CreateInviteCodesBodySchema,
  CreateInviteCodesResponseSchema,
  InviteCodeResponseSchema,
  ListInviteCodesQuerySchema,
  PaginatedInviteCodesResponseSchema,
  RegisterBodySchema,
  RegisterResponseSchema,
} from "./invite-codes.model";
import { InviteCodesService } from "./invite-codes.service";

function extractClientInfo(request: Request) {
  return {
    userAgent: request.headers.get("user-agent") || undefined,
    ipAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("cf-connecting-ip") ||
      undefined,
  };
}

/** Quản trị viên phát hành và quản lý Invite Code. */
export const inviteCodesRoutes = new Elysia({ prefix: "/invite-codes" })
  .decorate("inviteCodesService", new InviteCodesService())
  .decorate("authService", authService)
  .use(
    requireAuth({
      roles: ["admin"],
      forbiddenMessage: "Chỉ quản trị viên mới có quyền truy cập chức năng này.",
    }),
  )
  .get("/", async ({ inviteCodesService, query }) => inviteCodesService.list(query), {
    query: ListInviteCodesQuerySchema,
    response: PaginatedInviteCodesResponseSchema,
    detail: {
      tags: ["Invite Codes"],
      summary: "Danh sách mã mời (phân trang, lọc theo trạng thái)",
    },
  })
  .post(
    "/",
    async ({ inviteCodesService, body, currentUser, set }) => {
      const items = await inviteCodesService.createBatch({
        data: body,
        createdById: currentUser.id,
      });

      set.status = 201;

      return { items };
    },
    {
      body: CreateInviteCodesBodySchema,
      response: { 201: CreateInviteCodesResponseSchema },
      detail: {
        tags: ["Invite Codes"],
        summary: "Tạo hàng loạt mã mời dùng một lần cho Student",
      },
    },
  )
  .post(
    "/:id/revoke",
    async ({ inviteCodesService, params: { id } }) => inviteCodesService.revoke(id),
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
      response: InviteCodeResponseSchema,
      detail: {
        tags: ["Invite Codes"],
        summary: "Thu hồi mã mời chưa dùng",
      },
    },
  );

/** Guest đăng ký bằng link mời. Đường tự đăng ký duy nhất của hệ thống. */
export const registerRoutes = new Elysia({ prefix: "/register" })
  .decorate("inviteCodesService", new InviteCodesService())
  .use(authCookiePlugin)
  .derive(({ request }) => ({
    clientInfo: extractClientInfo(request),
  }))
  .get(
    "/check/:code",
    async ({ inviteCodesService, params: { code } }) => {
      await inviteCodesService.assertUsable(code);

      return { valid: true as const };
    },
    {
      params: t.Object({ code: t.String({ maxLength: 32 }) }),
      response: CheckInviteCodeResponseSchema,
      detail: {
        tags: ["Register"],
        summary: "Kiểm tra mã mời còn dùng được (cho trang đăng ký)",
      },
    },
  )
  .post(
    "/",
    async ({ inviteCodesService, body, clientInfo, authSession, set }) => {
      const { user, sessionToken } = await inviteCodesService.register({
        data: body,
        clientInfo,
      });

      authSession.set(sessionToken);
      set.status = 201;

      return {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: "student" as const,
        },
        message: "Đăng ký thành công",
      };
    },
    {
      body: RegisterBodySchema,
      response: { 201: RegisterResponseSchema },
      detail: {
        tags: ["Register"],
        summary: "Đăng ký tài khoản Student bằng mã mời và đăng nhập luôn",
      },
    },
  );
