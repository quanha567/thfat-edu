"use client";

import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw } from "lucide-react";
import { type DateRange } from "react-day-picker";

import {
  EXAM_DIFFICULTY_FILTER_OPTIONS,
  EXAM_STATUS_FILTER_OPTIONS,
} from "../constants/exam.constants";

export type TExamListFilterBarProps = {
  difficulty: string;
  onDifficultyChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onReset: () => void;
};

export function ExamListFilterBar({
  difficulty,
  onDifficultyChange,
  status,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  onReset,
}: TExamListFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={difficulty} onValueChange={onDifficultyChange}>
        <SelectTrigger className="h-9 w-[150px] text-sm font-normal">
          <SelectValue placeholder="Tất cả độ khó" />
        </SelectTrigger>
        <SelectContent>
          {EXAM_DIFFICULTY_FILTER_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-sm">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="h-9 w-[180px] text-sm font-normal">
          <SelectValue placeholder="Tất cả trạng thái" />
        </SelectTrigger>
        <SelectContent>
          {EXAM_STATUS_FILTER_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-sm">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DatePickerWithRange
        date={dateRange}
        onDateChange={onDateRangeChange}
        placeholder="Khoảng ngày tạo..."
      />

      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="text-muted-foreground hover:text-foreground h-9 px-2 text-xs"
        title="Đặt lại bộ lọc"
      >
        <RotateCcw className="size-3.5" />
      </Button>
    </div>
  );
}
