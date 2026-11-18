import { type ReactNode } from "react";

export type TLeaderboardWreathProps = {
  rank: 1 | 2 | 3;
  children: ReactNode;
};

const WREATH_THEMES = {
  1: {
    crownColor: "#F59E0B",
    crownGlow: "drop-shadow(0 2px 6px rgba(245, 158, 11, 0.7))",
    leafGradId: "gold-leaf-grad",
    leafColors: ["#FDE68A", "#F59E0B", "#D97706"],
    ringBorder: "border-gold-400 ring-2 ring-gold-300/60 shadow-[0_0_16px_rgba(251,191,36,0.4)]",
    badgeBg:
      "bg-gradient-to-b from-gold-300 via-gold-400 to-gold-600 text-primary-950 shadow-[0_2px_6px_rgba(217,119,6,0.5)]",
  },
  2: {
    crownColor: "#CBD5E1",
    crownGlow: "drop-shadow(0 2px 6px rgba(203, 213, 225, 0.7))",
    leafGradId: "silver-leaf-grad",
    leafColors: ["#F8FAFC", "#CBD5E1", "#94A3B8"],
    ringBorder:
      "border-neutral-300 ring-2 ring-neutral-200/60 shadow-[0_0_14px_rgba(148,163,184,0.35)]",
    badgeBg:
      "bg-gradient-to-b from-neutral-200 via-neutral-300 to-neutral-500 text-neutral-900 shadow-[0_2px_6px_rgba(100,116,139,0.5)]",
  },
  3: {
    crownColor: "#D97706",
    crownGlow: "drop-shadow(0 2px 6px rgba(217, 119, 6, 0.6))",
    leafGradId: "bronze-leaf-grad",
    leafColors: ["#FED7AA", "#D97706", "#9A3412"],
    ringBorder: "border-gold-600 ring-2 ring-gold-500/60 shadow-[0_0_14px_rgba(234,88,12,0.35)]",
    badgeBg:
      "bg-gradient-to-b from-gold-400 via-gold-600 to-gold-800 text-gold-50 shadow-[0_2px_6px_rgba(180,83,9,0.5)]",
  },
} as const;

export function LeaderboardWreath({ rank, children }: TLeaderboardWreathProps) {
  const theme = WREATH_THEMES[rank];

  return (
    <div className="relative flex items-center justify-center">
      {/* 3D Laurel Wreath SVG Vector Ring with Crown */}
      <svg
        viewBox="0 0 160 160"
        className="pointer-events-none absolute -inset-3.5 z-20 h-[calc(100%+28px)] w-[calc(100%+28px)] sm:-inset-5 sm:h-[calc(100%+40px)] sm:w-[calc(100%+40px)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={theme.leafGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.leafColors[0]} />
            <stop offset="50%" stopColor={theme.leafColors[1]} />
            <stop offset="100%" stopColor={theme.leafColors[2]} />
          </linearGradient>
        </defs>

        {/* Crown at top apex */}
        <g style={{ filter: theme.crownGlow }}>
          <path
            d="M68 32 L74 42 L80 26 L86 42 L92 32 L90 48 L70 48 Z"
            fill={`url(#${theme.leafGradId})`}
            stroke="#FFFFFF"
            strokeWidth="0.8"
          />
          <circle cx="80" cy="25" r="2" fill="#FFFFFF" />
          <circle cx="68" cy="31" r="1.5" fill="#FFFFFF" />
          <circle cx="92" cy="31" r="1.5" fill="#FFFFFF" />
        </g>

        {/* Left Laurel Branch */}
        <g fill={`url(#${theme.leafGradId})`} opacity="0.95">
          <path d="M42 56 C38 52 35 48 37 44 C42 45 44 50 42 56 Z" />
          <path d="M34 68 C29 66 26 62 27 58 C32 58 35 63 34 68 Z" />
          <path d="M30 82 C25 81 22 78 22 74 C27 73 31 77 30 82 Z" />
          <path d="M30 96 C25 97 22 101 22 105 C27 106 31 101 30 96 Z" />
          <path d="M35 110 C30 113 28 118 30 122 C34 121 37 116 35 110 Z" />
          <path d="M44 122 C40 127 40 132 43 135 C47 132 48 127 44 122 Z" />
        </g>

        {/* Right Laurel Branch */}
        <g fill={`url(#${theme.leafGradId})`} opacity="0.95">
          <path d="M118 56 C122 52 125 48 123 44 C118 45 116 50 118 56 Z" />
          <path d="M126 68 C131 66 134 62 133 58 C128 58 125 63 126 68 Z" />
          <path d="M130 82 C135 81 138 78 138 74 C133 73 129 77 130 82 Z" />
          <path d="M130 96 C135 97 138 101 138 105 C133 106 129 101 130 96 Z" />
          <path d="M125 110 C130 113 132 118 130 122 C126 121 123 116 125 110 Z" />
          <path d="M116 122 C120 127 120 132 117 135 C113 132 112 127 116 122 Z" />
        </g>

        {/* Circular framing ring */}
        <circle
          cx="80"
          cy="88"
          r="48"
          stroke={`url(#${theme.leafGradId})`}
          strokeWidth="2.5"
          strokeDasharray="4 2"
          opacity="0.6"
        />
      </svg>

      {/* Avatar Container with Metallic Border */}
      <div className={`relative z-10 rounded-full border-2 p-0.5 ${theme.ringBorder}`}>
        {children}
      </div>

      {/* Rank Badge Badge at Bottom Overlap */}
      <div
        className={`absolute -bottom-2.5 z-30 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-xs font-black sm:h-7 sm:w-7 sm:text-sm ${theme.badgeBg}`}
      >
        {rank}
      </div>
    </div>
  );
}
