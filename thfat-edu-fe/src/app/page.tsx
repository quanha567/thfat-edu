"use client";

import { Chem } from "@/components/chemistry/chem";
import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  FlaskConical,
  Atom,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useState } from "react";

const SAMPLE_QUESTION = {
  title: "Câu hỏi trắc nghiệm minh họa",
  prompt:
    "Cho m gam kim loại $\\ce{Fe}$ phản ứng hoàn toàn với dung dịch $\\ce{HCl}$ dư, thu được muối $\\ce{FeCl2}$ và khí $\\ce{H2}$. Phương trình hóa học đúng là:",
  options: [
    { id: "A", text: "$\\ce{Fe + HCl -> FeCl + H2}$" },
    { id: "B", text: "$\\ce{Fe + 2HCl -> FeCl2 + H2 ^}$" },
    { id: "C", text: "$\\ce{2Fe + 6HCl -> 2FeCl3 + 3H2 ^}$" },
    { id: "D", text: "$\\ce{Fe + 3HCl -> FeCl3 + H2}$" },
  ],
  correctId: "B",
  explanation:
    "Sắt ($\\ce{Fe}$) tác dụng với axit clohiđric ($\\ce{HCl}$) chỉ tạo muối sắt(II) clorua $\\ce{FeCl2}$ và giải phóng khí hiđro $\\ce{H2}$ theo tỉ lệ 1 : 2.",
};

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isCorrect = selectedOption === SAMPLE_QUESTION.correctId;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
              <FlaskConical className="h-6 w-6" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">TH FAT EDU</span>
              <span className="ml-2 hidden rounded border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 sm:inline-block">
                Hóa Học Trực Tuyến
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="gap-1 border-emerald-300 bg-emerald-50 text-emerald-800"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Next.js 16 + Bun Ready
            </Badge>
            <Button size="sm" variant="default" className="gap-1.5 shadow-sm">
              Đăng nhập <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="pointer-events-none absolute top-0 right-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-indigo-100/60 blur-3xl" />
          <div className="relative flex max-w-3xl flex-col gap-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold tracking-wider text-indigo-700 uppercase">
              <Sparkles className="h-3.5 w-3.5" /> Nền tảng học Hóa học chuyên sâu
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Chào mừng bạn đến với <span className="text-indigo-600">TH FAT EDU</span>
            </h1>
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
              Khởi tạo thành công kiến trúc Frontend: Next.js 16 (App Router), Tailwind CSS v4
              (Light Mode), shadcn/ui, Eden Treaty (Elysia BE), Firebase Auth, Vitest và bộ kết xuất
              công thức hóa học chuẩn KaTeX + mhchem.
            </p>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border-slate-200 bg-white shadow-sm transition-colors hover:border-indigo-300">
            <CardHeader className="pb-3">
              <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Atom className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold">KaTeX + mhchem</CardTitle>
              <CardDescription>Render công thức và phương trình hóa học</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm text-slate-600">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs">
                <div className="mb-1 text-slate-500">{"// Minh họa kết xuất:"}</div>
                <div className="text-sm text-slate-900">
                  <Chem formula="2Al + 6HCl -> 2AlCl3 + 3H2 ^" display />
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Hỗ trợ viết phương trình hóa học chuẩn theo cú pháp{" "}
                <code className="font-semibold text-indigo-600">\ce{"{...}"}</code>.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm transition-colors hover:border-indigo-300">
            <CardHeader className="pb-3">
              <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Zap className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold">Eden Treaty + Elysia</CardTitle>
              <CardDescription>End-to-End Type Safety Monorepo</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm text-slate-600">
              <p>
                Frontend kết nối trực tiếp với backend{" "}
                <code className="font-semibold text-slate-800">thfat-edu-be</code> qua Bun
                Workspaces.
              </p>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-700">
                ✓ 100% Autocomplete typesafe API
                <br />✓ TanStack Query v5 cache management
                <br />✓ Zustand Client state & nuqs URL state
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm transition-colors hover:border-indigo-300">
            <CardHeader className="pb-3">
              <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold">Chất lượng & Kiểm thử</CardTitle>
              <CardDescription>Oxlint & Vitest Test Runner</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm text-slate-600">
              <p>Tốc độ kiểm tra mã nguồn siêu nhanh cùng hệ thống kiểm thử unit tests tự động:</p>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 font-mono text-xs text-slate-700">
                $ bun run lint (Oxlint: ~13ms)
                <br />$ bun run test (Vitest: 4/4 passed)
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Chemistry Demo Card */}
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-lg font-bold">
                Hệ Thống Trắc Nghiệm Hóa Học Thực Tế
              </CardTitle>
            </div>
            <CardDescription>
              Trải nghiệm component hiển thị câu hỏi và đáp án có chứa công thức hóa học KaTeX
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Đề bài
              </div>
              <ChemRenderer
                content={SAMPLE_QUESTION.prompt}
                className="text-base font-medium text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SAMPLE_QUESTION.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                let borderClass = "border-slate-200 hover:border-indigo-300 hover:bg-slate-50";

                if (isSelected) {
                  borderClass = "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20";
                }

                if (isSubmitted) {
                  if (opt.id === SAMPLE_QUESTION.correctId) {
                    borderClass = "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20";
                  } else if (isSelected) {
                    borderClass = "border-rose-400 bg-rose-50";
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      if (!isSubmitted) setSelectedOption(opt.id);
                    }}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 text-left transition-all ${borderClass}`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200/70 text-xs font-bold text-slate-700">
                      {opt.id}
                    </span>
                    <div className="flex-1 text-sm font-medium text-slate-900">
                      <ChemRenderer content={opt.text} />
                    </div>
                  </button>
                );
              })}
            </div>

            {isSubmitted && (
              <div
                className={`rounded-xl border p-4 text-sm ${
                  isCorrect
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-rose-200 bg-rose-50 text-rose-900"
                }`}
              >
                <div className="mb-1 flex items-center gap-2 font-bold">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Chính xác! (+10 điểm)
                    </>
                  ) : (
                    <>Chưa chính xác. Đáp án đúng là {SAMPLE_QUESTION.correctId}.</>
                  )}
                </div>
                <div className="mt-1 text-xs text-slate-700">
                  <span className="font-semibold">Giải thích chi tiết: </span>
                  <ChemRenderer content={SAMPLE_QUESTION.explanation} />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-xs text-slate-500">
              Trạng thái: {selectedOption ? `Đã chọn câu ${selectedOption}` : "Chưa chọn đáp án"}
            </span>
            <div className="flex gap-2">
              {isSubmitted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedOption(null);
                    setIsSubmitted(false);
                  }}
                >
                  Làm lại
                </Button>
              )}
              <Button
                size="sm"
                disabled={!selectedOption || isSubmitted}
                onClick={() => setIsSubmitted(true)}
              >
                Nộp bài kiểm tra
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 sm:flex-row">
          <span>TH FAT EDU &copy; 2026 - Nền tảng học Hóa học trực tuyến</span>
          <div className="flex gap-4">
            <span>Next.js 16</span>
            <span>Bun Workspace</span>
            <span>Oxlint + Vitest</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
