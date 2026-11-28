"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useCreateExam } from "../../hooks/use-create-exam";
import { useExamImport } from "../../hooks/use-exam-import";
import { ExamCreatePreviewCard } from "./exam-create-preview-card";
import { ExamCreateProgressCard } from "./exam-create-progress-card";
import { ExamCreateUploadCard } from "./exam-create-upload-card";

export function ExamCreateAiMode() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userTitle, setUserTitle] = useState<string | null>(null);

  const {
    isUploading,
    isProcessing,
    progress,
    logs,
    parsedData,
    error,
    startImport,
    cancel,
    reset,
  } = useExamImport();

  const createExamMutation = useCreateExam();
  const currentTitle = userTitle ?? parsedData?.title ?? "";
  const canSave = Boolean(parsedData && !isProcessing && !isUploading);

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

      reset();
      toast.success("Đã lưu đề thi thành công vào Ngân hàng Đề!");
      router.push(`/admin/exams/${created.id}/edit`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra khi lưu đề thi.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Button asChild variant="outline" size="sm" className="gap-1 text-xs">
          <Link href="/admin/exams">Hủy bỏ</Link>
        </Button>

        <Button
          size="sm"
          onClick={handleSave}
          disabled={!canSave || createExamMutation.isPending}
          className="gap-1.5 text-xs font-semibold"
        >
          {createExamMutation.isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Đang lưu đề...</span>
            </>
          ) : (
            <>
              <Save className="size-3.5" />
              <span>Lưu đề thi</span>
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5 xl:col-span-4">
          <ExamCreateUploadCard
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
            onStart={handleStartImport}
            onCancel={() => void cancel()}
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
