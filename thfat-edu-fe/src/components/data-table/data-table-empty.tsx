"use client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { TableCell, TableRow } from "@/components/ui/table";
import { FileQuestion, RotateCcw } from "lucide-react";

export type TDataTableEmptyProps = {
  colSpan: number;
  emptyTitle: string;
  emptyDescription: string;
  onResetFilters?: () => void;
};

export function DataTableEmpty({
  colSpan,
  emptyTitle,
  emptyDescription,
  onResetFilters,
}: TDataTableEmptyProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-64 text-center">
        <Empty className="py-8">
          <EmptyMedia variant="icon">
            <FileQuestion className="size-6 text-neutral-400" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle className="text-sm font-semibold">{emptyTitle}</EmptyTitle>
            <EmptyDescription className="text-muted-foreground text-xs">
              {emptyDescription}
            </EmptyDescription>
          </EmptyHeader>
          {onResetFilters && (
            <EmptyContent>
              <Button
                variant="outline"
                size="sm"
                onClick={onResetFilters}
                className="gap-1.5 rounded-lg text-xs shadow-xs"
              >
                <RotateCcw className="size-3.5" />
                <span>Đặt lại bộ lọc</span>
              </Button>
            </EmptyContent>
          )}
        </Empty>
      </TableCell>
    </TableRow>
  );
}
