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
      className={`flex items-center gap-3.5 py-3 sm:gap-5 sm:py-0 ${
        isFirst ? "sm:pr-6" : "sm:px-6"
      }`}
    >
      {/* 3D Glossy Icon */}
      <div className="relative h-12 w-12 shrink-0 transition-transform duration-300 hover:scale-110 sm:h-14 sm:w-14">
        {stat.iconSrc ? (
          <Image
            src={stat.iconSrc}
            alt={stat.label}
            width={56}
            height={56}
            className="h-full w-full object-contain drop-shadow-md"
          />
        ) : null}
      </div>

      {/* Metric & Label */}
      <div className="space-y-0.5">
        <p className="font-sans text-2xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-3xl lg:text-4xl">
          <AnimatedCounter value={stat.value} countUp={stat.countUp} />
        </p>
        <p className="text-xs leading-snug font-medium text-white/90 sm:text-sm">
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
