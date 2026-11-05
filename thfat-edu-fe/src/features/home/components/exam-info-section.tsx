import { SectionBadge } from "@/components/base";
import { FadeInView } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { HOME_EXAM_INFO_DATA } from "../constants/home.data";
import { MetricCard } from "./metric-card";

export function ExamInfoSection() {
  return (
    <FadeInView className="h-full">
      <Card className="border-border bg-card flex h-full flex-col justify-between gap-0 rounded-2xl p-8 shadow-xs lg:p-10">
        <div>
          <SectionBadge>{HOME_EXAM_INFO_DATA.tagline}</SectionBadge>
          <h3 className="text-h2 sm:text-h1 text-foreground mb-8 font-bold tracking-tight">
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
            className="border-primary-200 text-primary hover:bg-primary-50 hover:text-primary-800 rounded-full px-6 font-semibold transition-colors"
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
