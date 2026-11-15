import { api } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

import { type TAuthUser } from "../types";

export function useAuthUser() {
  return useQuery<TAuthUser | null>({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const { data, error, status } = await api.auth.me.get();

      if (status === 401 || status === 403) {
        return null;
      }

      if (error) {
        throw new Error(extractApiErrorMessage(error, "Không thể xác thực thông tin người dùng."));
      }

      if (error) {
        throw new Error(extractApiErrorMessage(error, "Không thể xác thực thông tin người dùng."));
      }

      return data ?? null;
    },
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
    retry: (failureCount) => failureCount < 1,
  });
}
