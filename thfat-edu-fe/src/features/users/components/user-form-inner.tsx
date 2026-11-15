"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { type Nullable } from "@thfat-edu/shared";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import { useCreateUser, useUpdateUser } from "../hooks/use-user-mutations";
import {
  type TStudentProfileInput,
  type TTeacherProfileInput,
  type TUser,
  type TUserRole,
} from "../types";
import { UserAccountFields } from "./user-account-fields";
import { UserProfileFields } from "./user-profile-fields";

export type TUserFormInnerProps = {
  user: Nullable<TUser>;
  onClose: () => void;
};

export function UserFormInner({ user, onClose }: TUserFormInnerProps) {
  const isEdit = Boolean(user);
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState(isEdit ? "" : "Hocsinh@2026");
  const [role, setRole] = useState<TUserRole>(user?.role ?? "student");
  const [isActive, setIsActive] = useState(user?.isActive ?? true);
  const [sendResetEmail, setSendResetEmail] = useState(false);
  const [studentProfile, setStudentProfile] = useState<TStudentProfileInput>(
    user?.studentProfile ?? {},
  );
  const [teacherProfile, setTeacherProfile] = useState<TTeacherProfileInput>(
    user?.teacherProfile ?? {},
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return toast.error("Vui lòng nhập họ và tên");

    const profileData = {
      studentProfile: role === "student" ? studentProfile : null,
      teacherProfile: role === "teacher" ? teacherProfile : null,
    };

    if (!isEdit) {
      if (!email.trim()) return toast.error("Vui lòng nhập địa chỉ email");
      if (!password || password.length < 6) {
        return toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      }

      await createMutation.mutateAsync({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        sendResetEmail,
        ...profileData,
      });
      onClose();

      return;
    }

    if (user) {
      await updateMutation.mutateAsync({
        id: user.id,
        data: {
          fullName: fullName.trim(),
          role,
          isActive,
          ...profileData,
        },
      });
      onClose();
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  function getSubmitButtonText() {
    if (isPending) return "Đang lưu...";
    if (isEdit) return "Lưu thay đổi";

    return "Tạo tài khoản";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-1">
      <UserAccountFields
        isEdit={isEdit}
        fullName={fullName}
        onFullNameChange={setFullName}
        email={email}
        onEmailChange={setEmail}
        role={role}
        onRoleChange={setRole}
        isActive={isActive}
        onActiveChange={setIsActive}
        password={password}
        onPasswordChange={setPassword}
        sendResetEmail={sendResetEmail}
        onSendResetEmailChange={setSendResetEmail}
      />

      <UserProfileFields
        role={role}
        studentProfile={studentProfile}
        teacherProfile={teacherProfile}
        onStudentProfileChange={(fields) => setStudentProfile((prev) => ({ ...prev, ...fields }))}
        onTeacherProfileChange={(fields) => setTeacherProfile((prev) => ({ ...prev, ...fields }))}
      />

      <DialogFooter className="pt-3">
        <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
          Hủy
        </Button>
        <Button type="submit" disabled={isPending}>
          {getSubmitButtonText()}
        </Button>
      </DialogFooter>
    </form>
  );
}
