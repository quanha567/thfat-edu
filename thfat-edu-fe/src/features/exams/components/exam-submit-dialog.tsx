"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export type TExamSubmitDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmSubmit: () => void;
  totalSubItems: number;
  answeredCount: number;
  isSubmitting?: boolean;
};

export function ExamSubmitDialog({
  isOpen,
  onOpenChange,
  onConfirmSubmit,
  totalSubItems,
  answeredCount,
  isSubmitting = false,
}: TExamSubmitDialogProps) {
  const unansweredCount = Math.max(0, totalSubItems - answeredCount);
  const hasUnanswered = unansweredCount > 0;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {hasUnanswered ? (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            )}
            <AlertDialogTitle className="text-lg font-bold">
              {hasUnanswered ? "Xác nhận nộp bài thi" : "Bạn đã sẵn sàng nộp bài?"}
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription className="space-y-2 pt-2 text-sm text-neutral-600">
            <p>
              Bạn đã hoàn thành{" "}
              <strong className="font-bold text-neutral-900">{answeredCount}</strong> /{" "}
              {totalSubItems} ý câu hỏi.
            </p>
            {hasUnanswered && (
              <p className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
                Chú ý: Bạn vẫn còn{" "}
                <strong className="font-bold text-amber-900">{unansweredCount}</strong> ý chưa trả
                lời. Mỗi đề thi chỉ được làm 1 lần, bạn có chắc chắn muốn nộp bài ngay bây giờ?
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel disabled={isSubmitting}>Làm tiếp</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirmSubmit();
            }}
            disabled={isSubmitting}
            className="bg-primary-700 hover:bg-primary-800"
          >
            {isSubmitting ? "Đang chấm điểm..." : "Nộp bài ngay"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
