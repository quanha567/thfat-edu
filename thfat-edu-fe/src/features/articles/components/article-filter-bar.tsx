"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type TCategory } from "@/features/categories";
import { RotateCcw } from "lucide-react";

export type TArticleFilterBarProps = {
  status: string;
  onStatusChange: (status: string) => void;
  categoryId: string;
  onCategoryChange: (categoryId: string) => void;
  categories: TCategory[];
  onReset: () => void;
};

export function ArticleFilterBar({
  status,
  onStatusChange,
  categoryId,
  onCategoryChange,
  categories,
  onReset,
}: TArticleFilterBarProps) {
  const hasActiveFilters = status !== "all" || categoryId !== "all";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="h-9 w-[150px] text-xs">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">
            Tất cả trạng thái
          </SelectItem>
          <SelectItem value="published" className="text-xs">
            Đã xuất bản
          </SelectItem>
          <SelectItem value="draft" className="text-xs">
            Bản nháp
          </SelectItem>
          <SelectItem value="archived" className="text-xs">
            Lưu trữ
          </SelectItem>
        </SelectContent>
      </Select>

      <Select value={categoryId} onValueChange={onCategoryChange}>
        <SelectTrigger className="h-9 w-[160px] text-xs">
          <SelectValue placeholder="Chuyên mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">
            Tất cả chuyên mục
          </SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.id} className="text-xs">
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground h-9 gap-1.5 px-2.5 text-xs"
        >
          <RotateCcw className="size-3.5" />
          <span>Đặt lại</span>
        </Button>
      )}
    </div>
  );
}
