import { SectionBadge } from "@/components/base";

import { HOME_FEATURES } from "../constants/home.data";
import { FeatureCard } from "./feature-card";

export function FeaturesSection() {
  return (
    <section className="bg-background pt-6 pb-20 md:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <SectionBadge className="justify-center">V-SAT Luyện Thi Toàn Diện</SectionBadge>
          <h2 className="text-h2 sm:text-h1 text-foreground mb-3 font-bold tracking-tight">
            Tính năng nổi bật
          </h2>
          <p className="text-body text-muted-foreground">
            Đồng hành cùng bạn trên hành trình chinh phục kỳ thi V-SAT
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
