import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  type TActionResponse,
  type TCreateUserInput,
  type TResetPasswordInput,
  type TUpdateUserInput,
  type TUser,
} from "../types";

function getUsersApiUrl(path = ""): string {
  const baseUrl = getApiBaseUrl();
  const cleanBase = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;

  return `${cleanBase}/users${path}`;
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation<TUser, Error, TCreateUserInput>({
    mutationFn: async (input) => {
      const res = await fetch(getUsersApiUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể tạo người dùng mới."));
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast.success(`Đã tạo thành công tài khoản cho ${data.fullName}`);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<TUser, Error, { id: string; data: TUpdateUserInput }>({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(getUsersApiUrl(`/${id}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          extractApiErrorMessage(errorData, "Không thể cập nhật thông tin người dùng."),
        );
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast.success(`Đã cập nhật thông tin cho ${data.fullName}`);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}

export function useToggleActiveUser() {
  const queryClient = useQueryClient();

  return useMutation<TUser, Error, { id: string; isActive: boolean; fullName: string }>({
    mutationFn: async ({ id, isActive }) => {
      const res = await fetch(getUsersApiUrl(`/${id}/toggle-active`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          extractApiErrorMessage(errorData, "Không thể thay đổi trạng thái tài khoản."),
        );
      }

      return res.json();
    },
    onSuccess: (data, variables) => {
      const actionText = variables.isActive ? "kích hoạt" : "khóa";
      toast.success(`Đã ${actionText} tài khoản của ${variables.fullName}`);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}

export function useSoftDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation<TActionResponse, Error, { id: string; fullName: string }>({
    mutationFn: async ({ id }) => {
      const res = await fetch(getUsersApiUrl(`/${id}`), {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể xóa người dùng."));
      }

      return res.json();
    },
    onSuccess: (_, variables) => {
      toast.success(`Đã chuyển tài khoản ${variables.fullName} vào danh sách xóa mềm`);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}

export function useRestoreUser() {
  const queryClient = useQueryClient();

  return useMutation<TActionResponse, Error, { id: string; fullName: string }>({
    mutationFn: async ({ id }) => {
      const res = await fetch(getUsersApiUrl(`/${id}/restore`), {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể khôi phục tài khoản."));
      }

      return res.json();
    },
    onSuccess: (_, variables) => {
      toast.success(`Đã khôi phục tài khoản ${variables.fullName}`);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}

export function useResetPasswordUser() {
  return useMutation<TActionResponse, Error, { id: string; data: TResetPasswordInput }>({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(getUsersApiUrl(`/${id}/reset-password`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể đặt lại mật khẩu."));
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
