"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/features/categories";
import { type Nullable } from "@thfat-edu/shared";
import { Trash2 } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { useArticles } from "../hooks/use-articles";
import { useBatchDeleteArticles, useDeleteArticle } from "../hooks/use-delete-article";
import { type TArticleItem, type TArticleStatus } from "../types/article.types";
import { createArticleColumns } from "./article-columns";
import { ArticleDeleteDialog } from "./article-delete-dialog";
import { ArticleFilterBar } from "./article-filter-bar";

export function ArticleListTable() {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [status, setStatus] = useQueryState("status", parseAsString.withDefault("all"));
  const [categoryId, setCategoryId] = useQueryState("category", parseAsString.withDefault("all"));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState("pageSize", parseAsInteger.withDefault(10));

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [targetArticle, setTargetArticle] = useState<Nullable<TArticleItem>>(null);
  const [isBatchDeleteOpen, setIsBatchDeleteOpen] = useState(false);

  const { data: categories = [] } = useCategories();
  const deleteMutation = useDeleteArticle();
  const batchDeleteMutation = useBatchDeleteArticles();

  const queryParams = {
    page,
    limit: pageSize,
    search: search.trim() || undefined,
    status: status === "all" ? undefined : (status as TArticleStatus),
    categoryId: categoryId === "all" ? undefined : categoryId,
  };

  const { data, isLoading, isPlaceholderData } = useArticles({ query: queryParams, isAdmin: true });
  const articles = data?.items ?? [];
  const total = data?.total ?? 0;

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setCategoryId("all");
    setPage(1);
  };

  const handleConfirmSingleDelete = async () => {
    if (!targetArticle || deleteMutation.isPending) return;

    try {
      await deleteMutation.mutateAsync(targetArticle.id);
      setTargetArticle(null);
    } catch {
      // Lỗi đã được hiển thị qua toast trong hook; giữ dialog mở để thử lại.
    }
  };

  const handleConfirmBatchDelete = async () => {
    const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
    if (selectedIds.length === 0 || batchDeleteMutation.isPending) return;

    try {
      await batchDeleteMutation.mutateAsync(selectedIds);
      toast.success(`Đã xóa thành công ${selectedIds.length} bài viết.`);
      setRowSelection({});
      setIsBatchDeleteOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra khi xóa.");
    }
  };

  const columns = useMemo(
    () =>
      createArticleColumns({
        onDelete: (article) => setTargetArticle(article),
      }),
    [],
  );

  const selectedCount = Object.keys(rowSelection).filter((k) => rowSelection[k]).length;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DataTable
        columns={columns}
        data={articles}
        isLoading={isLoading || isPlaceholderData}
        totalCount={total}
        pageIndex={page}
        pageSize={pageSize}
        pageSizeOptions={[10, 20, 50]}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        itemName="bài viết"
        searchValue={search}
        searchPlaceholder="Tìm kiếm bài viết theo tiêu đề..."
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        filters={
          <ArticleFilterBar
            status={status}
            onStatusChange={(val) => {
              setStatus(val);
              setPage(1);
            }}
            categoryId={categoryId}
            onCategoryChange={(val) => {
              setCategoryId(val);
              setPage(1);
            }}
            categories={categories}
            onReset={handleResetFilters}
          />
        }
        batchActions={
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsBatchDeleteOpen(true)}
            className="h-8 gap-1.5 px-3 text-xs"
          >
            <Trash2 className="size-3.5" />
            <span>Xóa {selectedCount} bài viết</span>
          </Button>
        }
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        emptyTitle="Không tìm thấy bài viết nào"
        emptyDescription="Thử điều chỉnh từ khóa tìm kiếm hoặc đặt lại các bộ lọc."
        onResetFilters={handleResetFilters}
      />

      <ArticleDeleteDialog
        isOpen={Boolean(targetArticle)}
        article={targetArticle}
        isDeleting={deleteMutation.isPending}
        onClose={() => setTargetArticle(null)}
        onConfirm={handleConfirmSingleDelete}
      />

      <ArticleDeleteDialog
        isOpen={isBatchDeleteOpen}
        article={null}
        batchCount={selectedCount}
        isDeleting={batchDeleteMutation.isPending}
        onClose={() => setIsBatchDeleteOpen(false)}
        onConfirm={handleConfirmBatchDelete}
      />
    </div>
  );
}
