"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FilterX, Search, X } from "lucide-react";

export type TStatusFilter = "all" | "not_started" | "in_progress" | "submitted";

export type TExamFilterCounts = {
  all: number;
  notStarted: number;
  inProgress: number;
  submitted: number;
};

export type TStudentExamFilterBarProps = {
  status: string;
  onStatusChange: (val: string) => void;
  search: string;
  onSearchChange: (val: string) => void;
  counts: TExamFilterCounts;
  totalFiltered: number;
  totalCount: number;
  onResetFilters: () => void;
};

export function StudentExamFilterBar({
  status,
  onStatusChange,
  search,
  onSearchChange,
  counts,
  totalFiltered,
  totalCount,
  onResetFilters,
}: TStudentExamFilterBarProps) {
  const hasFilter = status !== "all" || Boolean(search);

  const tabs: Array<{ value: TStatusFilter; label: string; count: number }> = [
    { value: "all", label: "Tất cả", count: counts.all },
    { value: "not_started", label: "Chưa làm", count: counts.notStarted },
    { value: "in_progress", label: "Đang làm", count: counts.inProgress },
    { value: "submitted", label: "Đã nộp", count: counts.submitted },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:pb-0">
          {tabs.map((tab) => {
            const isActive = status === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => onStatusChange(tab.value)}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary-600 bg-primary-600 text-white shadow-xs"
                    : "text-muted-foreground hover:border-primary-300 hover:text-foreground bg-background border-neutral-200 dark:border-neutral-800",
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "text-xxs min-w-5 rounded-full px-1.5 py-0.5 text-center font-semibold",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Tìm theo tên đề thi..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-background h-9 rounded-full pr-9 pl-10 text-sm"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 rounded p-0.5"
              aria-label="Xóa tìm kiếm"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {hasFilter && (
        <div className="text-muted-foreground flex items-center justify-between gap-2 text-xs">
          <span>
            Hiển thị <span className="text-foreground font-semibold">{totalFiltered}</span> /{" "}
            {totalCount} đề thi
          </span>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 h-7 gap-1 px-2 text-xs"
          >
            <FilterX className="h-3.5 w-3.5" />
            Xóa bộ lọc
          </Button>
        </div>
      )}
    </div>
  );
}
