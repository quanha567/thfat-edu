"use client";

import type { TAuthUser } from "@/features/auth/types";
import { api } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { TProfileFormValues } from "../schemas/profile.schema";

function buildPayload(values: TProfileFormValues, role: TAuthUser["role"]) {
  const base = {
    fullName: values.fullName,
    avatarUrl: values.avatarUrl ?? null,
    gender: values.gender ?? null,
  };

  if (role === "student") {
    return {
      ...base,
      studentProfile: {
        studentCode: values.studentCode ?? null,
        grade: values.grade ?? null,
        schoolName: values.schoolName ?? null,
        dateOfBirth: values.dateOfBirth ?? null,
        parentPhone: values.parentPhone ?? null,
      },
    };
  }

  if (role === "teacher") {
    return {
      ...base,
      teacherProfile: {
        teacherCode: values.teacherCode ?? null,
        department: values.department ?? null,
        bio: values.bio ?? null,
      },
    };
  }

  return base;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      values,
      role,
    }: {
      values: TProfileFormValues;
      role: TAuthUser["role"];
    }) => {
      const payload = buildPayload(values, role);
      const { data, error } = await api.auth.me.patch(payload);

      if (error) {
        throw new Error(extractApiErrorMessage(error, "Không thể cập nhật thông tin cá nhân."));
      }

      return data;
    },

    onMutate: async ({ values, role }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.auth.me() });

      const previousUser = queryClient.getQueryData<TAuthUser>(queryKeys.auth.me());

      if (previousUser) {
        const payload = buildPayload(values, role);
        queryClient.setQueryData<TAuthUser>(queryKeys.auth.me(), (old) => {
          if (!old) return old;

          return {
            ...old,
            fullName: payload.fullName ?? old.fullName,
            avatarUrl: payload.avatarUrl ?? old.avatarUrl,
            gender: payload.gender !== undefined ? payload.gender : old.gender,
            studentProfile:
              "studentProfile" in payload && payload.studentProfile
                ? { ...old.studentProfile, ...payload.studentProfile }
                : old.studentProfile,
            teacherProfile:
              "teacherProfile" in payload && payload.teacherProfile
                ? { ...old.teacherProfile, ...payload.teacherProfile }
                : old.teacherProfile,
          };
        });
      }

      return { previousUser };
    },

    onError: (error, _vars, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(queryKeys.auth.me(), context.previousUser);
      }

      toast.error(error.message || "Cập nhật thất bại. Vui lòng thử lại.");
    },

    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.me(), data);
      toast.success("Đã cập nhật thông tin cá nhân thành công.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });
}
