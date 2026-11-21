"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Award, CheckCircle2, FileQuestion, TrendingDown, TrendingUp, Users } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";

import type { TDashboardAnalytics } from "../types";

export type TMetricsCardsProps = {
  kpi: TDashboardAnalytics["kpi"];
};

type TMetricSparklineProps = {
  id: string;
  color: string;
  data?: number[];
};

function MetricSparkline({ id, color, data }: TMetricSparklineProps) {
  const points = data && data.length > 1 ? data : [0, 0, 0, 0, 0, 0, 0];
  const chartData = points.map((val, idx) => ({ idx, val }));

  return (
    <div className="-mx-6 mt-2 -mb-6 h-10 w-[calc(100%+3rem)] overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`sparkline-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <YAxis
            hide
            domain={[0, (dataMax: number) => Math.max(dataMax * 2, 6)]}
            allowDataOverflow={false}
          />
          <Area
            type="monotone"
            dataKey="val"
            stroke={color}
            strokeWidth={1.75}
            fill={`url(#sparkline-${id})`}
            baseValue={0}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MetricsCards({ kpi }: TMetricsCardsProps) {
  const cards = [
    {
      id: "total-attempts",
      title: "Tổng lượt làm bài",
      value: kpi.totalAttempts.value.toLocaleString(),
      change: kpi.totalAttempts.changePercentage,
      subText: kpi.totalAttempts.subText,
      sparkline: kpi.totalAttempts.sparkline,
      color: "var(--color-primary-600, #2563eb)",
      icon: FileQuestion,
    },
    {
      id: "completion-rate",
      title: "Tỷ lệ nộp bài",
      value: `${kpi.completionRate.value}%`,
      change: kpi.completionRate.changePercentage,
      subText: kpi.completionRate.subText,
      sparkline: kpi.completionRate.sparkline,
      color: "var(--color-success-600, #16a34a)",
      icon: CheckCircle2,
    },
    {
      id: "average-score",
      title: "Điểm trung bình",
      value: `${kpi.averageScore.value}đ`,
      change: kpi.averageScore.changePercentage,
      subText: kpi.averageScore.subText,
      sparkline: kpi.averageScore.sparkline,
      color: "var(--color-gold-600, #d97706)",
      icon: Award,
    },
    {
      id: "active-candidates",
      title: "Thí sinh tham gia",
      value: kpi.activeCandidates.value.toLocaleString(),
      change: kpi.activeCandidates.changePercentage,
      subText: kpi.activeCandidates.subText,
      sparkline: kpi.activeCandidates.sparkline,
      color: "var(--color-cyan-600, #0891b2)",
      icon: Users,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((item) => {
        const Icon = item.icon;
        const isPositive = item.change > 0;
        const isNeutral = item.change === 0;

        return (
          <Card key={item.title} className="border-border bg-card overflow-hidden shadow-2xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-muted-foreground text-xs font-medium">{item.title}</span>
              <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md border">
                <Icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-foreground text-2xl font-bold tracking-tight">{item.value}</div>

              <div className="mt-2 flex items-center text-xs">
                {isNeutral ? (
                  <span className="text-muted-foreground font-medium">0.0%</span>
                ) : (
                  <span
                    className={`inline-flex items-center gap-0.5 font-medium ${
                      isPositive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="size-3" />
                    ) : (
                      <TrendingDown className="size-3" />
                    )}
                    {isPositive ? `+${item.change}%` : `${item.change}%`}
                  </span>
                )}
                <span className="text-muted-foreground ml-1.5">so với kỳ trước</span>
              </div>

              <p className="text-muted-foreground mt-1 text-xs">{item.subText}</p>

              <MetricSparkline id={item.id} color={item.color} data={item.sparkline} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
