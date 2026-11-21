"use client";

import { DataTable } from "@/components/data-table";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { type Nullable } from "@thfat-edu/shared";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useMemo, useState } from "react";

import { DEFAULT_USER_PAGE_SIZE } from "../constants";
import {
  useRestoreUser,
  useSoftDeleteUser,
  useToggleActiveUser,
} from "../hooks/use-user-mutations";
import { useUsers } from "../hooks/use-users";
import { type TUser, type TUserRoleFilter, type TUserStatusFilter } from "../types";
import { ResetPasswordModal } from "./reset-password-modal";
import { UserDeleteDialog } from "./user-delete-dialog";
import { UserFormModal } from "./user-form-modal";
import { createUserColumns } from "./users-columns";
import { UsersFilterBar } from "./users-filter-bar";

export type TUsersTableProps = {
  isCreateOpen: boolean;
  onCloseCreate: () => void;
};

export function UsersTable({ isCreateOpen, onCloseCreate }: TUsersTableProps) {
  const { data: currentUser } = useAuthUser();

  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [role, setRole] = useQueryState("role", parseAsString.withDefault("all"));
  const [status, setStatus] = useQueryState("status", parseAsString.withDefault("all"));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState(
    "pageSize",
    parseAsInteger.withDefault(DEFAULT_USER_PAGE_SIZE),
  );

  const [editUser, setEditUser] = useState<Nullable<TUser>>(null);
  const [resetPassUser, setResetPassUser] = useState<Nullable<TUser>>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    user: Nullable<TUser>;
    mode: "delete" | "restore";
  }>({ isOpen: false, user: null, mode: "delete" });

  const queryParams = {
    page,
    limit: pageSize,
    search: search.trim() || undefined,
    role: role as TUserRoleFilter,
    status: status as TUserStatusFilter,
  };

  const { data, isLoading } = useUsers(queryParams);
  const toggleActiveMutation = useToggleActiveUser();
  const softDeleteMutation = useSoftDeleteUser();
  const restoreMutation = useRestoreUser();

  const columns = useMemo(() => {
    return createUserColumns({
      currentUserId: currentUser?.id,
      onEdit: (user) => setEditUser(user),
      onResetPassword: (user) => setResetPassUser(user),
      onToggleActive: (user) => {
        toggleActiveMutation.mutate({
          id: user.id,
          isActive: !user.isActive,
          fullName: user.fullName,
        });
      },
      onDelete: (user) => {
        setDeleteDialog({ isOpen: true, user, mode: "delete" });
      },
      onRestore: (user) => {
        setDeleteDialog({ isOpen: true, user, mode: "restore" });
      },
    });
  }, [currentUser?.id, toggleActiveMutation]);

  const handleResetFilters = () => {
    setSearch("");
    setRole("all");
    setStatus("all");
    setPage(1);
  };

  const handleConfirmDeleteDialog = async () => {
    if (!deleteDialog.user) return;
    const { id, fullName } = deleteDialog.user;

    if (deleteDialog.mode === "delete") {
      await softDeleteMutation.mutateAsync({ id, fullName });
    } else {
      await restoreMutation.mutateAsync({ id, fullName });
    }

    setDeleteDialog({ isOpen: false, user: null, mode: "delete" });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        totalCount={data?.total ?? 0}
        pageIndex={page}
        pageSize={pageSize}
        pageSizeOptions={[10, 20, 50]}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        itemName="người dùng"
        searchValue={search}
        searchPlaceholder="Tìm theo tên, email, mã số..."
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        filters={
          <UsersFilterBar
            role={role as TUserRoleFilter}
            status={status as TUserStatusFilter}
            onRoleChange={(val) => {
              setRole(val);
              setPage(1);
            }}
            onStatusChange={(val) => {
              setStatus(val);
              setPage(1);
            }}
            onReset={handleResetFilters}
          />
        }
        emptyTitle="Không tìm thấy người dùng"
        emptyDescription="Thử thay đổi từ khóa tìm kiếm hoặc đặt lại các bộ lọc."
        onResetFilters={handleResetFilters}
      />

      {/* Modal Tạo mới */}
      <UserFormModal isOpen={isCreateOpen} user={null} onClose={onCloseCreate} />

      {/* Modal Chỉnh sửa */}
      <UserFormModal isOpen={Boolean(editUser)} user={editUser} onClose={() => setEditUser(null)} />

      {/* Modal Đặt lại mật khẩu */}
      <ResetPasswordModal
        isOpen={Boolean(resetPassUser)}
        user={resetPassUser}
        onClose={() => setResetPassUser(null)}
      />

      {/* Dialog Xóa mềm / Khôi phục */}
      <UserDeleteDialog
        isOpen={deleteDialog.isOpen}
        user={deleteDialog.user}
        mode={deleteDialog.mode}
        isLoading={softDeleteMutation.isPending || restoreMutation.isPending}
        onClose={() => setDeleteDialog({ isOpen: false, user: null, mode: "delete" })}
        onConfirm={handleConfirmDeleteDialog}
      />
    </div>
  );
}
