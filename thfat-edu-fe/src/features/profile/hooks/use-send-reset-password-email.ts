"use client";

import { sendPasswordReset } from "@/lib/firebase";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSendResetPasswordEmail({ email }: { email: string }) {
  return useMutation({
    mutationFn: async () => {
      await sendPasswordReset(email);
    },

    onSuccess: () => {
      toast.success("Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Gửi email thất bại. Vui lòng thử lại.");
    },
  });
}
