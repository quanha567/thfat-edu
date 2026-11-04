import { Elysia } from "elysia";

export class AppError extends Error {
  constructor(
    public override message: string,
    public statusCode: number = 400,
    public code: string = "APP_ERROR",
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export type TErrorContext = {
  code: string | number;
  error: unknown;
  set: { status?: number | string };
};

export function handleApplicationError({ code, error, set }: TErrorContext) {
  if (code === "UNAUTHORIZED" || error instanceof UnauthorizedError) {
    set.status = 401;

    return {
      success: false,
      code: "UNAUTHORIZED",
      message: (error as Error).message,
    };
  }

  if (code === "NOT_FOUND" || error instanceof NotFoundError) {
    set.status = 404;

    return {
      success: false,
      code: "ROUTE_NOT_FOUND",
      message: (error as Error).message || "The requested route does not exist",
    };
  }

  if (code === "VALIDATION") {
    set.status = 422;
    const allErrors = (error as { all?: unknown[] }).all;

    return {
      success: false,
      code: "VALIDATION_ERROR",
      message: "Invalid request payload or parameters",
      details: allErrors,
    };
  }

  if (code === "APP_ERROR" || error instanceof AppError) {
    const appErr = error as AppError;
    set.status = appErr.statusCode || 400;

    return {
      success: false,
      code: appErr.code || "APP_ERROR",
      message: appErr.message,
    };
  }

  set.status = 500;
  const isProduction = process.env.NODE_ENV === "production";

  return {
    success: false,
    code: "INTERNAL_SERVER_ERROR",
    message: isProduction
      ? "An internal server error occurred"
      : (error as Error).message || "Unknown error",
  };
}

export const errorHandlerPlugin = new Elysia({ name: "app:error-handler" })
  .error({
    UNAUTHORIZED: UnauthorizedError,
    NOT_FOUND: NotFoundError,
    APP_ERROR: AppError,
  })
  .onError({ as: "global" }, handleApplicationError);
