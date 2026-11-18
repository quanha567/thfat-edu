import { getAvatarGradient, getInitials } from "@/components/base";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, User } from "lucide-react";

import { formatLeaderboardScore } from "../constants/leaderboard.constants";
import { type TLeaderboardItem } from "../types/leaderboard.types";

export type TLeaderboardPodiumProps = {
  topItems: TLeaderboardItem[];
};

type TRank = 1 | 2 | 3;

type TPodiumConfig = {
  rank: TRank;
  order: string;
  avatarSize: string;
  avatarTextSize: string;
  cardWidth: string;
  cardPadding: string;
  nameSize: string;
  scoreSize: string;
  ringClass: string;
  badgeClass: string;
  cardBorder: string;
};

const PODIUM_CONFIGS: Record<TRank, TPodiumConfig> = {
  1: {
    rank: 1,
    order: "order-2 -mt-4 sm:-mt-6 z-20",
    avatarSize: "h-20 w-20 sm:h-24 sm:w-24",
    avatarTextSize: "text-xl sm:text-2xl",
    cardWidth: "w-full max-w-[210px] sm:max-w-[250px]",
    cardPadding: "px-3.5 py-4 sm:px-5 sm:py-5",
    nameSize: "text-sm sm:text-base font-extrabold",
    scoreSize: "text-lg sm:text-2xl",
    ringClass: "ring-4 ring-gold-400 shadow-[0_0_24px_rgba(251,191,36,0.35)]",
    badgeClass: "bg-gold-400 text-primary-950 ring-2 ring-white",
    cardBorder: "border-gold-300/70 shadow-xl",
  },
  2: {
    rank: 2,
    order: "order-1 z-10",
    avatarSize: "h-16 w-16 sm:h-20 sm:w-20",
    avatarTextSize: "text-sm sm:text-base",
    cardWidth: "w-full max-w-[170px] sm:max-w-[200px]",
    cardPadding: "px-3 py-3 sm:px-4 sm:py-4",
    nameSize: "text-xs sm:text-sm font-bold",
    scoreSize: "text-base sm:text-xl",
    ringClass: "ring-4 ring-neutral-300 shadow-[0_0_16px_rgba(203,213,225,0.25)]",
    badgeClass: "bg-neutral-200 text-neutral-800 ring-2 ring-white",
    cardBorder: "border-neutral-200 shadow-lg",
  },
  3: {
    rank: 3,
    order: "order-3 z-10",
    avatarSize: "h-16 w-16 sm:h-20 sm:w-20",
    avatarTextSize: "text-sm sm:text-base",
    cardWidth: "w-full max-w-[170px] sm:max-w-[200px]",
    cardPadding: "px-3 py-3 sm:px-4 sm:py-4",
    nameSize: "text-xs sm:text-sm font-bold",
    scoreSize: "text-base sm:text-xl",
    ringClass: "ring-4 ring-gold-600 shadow-[0_0_16px_rgba(217,119,6,0.25)]",
    badgeClass: "bg-gold-600 text-gold-50 ring-2 ring-white",
    cardBorder: "border-gold-200/70 shadow-lg",
  },
};

export function LeaderboardPodium({ topItems }: TLeaderboardPodiumProps) {
  const first = topItems.find((item) => item.rank === 1);
  const second = topItems.find((item) => item.rank === 2);
  const third = topItems.find((item) => item.rank === 3);

  const entries: Array<{ rank: TRank; item?: TLeaderboardItem }> = [
    { rank: 2, item: second },
    { rank: 1, item: first },
    { rank: 3, item: third },
  ];

  return (
    <div className="relative mx-auto w-full max-w-4xl px-2 pt-4 pb-2">
      <div className="grid grid-cols-3 items-end gap-2.5 sm:gap-6">
        {entries.map(({ rank, item }) => {
          const cfg = PODIUM_CONFIGS[rank];

          if (!item) {
            return (
              <div
                key={rank}
                className={`${cfg.order} flex flex-col items-center opacity-60 transition-opacity hover:opacity-80`}
              >
                {/* Empty Avatar Placeholder */}
                <div className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-white/30 bg-white/5 sm:h-16 sm:w-16">
                  <User className="h-6 w-6 text-white/50" />
                  <span className="absolute -bottom-1.5 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">
                    #{rank}
                  </span>
                </div>

                {/* Empty Card Placeholder */}
                <div
                  className={`w-full ${cfg.cardWidth} rounded-2xl border border-dashed border-white/20 bg-white/5 p-3 text-center backdrop-blur-xs`}
                >
                  <p className="text-xs font-semibold text-white/70">Top {rank}</p>
                  <p className="mt-0.5 text-[11px] text-white/50">Đang chờ thí sinh</p>
                </div>
              </div>
            );
          }

          return (
            <div
              key={rank}
              className={`${cfg.order} flex flex-col items-center transition-transform duration-300 hover:-translate-y-1`}
            >
              {/* Avatar with Metallic Ring & Crown */}
              <div className="relative mb-3 flex flex-col items-center">
                {rank === 1 && (
                  <Crown className="text-gold-300 mb-1 h-6 w-6 drop-shadow-sm sm:h-7 sm:w-7" />
                )}

                <div className="relative">
                  <Avatar className={`${cfg.avatarSize} ${cfg.ringClass} ring-offset-2 ring-offset-[#09357a]`}>
                    <AvatarImage src={item.avatarUrl ?? undefined} alt={item.fullName} />
                    <AvatarFallback
                      className={`bg-gradient-to-br ${getAvatarGradient(item.fullName)} font-black tracking-wider text-white shadow-inner ring-1 ring-white/30 select-none ${cfg.avatarTextSize}`}
                    >
                      {getInitials(item.fullName)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Rank Badge Tag */}
                  <span
                    className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-black shadow-sm ${cfg.badgeClass}`}
                  >
                    #{rank}
                  </span>
                </div>
              </div>

              {/* Glassmorphic Info Card */}
              <div
                className={`relative z-10 ${cfg.cardWidth} ${cfg.cardPadding} rounded-2xl border bg-white/95 text-center backdrop-blur-md ${cfg.cardBorder}`}
              >
                <p className={`truncate text-foreground ${cfg.nameSize}`}>
                  {item.fullName}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground sm:text-xs">
                  {item.schoolName || "—"}
                </p>
                <p className={`mt-1 font-black text-primary ${cfg.scoreSize}`}>
                  <span>{formatLeaderboardScore(item.totalScore)}</span>{" "}
                  <span className="text-[11px] font-semibold sm:text-xs text-primary-500">
                    điểm
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
