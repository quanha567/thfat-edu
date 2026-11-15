"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { type Nullable } from "@thfat-edu/shared";
import { Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { useBatchDeleteExams, useDeleteExam } from "../hooks/use-delete-exam";
import { useExamTableFilters } from "../hooks/use-exam-table-filters";
import { useExams } from "../hooks/use-exams";
import { useUpdateExam } from "../hooks/use-update-exam";
import { type TExamStatus, type TQuizListItem } from "../types";
import { filterExams } from "../utils/filter-exams";
import { createExamColumns } from "./exam-columns";
import { ExamDeleteDialog } from "./exam-delete-dialog";
import { ExamListFilterBar } from "./exam-list-filter-bar";

export function ExamListTable() {
  const {
    search,
    status,
    difficulty,
    fromDate,
    toDate,
    page,
    setPage,
    pageSize,
    dateRange,
    handleDateRangeChange,
    handleResetFilters,
    handleDifficultyChange,
    handleStatusChange,
    handlePageSizeChange,
    handleSearchChange,
  } = useExamTableFilters();

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [targetExam, setTargetExam] = useState<Nullable<{ id: string; title: string }>>(null);

  const queryParams = {
    search: search.trim() || undefined,
    status: status === "all" ? undefined : (status as TExamStatus),
  };

  const { data, isLoading, error } = useExams(queryParams);
  const deleteMutation = useDeleteExam();
  const batchDeleteMutation = useBatchDeleteExams();
  const updateMutation = useUpdateExam("");

  const items = data?.items;

  const filteredItems = useMemo(
    () => filterExams({ items, difficulty, search, fromDate, toDate }),
    [items, difficulty, search, fromDate, toDate],
  );

  const total = filteredItems.length;

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page, pageSize]);

  const handleConfirmDelete = async () => {
    if (!targetExam) return;

    try {
      await deleteMutation.mutateAsync(targetExam.id);
      toast.success(`Đã xóa thành công đề thi "${targetExam.title}"`);
      setTargetExam(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không thể xóa đề thi.");
    }
  };

  const handleBatchDelete = async () => {
    const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
    if (selectedIds.length === 0) return;

    try {
      await batchDeleteMutation.mutateAsync(selectedIds);
      toast.success(`Đã xóa thành công ${selectedIds.length} đề thi`);
      setRowSelection({});
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra khi xóa.");
    }
  };

  const handleToggleStatus = useCallback(
    async (exam: TQuizListItem) => {
      const nextStatus = exam.status === "archived" ? "published" : "archived";
      try {
        await updateMutation.mutateAsync({ id: exam.id, status: nextStatus });
        toast.success(
          nextStatus === "published"
            ? `Đã kích hoạt đề thi "${exam.title}"`
            : `Đã tạm dừng đề thi "${exam.title}"`,
        );
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra khi cập nhật trạng thái.");
      }
    },
    [updateMutation],
  );

  const columns = useMemo(
    () =>
      createExamColumns({
        onDelete: (exam) => setTargetExam({ id: exam.id, title: exam.title }),
        onToggleStatus: handleToggleStatus,
      }),
    [handleToggleStatus],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DataTable
        columns={columns}
        data={paginatedItems}
        isLoading={isLoading}
        totalCount={total}
        pageIndex={page}
        pageSize={pageSize}
        pageSizeOptions={[10, 20, 50]}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        itemName="đề thi"
        searchValue={search}
        searchPlaceholder="Tìm theo mã hoặc tên đề thi..."
        onSearchChange={handleSearchChange}
        filters={
          <ExamListFilterBar
            difficulty={difficulty}
            onDifficultyChange={handleDifficultyChange}
            status={status}
            onStatusChange={handleStatusChange}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            onReset={handleResetFilters}
          />
        }
        batchActions={
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBatchDelete}
            className="h-7 gap-1.5 rounded-lg px-2.5 text-xs shadow-xs"
          >
            <Trash2 className="size-3.5" />
            <span>Xóa các mục đã chọn</span>
          </Button>
        }
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        getRowId={(row) => row.id}
        emptyTitle="Không tìm thấy đề thi phù hợp"
        emptyDescription={
          error ? `Lỗi: ${error.message}` : "Hãy thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm."
        }
        onResetFilters={handleResetFilters}
        className="flex min-h-0 flex-1 flex-col"
      />

      <ExamDeleteDialog
        targetExam={targetExam}
        isDeleting={deleteMutation.isPending}
        onClose={() => setTargetExam(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
