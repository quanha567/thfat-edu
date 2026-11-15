import { ExamEditorPageClient } from "@/features/exams/components/editor/exam-editor-page-client";

type TAdminExamEditPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "Chỉnh sửa đề thi | ThFat Edu Admin",
  description: "Trình biên tập đề thi V-SAT",
};

export default async function AdminExamEditPage({ params }: TAdminExamEditPageProps) {
  const { id } = await params;

  return <ExamEditorPageClient examId={id} />;
}
