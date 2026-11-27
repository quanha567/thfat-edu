import { describe, expect, it } from "bun:test";

import { Elysia } from "elysia";

import { app } from "./index";
import { bearer, createMockAuthService, type TTestRole } from "./modules/auth/auth.test-utils";

type TRoute = {
  method: string;
  path: string;
  /** Roles that must NOT be denied; every other role (and Guest) must be rejected. */
  allowed: readonly TTestRole[];
};

const ANY_USER: readonly TTestRole[] = ["student", "teacher", "admin"];
const STAFF: readonly TTestRole[] = ["teacher", "admin"];
const ADMIN_ONLY: readonly TTestRole[] = ["admin"];

const ROUTES: readonly TRoute[] = [
  // Mock Exam: Student trở lên, Guest bị chặn
  { method: "GET", path: "/student-exams", allowed: ANY_USER },
  { method: "POST", path: "/student-exams/x/start", allowed: ANY_USER },
  { method: "PUT", path: "/student-exams/x/sync", allowed: ANY_USER },
  { method: "POST", path: "/student-exams/x/submit", allowed: ANY_USER },
  { method: "GET", path: "/student-exams/x/result", allowed: ANY_USER },
  // Upload
  { method: "POST", path: "/upload/avatar", allowed: ANY_USER },
  // Quizzes: chỉ teacher/admin
  { method: "GET", path: "/quizzes", allowed: STAFF },
  { method: "GET", path: "/quizzes/x", allowed: STAFF },
  { method: "POST", path: "/quizzes", allowed: STAFF },
  { method: "PUT", path: "/quizzes/x", allowed: STAFF },
  { method: "DELETE", path: "/quizzes/x", allowed: STAFF },
  { method: "POST", path: "/quizzes/ai/solve-question", allowed: STAFF },
  { method: "POST", path: "/quizzes/import/jobs", allowed: STAFF },
  { method: "GET", path: "/quizzes/import/jobs/x/stream", allowed: STAFF },
  { method: "DELETE", path: "/quizzes/import/jobs/x", allowed: STAFF },
  // Analytics: teacher/admin
  { method: "GET", path: "/analytics/dashboard", allowed: STAFF },
  // Admin only
  { method: "GET", path: "/users", allowed: ADMIN_ONLY },
  { method: "POST", path: "/users", allowed: ADMIN_ONLY },
  { method: "GET", path: "/admin/settings/exam", allowed: ADMIN_ONLY },
  { method: "PUT", path: "/admin/settings/exam", allowed: ADMIN_ONLY },
  { method: "GET", path: "/admin/articles", allowed: ADMIN_ONLY },
  { method: "POST", path: "/admin/articles/ai/generate", allowed: ADMIN_ONLY },
];

const ALL_ROLES: readonly TTestRole[] = ["student", "teacher", "admin"];

const testApp = new Elysia().decorate("authService", createMockAuthService()).use(app);

function send({ route, role, prefix }: { route: TRoute; role?: TTestRole; prefix: string }) {
  return testApp.handle(
    new Request(`http://localhost${prefix}${route.path}`, {
      method: route.method,
      headers: role ? bearer(role) : {},
    }),
  );
}

describe("auth matrix (root and /api mounts)", () => {
  for (const prefix of ["", "/api"]) {
    for (const route of ROUTES) {
      const label = `${route.method} ${prefix}${route.path}`;

      it(`${label} rejects Guest with 401`, async () => {
        const res = await send({ route, prefix });

        expect(res.status).toBe(401);
      });

      for (const role of ALL_ROLES.filter((candidate) => !route.allowed.includes(candidate))) {
        it(`${label} rejects ${role} with 403`, async () => {
          const res = await send({ route, role, prefix });

          expect(res.status).toBe(403);
        });
      }
    }
  }

  it("keeps GET /health public", async () => {
    const res = await testApp.handle(new Request("http://localhost/api/health"));

    expect(res.status).toBe(200);
  });
});
