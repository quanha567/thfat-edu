import Image from "next/image";

import { type THomeStat } from "../constants/home.data";
import { AnimatedCounter } from "./animated-counter";

type TStatItemProps = {
  stat: THomeStat;
  isFirst: boolean;
};

export function StatItem({ stat, isFirst }: TStatItemProps) {
  return (
    <div
      className={`flex items-center gap-3.5 sm:gap-5 py-3 sm:py-0 ${
        isFirst ? "sm:pr-6" : "sm:px-6"
      }`}
    >
      {/* 3D Glossy Icon */}
      <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 transition-transform duration-300 hover:scale-110">
        {stat.iconSrc ? (
          <Image
            src={stat.iconSrc}
            alt={stat.label}
            width={56}
            height={56}
            className="h-full w-full object-contain drop-shadow-[0_8px_16px_rgba(0,180,255,0.35)]"
          />
        ) : null}
      </div>

      {/* Metric & Label */}
      <div className="space-y-0.5">
        <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm font-sans">
          <AnimatedCounter value={stat.value} countUp={stat.countUp} />
        </p>
        <p className="text-xs sm:text-sm font-medium text-white/90 leading-snug">
          {stat.label}
          {stat.subLabel && (
            <>
              <br className="hidden sm:inline" /> {stat.subLabel}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
