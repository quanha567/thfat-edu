export type TLeaderboardPedestalProps = {
  rank: 1 | 2 | 3;
};

const PEDESTAL_STYLES = {
  1: {
    topSurface:
      "bg-gradient-to-r from-gold-200 via-warning-300 to-gold-300 border-t border-warning-100 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]",
    cylinder:
      "bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 border-b-2 border-gold-700 shadow-[0_12px_24px_rgba(217,119,6,0.45)]",
    rimGlow: "bg-gold-300/40",
    height: "h-6 sm:h-8",
  },
  2: {
    topSurface:
      "bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 border-t border-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]",
    cylinder:
      "bg-gradient-to-b from-neutral-300 via-neutral-400 to-neutral-500 border-b-2 border-neutral-600 shadow-[0_10px_20px_rgba(100,116,139,0.35)]",
    rimGlow: "bg-neutral-200/30",
    height: "h-5 sm:h-7",
  },
  3: {
    topSurface:
      "bg-gradient-to-r from-gold-200 via-gold-300 to-gold-400 border-t border-gold-100 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]",
    cylinder:
      "bg-gradient-to-b from-gold-600 via-gold-700 to-gold-800 border-b-2 border-gold-950 shadow-[0_10px_20px_rgba(180,83,9,0.35)]",
    rimGlow: "bg-gold-400/30",
    height: "h-5 sm:h-7",
  },
} as const;

export function LeaderboardPedestal({ rank }: TLeaderboardPedestalProps) {
  const style = PEDESTAL_STYLES[rank];

  return (
    <div className="relative w-full pt-1">
      {/* Ambient pedestal glow */}
      <div className={`absolute inset-x-4 -bottom-2 h-4 blur-md ${style.rimGlow}`} />

      {/* 3D Cylindrical Stage */}
      <div className="relative w-full">
        {/* Top elliptical surface */}
        <div className={`h-3 w-full rounded-[100%] ${style.topSurface}`} />

        {/* Cylinder body */}
        <div
          className={`-mt-1.5 w-full rounded-b-2xl ${style.height} ${style.cylinder} flex items-center justify-center`}
        >
          {/* Subtle rim reflection line */}
          <div className="h-0.5 w-3/4 rounded-full bg-white/30 blur-[0.5px]" />
        </div>
      </div>
    </div>
  );
}
