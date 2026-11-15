import { FadeInView } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Award, BarChart3, FileText, Target } from "lucide-react";
import Link from "next/link";

import { type TFeatureItem } from "../constants/home.data";

const ICON_MAP = {
  FileText,
  BarChart3,
  Target,
  Award,
} as const;

const ACCENT_STYLES = {
  blue: {
    iconBg: "bg-primary-50 border-primary-100 text-primary-700",
  },
  purple: {
    iconBg: "bg-primary-100/60 border-primary-200 text-primary-800",
  },
  rose: {
    iconBg: "bg-error-50 border-error-100 text-error-600",
  },
  amber: {
    iconBg: "bg-warning-50 border-warning-100 text-warning-700",
  },
} as const;

type TFeatureCardProps = {
  feature: TFeatureItem;
  index: number;
};

export function FeatureCard({ feature, index }: TFeatureCardProps) {
  const Icon = ICON_MAP[feature.iconName];
  const styles = ACCENT_STYLES[feature.accent];

  return (
    <FadeInView delay={index * 0.1} className="h-full">
      <Card className="group border-border bg-card hover:border-primary-200 relative flex h-full flex-col justify-between gap-0 rounded-2xl p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        <div>
          <div
            className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border ${styles.iconBg} shadow-xs transition-transform group-hover:scale-105`}
          >
            <Icon className="h-6 w-6" />
          </div>

          <h3 className="text-h3 text-foreground group-hover:text-primary mb-2 font-semibold transition-colors">
            {feature.title}
          </h3>

          <p className="text-body-sm text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            asChild
            size="icon"
            variant="ghost"
            className="bg-primary-50 text-primary hover:bg-primary hover:text-primary-foreground h-8 w-8 rounded-full transition-colors"
          >
            <Link href={feature.href} aria-label={feature.title}>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Card>
    </FadeInView>
  );
}
