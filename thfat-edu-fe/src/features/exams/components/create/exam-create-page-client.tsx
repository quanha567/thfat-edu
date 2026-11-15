"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useCreateExam } from "../../hooks/use-create-exam";
import { useExamImport } from "../../hooks/use-exam-import";
import { ExamCreateHeader } from "./exam-create-header";
import { ExamCreatePreviewCard } from "./exam-create-preview-card";
import { ExamCreateProgressCard } from "./exam-create-progress-card";
import { ExamCreateUploadCard } from "./exam-create-upload-card";

export function ExamCreatePageClient() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userTitle, setUserTitle] = useState<string | null>(null);

  const { isUploading, isProcessing, progress, logs, parsedData, error, startImport } =
    useExamImport();

  const createExamMutation = useCreateExam();
  const currentTitle = userTitle ?? parsedData?.title ?? "";

  const handleStartImport = () => {
    if (selectedFile) {
      void startImport(selectedFile);
    }
  };

  const handleSave = async () => {
    if (!parsedData) return;

    try {
      const created = await createExamMutation.mutateAsync({
        ...parsedData,
        title: currentTitle.trim() || parsedData.title,
      });

      toast.success("Đã lưu đề thi thành công vào Ngân hàng Đề!");
      router.push(`/admin/exams/${created.id}/edit`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra khi lưu đề thi.");
    }
  };

  const canSave = Boolean(parsedData && !isProcessing && !isUploading);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-6 p-4 md:p-6 lg:px-8 lg:py-6">
      <ExamCreateHeader
        isSaving={createExamMutation.isPending}
        canSave={canSave}
        onSave={handleSave}
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Upload & Progress */}
        <div className="space-y-4 lg:col-span-5 xl:col-span-4">
          <ExamCreateUploadCard
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
            onStart={handleStartImport}
            isUploading={isUploading}
            isProcessing={isProcessing}
            hasResult={Boolean(parsedData)}
          />

          {(isUploading || isProcessing || logs.length > 0 || error) && (
            <ExamCreateProgressCard
              isUploading={isUploading}
              progress={progress}
              logs={logs}
              error={error}
            />
          )}
        </div>

        {/* Right Column: Live Preview */}
        <div className="lg:col-span-7 xl:col-span-8">
          <ExamCreatePreviewCard
            parsedData={parsedData}
            customTitle={currentTitle}
            onChangeTitle={setUserTitle}
            isProcessing={isProcessing || isUploading}
          />
        </div>
      </div>
    </div>
  );
}
