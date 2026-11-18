import { FadeInView } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { HOME_CTA_DATA } from "../constants/home.data";

export function CtaSection() {
  return (
    <FadeInView delay={0.15} className="w-full">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#071d49] via-[#0b2f77] to-[#0f3d99] px-6 py-8 text-white shadow-xl sm:px-10 sm:py-10 md:px-12">
        {/* Decorative subtle lighting */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="bg-gold-400/10 pointer-events-none absolute -bottom-12 left-1/3 h-48 w-48 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row md:gap-8">
          {/* Left info */}
          <div className="flex items-start gap-4">
            <div className="bg-gold-400/20 text-gold-300 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl backdrop-blur-sm">
              <Zap className="fill-gold-300 h-6 w-6" />
            </div>

            <div className="space-y-1 text-left">
              <h3 className="text-h3 sm:text-h2 font-extrabold tracking-tight text-white">
                Kiểm tra năng lực với đề thi thử V-SAT
              </h3>
              <p className="text-body-sm text-primary-100/90 sm:text-body font-medium">
                {HOME_CTA_DATA.description}
              </p>
            </div>
          </div>

          {/* Right: Yellow CTA button & 3D Rocket */}
          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
            <Button
              asChild
              size="lg"
              className="bg-gold-400 text-primary-950 shadow-gold-500/25 hover:bg-gold-300 rounded-full px-7 py-3 text-base font-bold shadow-lg transition-all hover:scale-105"
            >
              <Link href={HOME_CTA_DATA.ctaHref} className="flex items-center gap-2">
                <span>{HOME_CTA_DATA.ctaText}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            {/* 3D Rocket visual */}
            <div className="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28">
              <Image
                src={HOME_CTA_DATA.imageSrc}
                alt="3D Rocket Launching"
                fill
                className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
                sizes="112px"
              />
            </div>
          </div>
        </div>
      </div>
    </FadeInView>
  );
}
