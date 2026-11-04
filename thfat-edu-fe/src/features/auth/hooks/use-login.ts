import { api } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type TAuthUser } from "../types";

export type TLoginPayload = {
  idToken: string;
};

export type TLoginResult = {
  user: TAuthUser;
  message: string;
};

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<TLoginResult, Error, TLoginPayload>({
    mutationFn: async ({ idToken }) => {
      const response = await api.auth.login.post({ idToken });

      if (response.error) {
        throw new Error(
          extractApiErrorMessage(response.error, "Đăng nhập thất bại. Vui lòng thử lại sau."),
        );
      }

      if (!response.data) {
        throw new Error("Không nhận được dữ liệu phản hồi từ máy chủ.");
      }

      return response.data as unknown as TLoginResult;
    },
    onSuccess: (result) => {
      queryClient.setQueryData(queryKeys.auth.me(), result.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}
