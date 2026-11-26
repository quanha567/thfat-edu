"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useEffect, useMemo } from "react";

import { type TDataTableInstance, type TDataTablePaginationProps } from "./data-table.types";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50];

function generatePaginationRange(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

type TResolveTotalPagesOptions = {
  pageCount?: number;
  totalCount?: number;
  resolvedPageSize: number;
  table?: TDataTableInstance<unknown>;
  resolvedTotal: number;
};

function resolveTotalPages({
  pageCount,
  totalCount,
  resolvedPageSize,
  table,
  resolvedTotal,
}: TResolveTotalPagesOptions): number {
  if (pageCount !== undefined) {
    return pageCount;
  }
  if (totalCount !== undefined) {
    return Math.max(1, Math.ceil(totalCount / resolvedPageSize));
  }
  if (table) {
    return Math.max(1, table.getPageCount());
  }

  return Math.max(1, Math.ceil(resolvedTotal / resolvedPageSize));
}

export function DataTablePagination<TData>({
  table,
  pageIndex,
  pageSize,
  totalCount,
  pageCount,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageChange,
  onPageSizeChange,
  itemName = "mục",
}: TDataTablePaginationProps<TData>) {
  const tablePagination = table?.getState().pagination;

  const resolvedPageIndex = pageIndex ?? (tablePagination ? tablePagination.pageIndex + 1 : 1);
  const resolvedPageSize = pageSize ?? (tablePagination ? tablePagination.pageSize : 10);
  const resolvedTotal = totalCount ?? (table ? table.getFilteredRowModel().rows.length : 0);
  const calculatedTotalPages = resolveTotalPages({
    pageCount,
    totalCount,
    resolvedPageSize,
    table: table as TDataTableInstance<unknown> | undefined,
    resolvedTotal,
  });

  const safePageIndex = Math.min(Math.max(1, resolvedPageIndex), calculatedTotalPages);

  useEffect(() => {
    // Bỏ qua khi tổng = 0 (đang tải hoặc chưa có dữ liệu) để không reset về trang 1
    if (resolvedTotal === 0) return;
    if (pageIndex !== undefined && pageIndex > calculatedTotalPages) {
      onPageChange?.(calculatedTotalPages);
    }
  }, [pageIndex, calculatedTotalPages, resolvedTotal, onPageChange]);

  const pages = useMemo(
    () => generatePaginationRange(safePageIndex, calculatedTotalPages),
    [safePageIndex, calculatedTotalPages],
  );

  const handlePageSelect = (targetPage: number) => {
    if (targetPage < 1 || targetPage > calculatedTotalPages) return;
    if (onPageChange) {
      onPageChange(targetPage);
    }
    if (table) {
      table.setPageIndex(targetPage - 1);
    }
  };

  const handlePageSizeSelect = (newSize: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
    if (table) {
      table.setPageSize(newSize);
    }
  };

  const from =
    resolvedTotal === 0 ? 0 : Math.min((safePageIndex - 1) * resolvedPageSize + 1, resolvedTotal);
  const to = Math.min(safePageIndex * resolvedPageSize, resolvedTotal);

  return (
    <div className="border-border flex flex-col-reverse items-center justify-between gap-4 border-t px-6 py-4 sm:flex-row">
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => handlePageSelect(safePageIndex - 1)}
          disabled={safePageIndex <= 1}
          aria-label="Trang trước"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {pages.map((p, idx) => {
          if (p === "...") {
            const ellipsisKey = idx < 3 ? "ellipsis-start" : "ellipsis-end";

            return (
              <span
                key={ellipsisKey}
                className="text-muted-foreground flex size-8 items-center justify-center"
              >
                <MoreHorizontal className="size-4" />
              </span>
            );
          }

          const isActive = p === safePageIndex;

          return (
            <Button
              key={`page-${p}`}
              variant={isActive ? "default" : "outline"}
              size="icon"
              className="size-8 text-xs transition-none"
              onClick={() => handlePageSelect(p)}
              aria-current={isActive ? "page" : undefined}
            >
              {p}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => handlePageSelect(safePageIndex + 1)}
          disabled={safePageIndex >= calculatedTotalPages}
          aria-label="Trang sau"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="text-muted-foreground flex items-center gap-4 text-xs">
        <span>
          Hiển thị{" "}
          <strong className="text-foreground font-semibold">
            {from} – {to}
          </strong>{" "}
          trong tổng số <strong className="text-foreground font-semibold">{resolvedTotal}</strong>{" "}
          {itemName}
        </span>

        {(onPageSizeChange || table) && (
          <div className="flex items-center gap-1.5">
            <Select
              value={String(resolvedPageSize)}
              onValueChange={(val) => handlePageSizeSelect(Number(val))}
            >
              <SelectTrigger size="sm" className="h-8 text-xs">
                <SelectValue placeholder={`${resolvedPageSize}`} />
              </SelectTrigger>
              <SelectContent align="end">
                {pageSizeOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)} className="text-xs">
                    Hiển thị {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}
