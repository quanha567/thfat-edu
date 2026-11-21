"use client";

import { Button } from "@/components/ui/button";
import {
  AttemptsTrendChart,
  DashboardEmptyState,
  DashboardHeader,
  DashboardSkeleton,
  MetricsCards,
  RecentAttemptsTable,
  ScoreDistributionChart,
  TopExamsCard,
  useDashboardAnalytics,
} from "@/features/analytics";
import type { TAnalyticsTimeRange } from "@/features/analytics";
import { AlertCircle, RefreshCw } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

export default function AdminDashboardPage() {
  const [rawTimeRange, setTimeRange] = useQueryState("timeRange", parseAsString.withDefault("7d"));
  const timeRange = (
    ["today", "7d", "30d", "all"].includes(rawTimeRange) ? rawTimeRange : "7d"
  ) as TAnalyticsTimeRange;

  const { data, isLoading, isError, error, refetch, isFetching } = useDashboardAnalytics(timeRange);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-600">
          <AlertCircle className="size-6" />
        </div>
        <h2 className="text-foreground text-base font-bold">Không thể tải dữ liệu thống kê</h2>
        <p className="text-muted-foreground mt-1 max-w-sm text-xs">
          {error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi khi kết nối tới máy chủ phân tích."}
        </p>
        <Button
          onClick={() => refetch()}
          size="sm"
          variant="outline"
          className="mt-4 gap-1.5 text-xs"
        >
          <RefreshCw className="size-3.5" />
          <span>Thử lại</span>
        </Button>
      </div>
    );
  }

  const isCompletelyEmpty = data.kpi.totalAttempts.value === 0 && data.recentAttempts.length === 0;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:px-8 lg:py-6">
      <DashboardHeader
        timeRange={timeRange}
        onTimeRangeChange={(val) => setTimeRange(val)}
        onRefresh={() => refetch()}
        isFetching={isFetching}
      />

      <MetricsCards kpi={data.kpi} />

      {isCompletelyEmpty ? (
        <DashboardEmptyState />
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <AttemptsTrendChart trends={data.trends} />
            </div>
            <div className="lg:col-span-5">
              <ScoreDistributionChart scoreDistribution={data.scoreDistribution} />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <RecentAttemptsTable recentAttempts={data.recentAttempts} />
            </div>
            <div className="lg:col-span-4">
              <TopExamsCard topExams={data.topExams} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
