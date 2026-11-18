import { FadeInView } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { HOME_ABOUT_DATA } from "../constants/home.data";

export function AboutPreviewSection() {
  return (
    <FadeInView id="about" className="h-full">
      <Card className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200/80 bg-gradient-to-br from-white via-white to-primary-50/70 p-7 shadow-xs transition-all hover:shadow-md dark:border-white/10 dark:bg-neutral-900/80 sm:p-8 lg:p-10">
        {/* Soft background ambient radial glow */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 left-1/3 h-48 w-48 rounded-full bg-primary-400/10 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 items-center gap-6 md:grid-cols-12 md:gap-8">
          {/* Left Content */}
          <div className="flex flex-col items-start space-y-4 md:col-span-7">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50 px-3.5 py-1 text-xs font-semibold text-primary-700 dark:border-primary-900 dark:bg-primary-950/50 dark:text-cyan-300">
              <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
              <span>{HOME_ABOUT_DATA.tagline}</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary-950 leading-tight dark:text-white">
              {HOME_ABOUT_DATA.title} <br />
              <span>{HOME_ABOUT_DATA.subtitle}</span>
            </h2>

            {/* Description */}
            <p className="text-body-sm sm:text-body leading-relaxed text-neutral-600 dark:text-neutral-300">
              {HOME_ABOUT_DATA.description}
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <Button
                asChild
                className="bg-primary hover:bg-primary-800 shadow-primary/25 rounded-full px-6 py-2.5 font-semibold text-primary-foreground shadow-md transition-all hover:scale-105"
              >
                <Link href={HOME_ABOUT_DATA.ctaHref} className="flex items-center gap-2">
                  <span>{HOME_ABOUT_DATA.ctaText}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: 3D Chemical Flask Illustration */}
          <div className="relative flex items-center justify-center md:col-span-5 h-56 sm:h-64 lg:h-72 w-full">
            {/* Ambient Cyan Aura behind Flask */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-48 w-48 rounded-full bg-gradient-to-tr from-cyan-400/25 to-blue-500/20 blur-2xl dark:bg-cyan-500/15" />
            </div>

            <Image
              src={HOME_ABOUT_DATA.imageSrc}
              alt="Bình thí nghiệm hóa học 3D ThFat Edu"
              fill
              className="relative z-10 object-contain drop-shadow-[0_16px_32px_rgba(0,140,255,0.25)] transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 360px"
              priority
            />
          </div>
        </div>
      </Card>
    </FadeInView>
  );
}
