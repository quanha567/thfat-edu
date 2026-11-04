import { describe, expect, it } from "bun:test";

import { app } from "./index";

describe("Backend API (Elysia)", () => {
  it("should return 'Hello Elysia' on GET /", async () => {
    const response = await app.handle(new Request("http://localhost/"));
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("Hello Elysia");
  });

  it("should return health status on GET /health", async () => {
    const response = await app.handle(new Request("http://localhost/health"));
    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      status: string;
      uptime: number;
      environment: string;
    };
    expect(body.status).toBe("ok");
    expect(body.uptime).toBeDefined();
    expect(body.environment).toBeDefined();
  });

  it("should return health status on GET /api/health", async () => {
    const response = await app.handle(new Request("http://localhost/api/health"));
    expect(response.status).toBe(200);
    const body = (await response.json()) as { status: string };
    expect(body.status).toBe("ok");
  });

  it("should return 404 for unknown routes", async () => {
    const response = await app.handle(new Request("http://localhost/non-existent-route"));
    expect(response.status).toBe(404);
    const body = (await response.json()) as { success: boolean; code: string };
    expect(body.success).toBe(false);
    expect(body.code).toBe("ROUTE_NOT_FOUND");
  });

  it("should reject register with invalid payload on POST /api/auth/register (422)", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "invalid-email", password: "123" }),
      }),
    );
    expect(response.status).toBe(422);
    const body = (await response.json()) as { success: boolean; code: string };
    expect(body.success).toBe(false);
    expect(body.code).toBe("VALIDATION_ERROR");
  });

  it("should reject login with invalid payload on POST /api/auth/login (422)", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "not-an-email" }),
      }),
    );
    expect(response.status).toBe(422);
  });

  it("should reject /api/auth/me when bearer token is missing (401)", async () => {
    const response = await app.handle(new Request("http://localhost/api/auth/me"));
    expect(response.status).toBe(401);
    const body = (await response.json()) as { success: boolean; code: string };
    expect(body.success).toBe(false);
    expect(body.code).toBe("UNAUTHORIZED");
  });

  it("should successfully logout and clear session on POST /api/auth/logout", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/auth/logout", {
        method: "POST",
      }),
    );
    expect(response.status).toBe(200);
    const body = (await response.json()) as { success: boolean; message: string };
    expect(body.success).toBe(true);
    expect(body.message).toContain("Logged out");
  });

  it("should handle /api/auth/google appropriately when OAuth credentials are not set", async () => {
    const response = await app.handle(new Request("http://localhost/api/auth/google"));
    // When Google env vars are missing, returns 401 UNAUTHORIZED
    expect(response.status).toBe(401);
    const body = (await response.json()) as { success: boolean; code: string };
    expect(body.success).toBe(false);
    expect(body.code).toBe("UNAUTHORIZED");
  });

  it("should serve Scalar API documentation on GET /docs and GET /api/docs", async () => {
    const res1 = await app.handle(new Request("http://localhost/docs"));
    expect(res1.status).toBe(200);
    expect(res1.headers.get("content-type")).toContain("text/html");
    const html1 = await res1.text();
    expect(html1.toLowerCase()).toContain("scalar");

    const res2 = await app.handle(new Request("http://localhost/api/docs"));
    expect(res2.status).toBe(200);
    expect(res2.headers.get("content-type")).toContain("text/html");
  });

  it("should provide OpenAPI JSON spec on GET /docs/json and GET /api/docs/json", async () => {
    const res = await app.handle(new Request("http://localhost/docs/json"));
    expect(res.status).toBe(200);
    const spec = (await res.json()) as { info: { title: string } };
    expect(spec.info.title).toBe("ThFat Edu API");
  });
});
