// Nullability & Optionals
export type Nullable<T> = T | null;
export type Maybe<T> = T | undefined;
export type Optional<T> = T | null | undefined;

// Function & Callbacks
export type Callback<TArgs extends unknown[] = [], TReturn = void> = (...args: TArgs) => TReturn;
export type AsyncCallback<TArgs extends unknown[] = [], TReturn = void> = (
  ...args: TArgs
) => Promise<TReturn>;
export type Predicate<T> = (value: T) => boolean;

// Generic Utilities
export type Dictionary<T = unknown> = Record<string, T>;
export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

// Pagination Standard
export type PaginationQuery = {
  page: number;
  limit: number;
};

export type PaginatedResponse<TItem> = {
  items: TItem[];
  total: number;
  page: number;
  limit: number;
};

// RFC 7807 Problem Details
export type ProblemDetails = {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  errors?: Record<string, string[]>;
};
