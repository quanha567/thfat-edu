"use client";

import { AdminPageHeader } from "@/components/layout/admin";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";

import { TIME_RANGE_OPTIONS } from "../constants";
import type { TAnalyticsTimeRange } from "../types";

export type TDashboardHeaderProps = {
  timeRange: TAnalyticsTimeRange;
  onTimeRangeChange: (val: TAnalyticsTimeRange) => void;
  onRefresh: () => void;
  isFetching?: boolean;
};

export function DashboardHeader({
  timeRange,
  onTimeRangeChange,
  onRefresh,
  isFetching = false,
}: TDashboardHeaderProps) {
  return (
    <AdminPageHeader
      title="Tổng quan"
      description="Thống kê vận hành và hoạt động khảo thí toàn hệ thống"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={timeRange}
            onValueChange={(val) => onTimeRangeChange(val as TAnalyticsTimeRange)}
          >
            <SelectTrigger size="sm" className="w-32 text-xs">
              <SelectValue placeholder="Khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="gap-1.5 text-xs"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>

          <Button asChild size="sm" className="gap-1.5 text-xs font-semibold">
            <Link href="/admin/exams/create">
              <Plus className="size-3.5" />
              <span>Tạo đề thi mới</span>
            </Link>
          </Button>
        </div>
      }
    />
  );
}
