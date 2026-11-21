"use client";

import { DataTable } from "@/components/data-table";
import { type Nullable } from "@thfat-edu/shared";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { useCategories } from "../hooks/use-categories";
import { useDeleteCategory } from "../hooks/use-delete-category";
import { type TCategory } from "../types/category.types";
import { createCategoryColumns } from "./category-columns";
import { CategoryDeleteDialog } from "./category-delete-dialog";
import { CategoryDialog } from "./category-dialog";

export type TCategoryListTableProps = {
  isCreateOpen?: boolean;
  onCloseCreate?: () => void;
};

export function CategoryListTable({
  isCreateOpen = false,
  onCloseCreate,
}: TCategoryListTableProps) {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState("pageSize", parseAsInteger.withDefault(10));

  const [editCategory, setEditCategory] = useState<Nullable<TCategory>>(null);
  const [deleteCategory, setDeleteCategory] = useState<Nullable<TCategory>>(null);

  const { data: categories = [], isLoading } = useCategories();
  const deleteMutation = useDeleteCategory();

  const filteredCategories = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return categories;

    return categories.filter(
      (cat) => cat.name.toLowerCase().includes(term) || cat.slug.toLowerCase().includes(term),
    );
  }, [categories, search]);

  const total = filteredCategories.length;
  const paginatedCategories = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, page, pageSize]);

  const handleConfirmDelete = async () => {
    if (!deleteCategory) return;
    try {
      await deleteMutation.mutateAsync(deleteCategory.id);
      toast.success(`Đã xóa chuyên mục "${deleteCategory.name}" thành công.`);
      setDeleteCategory(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không thể xóa chuyên mục.");
    }
  };

  const columns = useMemo(
    () =>
      createCategoryColumns({
        onEdit: (cat) => setEditCategory(cat),
        onDelete: (cat) => setDeleteCategory(cat),
      }),
    [],
  );

  const isDialogOpen = isCreateOpen || Boolean(editCategory);
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setEditCategory(null);
      if (onCloseCreate) onCloseCreate();
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DataTable
        columns={columns}
        data={paginatedCategories}
        isLoading={isLoading}
        totalCount={total}
        pageIndex={page}
        pageSize={pageSize}
        pageSizeOptions={[10, 20, 50]}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        itemName="chuyên mục"
        searchValue={search}
        searchPlaceholder="Tìm kiếm chuyên mục theo tên hoặc slug..."
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        emptyTitle="Không tìm thấy chuyên mục nào"
        emptyDescription="Thử tìm kiếm với từ khóa khác hoặc tạo chuyên mục mới."
        onResetFilters={() => {
          setSearch("");
          setPage(1);
        }}
      />

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={handleDialogChange}
        category={editCategory}
      />

      <CategoryDeleteDialog
        isOpen={Boolean(deleteCategory)}
        category={deleteCategory}
        onClose={() => setDeleteCategory(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
