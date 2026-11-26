import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getInviteCodesApiUrl } from "../invite-link";
import {
  type TCreateInviteCodesInput,
  type TCreateInviteCodesResponse,
  type TInviteCode,
} from "../types";

export function useCreateInviteCodes() {
  const queryClient = useQueryClient();

  return useMutation<TCreateInviteCodesResponse, Error, TCreateInviteCodesInput>({
    mutationFn: async (input) => {
      const res = await fetch(getInviteCodesApiUrl("/invite-codes"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể tạo mã mời."));
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast.success(`Đã tạo ${data.items.length} mã mời`);
      queryClient.invalidateQueries({ queryKey: queryKeys.inviteCodes.all });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}

export function useRevokeInviteCode() {
  const queryClient = useQueryClient();

  return useMutation<TInviteCode, Error, { id: string; code: string }>({
    mutationFn: async ({ id }) => {
      const res = await fetch(getInviteCodesApiUrl(`/invite-codes/${id}/revoke`), {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể thu hồi mã mời."));
      }

      return res.json();
    },
    onSuccess: (_, variables) => {
      toast.success(`Đã thu hồi mã ${variables.code}`);
      queryClient.invalidateQueries({ queryKey: queryKeys.inviteCodes.all });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
