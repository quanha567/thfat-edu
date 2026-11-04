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
  JWT_SECRET: t.String({
    default: "super-secret-default-jwt-secret-key-32chars!",
  }),
  JWT_REFRESH_SECRET: t.String({
    default: "super-secret-default-refresh-secret-key-32chars!",
  }),
  FRONTEND_URL: t.String({
    default: "http://localhost:3000",
  }),
  GOOGLE_CLIENT_ID: t.Optional(t.String()),
  GOOGLE_CLIENT_SECRET: t.Optional(t.String()),
  GOOGLE_REDIRECT_URI: t.Optional(t.String()),
  VERCEL: t.Optional(t.String()),
});

export type Env = Static<typeof EnvSchema>;

function loadEnv(): Env {
  const rawEnv: Record<string, unknown> = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || "3001",
    DATABASE_URL:
      process.env.DATABASE_URL ||
      (process.env.NODE_ENV === "production"
        ? undefined
        : "postgres://postgres:postgres@localhost:5432/thfat_edu"),
    JWT_SECRET:
      process.env.JWT_SECRET ||
      (process.env.NODE_ENV === "production"
        ? undefined
        : "super-secret-development-jwt-key-min-32-chars-long"),
    JWT_REFRESH_SECRET:
      process.env.JWT_REFRESH_SECRET ||
      (process.env.NODE_ENV === "production"
        ? undefined
        : "super-secret-development-refresh-key-min-32-chars"),
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
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
