"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    { value: "submitted", label: "Đã nộp bài", count: counts.submitted },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Tabs */}
        <div className="overflow-x-auto pb-1 sm:pb-0">
          <Tabs value={status} onValueChange={onStatusChange}>
            <TabsList className="bg-muted text-muted-foreground h-9 p-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="gap-1.5 px-3 py-1 text-xs font-medium sm:text-sm"
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && <span className="text-[11px] opacity-70">({tab.count})</span>}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Tìm theo tên đề thi..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-background pr-8 pl-9 text-xs sm:text-sm"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-0.5"
              aria-label="Xóa tìm kiếm"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Summary */}
      {hasFilter && (
        <div className="border-border text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-t pt-2 text-xs">
          <div>
            Hiển thị <span className="text-foreground font-semibold">{totalFiltered}</span>
            {" / "}
            <span>{totalCount}</span> đề thi
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 h-7 gap-1 px-2 text-xs"
          >
            <FilterX className="h-3.5 w-3.5" />
            <span>Xóa bộ lọc</span>
          </Button>
        </div>
      )}
    </div>
  );
}
