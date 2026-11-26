"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { TTrendPoint } from "../types";

export type TAttemptsTrendChartProps = {
  trends: TTrendPoint[];
};

const chartConfig: ChartConfig = {
  startedCount: {
    label: "Bắt đầu làm",
    color: "var(--color-primary-500)",
  },
  submittedCount: {
    label: "Nộp thành công",
    color: "var(--color-success-500)",
  },
};

export function AttemptsTrendChart({ trends }: TAttemptsTrendChartProps) {
  const hasData = trends.some((p) => p.startedCount > 0 || p.submittedCount > 0);

  return (
    <Card className="border-border bg-card shadow-2xs">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-bold">Xu hướng làm bài</CardTitle>
            <CardDescription className="text-xs">
              Lượt bắt đầu và hoàn thành bài thi theo chu kỳ thời gian
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="bg-primary-500 size-2 rounded-full" />
              <span className="text-muted-foreground">Bắt đầu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="bg-success-500 size-2 rounded-full" />
              <span className="text-muted-foreground">Đã nộp</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {!hasData ? (
          <div className="text-muted-foreground flex h-56 items-center justify-center text-xs">
            Chưa có lượt thi nào ghi nhận trong khoảng thời gian này
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-60 w-full">
            <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fillStarted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="fillSubmitted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-success-500)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-success-500)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={11}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={11}
                domain={[0, (dataMax: number) => Math.max(dataMax + 1, 4)]}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={{ stroke: "var(--color-border)", strokeDasharray: "3 3" }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="startedCount"
                type="monotone"
                fill="url(#fillStarted)"
                stroke="var(--color-primary-500)"
                strokeWidth={2}
                baseValue={0}
                isAnimationActive={false}
              />
              <Area
                dataKey="submittedCount"
                type="monotone"
                fill="url(#fillSubmitted)"
                stroke="var(--color-success-500)"
                strokeWidth={2}
                baseValue={0}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
