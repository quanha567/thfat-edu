import { SectionBadge } from "@/components/base";
import { FadeInView } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { HOME_ABOUT_DATA } from "../constants/home.data";

export function AboutPreviewSection() {
  return (
    <FadeInView id="about" className="h-full">
      <Card className="border-border from-card via-primary-50/30 to-primary-100/20 relative flex h-full flex-col justify-between gap-0 overflow-hidden rounded-2xl bg-gradient-to-br p-8 shadow-xs lg:p-10">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
          {/* Content */}
          <div className="flex flex-col items-start space-y-4 md:col-span-7">
            <SectionBadge>{HOME_ABOUT_DATA.tagline}</SectionBadge>
            <h2 className="text-h2 sm:text-h1 text-foreground leading-tight font-bold tracking-tight">
              {HOME_ABOUT_DATA.title} <br />
              <span className="text-primary">{HOME_ABOUT_DATA.subtitle}</span>
            </h2>
            <p className="text-body text-muted-foreground leading-relaxed">
              {HOME_ABOUT_DATA.description}
            </p>
            <div className="pt-2">
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary-800 shadow-primary-700/20 rounded-full px-6 py-2.5 font-semibold shadow-md transition-all"
              >
                <Link href={HOME_ABOUT_DATA.ctaHref} className="flex items-center gap-2">
                  <span>{HOME_ABOUT_DATA.ctaText}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* 3D Flask Image with gentle glow */}
          <div className="relative flex items-center justify-center md:col-span-5">
            <div className="relative aspect-square w-full max-w-[260px] overflow-hidden rounded-2xl">
              <Image
                src={HOME_ABOUT_DATA.imageSrc}
                alt="Bình thí nghiệm hóa học 3D ThFat Edu"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 260px"
              />
            </div>
          </div>
        </div>
      </Card>
    </FadeInView>
  );
}
