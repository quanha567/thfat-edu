"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type TLeaderboardPaginationProps = {
  page: number;
  limit: number;
  total: number;
  onPageChange: (newPage: number) => void;
};

export function LeaderboardPagination({
  page,
  limit,
  total,
  onPageChange,
}: TLeaderboardPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(total, page * limit);

  // Compute page numbers around current page
  const pages: number[] = [];
  const maxButtons = 5;
  let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxButtons - 1);

  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4 pt-4 text-sm sm:flex-row">
      <p className="text-muted-foreground text-xs sm:text-sm">
        Hiển thị <span className="text-foreground font-semibold">{startItem}</span> –{" "}
        <span className="text-foreground font-semibold">{endItem}</span> trong tổng số{" "}
        <span className="text-foreground font-semibold">{total}</span> học viên
      </p>

      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="border-border text-muted-foreground hover:bg-muted h-8 w-8 rounded-lg disabled:opacity-40"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Trang trước"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((p) => {
          const isActive = p === page;

          return (
            <Button
              key={p}
              type="button"
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={`h-8 min-w-8 rounded-lg px-2 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary-800 shadow-xs"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          );
        })}

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="border-border text-muted-foreground hover:bg-muted h-8 w-8 rounded-lg disabled:opacity-40"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Trang kế tiếp"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
