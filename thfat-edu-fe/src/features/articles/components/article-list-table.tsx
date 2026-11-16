"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCategories } from "@/features/categories";
import { Edit2, Eye, FilePlus2, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useArticles } from "../hooks/use-articles";
import { useDeleteArticle } from "../hooks/use-delete-article";
import type { TArticleStatus } from "../types/article.types";

function getStatusBadge(status: TArticleStatus) {
  if (status === "published") {
    return (
      <Badge variant="default" className="text-[11px] font-semibold">
        Đã xuất bản
      </Badge>
    );
  }
  if (status === "archived") {
    return (
      <Badge variant="secondary" className="text-[11px] font-semibold">
        Lưu trữ
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-[11px] font-semibold">
      Bản nháp
    </Badge>
  );
}

export function ArticleListTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: categories = [] } = useCategories();
  const deleteMutation = useDeleteArticle();

  const queryParams = {
    page,
    limit: 10,
    search: search.trim() || undefined,
    status: statusFilter === "all" ? undefined : (statusFilter as TArticleStatus),
    categoryId: categoryFilter === "all" ? undefined : categoryFilter,
  };

  const { data, isLoading } = useArticles({ query: queryParams, isAdmin: true });
  const articles = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 10);

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    await deleteMutation.mutateAsync(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  const renderTableBody = () => {
    if (isLoading) {
      return ["table-skel-1", "table-skel-2", "table-skel-3", "table-skel-4"].map((key) => (
        <TableRow key={key}>
          <TableCell>
            <Skeleton className="h-10 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-12" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="ml-auto h-5 w-14" />
          </TableCell>
        </TableRow>
      ));
    }

    if (articles.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="py-12 text-center">
            <p className="text-muted-foreground text-sm font-medium">
              Không tìm thấy bài viết nào phù hợp.
            </p>
          </TableCell>
        </TableRow>
      );
    }

    return articles.map((item) => (
      <TableRow key={item.id}>
        <TableCell>
          <div className="flex items-center gap-3">
            {item.thumbnailUrl ? (
              <div className="relative size-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted/60 text-muted-foreground text-xs font-semibold">
                N/A
              </div>
            )}
            <div className="flex min-w-0 flex-col">
              <span className="font-semibold text-foreground text-sm line-clamp-1">
                {item.title}
              </span>
              <span className="text-muted-foreground text-xs">
                {new Date(item.createdAt).toLocaleDateString("vi-VN")} • Tác giả:{" "}
                {item.author?.fullName ?? "Quản trị viên"}
              </span>
            </div>
          </div>
        </TableCell>
        <TableCell>
          {item.category ? (
            <Badge variant="outline" className="text-xs font-medium">
              {item.category.name}
            </Badge>
          ) : (
            <span className="text-muted-foreground text-xs italic">Chưa phân loại</span>
          )}
        </TableCell>
        <TableCell>{getStatusBadge(item.status)}</TableCell>
        <TableCell>
          <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
            <Eye className="size-3.5" />
            {item.viewCount}
          </span>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-1">
            <Button asChild variant="ghost" size="icon" className="size-8" title="Chỉnh sửa">
              <Link href={`/admin/articles/${item.id}/edit`}>
                <Edit2 className="size-3.5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
              onClick={() => setDeleteConfirmId(item.id)}
              title="Xóa bài viết"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <Card className="border-border/80 shadow-2xs">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2.5">
            <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 text-xs sm:text-sm"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px] text-xs">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
                <SelectItem value="published">Đã xuất bản</SelectItem>
                <SelectItem value="archived">Lưu trữ</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={categoryFilter}
              onValueChange={(val) => {
                setCategoryFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[150px] text-xs">
                <SelectValue placeholder="Chuyên mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả chuyên mục</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button asChild size="sm" className="gap-1.5 shadow-2xs">
            <Link href="/admin/articles/create">
              <FilePlus2 className="size-4" />
              Tạo bài viết mới
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Bài viết</TableHead>
                  <TableHead className="w-[15%]">Chuyên mục</TableHead>
                  <TableHead className="w-[15%]">Trạng thái</TableHead>
                  <TableHead className="w-[15%]">Lượt xem</TableHead>
                  <TableHead className="w-[15%] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{renderTableBody()}</TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <span className="text-muted-foreground text-xs">
                Trang {page} / {totalPages} (Tổng số {total} bài viết)
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="h-8 text-xs"
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-8 text-xs"
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={Boolean(deleteConfirmId)}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bài viết?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa hoàn toàn bài viết khỏi hệ thống và không thể phục hồi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
