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
    const body = (await response.json()) as { status: string; timestamp: string };
    expect(body.status).toBe("ok");
    expect(body.timestamp).toBeDefined();
  });
});
