import { FadeInView } from "@/components/motion";
import { Card } from "@/components/ui/card";
import { ArrowRight, Trophy } from "lucide-react";
import Link from "next/link";

import { HOME_LEADERBOARD_DATA } from "../constants/home.data";
import { StudentRow } from "./student-row";

export function LeaderboardPreviewSection() {
  return (
    <FadeInView id="leaderboard" delay={0.15} className="h-full">
      <Card className="border-border bg-card flex h-full flex-col justify-between gap-0 rounded-2xl p-7 shadow-xs lg:p-8">
        <div>
          {/* Header */}
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-warning-50 text-warning-700 flex h-8 w-8 items-center justify-center rounded-xl shadow-xs">
                <Trophy className="h-4 w-4" />
              </div>
              <h3 className="text-h3 text-foreground font-semibold">
                {HOME_LEADERBOARD_DATA.title}
              </h3>
            </div>

            <Link
              href={HOME_LEADERBOARD_DATA.viewAllHref}
              className="text-caption text-primary hover:text-primary-800 inline-flex items-center gap-1 font-semibold"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <p className="text-caption text-muted-foreground mb-6">
            {HOME_LEADERBOARD_DATA.subtitle}
          </p>

          {/* List of top students */}
          <div className="space-y-3">
            {HOME_LEADERBOARD_DATA.students.map((student) => (
              <StudentRow key={student.id} student={student} />
            ))}
          </div>
        </div>
      </Card>
    </FadeInView>
  );
}
