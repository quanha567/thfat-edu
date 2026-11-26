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

import { type TArticleItem } from "../types/article.types";

export type TArticleDeleteDialogProps = {
  isOpen: boolean;
  article: Nullable<TArticleItem>;
  batchCount?: number;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ArticleDeleteDialog({
  isOpen,
  article,
  batchCount = 0,
  isDeleting = false,
  onClose,
  onConfirm,
}: TArticleDeleteDialogProps) {
  const isBatch = batchCount > 0;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isBatch ? `Xác nhận xóa ${batchCount} bài viết đã chọn?` : "Xác nhận xóa bài viết?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isBatch
              ? `Bạn có chắc chắn muốn xóa ${batchCount} bài viết này khỏi hệ thống? Hành động này không thể hoàn tác.`
              : `Hành động này sẽ xóa hoàn toàn bài viết "${article?.title ?? ""}" khỏi hệ thống và không thể phục hồi.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} onClick={onClose}>
            Hủy bỏ
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
