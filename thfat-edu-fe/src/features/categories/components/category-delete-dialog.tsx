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
import { type Nullable } from "@thfat-edu/shared";

import { type TCategory } from "../types/category.types";

export type TCategoryDeleteDialogProps = {
  isOpen: boolean;
  category: Nullable<TCategory>;
  onClose: () => void;
  onConfirm: () => void;
};

export function CategoryDeleteDialog({
  isOpen,
  category,
  onClose,
  onConfirm,
}: TCategoryDeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa chuyên mục?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này sẽ xóa chuyên mục &ldquo;{category?.name ?? ""}&rdquo; khỏi hệ thống. Các
            bài viết thuộc chuyên mục này sẽ được chuyển về trạng thái Chưa phân loại.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Hủy bỏ</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Xác nhận xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
