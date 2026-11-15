"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef } from "@tanstack/react-table";

export function getDataTableSelectColumn<TData>(
  getItemLabel?: (row: TData) => string,
): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
        aria-label="Chọn tất cả hàng"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
        aria-label={getItemLabel ? `Chọn ${getItemLabel(row.original)}` : "Chọn hàng"}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}
