"use client";

/* eslint-disable react/incompatible-library */

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type RowSelectionState,
} from "@tanstack/react-table";

import { DataTableEmpty } from "./data-table-empty";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { type TDataTableProps } from "./data-table.types";

export type { TDataTableProps };

const EMPTY_ROW_SELECTION: RowSelectionState = {};
const SKELETON_ROW_KEYS = [
  "skeleton-row-1",
  "skeleton-row-2",
  "skeleton-row-3",
  "skeleton-row-4",
  "skeleton-row-5",
  "skeleton-row-6",
];

export function DataTable<TData, TValue = unknown>({
  columns,
  data,
  isLoading = false,
  totalCount,
  pageIndex = 1,
  pageSize = 10,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  itemName = "mục",
  searchValue,
  searchPlaceholder,
  onSearchChange,
  filters,
  actions,
  toolbar,
  batchActions,
  emptyTitle = "Không có dữ liệu",
  emptyDescription = "Hiện tại chưa có bản ghi nào để hiển thị.",
  onResetFilters,
  className,
  rowSelection = EMPTY_ROW_SELECTION,
  onRowSelectionChange,
  getRowId,
}: TDataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: Boolean(onRowSelectionChange),
    onRowSelectionChange,
    getRowId:
      getRowId ?? ((row: TData, index: number) => (row as { id?: string }).id ?? String(index)),
    manualPagination: true,
    state: {
      rowSelection,
    },
  });

  const selectedCount = Object.keys(rowSelection).filter((k) => rowSelection[k]).length;

  const renderBody = () => {
    if (isLoading) {
      return SKELETON_ROW_KEYS.map((key) => (
        <TableRow key={key} className="border-border/50 h-16 border-b">
          {columns.map((col, colIdx) => (
            <TableCell key={`skeleton-cell-${col.id ?? colIdx}`} className="px-4 py-3 align-middle">
              <Skeleton className="h-4 w-full max-w-[120px]" />
            </TableCell>
          ))}
        </TableRow>
      ));
    }

    if (data.length === 0) {
      return (
        <DataTableEmpty
          colSpan={columns.length}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
          onResetFilters={onResetFilters}
        />
      );
    }

    return table.getRowModel().rows.map((row) => (
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() && "selected"}
        className="border-border/50 hover:bg-muted/40 data-[state=selected]:bg-muted/60 h-16 border-b transition-colors"
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id} className="px-4 py-3 align-middle text-xs">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  const renderHeaderToolbar = () => {
    if (toolbar) return toolbar;

    const hasToolbarContent =
      onSearchChange || filters || actions || (selectedCount > 0 && batchActions);

    if (!hasToolbarContent) return null;

    return (
      <DataTableToolbar
        searchValue={searchValue}
        searchPlaceholder={searchPlaceholder}
        onSearchChange={onSearchChange}
        filters={filters}
        actions={actions}
        selectedCount={selectedCount}
        batchActions={batchActions}
        onClearSelection={onRowSelectionChange ? () => onRowSelectionChange({}) : undefined}
      />
    );
  };

  return (
    <div
      className={cn(
        "flex flex-1 flex-col min-h-0 rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden",
        className,
      )}
    >
      <div className="shrink-0">{renderHeaderToolbar()}</div>

      <div className="relative min-h-0 w-full flex-1 overflow-y-auto">
        <Table>
          <TableHeader className="border-border/70 sticky top-0 z-10 border-y bg-neutral-50/85 backdrop-blur-xs dark:bg-neutral-900/85">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="h-11 border-0 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 text-xs font-semibold whitespace-nowrap text-neutral-700 dark:text-neutral-300"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>{renderBody()}</TableBody>
        </Table>
      </div>

      {(onPageChange || totalCount !== undefined) && (
        <div className="shrink-0">
          <DataTablePagination
            table={table}
            pageIndex={pageIndex}
            pageSize={pageSize}
            totalCount={totalCount}
            pageSizeOptions={pageSizeOptions}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            itemName={itemName}
          />
        </div>
      )}
    </div>
  );
}
