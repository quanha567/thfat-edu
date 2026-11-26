import { FadeInView } from "@/components/motion";
import { Card } from "@/components/ui/card";
import { ArrowRight, Award, BarChart3, FileText, Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { type TFeatureItem } from "../constants/home.data";

const FALLBACK_ICON_MAP = {
  FileText,
  BarChart3,
  Target,
  Award,
} as const;

type TFeatureCardProps = {
  feature: TFeatureItem;
  index: number;
};

export function FeatureCard({ feature, index }: TFeatureCardProps) {
  const FallbackIcon = FALLBACK_ICON_MAP[feature.iconName];

  return (
    <FadeInView delay={index * 0.1} className="h-full">
      <Card className="group hover:border-primary-200 relative flex h-full flex-col justify-between rounded-3xl border border-neutral-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md dark:border-white/10 dark:bg-neutral-900/80">
        <div>
          {/* 3D Glossy Icon matching design */}
          <div className="relative mb-6 h-16 w-16 transition-transform duration-300 group-hover:scale-110 sm:h-18 sm:w-18">
            {feature.imageSrc ? (
              <Image
                src={feature.imageSrc}
                alt={feature.title}
                fill
                className="object-contain drop-shadow-md"
                sizes="72px"
              />
            ) : (
              <div className="bg-primary-50 text-primary-600 flex h-12 w-12 items-center justify-center rounded-2xl">
                <FallbackIcon className="h-6 w-6 stroke-[2]" />
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-h3 group-hover:text-primary-600 mb-2 font-bold text-neutral-900 transition-colors dark:text-white dark:group-hover:text-cyan-400">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-body-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            {feature.description}
          </p>
        </div>

        {/* Action Link: Khám phá → */}
        <div className="mt-6 pt-2">
          <Link
            href={feature.href}
            className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 hover:gap-2.5 dark:text-cyan-400 dark:hover:text-cyan-300"
          >
            <span>Khám phá</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </Card>
    </FadeInView>
  );
}
