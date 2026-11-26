import { Value } from "@sinclair/typebox/value";
import { type Static, t } from "elysia";

export const EnvSchema = t.Object({
  NODE_ENV: t.Union([t.Literal("development"), t.Literal("production"), t.Literal("test")], {
    default: "development",
  }),
  PORT: t.String({ default: "3001" }),
  LOG_LEVEL: t.Optional(
    t.Union([
      t.Literal("fatal"),
      t.Literal("error"),
      t.Literal("warn"),
      t.Literal("info"),
      t.Literal("debug"),
      t.Literal("trace"),
      t.Literal("silent"),
    ]),
  ),
  DATABASE_URL: t.String({ minLength: 1 }),
  FRONTEND_URL: t.String({ default: "http://localhost:3000" }),
  JWT_SECRET: t.String({ minLength: 16 }),
  ADMIN_EMAIL: t.Optional(t.String()),
  FIREBASE_PROJECT_ID: t.Optional(t.String()),
  FIREBASE_CLIENT_EMAIL: t.Optional(t.String()),
  FIREBASE_PRIVATE_KEY: t.Optional(t.String()),
  FIREBASE_SERVICE_ACCOUNT_PATH: t.Optional(t.String()),
  VERCEL: t.Optional(t.String()),
  NVIDIA_API_KEY: t.Optional(t.String()),
  IMAGEKIT_PUBLIC_KEY: t.String({ minLength: 1 }),
  IMAGEKIT_PRIVATE_KEY: t.String({ minLength: 1 }),
  IMAGEKIT_URL_ENDPOINT: t.String({ minLength: 1 }),
});

export type TEnv = Static<typeof EnvSchema>;
export type Env = TEnv;

function loadEnv(): TEnv {
  const isTest = process.env.NODE_ENV === "test";

  const rawEnv: Record<string, unknown> = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: process.env.PORT ?? "3001",
    LOG_LEVEL: process.env.LOG_LEVEL || undefined,
    DATABASE_URL:
      process.env.DATABASE_URL ?? (isTest ? "postgres://localhost:5432/test_db" : undefined),
    FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:3000",
    JWT_SECRET:
      process.env.JWT_SECRET ?? (isTest ? "test_jwt_secret_min_16_characters_ok" : undefined),
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    FIREBASE_SERVICE_ACCOUNT_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
    VERCEL: process.env.VERCEL,
    NVIDIA_API_KEY: process.env.NVIDIA_API_KEY,
    IMAGEKIT_PUBLIC_KEY:
      process.env.IMAGEKIT_PUBLIC_KEY ?? (isTest ? "test_imagekit_public_key" : undefined),
    IMAGEKIT_PRIVATE_KEY:
      process.env.IMAGEKIT_PRIVATE_KEY ?? (isTest ? "test_imagekit_private_key" : undefined),
    IMAGEKIT_URL_ENDPOINT:
      process.env.IMAGEKIT_URL_ENDPOINT ??
      (isTest ? "https://ik.imagekit.io/test_imagekit_id" : undefined),
  };

  if (!Value.Check(EnvSchema, rawEnv)) {
    const errors = [...Value.Errors(EnvSchema, rawEnv)];
    const errorDetails = errors
      .map((err) => `  - ${err.path.slice(1) || "root"}: ${err.message}`)
      .join("\n");

    throw new Error(
      `❌ Invalid environment configuration:\n${errorDetails}\nPlease copy .env.example to .env and configure the required variables.`,
    );
  }

  return Value.Cast(EnvSchema, rawEnv);
}

export const env = loadEnv();
