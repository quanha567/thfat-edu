"use client";

import { DataTableRowActions } from "@/components/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { Ban, Link2 } from "lucide-react";

import { type TInviteCode } from "../types";
import { InviteCodeStatusBadge } from "./invite-code-status-badge";

type TCreateInviteCodeColumnsOptions = {
  onCopyLink: (inviteCode: TInviteCode) => void;
  onRevoke: (inviteCode: TInviteCode) => void;
};

function formatDateTime(value: string): string {
  try {
    return format(parseISO(value), "dd/MM/yyyy HH:mm");
  } catch {
    return value;
  }
}

export function createInviteCodeColumns({
  onCopyLink,
  onRevoke,
}: TCreateInviteCodeColumnsOptions): ColumnDef<TInviteCode>[] {
  return [
    {
      accessorKey: "code",
      header: "Mã mời",
      cell: ({ row }) => (
        <span className="text-foreground font-mono text-sm font-semibold tracking-wider">
          {row.original.code}
        </span>
      ),
    },
    {
      accessorKey: "note",
      header: "Ghi chú",
      cell: ({ row }) =>
        row.original.note ? (
          <span className="text-foreground line-clamp-1 text-xs">{row.original.note}</span>
        ) : (
          <span className="text-muted-foreground text-xs italic">Không có</span>
        ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => <InviteCodeStatusBadge status={row.original.status} />,
    },
    {
      id: "usedBy",
      header: "Người đăng ký",
      cell: ({ row }) => {
        const { usedByName, usedByEmail, usedAt } = row.original;

        if (!usedAt) return <span className="text-muted-foreground text-xs">—</span>;

        return (
          <div className="flex flex-col">
            <span className="text-foreground line-clamp-1 text-xs font-semibold">
              {usedByName ?? "Tài khoản đã bị xóa"}
            </span>
            {usedByEmail && (
              <span className="text-muted-foreground line-clamp-1 text-xs">{usedByEmail}</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "expiresAt",
      header: "Hết hạn",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {formatDateTime(row.original.expiresAt)}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {formatDateTime(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => {
        const inviteCode = row.original;
        const isActive = inviteCode.status === "active";

        const actions = [
          {
            id: "copy-link",
            label: "Sao chép link mời",
            icon: <Link2 className="size-4" />,
            hidden: !isActive,
            onClick: () => onCopyLink(inviteCode),
          },
          {
            id: "revoke",
            label: "Thu hồi mã",
            icon: <Ban className="size-4" />,
            variant: "destructive" as const,
            hidden: !isActive,
            onClick: () => onRevoke(inviteCode),
          },
        ];

        return <DataTableRowActions row={inviteCode} actions={actions} />;
      },
    },
  ];
}
