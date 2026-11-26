"use client";

import { DataTableRowActions, getDataTableSelectColumn } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { type ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { Edit2, ExternalLink, Eye, Trash2 } from "lucide-react";
import Image from "next/image";

import { DEFAULT_ARTICLE_THUMBNAIL } from "../constants";
import { type TArticleItem, type TArticleStatus } from "../types/article.types";

function ArticleStatusBadge({ status }: { status: TArticleStatus }) {
  if (status === "published") {
    return (
      <Badge variant="default" className="text-xxs font-semibold">
        Đã xuất bản
      </Badge>
    );
  }

  if (status === "archived") {
    return (
      <Badge variant="secondary" className="text-xxs font-semibold">
        Lưu trữ
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-xxs font-semibold">
      Bản nháp
    </Badge>
  );
}

type TCreateArticleColumnsOptions = {
  onDelete: (article: TArticleItem) => void;
};

export function createArticleColumns({
  onDelete,
}: TCreateArticleColumnsOptions): ColumnDef<TArticleItem>[] {
  return [
    getDataTableSelectColumn<TArticleItem>((article) => article.title),
    {
      id: "articleInfo",
      header: "Bài viết",
      cell: ({ row }) => {
        const article = row.original;
        const formattedDate = article.createdAt
          ? format(parseISO(article.createdAt), "dd/MM/yyyy")
          : "";

        return (
          <div className="flex items-center gap-3 py-1">
            <div className="border-border bg-muted relative size-10 shrink-0 overflow-hidden rounded-md border">
              <Image
                src={article.thumbnailUrl || DEFAULT_ARTICLE_THUMBNAIL}
                alt={article.title}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-foreground line-clamp-1 font-semibold" title={article.title}>
                {article.title}
              </span>
              <span className="text-muted-foreground text-xxs">
                {formattedDate} • Tác giả: {article.author?.fullName ?? "Quản trị viên"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: "category",
      header: "Chuyên mục",
      cell: ({ row }) => {
        const category = row.original.category;
        if (!category) {
          return <span className="text-muted-foreground text-xs italic">Chưa phân loại</span>;
        }

        return (
          <Badge variant="outline" className="text-xxs font-medium">
            {category.name}
          </Badge>
        );
      },
    },
    {
      id: "status",
      header: "Trạng thái",
      cell: ({ row }) => <ArticleStatusBadge status={row.original.status} />,
    },
    {
      id: "viewCount",
      header: "Lượt xem",
      cell: ({ row }) => (
        <span className="text-muted-foreground flex items-center gap-1 font-medium">
          <Eye className="size-3.5" />
          {row.original.viewCount.toLocaleString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => {
        const article = row.original;

        const actions = [
          {
            id: "view",
            label: "Xem bài viết",
            icon: <ExternalLink className="size-3.5" />,
            onClick: () => {
              window.open(`/articles/${article.slug}`, "_blank");
            },
          },
          {
            id: "edit",
            label: "Chỉnh sửa",
            icon: <Edit2 className="size-3.5" />,
            onClick: () => {
              window.location.href = `/admin/articles/${article.id}/edit`;
            },
          },
          {
            id: "delete",
            label: "Xóa bài viết",
            icon: <Trash2 className="size-3.5" />,
            variant: "destructive" as const,
            onClick: () => onDelete(article),
          },
        ];

        return <DataTableRowActions row={article} actions={actions} />;
      },
    },
  ];
}
