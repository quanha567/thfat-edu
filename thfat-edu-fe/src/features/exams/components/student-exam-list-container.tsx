"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useStudentExams } from "@/features/exams/hooks/use-student-exams";
import { type TStudentExamListItem } from "@/features/exams/types";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";

import { StudentExamCard, ExamCardSkeleton } from "./student-exam-card";
import { StudentExamEmptyState } from "./student-exam-empty-state";
import { StudentExamFilterBar, type TExamFilterCounts } from "./student-exam-filter-bar";
import { StudentExamListHero } from "./student-exam-list-hero";

const PAGE_SIZE = 9;
const SKELETON_KEYS = Array.from({ length: PAGE_SIZE }, (_, i) => `exam-skeleton-${i + 1}`);

function renderContent(options: {
  isLoading: boolean;
  exams: TStudentExamListItem[];
  hasActiveFilter: boolean;
  onResetFilters: () => void;
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
      <StudentExamEmptyState
        hasActiveFilter={options.hasActiveFilter}
        onResetFilters={options.onResetFilters}
      />
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
  const allItems = useMemo(() => data?.items ?? [], [data?.items]);

  const counts: TExamFilterCounts = useMemo(
    () => ({
      all: allItems.length,
      notStarted: allItems.filter((e) => e.attemptStatus === "not_started").length,
      inProgress: allItems.filter((e) => e.attemptStatus === "in_progress").length,
      submitted: allItems.filter((e) => e.attemptStatus === "submitted").length,
    }),
    [allItems],
  );

  const filteredExams = useMemo(() => {
    if (status === "all") return allItems;

    return allItems.filter((exam) => exam.attemptStatus === status);
  }, [allItems, status]);

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

  function handleResetFilters() {
    void setStatus(null);
    void setSearch(null);
    void setPage(null);
  }

  function handlePageChange(newPage: number) {
    void setPage(newPage === 1 ? null : newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <StudentExamListHero totalExams={data?.total ?? allItems.length} />

      <StudentExamFilterBar
        status={status}
        onStatusChange={handleStatusChange}
        search={search}
        onSearchChange={handleSearchChange}
        counts={counts}
        totalFiltered={filteredExams.length}
        totalCount={allItems.length}
        onResetFilters={handleResetFilters}
      />

      {renderContent({
        isLoading,
        exams: paginatedExams,
        hasActiveFilter: status !== "all" || Boolean(search),
        onResetFilters: handleResetFilters,
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
  );
}
