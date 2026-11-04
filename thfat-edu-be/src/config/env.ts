import { Value } from "@sinclair/typebox/value";
import { type Static, t } from "elysia";

export const EnvSchema = t.Object({
  NODE_ENV: t.Union([t.Literal("development"), t.Literal("production"), t.Literal("test")], {
    default: "development",
  }),
  PORT: t.String({ default: "3001" }),
  DATABASE_URL: t.String({
    default: "postgres://postgres:postgres@localhost:5432/thfat_edu",
  }),
  FRONTEND_URL: t.String({
    default: "http://localhost:3000",
  }),
  VERCEL: t.Optional(t.String()),
});

export type TEnv = Static<typeof EnvSchema>;
export type Env = TEnv;

function loadEnv(): TEnv {
  const rawEnv: Record<string, unknown> = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || "3001",
    DATABASE_URL:
      process.env.DATABASE_URL ||
      (process.env.NODE_ENV === "production"
        ? undefined
        : "postgres://postgres:postgres@localhost:5432/thfat_edu"),
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    VERCEL: process.env.VERCEL,
  };

  const hasErrors = !Value.Check(EnvSchema, rawEnv);

  if (hasErrors) {
    const errors = [...Value.Errors(EnvSchema, rawEnv)];
    const errorDetails = errors
      .map((err) => `  - ${err.path.slice(1) || "root"}: ${err.message}`)
      .join("\n");

    throw new Error(
      `❌ Invalid environment configuration:\n${errorDetails}\nPlease check your .env or server environment variables.`,
    );
  }

  return Value.Cast(EnvSchema, rawEnv);
}

export const env = loadEnv();
