import type { ReactNode } from "react";

// Event and UI Action Callbacks
export type OnPress<TReturn = void> = () => TReturn;
export type OnChange<TArgs = unknown, TReturn = void> = (
  ...args: TArgs extends unknown[] ? TArgs : [value: TArgs]
) => TReturn;
export type OnKeyValueChange<K extends string = string, V = unknown, TReturn = void> = (
  key: K,
  value: V,
) => TReturn;
export type OnSelect<TItem, TReturn = void> = (item: TItem) => TReturn;
export type OnSubmit<TFormValues, TReturn = void | Promise<void>> = (
  values: TFormValues,
) => TReturn;

// Component Props Utilities
export type WithChildren<P = unknown> = P & { children: ReactNode };
export type WithClassName<P = unknown> = P & { className?: string };
