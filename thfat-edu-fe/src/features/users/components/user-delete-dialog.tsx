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

import { type TUser } from "../types";

export type TUserDeleteDialogProps = {
  user: Nullable<TUser>;
  mode: "delete" | "restore";
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function UserDeleteDialog({
  user,
  mode,
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: TUserDeleteDialogProps) {
  if (!user) return null;

  const isDelete = mode === "delete";
  let confirmButtonText = "Khôi phục tài khoản";
  if (isLoading) {
    confirmButtonText = "Đang xử lý...";
  } else if (isDelete) {
    confirmButtonText = "Xóa người dùng";
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isDelete ? "Xác nhận xóa mềm người dùng?" : "Xác nhận khôi phục người dùng?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isDelete ? (
              <>
                Tài khoản <strong className="text-foreground">{user.fullName}</strong> ({user.email}
                ) sẽ bị chuyển sang trạng thái xóa mềm, vô hiệu hóa đăng nhập ngay lập tức. Toàn bộ
                lịch sử làm bài và dữ liệu của người dùng này vẫn được bảo toàn.
              </>
            ) : (
              <>
                Bạn có chắc chắn muốn khôi phục tài khoản{" "}
                <strong className="text-foreground">{user.fullName}</strong> ({user.email})? Người
                dùng sẽ có thể đăng nhập trở lại bình thường.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} onClick={onClose}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className={
              isDelete ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""
            }
          >
            {confirmButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
