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
import { type Nullable } from "@thfat-edu/shared";

export type TExamDeleteDialogProps = {
  targetExam: Nullable<{ id: string; title: string }>;
  batchCount?: number;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ExamDeleteDialog({
  targetExam,
  batchCount = 0,
  isDeleting,
  onClose,
  onConfirm,
}: TExamDeleteDialogProps) {
  const isBatch = batchCount > 0;
  const confirmLabel = isBatch ? `Xóa ${batchCount} đề thi` : "Xóa đề thi";

  return (
    <AlertDialog
      open={isBatch || Boolean(targetExam)}
      onOpenChange={(open) => !open && !isDeleting && onClose()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isBatch ? `Xác nhận xóa ${batchCount} đề thi đã chọn?` : "Xác nhận xóa đề thi?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isBatch ? (
              `Hành động này không thể hoàn tác. ${batchCount} đề thi cùng toàn bộ câu hỏi và dữ liệu liên quan sẽ bị xóa vĩnh viễn khỏi ngân hàng đề.`
            ) : (
              <>
                Hành động này không thể hoàn tác. Toàn bộ cấu trúc câu hỏi và dữ liệu liên quan của
                đề thi <span className="text-foreground font-semibold">"{targetExam?.title}"</span>{" "}
                sẽ bị xóa vĩnh viễn khỏi ngân hàng đề.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Đang xóa..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
