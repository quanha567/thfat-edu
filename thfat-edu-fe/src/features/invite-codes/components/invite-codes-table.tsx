"use client";

import { DataTable } from "@/components/data-table";
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
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DEFAULT_INVITE_CODE_PAGE_SIZE } from "../constants";
import { useRevokeInviteCode } from "../hooks/use-invite-code-mutations";
import { useInviteCodes } from "../hooks/use-invite-codes";
import { buildInviteLink } from "../invite-link";
import { type TInviteCode, type TInviteCodeStatusFilter } from "../types";
import { createInviteCodeColumns } from "./invite-codes-columns";
import { InviteCodesFilterBar } from "./invite-codes-filter-bar";

export function InviteCodesTable() {
  const [status, setStatus] = useQueryState("status", parseAsString.withDefault("all"));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState(
    "pageSize",
    parseAsInteger.withDefault(DEFAULT_INVITE_CODE_PAGE_SIZE),
  );
  const [revokeTarget, setRevokeTarget] = useState<Nullable<TInviteCode>>(null);

  const { data, isLoading, isPlaceholderData } = useInviteCodes({
    page,
    limit: pageSize,
    status: status as TInviteCodeStatusFilter,
  });
  const revokeMutation = useRevokeInviteCode();

  const columns = useMemo(
    () =>
      createInviteCodeColumns({
        onCopyLink: async (inviteCode) => {
          await navigator.clipboard.writeText(buildInviteLink(inviteCode.code));
          toast.success("Đã sao chép link mời vào bộ nhớ tạm");
        },
        onRevoke: setRevokeTarget,
      }),
    [],
  );

  function handleResetFilters() {
    setStatus("all");
    setPage(1);
  }

  async function handleConfirmRevoke() {
    if (!revokeTarget) return;

    await revokeMutation.mutateAsync({
      id: revokeTarget.id,
      code: revokeTarget.code,
    });
    setRevokeTarget(null);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading || isPlaceholderData}
        totalCount={data?.total ?? 0}
        pageIndex={page}
        pageSize={pageSize}
        pageSizeOptions={[20, 50, 100]}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        itemName="mã mời"
        filters={
          <InviteCodesFilterBar
            status={status as TInviteCodeStatusFilter}
            onStatusChange={(val) => {
              setStatus(val);
              setPage(1);
            }}
            onReset={handleResetFilters}
          />
        }
        emptyTitle="Chưa có mã mời nào"
        emptyDescription="Bấm “Tạo mã mời” để phát hành mã cho học sinh."
        onResetFilters={handleResetFilters}
      />

      <AlertDialog
        open={Boolean(revokeTarget)}
        onOpenChange={(open) => !open && setRevokeTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Thu hồi mã mời?</AlertDialogTitle>
            <AlertDialogDescription>
              Mã <strong className="text-foreground">{revokeTarget?.code}</strong> sẽ không còn dùng
              được để đăng ký. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={revokeMutation.isPending}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              disabled={revokeMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                handleConfirmRevoke();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {revokeMutation.isPending ? "Đang xử lý..." : "Thu hồi"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
