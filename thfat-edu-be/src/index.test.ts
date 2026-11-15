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
});
