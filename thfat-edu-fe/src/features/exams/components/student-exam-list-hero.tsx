import { BookOpen } from "lucide-react";

export type TStudentExamListHeroProps = {
  totalExams?: number;
};

export function StudentExamListHero({ totalExams }: TStudentExamListHeroProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
          <BookOpen className="h-4 w-4" />
        </div>

        <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl dark:text-neutral-100">
          Thi thử Hóa học
        </h1>

        {totalExams !== undefined && (
          <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-semibold">
            {totalExams} đề thi
          </span>
        )}
      </div>

      <p className="text-muted-foreground mt-1 text-sm">
        Luyện đề thi thử trực tuyến mô phỏng kỳ thi tốt nghiệp THPT chuẩn Bộ GD&amp;ĐT
      </p>
    </div>
  );
}
