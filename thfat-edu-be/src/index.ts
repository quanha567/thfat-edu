import { Elysia } from "elysia";

export const app = new Elysia().get("/", () => "Hello Elysia");

app.listen(3000);

export type App = typeof app;

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
