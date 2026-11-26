"use client";

import { BaseForm, BaseInput } from "@/components/base";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowRight, Loader2, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useRegister } from "../hooks/use-register";

const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, "Vui lòng nhập họ và tên"),
    email: z.email("Định dạng email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu nhập lại không khớp",
  });

export type TRegisterFormData = z.infer<typeof registerSchema>;

export type TRegisterFormProps = {
  code: string;
  onSuccess: () => void;
};

export function RegisterForm({ code, onSuccess }: TRegisterFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutateAsync: registerMutation, isPending } = useRegister();

  const form = useForm<TRegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: TRegisterFormData) {
    setErrorMessage(null);

    try {
      await registerMutation({
        code,
        fullName: data.fullName.trim(),
        email: data.email,
        password: data.password,
      });
      toast.success("Đăng ký thành công!");
      onSuccess();
    } catch (error) {
      const message = (error as Error).message || "Đăng ký thất bại. Vui lòng thử lại.";
      setErrorMessage(message);
      toast.error(message);
    }
  }

  return (
    <BaseForm form={form} onSubmit={onSubmit}>
      {errorMessage && (
        <Alert
          variant="destructive"
          className="border-destructive/20 bg-destructive/10 rounded-lg py-2.5"
        >
          <AlertCircle className="size-4" />
          <AlertDescription className="text-destructive text-xs">{errorMessage}</AlertDescription>
        </Alert>
      )}

      <BaseInput
        fieldId="fullName"
        label="Họ và tên"
        placeholder="Nguyễn Văn A"
        autoComplete="name"
        disabled={isPending}
        leadingIcon={<User className="size-4" />}
      />

      <BaseInput
        fieldId="email"
        label="Địa chỉ email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        disabled={isPending}
        leadingIcon={<Mail className="size-4" />}
      />

      <BaseInput
        fieldId="password"
        label="Mật khẩu"
        placeholder="Tối thiểu 6 ký tự"
        autoComplete="new-password"
        isPassword
        disabled={isPending}
        leadingIcon={<Lock className="size-4" />}
      />

      <BaseInput
        fieldId="confirmPassword"
        label="Nhập lại mật khẩu"
        placeholder="Nhập lại mật khẩu"
        autoComplete="new-password"
        isPassword
        disabled={isPending}
        leadingIcon={<Lock className="size-4" />}
      />

      <Button
        type="submit"
        size="lg"
        className="mt-2 w-full gap-2 font-semibold shadow-xs"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            <span>Tạo tài khoản</span>
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>
    </BaseForm>
  );
}
