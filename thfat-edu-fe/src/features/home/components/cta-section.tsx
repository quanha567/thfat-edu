import { FadeInView } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { HOME_CTA_DATA } from "../constants/home.data";

export function CtaSection() {
  return (
    <FadeInView delay={0.15} className="h-full">
      <Card className="from-primary-950 via-primary-900 to-primary-800 relative flex h-full flex-col justify-between gap-0 overflow-hidden rounded-2xl border-none bg-gradient-to-br p-8 text-white shadow-xl lg:p-10">
        {/* Decorative radial lighting */}
        <div className="bg-highlight/15 pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full blur-3xl" />
        <div className="bg-primary-500/20 pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-3">
          <h3 className="text-h2 sm:text-h1 leading-tight font-extrabold tracking-tight text-white">
            Sẵn sàng chinh phục <br />
            kỳ thi V-SAT?
          </h3>
          <p className="text-body-sm text-primary-100/90 max-w-xs leading-relaxed">
            {HOME_CTA_DATA.description}
          </p>
        </div>

        <div className="relative z-10 mt-8 flex items-center justify-between gap-4">
          <Button
            asChild
            size="lg"
            className="text-primary-950 hover:bg-primary-50 rounded-full bg-white px-6 font-bold shadow-lg transition-transform hover:scale-105"
          >
            <Link href={HOME_CTA_DATA.ctaHref} className="flex items-center gap-2">
              <span>{HOME_CTA_DATA.ctaText}</span>
              <ArrowRight className="text-primary h-4 w-4" />
            </Link>
          </Button>

          {/* 3D Rocket */}
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl">
            <Image
              src={HOME_CTA_DATA.imageSrc}
              alt="3D Rocket Launching"
              fill
              className="object-contain"
              sizes="112px"
            />
          </div>
        </div>
      </Card>
    </FadeInView>
  );
}
