// color-exception: decorative laurel/crown illustration with metallic gradients outside the UI palette.
import { type ReactNode } from "react";

import { WREATH_CONFIGS } from "../constants/leaderboard-wreath.constants";

export type TLeaderboardWreathProps = {
  rank: 1 | 2 | 3;
  children: ReactNode;
};

export function LeaderboardWreath({ rank, children }: TLeaderboardWreathProps) {
  const cfg = WREATH_CONFIGS[rank];
  const branchId = `${cfg.leafGradient.id}-branch`;

  return (
    <div className="relative flex items-center justify-center">
      {/* Ambient Pulsing Aura Halo */}
      <div
        className={`pointer-events-none absolute -inset-3.5 rounded-full sm:-inset-5 ${cfg.haloBg}`}
      />

      {/* Royal Crown Resting atop Avatar Rim */}
      <div
        className={`animate-float-subtle pointer-events-none absolute ${cfg.crownOffset} left-1/2 z-30 -translate-x-1/2 ${cfg.crownSize}`}
      >
        <svg
          viewBox="0 0 60 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          style={{ filter: cfg.crownDropShadow }}
        >
          <defs>
            <linearGradient id={cfg.crownGradient.id} x1="0%" y1="0%" x2="100%" y2="100%">
              {cfg.crownGradient.stops.map((stop) => (
                <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
          </defs>

          {/* Royal Crown 5-Peak Shell */}
          <path
            d="M7 36 Q30 42 53 36 L57 16 C53 20 48 24 43 23 L30 8 L17 23 C12 24 7 20 3 16 Z"
            fill={`url(#${cfg.crownGradient.id})`}
            stroke="#FFFFFF"
            strokeWidth="0.8"
          />

          {/* Crown Base Arch Band */}
          <path d="M8 35 Q30 40 52 35 L53 38 Q30 43 7 38 Z" fill="#FFFFFF" opacity="0.3" />

          {/* Pearls on Crown Peaks */}
          <circle
            cx="30"
            cy="8"
            r="3.2"
            fill="#FFFFFF"
            stroke={cfg.crownGradient.stops[1].color}
            strokeWidth="0.8"
          />
          <circle
            cx="3"
            cy="16"
            r="2.4"
            fill="#FFFFFF"
            stroke={cfg.crownGradient.stops[1].color}
            strokeWidth="0.8"
          />
          <circle
            cx="57"
            cy="16"
            r="2.4"
            fill="#FFFFFF"
            stroke={cfg.crownGradient.stops[1].color}
            strokeWidth="0.8"
          />
          <circle
            cx="17"
            cy="23"
            r="2"
            fill="#FFFFFF"
            stroke={cfg.crownGradient.stops[1].color}
            strokeWidth="0.8"
          />
          <circle
            cx="43"
            cy="23"
            r="2"
            fill="#FFFFFF"
            stroke={cfg.crownGradient.stops[1].color}
            strokeWidth="0.8"
          />
        </svg>

        {/* 4-Point Twinkling Sparkle on Top 1 Crown */}
        {rank === 1 && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="animate-sparkle-twinkle pointer-events-none absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 drop-shadow-[0_0_8px_rgba(255,255,255,1)] sm:h-5 sm:w-5"
          >
            <path
              d="M12 0 C12 6.6 6.6 12 0 12 C6.6 12 12 17.4 12 24 C12 17.4 17.4 12 24 12 C17.4 12 12 6.6 12 0 Z"
              fill="#FFFFFF"
            />
            <circle cx="12" cy="12" r="2.2" fill="#FEF08A" />
          </svg>
        )}
      </div>

      {/* Symmetrical Laurel Wreath Embracing Avatar Flanks */}
      <svg
        viewBox="0 0 200 200"
        className="pointer-events-none absolute top-1/2 left-1/2 z-20 h-[175%] w-[175%] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={cfg.leafGradient.id} x1="0%" y1="0%" x2="100%" y2="100%">
            {cfg.leafGradient.stops.map((stop) => (
              <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>

          {/* Reusable Botanical Laurel Branch */}
          <g id={branchId} fill={`url(#${cfg.leafGradient.id})`}>
            {/* Upward Arching Curved Stem */}
            <path
              d="M75 155 C30 132 28 80 62 48"
              stroke={`url(#${cfg.leafGradient.id})`}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
            {/* 5 Leaf Pairs Pointing Upward Along the Stem */}
            <path
              d="M70 148 C64 146 56 141 58 134 C63 133 69 139 70 148 Z"
              stroke="#FFFFFF"
              strokeWidth="0.4"
              strokeOpacity="0.35"
            />
            <path
              d="M66 150 C58 152 46 153 48 144 C53 140 62 142 66 150 Z"
              stroke="#FFFFFF"
              strokeWidth="0.4"
              strokeOpacity="0.35"
            />
            <path
              d="M52 128 C47 122 41 116 45 110 C50 111 54 119 52 128 Z"
              stroke="#FFFFFF"
              strokeWidth="0.4"
              strokeOpacity="0.35"
            />
            <path
              d="M48 130 C38 131 29 129 32 120 C38 118 45 122 48 130 Z"
              stroke="#FFFFFF"
              strokeWidth="0.4"
              strokeOpacity="0.35"
            />
            <path
              d="M40 106 C36 98 33 92 38 86 C43 89 45 98 40 106 Z"
              stroke="#FFFFFF"
              strokeWidth="0.4"
              strokeOpacity="0.35"
            />
            <path
              d="M36 108 C26 107 17 104 20 96 C27 94 33 99 36 108 Z"
              stroke="#FFFFFF"
              strokeWidth="0.4"
              strokeOpacity="0.35"
            />
            <path
              d="M42 83 C40 74 42 68 48 64 C51 69 50 78 42 83 Z"
              stroke="#FFFFFF"
              strokeWidth="0.4"
              strokeOpacity="0.35"
            />
            <path
              d="M38 84 C29 80 22 76 26 70 C33 68 38 74 38 84 Z"
              stroke="#FFFFFF"
              strokeWidth="0.4"
              strokeOpacity="0.35"
            />
            <path
              d="M52 62 C53 54 57 49 63 46 C65 52 61 59 52 62 Z"
              stroke="#FFFFFF"
              strokeWidth="0.4"
              strokeOpacity="0.35"
            />
            <path
              d="M48 64 C39 58 34 53 38 48 C45 47 49 54 48 64 Z"
              stroke="#FFFFFF"
              strokeWidth="0.4"
              strokeOpacity="0.35"
            />
            <path
              d="M62 48 C63 40 68 36 74 36 C75 43 71 49 62 48 Z"
              stroke="#FFFFFF"
              strokeWidth="0.4"
              strokeOpacity="0.35"
            />
          </g>
        </defs>

        {/* Left Laurel Branch */}
        <use href={`#${branchId}`} />

        {/* Right Laurel Branch (Mirrored across x=100) */}
        <use href={`#${branchId}`} transform="translate(200, 0) scale(-1, 1)" />
      </svg>

      {/* Avatar Container with Metallic Double-Bezel */}
      <div className={`relative z-10 rounded-full ${cfg.ringBorder}`}>{children}</div>

      {/* Circular Medal Badge (#1, #2, #3) at Bottom Overlap */}
      <div
        className={`absolute -bottom-2 z-30 flex items-center justify-center rounded-full ring-2 ring-white/95 sm:-bottom-2.5 ${cfg.badgeSize} ${cfg.badgeBg}`}
      >
        <div
          className={`flex h-[calc(100%-2px)] w-[calc(100%-2px)] items-center justify-center rounded-full border ${cfg.badgeInnerBorder}`}
        >
          <span className="font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            {rank}
          </span>
        </div>
      </div>
    </div>
  );
}
