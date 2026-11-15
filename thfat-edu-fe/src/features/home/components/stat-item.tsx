import { GraduationCap, Trophy, Users } from "lucide-react";

import { type THomeStat } from "../constants/home.data";

const ICON_MAP = {
  GraduationCap,
  Users,
  Trophy,
} as const;

type TStatItemProps = {
  stat: THomeStat;
  isFirst: boolean;
};

export function StatItem({ stat, isFirst }: TStatItemProps) {
  const Icon = ICON_MAP[stat.iconName];

  return (
    <div
      className={`flex items-center gap-4 sm:gap-5 ${isFirst ? "sm:pr-6" : "sm:px-6"} py-2 sm:py-0`}
    >
      {/* Radiant Glowing Icon Badge */}
      <div className="text-highlight flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-white/10 shadow-md backdrop-blur-sm">
        <Icon className="h-7 w-7 stroke-[2.2]" />
      </div>

      {/* Metric & Label */}
      <div className="space-y-0.5">
        <p className="text-h2 sm:text-h1 font-extrabold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
          {stat.value}
        </p>
        <p className="text-body-sm text-primary-100/90 font-medium">{stat.label}</p>
      </div>
    </div>
  );
}
