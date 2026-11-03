"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Users,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Vui lòng nhập địa chỉ email")
    .email("Email không đúng định dạng (vd: you@example.com)"),
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải chứa ít nhất 6 ký tự"),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError(null);
    setIsSubmitting(true);

    try {
      // Giả lập authentication call
      await new Promise((resolve) => setTimeout(resolve, 1400));

      if (data.email.includes("error")) {
        throw new Error("Tài khoản hoặc mật khẩu không chính xác.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthError(err.message);
      } else {
        setAuthError("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setIsGoogleSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
    } catch {
      setAuthError("Không thể kết nối đến máy chủ Google.");
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen w-full bg-[#F8FAFC] lg:grid-cols-12">
      {/* ── CỘT TRÁI: HERO BANNER VỚI ẢNH PHÒNG LAB & SÓNG XANH DƯƠNG ── */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0A2558] p-12 text-white lg:col-span-7 lg:flex lg:p-14 xl:col-span-7">
        {/* Background Lab Photo & Wave Transitions */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/login-hero.jpg"
            alt="ThFat Edu Chemistry Lab"
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            priority
            className="object-cover object-right filter"
          />
          {/* Lớp phủ chuyển màu xanh Navy mượt mà ở bên trái */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#071E4A] via-[#0A2558]/90 via-55% to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071E4A]/80 via-transparent to-transparent" />
        </div>

        {/* Dynamic Wave Ribbon Graphic (Ambient Curves) */}
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-[500px] w-[500px] rounded-full bg-blue-500/15 blur-[100px]" />
        <div className="pointer-events-none absolute top-1/3 left-1/4 h-[350px] w-[350px] rounded-full bg-cyan-400/10 blur-[90px]" />

        {/* 1. Top Header: Logo ThFat Edu */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 flex items-center gap-3.5"
        >
          <div className="relative size-12 shrink-0 overflow-hidden rounded-2xl bg-white p-1 shadow-md">
            <Image
              src="/brand/logo-icon.png"
              alt="ThFat Edu Logo"
              fill
              sizes="48px"
              className="object-contain p-0.5"
              priority
            />
          </div>
          <div>
            <h2 className="text-xl leading-tight font-bold tracking-tight text-white">ThFat Edu</h2>
            <p className="mt-0.5 text-xs font-normal tracking-wide text-white/70">
              Học Hóa · Học Thật · Truyền Cảm Hứng
            </p>
          </div>
        </motion.div>

        {/* 2. Center: Headline & Subtitle */}
        <div className="relative z-10 my-auto max-w-xl py-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="space-y-4"
          >
            <h1 className="text-4xl leading-[1.15] font-extrabold tracking-tight text-white sm:text-5xl">
              Bứt phá điểm số <br />
              <span className="mt-1 block text-[#38BDF8]">Chinh phục môn Hóa</span>
            </h1>

            <p className="max-w-lg pt-2 text-base leading-relaxed font-light text-white/80">
              Hệ thống luyện thi V-SAT môn Hóa học với ngân hàng câu hỏi chất lượng, bài giảng
              chuyên sâu và lộ trình học tối ưu, giúp bạn tự tin chinh phục kỳ thi.
            </p>
          </motion.div>
        </div>

        {/* 3. Bottom: 2 Glassmorphism Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="relative z-10 grid max-w-xl grid-cols-2 gap-4"
        >
          {/* Card 1: 96.8% */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-white/15 bg-white/[0.08] p-4 shadow-lg backdrop-blur-md">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#38BDF8]/40 bg-[#38BDF8]/10 text-[#38BDF8]">
              <GraduationCap className="size-6 text-[#38BDF8]" />
            </div>
            <div>
              <p className="text-2xl leading-none font-bold tracking-tight text-white">96.8%</p>
              <p className="mt-1.5 text-xs leading-snug font-normal text-white/75">
                Học viên đạt điểm 8+ sau 3 tháng
              </p>
            </div>
          </div>

          {/* Card 2: 15.000+ */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-white/15 bg-white/[0.08] p-4 shadow-lg backdrop-blur-md">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#38BDF8]/40 bg-[#38BDF8]/10 text-[#38BDF8]">
              <Users className="size-6 text-[#38BDF8]" />
            </div>
            <div>
              <p className="text-2xl leading-none font-bold tracking-tight text-white">15.000+</p>
              <p className="mt-1.5 text-xs leading-snug font-normal text-white/75">
                Câu hỏi & phân tích theo năng lực
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── CỘT PHẢI: FORM ĐĂNG NHẬP TRÊN NỀN SÓNG TRẮNG XANH NHẠT ── */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-8 lg:col-span-5 xl:col-span-5">
        {/* Abstract Light Background Shapes */}
        <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-100/50 blur-[90px]" />
        <div className="pointer-events-none absolute right-12 bottom-0 h-80 w-80 rounded-full bg-cyan-100/40 blur-[80px]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 w-full max-w-[460px] space-y-6"
        >
          {/* Mobile Logo Brand */}
          <div className="mb-2 flex flex-col items-center space-y-2 text-center lg:hidden">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-1 shadow-sm">
              <Image
                src="/brand/logo-icon.png"
                alt="ThFat Edu Logo"
                fill
                sizes="56px"
                className="object-contain p-1"
                priority
              />
            </div>
            <h2 className="text-2xl font-bold text-[#0A2558]">ThFat Edu</h2>
            <p className="text-xs text-neutral-500">Học Hóa · Học Thật · Truyền Cảm Hứng</p>
          </div>

          {/* Main White Card */}
          <div className="rounded-[28px] border border-neutral-200/80 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sm:p-10">
            {/* Header Text */}
            <div className="mb-6 space-y-1.5 text-left">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0A2558] sm:text-3xl">
                Đăng nhập
              </h1>
              <p className="text-sm font-normal text-neutral-500">
                Nhập thông tin tài khoản của bạn để bắt đầu học tập
              </p>
            </div>

            {/* Inline Alert Feedback */}
            <AnimatePresence mode="wait">
              {authError && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Alert variant="destructive" className="py-2.5">
                    <AlertCircle className="size-4" />
                    <AlertDescription className="text-xs">{authError}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Google OAuth Button */}
            <motion.div whileTap={{ scale: 0.99 }}>
              <Button
                type="button"
                variant="outline"
                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border-neutral-200 text-sm font-medium text-neutral-700 shadow-none transition-all hover:bg-neutral-50/80"
                onClick={handleGoogleLogin}
                disabled={isGoogleSubmitting || isSubmitting}
              >
                {isGoogleSubmitting ? (
                  <Spinner className="size-4" />
                ) : (
                  <svg className="size-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Đăng nhập với Google</span>
              </Button>
            </motion.div>

            {/* Separator Divider */}
            <div className="relative my-6 text-center text-[11px] tracking-wider text-neutral-400 uppercase">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-neutral-200/80" />
              </div>
              <span className="relative bg-white px-3 font-medium text-neutral-400">
                HOẶC ĐĂNG NHẬP BẰNG EMAIL
              </span>
            </div>

            {/* Credential Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-neutral-700">
                  Địa chỉ email
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`h-11 rounded-xl bg-white pl-10 text-sm transition-all ${
                      errors.email
                        ? "border-error-500 focus-visible:ring-error-500/20"
                        : "border-neutral-200 focus-visible:border-blue-600 focus-visible:ring-blue-600/20"
                    }`}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-error-600 mt-1 flex items-center gap-1 text-xs font-medium"
                  >
                    <AlertCircle className="size-3.5 shrink-0" />
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-neutral-700">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-neutral-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    autoComplete="current-password"
                    className={`h-11 rounded-xl bg-white pr-10 pl-10 text-sm transition-all ${
                      errors.password
                        ? "border-error-500 focus-visible:ring-error-500/20"
                        : "border-neutral-200 focus-visible:border-blue-600 focus-visible:ring-blue-600/20"
                    }`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-neutral-400 transition-colors hover:text-neutral-600"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-error-600 mt-1 flex items-center gap-1 text-xs font-medium"
                  >
                    <AlertCircle className="size-3.5 shrink-0" />
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              {/* Remember Me Checkbox & Forgot Password Link */}
              <div className="flex items-center justify-between pt-1 pb-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    className="rounded-md data-[state=checked]:border-[#0066FF] data-[state=checked]:bg-[#0066FF]"
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="cursor-pointer text-xs font-normal text-neutral-600 select-none"
                  >
                    Ghi nhớ đăng nhập trên thiết bị này
                  </Label>
                </div>

                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Tính năng quên mật khẩu đang được liên kết!");
                  }}
                  className="text-xs font-semibold text-[#0066FF] transition-colors hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit Button */}
              <motion.div whileTap={{ scale: 0.99 }}>
                <Button
                  type="submit"
                  disabled={isSubmitting || isGoogleSubmitting}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0066FF] text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-[#0052CC]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Spinner className="size-4 text-white" />
                      <span>Đang xác thực...</span>
                    </div>
                  ) : (
                    <>
                      <span>Đăng nhập</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </div>

          {/* Register Link & Footer */}
          <div className="space-y-2 text-center">
            <p className="text-xs font-normal text-neutral-500">
              Chưa có tài khoản?{" "}
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Chức năng đăng ký đang được cập nhật!");
                }}
                className="font-semibold text-[#0066FF] hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
            <p className="text-xs text-neutral-400">© 2026 ThFat Edu. Mọi quyền được bảo lưu.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
