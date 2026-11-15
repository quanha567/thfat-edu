"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type OnChange } from "@thfat-edu/shared";
import { Search, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

type TDataTableToolbarProps = {
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: OnChange<string>;
  filters?: ReactNode;
  actions?: ReactNode;
  selectedCount?: number;
  batchActions?: ReactNode;
  onClearSelection?: () => void;
};

export function DataTableToolbar({
  searchValue = "",
  searchPlaceholder = "Tìm kiếm...",
  onSearchChange,
  filters,
  actions,
  selectedCount = 0,
  batchActions,
  onClearSelection,
}: TDataTableToolbarProps) {
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [prevSearchValue, setPrevSearchValue] = useState(searchValue);

  if (searchValue !== prevSearchValue) {
    setPrevSearchValue(searchValue);
    setLocalSearch(searchValue);
  }

  useEffect(() => {
    if (!onSearchChange) return;
    const timer = setTimeout(() => {
      if (localSearch !== searchValue) {
        onSearchChange(localSearch);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange, searchValue]);

  if (selectedCount > 0 && batchActions) {
    return (
      <div className="border-border bg-secondary/70 text-secondary-foreground flex flex-wrap items-center justify-between gap-3 border-b px-6 py-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-medium">
            Đã chọn <strong className="text-primary font-semibold">{selectedCount}</strong> hàng
          </span>
          {onClearSelection && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="text-muted-foreground hover:text-foreground h-7 text-xs"
            >
              Bỏ chọn tất cả
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">{batchActions}</div>
      </div>
    );
  }

  return (
    <div className="border-border flex flex-col gap-3 border-b px-6 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-3">
        {onSearchChange && (
          <div className="relative w-full max-w-sm">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="border-input bg-background h-9 pr-9 pl-9 text-sm"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch("");
                  onSearchChange("");
                }}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 p-1"
                aria-label="Xóa tìm kiếm"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filters}
        {actions}
      </div>
    </div>
  );
}
