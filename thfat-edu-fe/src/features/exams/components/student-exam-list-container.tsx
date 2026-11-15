"use client";

import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStudentExams } from "@/features/exams/hooks/use-student-exams";
import { type TStudentExamListItem } from "@/features/exams/types";
import { Search } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";

import { ExamCardSkeleton, StudentExamCard } from "./student-exam-card";
import { StudentExamListHero } from "./student-exam-list-hero";

const PAGE_SIZE = 9;
const SKELETON_KEYS = Array.from({ length: PAGE_SIZE }, (_, i) => `exam-skeleton-${i + 1}`);

type TStatusFilter = "all" | "not_started" | "in_progress" | "submitted";

type TStatusTab = {
  value: TStatusFilter;
  label: string;
};

const STATUS_TABS: TStatusTab[] = [
  { value: "all", label: "Tất cả" },
  { value: "not_started", label: "Chưa làm" },
  { value: "in_progress", label: "Đang làm dở" },
  { value: "submitted", label: "Đã nộp bài" },
];

function renderContent(options: {
  isLoading: boolean;
  exams: TStudentExamListItem[];
  hasActiveFilter: boolean;
}) {
  if (options.isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SKELETON_KEYS.map((key) => (
          <ExamCardSkeleton key={key} />
        ))}
      </div>
    );
  }

  if (options.exams.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-12 text-center">
        <p className="text-base font-medium text-neutral-600">
          {options.hasActiveFilter
            ? "Không có đề thi nào phù hợp với bộ lọc."
            : "Hiện chưa có đề thi nào được xuất bản."}
        </p>
        <p className="mt-1 text-sm text-neutral-400">
          {options.hasActiveFilter
            ? "Thử chọn tab khác hoặc xóa từ khóa tìm kiếm."
            : "Vui lòng quay lại sau khi giáo viên mở đề thi mới."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {options.exams.map((exam) => (
        <StudentExamCard key={exam.id} exam={exam} />
      ))}
    </div>
  );
}

export function StudentExamListContainer() {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [status, setStatus] = useQueryState("status", parseAsString.withDefault("all"));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const { data, isLoading } = useStudentExams({ search: search || undefined, limit: 100 });

  const filteredExams = useMemo(() => {
    const items = data?.items ?? [];

    if (status === "all") return items;

    return items.filter((exam) => exam.attemptStatus === status);
  }, [data?.items, status]);

  const totalPages = Math.ceil(filteredExams.length / PAGE_SIZE);
  const safePage = Math.min(Math.max(1, page), Math.max(1, totalPages));
  const paginatedExams = filteredExams.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleStatusChange(value: string) {
    void setStatus(value === "all" ? null : value);
    void setPage(null);
  }

  function handleSearchChange(value: string) {
    void setSearch(value || null);
    void setPage(null);
  }

  function handlePageChange(newPage: number) {
    void setPage(newPage === 1 ? null : newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <StudentExamListHero totalExams={data?.total} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={status} onValueChange={handleStatusChange}>
            <TabsList>
              {STATUS_TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="relative w-full sm:w-72">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm đề thi..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="bg-white pl-9"
            />
          </div>
        </div>

        {renderContent({
          isLoading,
          exams: paginatedExams,
          hasActiveFilter: status !== "all" || !!search,
        })}

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(safePage - 1)}
                  aria-disabled={safePage === 1}
                  className={safePage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => handlePageChange(pageNum)}
                    isActive={pageNum === safePage}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(safePage + 1)}
                  aria-disabled={safePage === totalPages}
                  className={
                    safePage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
