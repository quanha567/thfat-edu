"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import { SCORE_TIER_COLORS } from "../constants";
import type { TScoreTier } from "../types";

export type TScoreDistributionChartProps = {
  scoreDistribution: TScoreTier[];
};

const chartConfig: ChartConfig = {
  count: {
    label: "Số bài thi",
    color: "var(--color-primary-500)",
  },
};

function ScoreDistributionTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: TScoreTier }>;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <div className="border-border bg-popover text-popover-foreground rounded-md border p-2 shadow-md">
      <div className="flex items-center gap-1.5">
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: SCORE_TIER_COLORS[item.tier] }}
        />
        <p className="text-xs font-semibold">
          {item.label} ({item.rangeLabel})
        </p>
      </div>
      <p className="text-muted-foreground mt-1 text-xs">
        Số lượng: <span className="text-foreground font-bold">{item.count}</span> bài
      </p>
      <p className="text-muted-foreground text-xs">
        Chiếm: <span className="text-foreground font-bold">{item.percentage}%</span>
      </p>
    </div>
  );
}

export function ScoreDistributionChart({ scoreDistribution }: TScoreDistributionChartProps) {
  const hasData = scoreDistribution.some((tier) => tier.count > 0);

  return (
    <Card className="border-border bg-card shadow-2xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">Phân bổ phổ điểm</CardTitle>
        <CardDescription className="text-xs">
          Phổ điểm bài thi đã nộp theo thang điểm 10 quy chuẩn
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {!hasData ? (
          <div className="text-muted-foreground flex h-56 items-center justify-center text-xs">
            Chưa có bài thi nào nộp trong khoảng thời gian này
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-60 w-full">
            <BarChart
              data={scoreDistribution}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
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
                cursor={{ fill: "var(--color-muted)" }}
                content={<ScoreDistributionTooltip />}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={36}>
                {scoreDistribution.map((entry) => (
                  <Cell
                    key={entry.tier}
                    fill={SCORE_TIER_COLORS[entry.tier] || "var(--color-primary-500)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
