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
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ExamDeleteDialog({
  targetExam,
  isDeleting,
  onClose,
  onConfirm,
}: TExamDeleteDialogProps) {
  return (
    <AlertDialog open={Boolean(targetExam)} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa đề thi?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Toàn bộ cấu trúc câu hỏi và dữ liệu liên quan của đề
            thi <span className="text-foreground font-semibold">"{targetExam?.title}"</span> sẽ bị
            xóa vĩnh viễn khỏi ngân hàng đề.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Đang xóa..." : "Xóa đề thi"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
