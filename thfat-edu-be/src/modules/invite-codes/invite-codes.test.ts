import { describe, expect, it } from "bun:test";

import { Elysia } from "elysia";

import {
  BadRequestError,
  errorHandlerPlugin,
  UnauthorizedError,
} from "../../middlewares/error-handler";
import { resolveBucket } from "../../middlewares/rate-limit";
import { type AuthService } from "../auth/auth.service";
import { inviteCodesRoutes, registerRoutes } from "./invite-codes.routes";
import {
  generateInviteCode,
  type InviteCodesService,
  normalizeInviteCode,
  resolveInviteCodeStatus,
} from "./invite-codes.service";

const HOUR_MS = 60 * 60 * 1000;

describe("Invite code helpers", () => {
  it("generates 10-character codes without ambiguous characters", () => {
    for (let index = 0; index < 200; index += 1) {
      expect(generateInviteCode()).toMatch(/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{10}$/);
    }
  });

  it("normalizes user input", () => {
    expect(normalizeInviteCode("  ab12cd  ")).toBe("AB12CD");
  });

  it("resolves status with precedence used > revoked > expired > active", () => {
    const now = new Date();
    const future = new Date(now.getTime() + HOUR_MS);
    const past = new Date(now.getTime() - HOUR_MS);

    expect(resolveInviteCodeStatus({ usedAt: now, revokedAt: now, expiresAt: past }, now)).toBe(
      "used",
    );
    expect(resolveInviteCodeStatus({ usedAt: null, revokedAt: now, expiresAt: past }, now)).toBe(
      "revoked",
    );
    expect(resolveInviteCodeStatus({ usedAt: null, revokedAt: null, expiresAt: past }, now)).toBe(
      "expired",
    );
    expect(resolveInviteCodeStatus({ usedAt: null, revokedAt: null, expiresAt: future }, now)).toBe(
      "active",
    );
  });
});

describe("Rate limit bucket", () => {
  it("routes register paths to the register bucket", () => {
    expect(resolveBucket({ method: "POST", path: "/register" })).toBe("register");
    expect(resolveBucket({ method: "GET", path: "/register/check/ABC" })).toBe("register");
    expect(resolveBucket({ method: "GET", path: "/invite-codes" })).toBe("read");
  });
});

describe("Invite codes routes", () => {
  const adminUser = {
    id: "admin-1",
    email: "admin@thfat.edu.vn",
    fullName: "Admin",
    avatarUrl: null,
    role: "admin" as const,
    isActive: true,
    studentProfile: null,
    teacherProfile: null,
  };
  const studentUser = { ...adminUser, id: "student-1", role: "student" as const };

  const mockAuthService = {
    getCurrentUser: async (token: string) => {
      if (token === "admin-token") return adminUser;
      if (token === "student-token") return studentUser;
      throw new UnauthorizedError("Unauthorized");
    },
  } as unknown as AuthService;

  const sampleItem = {
    id: "code-1",
    code: "ABCDEFGHJK",
    note: "Lớp 12A1",
    status: "active" as const,
    expiresAt: new Date(Date.now() + HOUR_MS).toISOString(),
    revokedAt: null,
    usedAt: null,
    usedByUserId: null,
    usedByEmail: null,
    usedByName: null,
    createdAt: new Date().toISOString(),
  };

  let lastCreateInput: unknown = null;

  const mockService = {
    list: async () => ({ items: [sampleItem], total: 1, page: 1, limit: 20 }),
    createBatch: async (input: unknown) => {
      lastCreateInput = input;

      return [sampleItem];
    },
    revoke: async () => ({ ...sampleItem, status: "revoked" as const }),
    assertUsable: async (code: string) => {
      if (code !== "GOODCODE22") throw new BadRequestError("Mã mời không hợp lệ.");

      return {};
    },
    register: async ({ data }: { data: { email: string; fullName: string } }) => ({
      user: { id: "new-1", email: data.email, fullName: data.fullName },
      sessionToken: "new-session-token",
    }),
  } as unknown as InviteCodesService;

  const adminApp = new Elysia()
    .use(errorHandlerPlugin)
    .decorate("authService", mockAuthService)
    .decorate("inviteCodesService", mockService)
    .use(inviteCodesRoutes);

  const publicApp = new Elysia()
    .use(errorHandlerPlugin)
    .decorate("inviteCodesService", mockService)
    .use(registerRoutes);

  const adminHeaders = { authorization: "Bearer admin-token", "content-type": "application/json" };

  it("rejects unauthenticated and non-admin access to admin routes", async () => {
    const anonymous = await adminApp.handle(new Request("http://localhost/invite-codes"));
    const student = await adminApp.handle(
      new Request("http://localhost/invite-codes", {
        headers: { authorization: "Bearer student-token" },
      }),
    );

    expect(anonymous.status).toBe(401);
    expect(student.status).toBe(403);
  });

  it("lets admin list invite codes", async () => {
    const res = await adminApp.handle(
      new Request("http://localhost/invite-codes", { headers: adminHeaders }),
    );
    const body = (await res.json()) as { items: unknown[]; total: number };

    expect(res.status).toBe(200);
    expect(body.total).toBe(1);
  });

  it("lets admin create a batch and records the creator", async () => {
    const res = await adminApp.handle(
      new Request("http://localhost/invite-codes", {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({ count: 3, note: "Lớp 12A1" }),
      }),
    );

    expect(res.status).toBe(201);
    expect((lastCreateInput as { createdById: string }).createdById).toBe("admin-1");
  });

  it("rejects batches larger than 100 codes", async () => {
    const res = await adminApp.handle(
      new Request("http://localhost/invite-codes", {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({ count: 101 }),
      }),
    );

    expect(res.status).toBe(422);
  });

  it("lets admin revoke a code", async () => {
    const res = await adminApp.handle(
      new Request("http://localhost/invite-codes/code-1/revoke", {
        method: "POST",
        headers: adminHeaders,
      }),
    );
    const body = (await res.json()) as { status: string };

    expect(res.status).toBe(200);
    expect(body.status).toBe("revoked");
  });

  it("checks a valid code publicly and rejects an invalid one with a generic error", async () => {
    const ok = await publicApp.handle(new Request("http://localhost/register/check/GOODCODE22"));
    const bad = await publicApp.handle(new Request("http://localhost/register/check/NOPE"));
    const badBody = (await bad.json()) as { message: string };

    expect(ok.status).toBe(200);
    expect(bad.status).toBe(400);
    expect(badBody.message).toBe("Mã mời không hợp lệ.");
  });

  it("registers a student and sets the session cookie", async () => {
    const res = await publicApp.handle(
      new Request("http://localhost/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          code: "GOODCODE22",
          fullName: "Học Sinh Mới",
          email: "new@thfat.edu.vn",
          password: "password123",
        }),
      }),
    );
    const body = (await res.json()) as { user: { role: string } };

    expect(res.status).toBe(201);
    expect(body.user.role).toBe("student");
    expect(res.headers.get("set-cookie")).toContain("session_token=new-session-token");
  });

  it("validates the register body", async () => {
    const res = await publicApp.handle(
      new Request("http://localhost/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: "GOODCODE22", fullName: "A", email: "bad", password: "123" }),
      }),
    );

    expect(res.status).toBe(422);
  });
});
