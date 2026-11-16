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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, FolderPlus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

import { useCategories } from "../hooks/use-categories";
import { useDeleteCategory } from "../hooks/use-delete-category";
import type { TCategory } from "../types/category.types";
import { CategoryDialog } from "./category-dialog";

export function CategoryListTable() {
  const { data: categories = [], isLoading } = useCategories();
  const deleteMutation = useDeleteCategory();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TCategory | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredCategories = categories.filter((cat) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;

    return cat.name.toLowerCase().includes(term) || cat.slug.toLowerCase().includes(term);
  });

  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (category: TCategory) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    await deleteMutation.mutateAsync(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  const renderTableBody = () => {
    if (isLoading) {
      return ["skel-1", "skel-2", "skel-3", "skel-4"].map((key) => (
        <TableRow key={key}>
          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
          <TableCell className="text-center"><Skeleton className="mx-auto h-5 w-10" /></TableCell>
          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
          <TableCell className="text-right"><Skeleton className="ml-auto h-5 w-14" /></TableCell>
        </TableRow>
      ));
    }

    if (filteredCategories.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="py-12 text-center">
            <p className="text-muted-foreground text-sm font-medium">
              {search ? "Không tìm thấy chuyên mục phù hợp." : "Chưa có chuyên mục nào. Hãy tạo chuyên mục đầu tiên!"}
            </p>
          </TableCell>
        </TableRow>
      );
    }

    return filteredCategories.map((cat) => (
      <TableRow key={cat.id}>
        <TableCell>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm">{cat.name}</span>
            {cat.description && (
              <span className="text-muted-foreground line-clamp-1 text-xs">
                {cat.description}
              </span>
            )}
          </div>
        </TableCell>
        <TableCell>
          <Badge variant="outline" className="font-mono text-xs">
            {cat.slug}
          </Badge>
        </TableCell>
        <TableCell className="text-center">
          <Badge variant="secondary" className="font-semibold text-xs">
            {cat.articleCount ?? 0}
          </Badge>
        </TableCell>
        <TableCell className="text-muted-foreground text-xs">
          {new Date(cat.createdAt).toLocaleDateString("vi-VN")}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
              onClick={() => handleOpenEdit(cat)}
              title="Chỉnh sửa"
            >
              <Edit2 className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
              onClick={() => setDeleteConfirmId(cat.id)}
              title="Xóa chuyên mục"
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
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Tìm kiếm chuyên mục..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs sm:text-sm"
            />
          </div>

          <Button onClick={handleOpenCreate} size="sm" className="gap-1.5 shadow-2xs">
            <FolderPlus className="size-4" />
            Thêm chuyên mục
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Tên chuyên mục</TableHead>
                  <TableHead className="w-[25%]">Đường dẫn (Slug)</TableHead>
                  <TableHead className="w-[15%] text-center">Số bài viết</TableHead>
                  <TableHead className="w-[18%]">Ngày tạo</TableHead>
                  <TableHead className="w-[12%] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTableBody()}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={selectedCategory}
      />

      <AlertDialog
        open={Boolean(deleteConfirmId)}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa chuyên mục?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa chuyên mục khỏi hệ thống. Các bài viết trực thuộc chuyên mục này sẽ được chuyển về trạng thái không phân loại (chuyên mục trống).
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
