"use client";

import { DataTableRowActions } from "@/components/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { KeyRound, Lock, Pencil, RotateCcw, Trash2, Unlock } from "lucide-react";

import { type TUser } from "../types";
import { UserRoleBadge } from "./user-role-badge";
import { UserStatusBadge } from "./user-status-badge";

type TCreateUserColumnsOptions = {
  currentUserId?: string;
  onEdit: (user: TUser) => void;
  onResetPassword: (user: TUser) => void;
  onToggleActive: (user: TUser) => void;
  onDelete: (user: TUser) => void;
  onRestore: (user: TUser) => void;
};

export function createUserColumns({
  currentUserId,
  onEdit,
  onResetPassword,
  onToggleActive,
  onDelete,
  onRestore,
}: TCreateUserColumnsOptions): ColumnDef<TUser>[] {
  return [
    {
      id: "userInfo",
      header: "Họ và tên / Email",
      cell: ({ row }) => {
        const user = row.original;
        const initials = user.fullName
          .split(" ")
          .map((n) => n[0])
          .slice(-2)
          .join("")
          .toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatarUrl ?? undefined} alt={user.fullName} />
              <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                {initials || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-foreground line-clamp-1 text-sm font-semibold">
                {user.fullName}
              </span>
              <span className="text-muted-foreground line-clamp-1 text-xs">{user.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Vai trò",
      cell: ({ row }) => <UserRoleBadge role={row.original.role} />,
    },
    {
      id: "profileDetails",
      header: "Thông tin hồ sơ",
      cell: ({ row }) => {
        const user = row.original;
        if (user.role === "student" && user.studentProfile) {
          const sp = user.studentProfile;

          return (
            <div className="space-y-0.5 text-xs">
              <div className="text-foreground font-medium">
                {sp.studentCode ? `Mã: ${sp.studentCode}` : "Chưa có mã HS"}
                {sp.grade ? ` • Khối ${sp.grade}` : ""}
              </div>
              <div className="text-muted-foreground max-w-[200px] truncate text-[11px]">
                {sp.schoolName ?? "Chưa có trường"}
              </div>
            </div>
          );
        }

        if (user.role === "teacher" && user.teacherProfile) {
          const tp = user.teacherProfile;

          return (
            <div className="space-y-0.5 text-xs">
              <div className="text-foreground font-medium">
                {tp.teacherCode ? `Mã: ${tp.teacherCode}` : "Chưa có mã GV"}
              </div>
              <div className="text-muted-foreground max-w-[200px] truncate text-[11px]">
                {tp.department ?? "Chưa có bộ môn"}
              </div>
            </div>
          );
        }

        return <span className="text-muted-foreground text-xs italic">Không có hồ sơ</span>;
      },
    },
    {
      id: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const user = row.original;

        return <UserStatusBadge isActive={user.isActive} deletedAt={user.deletedAt} />;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) => {
        try {
          const formatted = format(parseISO(row.original.createdAt), "dd/MM/yyyy HH:mm");

          return <span className="text-muted-foreground text-xs">{formatted}</span>;
        } catch {
          return <span className="text-muted-foreground text-xs">{row.original.createdAt}</span>;
        }
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => {
        const user = row.original;
        const isSelf = Boolean(currentUserId && currentUserId === user.id);
        const isDeleted = Boolean(user.deletedAt);

        const actions = [
          {
            id: "edit",
            label: "Chỉnh sửa hồ sơ",
            icon: <Pencil className="size-4" />,
            disabled: isDeleted,
            onClick: () => onEdit(user),
          },
          {
            id: "reset-password",
            label: "Đặt lại mật khẩu",
            icon: <KeyRound className="size-4" />,
            disabled: isDeleted,
            onClick: () => onResetPassword(user),
          },
          {
            id: "toggle-active",
            label: user.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản",
            icon: user.isActive ? <Lock className="size-4" /> : <Unlock className="size-4" />,
            disabled: isSelf || isDeleted,
            onClick: () => onToggleActive(user),
          },
          isDeleted
            ? {
                id: "restore",
                label: "Khôi phục tài khoản",
                icon: <RotateCcw className="text-success-600 size-4" />,
                onClick: () => onRestore(user),
              }
            : {
                id: "delete",
                label: "Xóa mềm",
                icon: <Trash2 className="size-4" />,
                variant: "destructive" as const,
                disabled: isSelf,
                onClick: () => onDelete(user),
              },
        ];

        return <DataTableRowActions row={user} actions={actions} />;
      },
    },
  ];
}
