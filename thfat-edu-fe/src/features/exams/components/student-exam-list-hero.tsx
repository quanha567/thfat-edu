export type TStudentExamListHeroProps = {
  totalExams?: number;
};

export function StudentExamListHero(_props?: TStudentExamListHeroProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-foreground text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
        Ngân hàng đề thi thử Hóa học
      </h1>

      <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed sm:text-base">
        Hệ thống đề thi mô phỏng bám sát cấu trúc đề mới của Bộ GD&amp;ĐT và định dạng V-SAT. Rèn
        luyện phản xạ, làm quen áp lực phòng thi và đánh giá chính xác năng lực bản thân.
      </p>
    </div>
  );
}
