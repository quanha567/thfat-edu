import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { ExamEditorPageClient } from "@/features/exams/components/editor/exam-editor-page-client";

type TAdminExamEditPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "Chỉnh sửa đề thi | ThFat Edu Admin",
  description: "Biên tập nội dung câu hỏi và cấu hình đề thi",
};

async function ExamEditorLoader({ params }: TAdminExamEditPageProps) {
  const { id } = await params;

  return <ExamEditorPageClient examId={id} />;
}

export default function AdminExamEditPage({ params }: TAdminExamEditPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Đang tải trình chỉnh sửa đề thi...</p>
        </div>
      }
    >
      <ExamEditorLoader params={params} />
    </Suspense>
  );
}
