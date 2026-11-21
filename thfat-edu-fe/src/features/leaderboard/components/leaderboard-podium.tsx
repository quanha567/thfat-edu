import { getAvatarGradient, getDefaultAvatar, getInitials } from "@/components/base";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

import { formatLeaderboardScore } from "../constants/leaderboard.constants";
import { type TLeaderboardItem } from "../types/leaderboard.types";
import { LeaderboardRibbons } from "./leaderboard-ribbons";
import { LeaderboardWreath } from "./leaderboard-wreath";

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
    <div className="relative mx-auto w-full max-w-4xl pt-6 pb-2">
      {/* Festive Floating Ribbons */}
      <LeaderboardRibbons />

      <div className="relative z-10 grid grid-cols-3 items-end gap-2.5 sm:gap-6">
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
                  <span className="text-xxs absolute -bottom-1.5 rounded-full bg-white/20 px-2 py-0.5 font-bold text-white">
                    #{rank}
                  </span>
                </div>

                {/* Empty Card Placeholder */}
                <div
                  className={`w-full ${cfg.cardWidth} rounded-2xl border border-dashed border-white/20 bg-white/5 p-3 text-center backdrop-blur-xs`}
                >
                  <p className="text-xs font-semibold text-white/70">Top {rank}</p>
                  <p className="text-xxs mt-0.5 text-white/50">Đang chờ thí sinh</p>
                </div>
              </div>
            );
          }

          return (
            <div
              key={rank}
              className={`${cfg.order} flex flex-col items-center transition-all duration-300 hover:-translate-y-2`}
            >
              {/* Avatar Wrapped in Laurel Wreath, Royal Crown & Halo Glow */}
              <div className="relative mb-3.5 flex flex-col items-center">
                <LeaderboardWreath rank={rank}>
                  <Avatar className={`${cfg.avatarSize} shadow-inner ring-2 ring-white/95`}>
                    {(item.avatarUrl || getDefaultAvatar(item.fullName, item.gender)) && (
                      <AvatarImage
                        src={
                          item.avatarUrl ||
                          getDefaultAvatar(item.fullName, item.gender) ||
                          undefined
                        }
                        alt={item.fullName}
                      />
                    )}
                    <AvatarFallback
                      className={`bg-gradient-to-br ${getAvatarGradient(item.fullName)} font-black tracking-wider text-white shadow-inner ring-1 ring-white/30 select-none ${cfg.avatarTextSize}`}
                    >
                      {getInitials(item.fullName)}
                    </AvatarFallback>
                  </Avatar>
                </LeaderboardWreath>
              </div>

              {/* Glassmorphic Info Card */}
              <div
                className={`relative z-10 ${cfg.cardWidth} ${cfg.cardPadding} rounded-2xl border bg-white/95 text-center shadow-md backdrop-blur-md transition-shadow hover:shadow-xl ${cfg.cardBorder}`}
              >
                <p className={`text-foreground truncate ${cfg.nameSize}`}>{item.fullName}</p>
                <p className="text-muted-foreground text-xxs mt-0.5 truncate sm:text-xs">
                  {item.schoolName || "—"}
                </p>
                <p className={`text-primary mt-1 font-black ${cfg.scoreSize}`}>
                  <span>{formatLeaderboardScore(item.totalScore)}</span>{" "}
                  <span className="text-primary-500 text-xxs font-semibold sm:text-xs">điểm</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
