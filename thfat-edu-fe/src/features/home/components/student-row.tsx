import { BaseAvatar } from "@/components/base";

import { type TLeaderboardStudent } from "../constants/home.data";

const RANK_BADGES = {
  1: {
    bg: "bg-gradient-to-br from-gold-300 via-gold-400 to-gold-500 text-primary-950 ring-1 ring-gold-300/60 shadow-xs",
    label: "1",
  },
  2: {
    bg: "bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-400 text-neutral-800 ring-1 ring-neutral-300/60 shadow-xs",
    label: "2",
  },
  3: {
    bg: "bg-gradient-to-br from-gold-600 via-gold-700 to-gold-800 text-white ring-1 ring-gold-600/60 shadow-xs",
    label: "3",
  },
} as const;

type TStudentRowProps = {
  student: TLeaderboardStudent;
  isLast?: boolean;
};

export function StudentRow({ student, isLast }: TStudentRowProps) {
  const badge = RANK_BADGES[student.rank];

  return (
    <div
      className={`flex items-center justify-between py-3 transition-colors hover:bg-neutral-50/70 sm:py-3.5 dark:hover:bg-white/5 ${
        !isLast ? "border-b border-neutral-100 dark:border-white/5" : ""
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        {/* Rank Number Badge */}
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${badge.bg}`}
        >
          {badge.label}
        </div>

        {/* Student Avatar Photo */}
        <BaseAvatar
          src={student.avatarUrl}
          name={student.name}
          size="md"
          className="h-9 w-9 shrink-0 ring-2 ring-neutral-100 dark:ring-white/10"
        />

        {/* Name and School */}
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-neutral-900 dark:text-white">
            {student.name}
          </p>
          <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
            {student.school}
          </p>
        </div>
      </div>

      {/* Score */}
      <div className="shrink-0 pl-3 text-right">
        <span className="text-sm font-extrabold text-neutral-900 dark:text-white">
          {student.score.toFixed(1)}{" "}
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">điểm</span>
        </span>
      </div>
    </div>
  );
}
