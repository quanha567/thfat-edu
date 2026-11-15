import { cn } from "cn";

import { EXAM_DIFFICULTY_CONFIG } from "../constants/exam.constants";
import { type TExamDifficulty } from "../types";

export type TExamDifficultyBadgeProps = {
  difficulty: TExamDifficulty;
  className?: string;
};

export function ExamDifficultyBadge({ difficulty, className }: TExamDifficultyBadgeProps) {
  const config = EXAM_DIFFICULTY_CONFIG[difficulty] ?? EXAM_DIFFICULTY_CONFIG.medium;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        config.badgeClass,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
