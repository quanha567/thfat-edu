import { Elysia } from "elysia";

import { createModuleLogger, enterRequestContext } from "../config/logger";

const REQUEST_ID_HEADER = "x-request-id";
const MAX_REQUEST_ID_LENGTH = 128;
const SAFE_REQUEST_ID = /^[\w.-]+$/;

const SKIPPED_PATHS = new Set(["/", "/health", "/api/health"]);
const SKIPPED_PREFIXES = ["/openapi", "/docs", "/api/openapi", "/api/docs"];

const requestLogger = createModuleLogger("http");

const requestStartTimes = new WeakMap<Request, number>();

function resolveRequestId(request: Request): string {
  const incoming = request.headers.get(REQUEST_ID_HEADER);

  if (incoming && incoming.length <= MAX_REQUEST_ID_LENGTH && SAFE_REQUEST_ID.test(incoming)) {
    return incoming;
  }

  return crypto.randomUUID();
}

function shouldSkip(pathname: string): boolean {
  if (SKIPPED_PATHS.has(pathname)) {
    return true;
  }

  return SKIPPED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function resolveStatus(status: number | string | undefined): number {
  const numeric = Number(status);

  return Number.isInteger(numeric) && numeric >= 100 ? numeric : 200;
}

export const requestLoggerPlugin = new Elysia({ name: "app:request-logger" })
  .onRequest(({ request, set }) => {
    const requestId = resolveRequestId(request);

    enterRequestContext({ requestId });
    requestStartTimes.set(request, performance.now());
    set.headers[REQUEST_ID_HEADER] = requestId;
  })
  .onAfterResponse({ as: "global" }, ({ request, set }) => {
    const { pathname } = new URL(request.url);

    if (shouldSkip(pathname)) {
      return;
    }

    const startedAt = requestStartTimes.get(request);
    const status = resolveStatus(set.status);
    const fields = {
      method: request.method,
      path: pathname,
      status,
      durationMs: startedAt === undefined ? undefined : Math.round(performance.now() - startedAt),
    };

    if (status >= 500) {
      requestLogger.error(fields, "request completed");

      return;
    }

    if (status >= 400) {
      requestLogger.warn(fields, "request completed");

      return;
    }

    requestLogger.info(fields, "request completed");
  });
