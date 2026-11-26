import { describe, expect, it } from "bun:test";

import { Elysia } from "elysia";

import { errorHandlerPlugin, UnauthorizedError } from "../../middlewares/error-handler";
import { type AuthService } from "../auth/auth.service";
import { usersRoutes } from "./users.routes";
import { type UsersService } from "./users.service";

describe("Users Module (Routes & Access Control)", () => {
  const mockAdminUser = {
    id: "admin-uuid-1",
    email: "admin@thfat.edu.vn",
    fullName: "Admin Quản Trị",
    avatarUrl: null,
    role: "admin" as const,
    isActive: true,
    studentProfile: null,
    teacherProfile: null,
  };

  const mockStudentUser = {
    id: "student-uuid-2",
    email: "student@thfat.edu.vn",
    fullName: "Học Sinh A",
    avatarUrl: null,
    role: "student" as const,
    isActive: true,
    studentProfile: null,
    teacherProfile: null,
  };

  const mockAuthService = {
    getCurrentUser: async (token: string) => {
      if (!token) throw new UnauthorizedError("Unauthorized");
      if (token === "admin-token") return mockAdminUser;
      if (token === "student-token") return mockStudentUser;
      throw new UnauthorizedError("Invalid token");
    },
  } as unknown as AuthService;

  const mockUsersService = {
    listUsers: async () => ({
      items: [
        {
          id: "user-1",
          firebaseUid: "fb-1",
          email: "student1@thfat.edu.vn",
          fullName: "Học Sinh 1",
          avatarUrl: null,
          role: "student",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
          studentProfile: {
            id: "sp-1",
            studentCode: "HS001",
            grade: "12",
            schoolName: "THPT Chuyên",
            dateOfBirth: "2008-01-01",
            parentPhone: "0900000001",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          teacherProfile: null,
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    }),
    getUserById: async (id: string) => ({
      id,
      firebaseUid: "fb-1",
      email: "student1@thfat.edu.vn",
      fullName: "Học Sinh 1",
      avatarUrl: null,
      role: "student" as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      studentProfile: null,
      teacherProfile: null,
    }),
    createUser: async (data: unknown) => ({
      id: "new-user-id",
      firebaseUid: "fb-new",
      email: (data as { email: string }).email,
      fullName: (data as { fullName: string }).fullName,
      avatarUrl: null,
      role: (data as { role: "student" | "teacher" | "admin" }).role,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      studentProfile: null,
      teacherProfile: null,
    }),
    updateUser: async () => ({
      id: "updated-user-id",
      firebaseUid: "fb-updated",
      email: "updated@thfat.edu.vn",
      fullName: "Updated Name",
      avatarUrl: null,
      role: "student" as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      studentProfile: null,
      teacherProfile: null,
    }),
    toggleActive: async ({ isActive }: { isActive: boolean }) => ({
      id: "toggled-user-id",
      firebaseUid: "fb-toggled",
      email: "toggled@thfat.edu.vn",
      fullName: "Toggled Name",
      avatarUrl: null,
      role: "student" as const,
      isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      studentProfile: null,
      teacherProfile: null,
    }),
    softDeleteUser: async () => {},
    restoreUser: async (id: string) => ({
      id,
      firebaseUid: "fb-restored",
      email: "restored@thfat.edu.vn",
      fullName: "Restored Name",
      avatarUrl: null,
      role: "student" as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      studentProfile: null,
      teacherProfile: null,
    }),
    resetPassword: async () => ({
      message: "Đã đổi mật khẩu thành công và thu hồi các phiên đăng nhập cũ.",
    }),
  } as unknown as UsersService;

  const testApp = new Elysia()
    .use(errorHandlerPlugin)
    .decorate("authService", mockAuthService)
    .decorate("usersService", mockUsersService)
    .use(usersRoutes);

  it("should reject unauthenticated request with 401", async () => {
    const res = await testApp.handle(new Request("http://localhost/users"));
    expect(res.status).toBe(401);
  });

  it("should reject non-admin request with 403", async () => {
    const res = await testApp.handle(
      new Request("http://localhost/users", {
        headers: {
          authorization: "Bearer student-token",
        },
      }),
    );
    expect(res.status).toBe(403);
  });

  it("should allow admin to list users", async () => {
    const res = await testApp.handle(
      new Request("http://localhost/users?page=1&limit=10", {
        headers: {
          authorization: "Bearer admin-token",
        },
      }),
    );
    expect(res.status).toBe(200);

    const data = (await res.json()) as { items: unknown[]; total: number };
    expect(data.total).toBe(1);
    expect(data.items.length).toBe(1);
  });

  it("should allow admin to create a user", async () => {
    const res = await testApp.handle(
      new Request("http://localhost/users", {
        method: "POST",
        headers: {
          authorization: "Bearer admin-token",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: "newstudent@thfat.edu.vn",
          fullName: "Học sinh mới",
          role: "student",
          password: "password123",
        }),
      }),
    );
    expect(res.status).toBe(200);

    const user = (await res.json()) as { email: string };
    expect(user.email).toBe("newstudent@thfat.edu.vn");
  });

  it("should allow admin to update user", async () => {
    const res = await testApp.handle(
      new Request("http://localhost/users/11111111-1111-4111-8111-111111111111", {
        method: "PATCH",
        headers: {
          authorization: "Bearer admin-token",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          fullName: "Updated Name",
        }),
      }),
    );
    expect(res.status).toBe(200);

    const user = (await res.json()) as { fullName: string };
    expect(user.fullName).toBe("Updated Name");
  });

  it("should allow admin to toggle active status", async () => {
    const res = await testApp.handle(
      new Request("http://localhost/users/11111111-1111-4111-8111-111111111111/toggle-active", {
        method: "PATCH",
        headers: {
          authorization: "Bearer admin-token",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          isActive: false,
        }),
      }),
    );
    expect(res.status).toBe(200);

    const user = (await res.json()) as { isActive: boolean };
    expect(user.isActive).toBe(false);
  });

  it("should allow admin to reset password", async () => {
    const res = await testApp.handle(
      new Request("http://localhost/users/11111111-1111-4111-8111-111111111111/reset-password", {
        method: "POST",
        headers: {
          authorization: "Bearer admin-token",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          newPassword: "newsecretpassword123",
        }),
      }),
    );
    expect(res.status).toBe(200);

    const result = (await res.json()) as { message: string };
    expect(result.message).toContain("Đã đổi mật khẩu thành công");
  });

  it("should allow admin to soft delete user", async () => {
    const res = await testApp.handle(
      new Request("http://localhost/users/11111111-1111-4111-8111-111111111111", {
        method: "DELETE",
        headers: {
          authorization: "Bearer admin-token",
        },
      }),
    );
    expect(res.status).toBe(200);

    const result = (await res.json()) as { message: string };
    expect(result.message).toContain("Đã xóa mềm người dùng");
  });
});
