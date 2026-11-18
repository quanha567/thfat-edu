import { FadeInView } from "@/components/motion";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { HOME_LEADERBOARD_DATA } from "../constants/home.data";
import { StudentRow } from "./student-row";

export function LeaderboardPreviewSection() {
  return (
    <FadeInView id="leaderboard" delay={0.15} className="h-full">
      <Card className="flex h-full flex-col justify-between rounded-3xl border border-neutral-200/80 bg-white p-7 shadow-xs transition-all hover:shadow-md sm:p-8 dark:border-white/10 dark:bg-neutral-900/80">
        <div>
          {/* Header matching design */}
          <div className="mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative h-6 w-6 shrink-0">
                <Image
                  src="/images/home/feature-trophy-3d.png"
                  alt="Cúp vinh danh"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 sm:text-xl dark:text-white">
                {HOME_LEADERBOARD_DATA.title}
              </h3>
            </div>

            <Link
              href={HOME_LEADERBOARD_DATA.viewAllHref}
              className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 text-sm font-semibold transition-colors dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <p className="mb-4 text-xs text-neutral-500 sm:text-sm dark:text-neutral-400">
            {HOME_LEADERBOARD_DATA.subtitle}
          </p>

          {/* List of top students */}
          <div className="divide-y divide-neutral-100 dark:divide-white/5">
            {HOME_LEADERBOARD_DATA.students.map((student, idx) => (
              <StudentRow
                key={student.id}
                student={student}
                isLast={idx === HOME_LEADERBOARD_DATA.students.length - 1}
              />
            ))}
          </div>
        </div>
      </Card>
    </FadeInView>
  );
}
