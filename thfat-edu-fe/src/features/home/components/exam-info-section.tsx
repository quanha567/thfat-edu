import { FadeInView } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, HelpCircle } from "lucide-react";
import Link from "next/link";

import { HOME_EXAM_INFO_DATA } from "../constants/home.data";
import { MetricCard } from "./metric-card";

export function ExamInfoSection() {
  return (
    <FadeInView className="h-full">
      <Card className="flex h-full flex-col justify-between rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs transition-all hover:shadow-md sm:p-8 lg:p-10 dark:border-white/10 dark:bg-neutral-900/80">
        <div>
          {/* Pill Tag */}
          <div className="border-primary-100 bg-primary-50 text-primary-700 dark:border-primary-900 dark:bg-primary-950/50 mb-4 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-semibold dark:text-cyan-300">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>{HOME_EXAM_INFO_DATA.tagline}</span>
          </div>

          <h3 className="text-h2 sm:text-h1 mb-8 font-bold tracking-tight text-neutral-900 dark:text-white">
            {HOME_EXAM_INFO_DATA.title}
          </h3>

          {/* 4 Metric Columns */}
          <div className="mb-8 grid grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-4">
            {HOME_EXAM_INFO_DATA.metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </div>
        </div>

        <div>
          <Button
            asChild
            variant="outline"
            className="border-primary-600 text-primary-600 hover:bg-primary-50 hover:text-primary-700 rounded-full px-6 font-semibold transition-colors dark:border-cyan-400 dark:text-cyan-400 dark:hover:bg-cyan-950/30"
          >
            <Link href={HOME_EXAM_INFO_DATA.ctaHref} className="flex items-center gap-2">
              <span>{HOME_EXAM_INFO_DATA.ctaText}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Card>
    </FadeInView>
  );
}
