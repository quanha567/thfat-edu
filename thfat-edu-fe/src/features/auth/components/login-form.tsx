"use client";

import { BaseCheckbox, BaseForm, BaseInput } from "@/components/base";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { loginWithEmail } from "@/lib/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useLogin } from "../hooks/use-login";
import { type TAuthUser } from "../types";

const loginSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Định dạng email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  rememberMe: z.boolean(),
});

export type TLoginFormData = z.infer<typeof loginSchema>;

export type TLoginFormProps = {
  onSuccess: (user: TAuthUser) => void;
  disabled?: boolean;
};

export function LoginForm({ onSuccess, disabled }: TLoginFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutateAsync: loginMutation, isPending: isMutating } = useLogin();

  const form = useForm<TLoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const isLoading = form.formState.isSubmitting || isMutating;

  async function onSubmit(data: TLoginFormData) {
    setErrorMessage(null);
    try {
      const idToken = await loginWithEmail(data.email, data.password);
      const result = await loginMutation({ idToken });
      toast.success("Đăng nhập thành công!");
      onSuccess(result.user);
    } catch (error) {
      const msg = (error as Error).message || "Đăng nhập thất bại. Vui lòng kiểm tra lại.";
      setErrorMessage(msg);
      toast.error(msg);
    }
  }

  function handleForgotPassword() {
    toast.info("Vui lòng liên hệ giáo viên hoặc quản trị viên để được đặt lại mật khẩu.");
  }

  return (
    <BaseForm form={form} onSubmit={onSubmit}>
      {errorMessage && (
        <Alert
          variant="destructive"
          className="border-destructive/20 bg-destructive/10 rounded-lg py-2.5"
        >
          <AlertCircle className="size-4" />
          <AlertDescription className="text-caption text-destructive">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <BaseInput
        fieldId="email"
        label="Địa chỉ email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        disabled={disabled || isLoading}
        leadingIcon={<Mail className="size-4" />}
      />

      <BaseInput
        fieldId="password"
        label="Mật khẩu"
        placeholder="Nhập mật khẩu"
        autoComplete="current-password"
        isPassword
        disabled={disabled || isLoading}
        leadingIcon={<Lock className="size-4" />}
      />

      <div className="flex items-center justify-between pt-1">
        <BaseCheckbox
          fieldId="rememberMe"
          label="Ghi nhớ đăng nhập trên thiết bị này"
          disabled={disabled || isLoading}
        />
        <Button
          type="button"
          variant="link"
          onClick={handleForgotPassword}
          className="text-caption text-primary hover:text-primary/90 h-auto p-0 font-medium"
        >
          Quên mật khẩu?
        </Button>
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-2 w-full gap-2 font-semibold shadow-xs transition-all"
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            <span>Đăng nhập</span>
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>
    </BaseForm>
  );
}
