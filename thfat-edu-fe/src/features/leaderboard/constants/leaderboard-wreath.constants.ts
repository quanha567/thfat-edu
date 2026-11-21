export type TRankWreathConfig = {
  leafGradient: { id: string; stops: Array<{ offset: string; color: string }> };
  crownGradient: { id: string; stops: Array<{ offset: string; color: string }> };
  crownDropShadow: string;
  crownSize: string;
  crownOffset: string;
  ringBorder: string;
  haloBg: string;
  badgeBg: string;
  badgeInnerBorder: string;
  badgeSize: string;
};

export const WREATH_CONFIGS: Record<1 | 2 | 3, TRankWreathConfig> = {
  1: {
    leafGradient: {
      id: "leaf-gold-grad",
      stops: [
        { offset: "0%", color: "#FEF08A" },
        { offset: "45%", color: "#F59E0B" },
        { offset: "100%", color: "#B45309" },
      ],
    },
    crownGradient: {
      id: "crown-gold-grad",
      stops: [
        { offset: "0%", color: "#FFFBEB" },
        { offset: "25%", color: "#FDE047" },
        { offset: "65%", color: "#F59E0B" },
        { offset: "100%", color: "#D97706" },
      ],
    },
    crownDropShadow: "drop-shadow(0 4px 10px rgba(245, 158, 11, 0.65))",
    crownSize: "w-10 h-7.5 sm:w-12 sm:h-9",
    crownOffset: "-top-4.5 sm:-top-5.5",
    ringBorder:
      "p-1 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 shadow-[0_0_24px_rgba(251,191,36,0.45)]",
    haloBg:
      "bg-gradient-to-tr from-amber-400/40 via-yellow-300/30 to-amber-500/30 blur-xl animate-pulse-aura",
    badgeBg:
      "bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 shadow-[0_2px_8px_rgba(217,119,6,0.55)]",
    badgeInnerBorder: "border-amber-200/70",
    badgeSize: "h-6 w-6 sm:h-7.5 sm:w-7.5 text-xs sm:text-sm",
  },
  2: {
    leafGradient: {
      id: "leaf-silver-grad",
      stops: [
        { offset: "0%", color: "#FFFFFF" },
        { offset: "45%", color: "#CBD5E1" },
        { offset: "100%", color: "#64748B" },
      ],
    },
    crownGradient: {
      id: "crown-silver-grad",
      stops: [
        { offset: "0%", color: "#FFFFFF" },
        { offset: "35%", color: "#E2E8F0" },
        { offset: "70%", color: "#94A3B8" },
        { offset: "100%", color: "#64748B" },
      ],
    },
    crownDropShadow: "drop-shadow(0 4px 8px rgba(148, 163, 184, 0.5))",
    crownSize: "w-8.5 h-6.5 sm:w-10 sm:h-7.5",
    crownOffset: "-top-4 sm:-top-5",
    ringBorder:
      "p-1 bg-gradient-to-b from-slate-100 via-slate-300 to-slate-400 shadow-[0_0_18px_rgba(203,213,225,0.4)]",
    haloBg:
      "bg-gradient-to-tr from-slate-200/30 via-white/20 to-slate-400/25 blur-lg animate-pulse-aura",
    badgeBg:
      "bg-gradient-to-b from-slate-100 via-slate-300 to-slate-500 shadow-[0_2px_8px_rgba(100,116,139,0.5)]",
    badgeInnerBorder: "border-white/70",
    badgeSize: "h-5.5 w-5.5 sm:h-7 sm:w-7 text-xs sm:text-sm",
  },
  3: {
    leafGradient: {
      id: "leaf-bronze-grad",
      stops: [
        { offset: "0%", color: "#FED7AA" },
        { offset: "45%", color: "#EA580C" },
        { offset: "100%", color: "#7C2D12" },
      ],
    },
    crownGradient: {
      id: "crown-bronze-grad",
      stops: [
        { offset: "0%", color: "#FFEDD5" },
        { offset: "30%", color: "#FB923C" },
        { offset: "70%", color: "#D97706" },
        { offset: "100%", color: "#9A3412" },
      ],
    },
    crownDropShadow: "drop-shadow(0 4px 8px rgba(217, 119, 6, 0.45))",
    crownSize: "w-8.5 h-6.5 sm:w-10 sm:h-7.5",
    crownOffset: "-top-4 sm:-top-5",
    ringBorder:
      "p-1 bg-gradient-to-b from-orange-200 via-amber-500 to-amber-700 shadow-[0_0_18px_rgba(217,119,6,0.4)]",
    haloBg:
      "bg-gradient-to-tr from-amber-600/25 via-orange-400/20 to-amber-700/25 blur-lg animate-pulse-aura",
    badgeBg:
      "bg-gradient-to-b from-orange-300 via-amber-600 to-amber-800 shadow-[0_2px_8px_rgba(180,83,9,0.5)]",
    badgeInnerBorder: "border-orange-200/70",
    badgeSize: "h-5.5 w-5.5 sm:h-7 sm:w-7 text-xs sm:text-sm",
  },
};
