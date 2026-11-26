import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInviteCodesApiUrl } from "../invite-link";
import { type TRegisterInput, type TRegisterResponse } from "../types";

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<TRegisterResponse, Error, TRegisterInput>({
    mutationFn: async (input) => {
      const res = await fetch(getInviteCodesApiUrl("/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Đăng ký thất bại. Vui lòng thử lại."));
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}
