"use client";

import { DataTableRowActions } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { type ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { Edit2, Trash2 } from "lucide-react";

import { type TCategory } from "../types/category.types";

type TCreateCategoryColumnsOptions = {
  onEdit: (category: TCategory) => void;
  onDelete: (category: TCategory) => void;
};

export function createCategoryColumns({
  onEdit,
  onDelete,
}: TCreateCategoryColumnsOptions): ColumnDef<TCategory>[] {
  return [
    {
      id: "name",
      header: "Tên chuyên mục",
      cell: ({ row }) => {
        const cat = row.original;

        return (
          <div className="flex flex-col py-1">
            <span className="text-foreground font-semibold">{cat.name}</span>
            {cat.description && (
              <span className="text-muted-foreground text-3xs line-clamp-1">{cat.description}</span>
            )}
          </div>
        );
      },
    },
    {
      id: "slug",
      header: "Đường dẫn (Slug)",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-3xs font-mono">
          {row.original.slug}
        </Badge>
      ),
    },
    {
      id: "articleCount",
      header: "Số bài viết",
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-3xs font-semibold">
          {row.original.articleCount ?? 0}
        </Badge>
      ),
    },
    {
      id: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) => {
        const formattedDate = row.original.createdAt
          ? format(parseISO(row.original.createdAt), "dd/MM/yyyy")
          : "";

        return <span className="text-muted-foreground text-xs">{formattedDate}</span>;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => {
        const category = row.original;

        const actions = [
          {
            id: "edit",
            label: "Chỉnh sửa",
            icon: <Edit2 className="size-3.5" />,
            onClick: () => onEdit(category),
          },
          {
            id: "delete",
            label: "Xóa chuyên mục",
            icon: <Trash2 className="size-3.5" />,
            variant: "destructive" as const,
            onClick: () => onDelete(category),
          },
        ];

        return <DataTableRowActions row={category} actions={actions} />;
      },
    },
  ];
}
