type TErrorCandidate = {
  detail?: unknown;
  message?: unknown;
  value?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function extractApiErrorMessage(
  error: unknown,
  fallback = "Đã xảy ra lỗi không xác định.",
): string {
  if (!error) {
    return fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (isRecord(error)) {
    const candidate = error as TErrorCandidate;

    if (isRecord(candidate.value)) {
      const nested = candidate.value as TErrorCandidate;

      if (typeof nested.detail === "string" && nested.detail.length > 0) {
        return nested.detail;
      }

      if (typeof nested.message === "string" && nested.message.length > 0) {
        return nested.message;
      }
    }

    if (typeof candidate.detail === "string" && candidate.detail.length > 0) {
      return candidate.detail;
    }

    if (typeof candidate.message === "string" && candidate.message.length > 0) {
      return candidate.message;
    }
  }

  return fallback;
}
