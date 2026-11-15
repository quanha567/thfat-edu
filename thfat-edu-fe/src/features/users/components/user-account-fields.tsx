"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Sparkles } from "lucide-react";

import { USER_ROLE_LABELS } from "../constants";
import { type TUserRole } from "../types";

export type TUserAccountFieldsProps = {
  isEdit: boolean;
  fullName: string;
  onFullNameChange: (val: string) => void;
  email: string;
  onEmailChange: (val: string) => void;
  role: TUserRole;
  onRoleChange: (val: TUserRole) => void;
  isActive: boolean;
  onActiveChange: (val: boolean) => void;
  password: string;
  onPasswordChange: (val: string) => void;
  sendResetEmail: boolean;
  onSendResetEmailChange: (val: boolean) => void;
};

export function UserAccountFields({
  isEdit,
  fullName,
  onFullNameChange,
  email,
  onEmailChange,
  role,
  onRoleChange,
  isActive,
  onActiveChange,
  password,
  onPasswordChange,
  sendResetEmail,
  onSendResetEmailChange,
}: TUserAccountFieldsProps) {
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="user-fullName" className="text-xs">
          Họ và tên *
        </Label>
        <Input
          id="user-fullName"
          placeholder="VD: Nguyễn Văn An"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="user-email" className="text-xs">
          Email *
        </Label>
        <Input
          id="user-email"
          type="email"
          disabled={isEdit}
          placeholder="VD: an.nv@thfat.edu.vn"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Vai trò</Label>
          <Select value={role} onValueChange={(val) => onRoleChange(val as TUserRole)}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">{USER_ROLE_LABELS.student}</SelectItem>
              <SelectItem value="teacher">{USER_ROLE_LABELS.teacher}</SelectItem>
              <SelectItem value="admin">{USER_ROLE_LABELS.admin}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isEdit ? (
          <div className="flex flex-col justify-end space-y-2">
            <div className="flex items-center justify-between rounded-lg border p-2">
              <Label htmlFor="user-active" className="text-xs">
                Kích hoạt
              </Label>
              <Switch id="user-active" checked={isActive} onCheckedChange={onActiveChange} />
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="user-pass" className="text-xs">
                Mật khẩu ban đầu *
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  onPasswordChange(`Hocsinh@${Math.floor(1000 + Math.random() * 9000)}`)
                }
                className="text-primary h-6 px-1.5 text-xs"
              >
                <Sparkles className="mr-1 h-3 w-3" />
                Sinh
              </Button>
            </div>
            <Input
              id="user-pass"
              type="text"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
            />
          </div>
        )}
      </div>

      {!isEdit && (
        <div className="flex items-center space-x-2 pt-1">
          <Checkbox
            id="sendReset"
            checked={sendResetEmail}
            onCheckedChange={(checked) => onSendResetEmailChange(Boolean(checked))}
          />
          <Label
            htmlFor="sendReset"
            className="text-xs font-normal text-neutral-600 dark:text-neutral-400"
          >
            Gửi liên kết đặt lại mật khẩu của Firebase cho người dùng
          </Label>
        </div>
      )}
    </>
  );
}
