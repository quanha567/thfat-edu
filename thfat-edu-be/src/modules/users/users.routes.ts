import { Elysia, t } from "elysia";

import { ForbiddenError, UnauthorizedError } from "../../middlewares/error-handler";
import { extractSessionToken, SESSION_COOKIE_NAME } from "../auth/auth.cookie";
import { authService } from "../auth/auth.service";
import {
  ActionSuccessResponseSchema,
  CreateUserBodySchema,
  ListUsersQuerySchema,
  PaginatedUsersResponseSchema,
  ResetPasswordBodySchema,
  ToggleActiveBodySchema,
  UpdateUserBodySchema,
  UserDetailResponseSchema,
} from "./users.model";
import { UsersService } from "./users.service";

export const usersRoutes = new Elysia({ prefix: "/users" })
  .decorate("usersService", new UsersService())
  .decorate("authService", authService)
  .derive(async ({ cookie, request, authService: activeAuthService }) => {
    let token = extractSessionToken(cookie[SESSION_COOKIE_NAME]?.value);
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.slice(7).trim();
      }
    }

    if (!token) {
      throw new UnauthorizedError("Bạn cần đăng nhập để thực hiện thao tác này.");
    }

    const currentAuthService = activeAuthService ?? authService;
    const currentUser = await currentAuthService.getCurrentUser(token);
    if (!currentUser || currentUser.role !== "admin") {
      throw new ForbiddenError("Chỉ quản trị viên mới có quyền truy cập chức năng này.");
    }

    return { currentUser, sessionToken: token };
  })
  .get(
    "/",
    async ({ usersService, query }) => {
      return usersService.listUsers(query);
    },
    {
      query: ListUsersQuerySchema,
      response: PaginatedUsersResponseSchema,
      detail: {
        tags: ["Users"],
        summary: "Danh sách người dùng (Phân trang, tìm kiếm, lọc theo vai trò và trạng thái)",
      },
    },
  )
  .get(
    "/:id",
    async ({ usersService, params: { id } }) => {
      return usersService.getUserById(id);
    },
    {
      params: t.Object({ id: t.String() }),
      response: UserDetailResponseSchema,
      detail: {
        tags: ["Users"],
        summary: "Xem thông tin chi tiết người dùng",
      },
    },
  )
  .post(
    "/",
    async ({ usersService, body }) => {
      return usersService.createUser(body);
    },
    {
      body: CreateUserBodySchema,
      response: UserDetailResponseSchema,
      detail: {
        tags: ["Users"],
        summary: "Tạo tài khoản người dùng mới (Đồng bộ Firebase Auth và Profile)",
      },
    },
  )
  .patch(
    "/:id",
    async ({ usersService, params: { id }, body, currentUser }) => {
      return usersService.updateUser({
        id,
        currentAdminId: currentUser.id,
        data: body,
      });
    },
    {
      params: t.Object({ id: t.String() }),
      body: UpdateUserBodySchema,
      response: UserDetailResponseSchema,
      detail: {
        tags: ["Users"],
        summary: "Cập nhật thông tin và hồ sơ người dùng",
      },
    },
  )
  .patch(
    "/:id/toggle-active",
    async ({ usersService, params: { id }, body, currentUser }) => {
      return usersService.toggleActive({
        id,
        currentAdminId: currentUser.id,
        isActive: body.isActive,
      });
    },
    {
      params: t.Object({ id: t.String() }),
      body: ToggleActiveBodySchema,
      response: UserDetailResponseSchema,
      detail: {
        tags: ["Users"],
        summary: "Khóa hoặc kích hoạt lại tài khoản người dùng",
      },
    },
  )
  .post(
    "/:id/reset-password",
    async ({ usersService, params: { id }, body }) => {
      return usersService.resetPassword({
        id,
        data: body,
      });
    },
    {
      params: t.Object({ id: t.String() }),
      body: ResetPasswordBodySchema,
      response: ActionSuccessResponseSchema,
      detail: {
        tags: ["Users"],
        summary: "Đặt lại mật khẩu hoặc sinh link reset mật khẩu qua Firebase",
      },
    },
  )
  .delete(
    "/:id",
    async ({ usersService, params: { id }, currentUser }) => {
      await usersService.softDeleteUser({
        id,
        currentAdminId: currentUser.id,
      });

      return { message: "Đã xóa mềm người dùng thành công." };
    },
    {
      params: t.Object({ id: t.String() }),
      response: ActionSuccessResponseSchema,
      detail: {
        tags: ["Users"],
        summary: "Xóa mềm người dùng (Soft Delete)",
      },
    },
  )
  .post(
    "/:id/restore",
    async ({ usersService, params: { id } }) => {
      const user = await usersService.restoreUser(id);

      return {
        message: "Đã khôi phục tài khoản thành công.",
        user,
      };
    },
    {
      params: t.Object({ id: t.String() }),
      response: ActionSuccessResponseSchema,
      detail: {
        tags: ["Users"],
        summary: "Khôi phục tài khoản đã bị xóa mềm",
      },
    },
  );
