import {
  type ColumnDef,
  type RowSelectionState,
  type Table as TanstackTable,
} from "@tanstack/react-table";
import { type OnChange } from "@thfat-edu/shared";
import { type ReactNode } from "react";

export type TDataTableAction<TData> = {
  id: string;
  label: string;
  icon?: ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  onClick: (row: TData) => void | Promise<void>;
  disabled?: boolean | ((row: TData) => boolean);
  hidden?: boolean | ((row: TData) => boolean);
};

export type TDataTableInstance<TData> = TanstackTable<TData>;

export type TDataTablePaginationProps<TData> = {
  table?: TanstackTable<TData>;
  pageIndex?: number;
  pageSize?: number;
  totalCount?: number;
  pageCount?: number;
  pageSizeOptions?: number[];
  onPageChange?: OnChange<number>;
  onPageSizeChange?: OnChange<number>;
  itemName?: string;
};

export type TDataTableProps<TData, TValue = unknown> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  totalCount?: number;
  pageIndex?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: OnChange<number>;
  onPageSizeChange?: OnChange<number>;
  itemName?: string;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: OnChange<string>;
  filters?: ReactNode;
  actions?: ReactNode;
  toolbar?: ReactNode;
  batchActions?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  onResetFilters?: () => void;
  className?: string;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (
    updaterOrValue: RowSelectionState | ((old: RowSelectionState) => RowSelectionState),
  ) => void;
  getRowId?: (row: TData, index: number) => string;
};
