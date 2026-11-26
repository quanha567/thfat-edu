import { AsyncLocalStorage } from "node:async_hooks";

import pino, { type DestinationStream, type Logger } from "pino";

import { env } from "./env";

export type TRequestContext = {
  requestId: string;
  userId?: string;
};

const requestContext = new AsyncLocalStorage<TRequestContext>();

export function enterRequestContext(context: TRequestContext): void {
  requestContext.enterWith(context);
}

export function getRequestContext(): TRequestContext | undefined {
  return requestContext.getStore();
}

export function setRequestUserId(userId: string): void {
  const context = requestContext.getStore();

  if (!context) {
    return;
  }

  context.userId = userId;
}

const SENSITIVE_KEYS = [
  "authorization",
  "cookie",
  "password",
  "token",
  "idToken",
  "sessionToken",
  "FIREBASE_PRIVATE_KEY",
  "IMAGEKIT_PRIVATE_KEY",
  "NVIDIA_API_KEY",
  "JWT_SECRET",
];

const REDACT_PATHS = SENSITIVE_KEYS.flatMap((key) => [
  key,
  `*.${key}`,
  `*.*.${key}`,
  `*.*.*.${key}`,
]);

function resolveLevel(): string {
  if (env.LOG_LEVEL) {
    return env.LOG_LEVEL;
  }

  if (env.NODE_ENV === "test") {
    return "silent";
  }

  return env.NODE_ENV === "production" ? "info" : "debug";
}

async function createDestination(): Promise<DestinationStream | undefined> {
  if (env.NODE_ENV !== "development") {
    return undefined;
  }

  const { default: pretty } = await import("pino-pretty");

  return pretty({ colorize: true, translateTime: "SYS:HH:MM:ss", ignore: "pid,hostname" });
}

const destination = await createDestination();

export const logger: Logger = pino(
  {
    level: resolveLevel(),
    base: { env: env.NODE_ENV },
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: { paths: REDACT_PATHS, censor: "[REDACTED]" },
    serializers: { err: pino.stdSerializers.err },
    mixin: () => {
      const context = requestContext.getStore();

      if (!context) {
        return {};
      }

      return { requestId: context.requestId, userId: context.userId };
    },
  },
  destination,
);

export function createModuleLogger(module: string): Logger {
  return logger.child({ module });
}
