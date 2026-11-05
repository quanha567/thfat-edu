import { ExamEditContainer } from "@/features/exams/components/exam-edit-container";

export const metadata = {
  title: "Soát & Biên tập đề thi | ThFat Edu Admin",
  description: "Không gian đối chiếu đề gốc và biên tập câu hỏi 150 điểm",
};

export default async function AdminExamEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <ExamEditContainer examId={id} />
    </div>
  );
}
