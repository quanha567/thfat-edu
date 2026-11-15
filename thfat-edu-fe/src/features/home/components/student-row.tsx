import { BaseAvatar } from "@/components/base";
import { Badge } from "@/components/ui/badge";

import { type TLeaderboardStudent } from "../constants/home.data";

const RANK_BADGES = {
  1: {
    bg: "bg-warning-400 text-warning-950 shadow-warning-400/40 ring-2 ring-warning-300/40",
    label: "1",
  },
  2: {
    bg: "bg-neutral-300 text-neutral-800 shadow-neutral-300/40 ring-2 ring-neutral-200",
    label: "2",
  },
  3: {
    bg: "bg-warning-700 text-warning-100 shadow-warning-700/40 ring-2 ring-warning-600/40",
    label: "3",
  },
} as const;

type TStudentRowProps = {
  student: TLeaderboardStudent;
};

export function StudentRow({ student }: TStudentRowProps) {
  const badge = RANK_BADGES[student.rank];

  return (
    <div className="hover:bg-muted/70 flex items-center justify-between rounded-xl p-2.5 transition-colors">
      <div className="flex items-center gap-3">
        {/* Rank Number Badge */}
        <Badge
          className={`h-6 w-6 shrink-0 rounded-full border-none p-0 text-xs font-black shadow-xs ${badge.bg}`}
        >
          {badge.label}
        </Badge>

        {/* Student Avatar */}
        <BaseAvatar
          name={student.name}
          fallback={student.avatarText}
          size="lg"
          className="border-border border"
        />

        {/* Name and School */}
        <div>
          <p className="text-label text-foreground leading-snug font-semibold">{student.name}</p>
          <p className="text-caption text-muted-foreground">{student.school}</p>
        </div>
      </div>

      {/* Score */}
      <div className="pl-2 text-right">
        <span className="text-label text-foreground font-bold">{student.score.toFixed(1)}</span>
        <span className="text-caption text-muted-foreground ml-1 font-medium">điểm</span>
      </div>
    </div>
  );
}
