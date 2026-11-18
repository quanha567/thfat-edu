import { HOME_FEATURES } from "../constants/home.data";
import { FeatureCard } from "./feature-card";

export function FeaturesSection() {
  return (
    <section id="features" className="relative bg-background pt-8 pb-16 md:pt-12 md:pb-20">
      {/* Subtle molecular background watermark */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-40">
        <svg
          className="absolute top-10 left-6 h-64 w-64 text-primary-200/30"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" />
          <circle cx="50" cy="15" r="2.5" fill="currentColor" />
          <circle cx="80" cy="32" r="2.5" fill="currentColor" />
          <circle cx="80" cy="68" r="2.5" fill="currentColor" />
          <circle cx="50" cy="85" r="2.5" fill="currentColor" />
          <circle cx="20" cy="68" r="2.5" fill="currentColor" />
          <circle cx="20" cy="32" r="2.5" fill="currentColor" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with Accent Lines */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-3 flex items-center justify-center gap-4">
            <span className="h-0.5 w-12 rounded-full bg-primary-600 sm:w-16" />
            <h2 className="text-h2 sm:text-h1 font-bold tracking-tight text-neutral-900 dark:text-white">
              Tính năng nổi bật
            </h2>
            <span className="h-0.5 w-12 rounded-full bg-primary-600 sm:w-16" />
          </div>
          <p className="text-body font-medium text-neutral-600 dark:text-neutral-300">
            Công cụ luyện thi toàn diện, giúp bạn tiến bộ vượt bậc
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_FEATURES.map((feature, idx) => (
            <FeatureCard key={feature.id} feature={feature} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
