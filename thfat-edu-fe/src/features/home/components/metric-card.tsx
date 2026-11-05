import { Card } from "@/components/ui/card";
import { Calendar, CheckSquare, Clock, TrendingUp } from "lucide-react";

import { type TExamMetric } from "../constants/home.data";

const ICON_MAP = {
  Calendar,
  Clock,
  CheckSquare,
  TrendingUp,
} as const;

type TMetricCardProps = {
  metric: TExamMetric;
};

export function MetricCard({ metric }: TMetricCardProps) {
  const Icon = ICON_MAP[metric.iconName];

  return (
    <Card className="border-border bg-muted/40 flex flex-col items-center gap-0 rounded-xl p-4 text-center shadow-none">
      <div className="bg-card text-primary mb-3 flex h-10 w-10 items-center justify-center rounded-xl shadow-xs">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-body sm:text-body-lg text-foreground leading-tight font-bold">
        {metric.label}
      </p>
      <p className="text-caption text-muted-foreground mt-1 leading-snug">{metric.detail}</p>
    </Card>
  );
}
