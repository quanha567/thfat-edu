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
    <Card className="flex flex-col items-center gap-0 rounded-2xl border border-primary-100 bg-primary-50/40 p-4 text-center shadow-none transition-colors hover:border-primary-300 dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary-600 shadow-2xs dark:bg-white/10 dark:text-cyan-300">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-body sm:text-body-lg leading-tight font-bold text-neutral-900 dark:text-white">
        {metric.label}
      </p>
      <p className="text-caption mt-1 leading-snug text-neutral-500 dark:text-neutral-400">
        {metric.detail}
      </p>
    </Card>
  );
}
