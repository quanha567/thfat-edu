"use client";

import { format, parseISO } from "date-fns";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";
import { type DateRange } from "react-day-picker";

export function useExamTableFilters() {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [status, setStatus] = useQueryState("status", parseAsString.withDefault("all"));
  const [difficulty, setDifficulty] = useQueryState("difficulty", parseAsString.withDefault("all"));
  const [fromDate, setFromDate] = useQueryState("fromDate", parseAsString.withDefault(""));
  const [toDate, setToDate] = useQueryState("toDate", parseAsString.withDefault(""));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState("pageSize", parseAsInteger.withDefault(10));

  const dateRange = useMemo(
    () =>
      !fromDate && !toDate
        ? undefined
        : {
            from: fromDate ? parseISO(fromDate) : undefined,
            to: toDate ? parseISO(toDate) : undefined,
          },
    [fromDate, toDate],
  );

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setFromDate(range?.from ? format(range.from, "yyyy-MM-dd") : "");
    setToDate(range?.to ? format(range.to, "yyyy-MM-dd") : "");
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setDifficulty("all");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const handleDifficultyChange = (val: string) => {
    setDifficulty(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return {
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
  };
}
