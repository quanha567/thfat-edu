"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Nullable } from "@thfat-edu/shared";
import { UserCheck, UserPlus } from "lucide-react";

import { type TUser } from "../types";
import { UserFormInner } from "./user-form-inner";

export type TUserFormModalProps = {
  user: Nullable<TUser>;
  isOpen: boolean;
  onClose: () => void;
};

export function UserFormModal({ user, isOpen, onClose }: TUserFormModalProps) {
  const isEdit = Boolean(user);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {isEdit ? (
              <UserCheck className="text-primary h-5 w-5" />
            ) : (
              <UserPlus className="text-primary h-5 w-5" />
            )}
            <DialogTitle>{isEdit ? "Chỉnh sửa người dùng" : "Tạo người dùng mới"}</DialogTitle>
          </div>
          <DialogDescription>
            {isEdit
              ? "Cập nhật thông tin cơ bản và hồ sơ học tập/giảng dạy."
              : "Thêm tài khoản mới và đồng bộ xác thực vào hệ thống."}
          </DialogDescription>
        </DialogHeader>

        {isOpen && (
          <UserFormInner key={user?.id ?? "new-user-form"} user={user} onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}
