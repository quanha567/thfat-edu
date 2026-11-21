"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  GraduationCap,
  Printer,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { type TAttemptResult } from "../types";

export type TExamResultSummaryProps = {
  result: TAttemptResult;
};

export function ExamResultSummary({ result }: TExamResultSummaryProps) {
  const scoreNum = parseFloat(result.score);
  const totalNum = parseFloat(result.totalPoints) || 10;
  const percentage = Math.min(100, Math.max(0, Math.round((scoreNum / totalNum) * 100)));

  const minutes = Math.floor(result.timeSpentSeconds / 60);
  const seconds = result.timeSpentSeconds % 60;
  const timeFormatted = `${minutes} phút ${seconds < 10 ? "0" : ""}${seconds} giây`;

  const rawDate = result.submittedAt || result.startedAt;
  const examDate = rawDate ? format(parseISO(rawDate), "dd/MM/yyyy HH:mm") : "--/--/----";

  const certCode = `CERT-${result.attemptId.slice(0, 8).toUpperCase()}`;
  const studentCode = result.studentCode || certCode;
  const studentName = result.studentName || "Thí sinh";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
      {/* Official Certificate Card */}
      <div
        id="certificate-print-area"
        className="relative w-full overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm sm:p-10 print:m-0 print:border-none print:p-0 print:shadow-none"
      >
        {/* Subtle Top Accent Bar */}
        <div className="bg-primary-700 absolute top-0 right-0 left-0 h-1.5" />

        {/* Certificate Header */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-neutral-100 pb-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary-50 text-primary-700 border-primary-100/80 flex h-11 w-11 items-center justify-center rounded-xl border">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-neutral-900 uppercase">
                Hệ Thống Giáo Dục ThFat Edu
              </p>
              <p className="text-xxs text-neutral-500">Ban Khảo Thí & Đánh Giá Năng Lực</p>
            </div>
          </div>

          <Badge
            variant="outline"
            className="border-primary-200 bg-primary-50/70 text-primary-700 px-3 py-1 text-xs font-semibold"
          >
            Chứng nhận kết quả thi
          </Badge>
        </div>

        {/* Title & Exam Information */}
        <div className="mt-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            Phiếu Chứng Nhận Điểm Thi
          </h1>
          <p className="mt-1 text-sm font-medium text-neutral-600 sm:text-base">
            {result.quizTitle}
          </p>
        </div>

        {/* Examinee Information Grid */}
        <div className="mt-6 grid grid-cols-1 gap-3 rounded-xl border border-neutral-100 bg-neutral-50/60 p-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-neutral-500">Thí sinh</p>
            <p className="text-sm font-bold text-neutral-900">{studentName}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Số báo danh / Mã tra cứu</p>
            <p className="font-mono text-sm font-semibold text-neutral-800">{studentCode}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Thời gian nộp bài</p>
            <p className="text-sm font-semibold text-neutral-800">{examDate}</p>
          </div>
        </div>

        {/* Hero Score Showcase */}
        <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-6 text-center sm:p-8">
          <p className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            Điểm Đạt Được
          </p>

          <div className="text-primary-700 mt-2 text-5xl font-black tracking-tight sm:text-6xl">
            {result.score}
            <span className="text-2xl font-semibold text-neutral-400 sm:text-3xl">
              {" "}
              / {result.totalPoints}
            </span>
          </div>

          <div className="mx-auto mt-4 max-w-xs">
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
              <div
                className="bg-primary-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs font-medium text-neutral-500">
              Đạt tỉ lệ {percentage}% điểm tối đa
            </p>
          </div>

          {/* Audit Metrics */}
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-neutral-200/60 pt-4 text-left text-xs">
            <div className="flex items-center gap-2.5 rounded-lg border border-neutral-200/50 bg-white p-3">
              <Clock className="h-4 w-4 shrink-0 text-neutral-400" />
              <div>
                <p className="text-xxs text-neutral-500">Thời gian làm bài</p>
                <p className="font-semibold text-neutral-800">{timeFormatted}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-lg border border-neutral-200/50 bg-white p-3">
              <CheckCircle2 className="text-success-600 h-4 w-4 shrink-0" />
              <div>
                <p className="text-xxs text-neutral-500">Số câu đã trả lời</p>
                <p className="font-semibold text-neutral-800">
                  {result.totalAnswered} / {result.totalSubItems} ý
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Footer / Authentication */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-neutral-100 pt-6 sm:flex-row sm:items-end">
          {/* Verification Code */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50">
              <QrCode className="h-6 w-6 text-neutral-600" />
            </div>
            <div className="text-left">
              <p className="font-mono text-xs font-bold text-neutral-800">{certCode}</p>
              <p className="text-xxs text-neutral-500">Mã xác thực điện tử ThFat Edu</p>
            </div>
          </div>

          {/* Official Verification Badge */}
          <div className="border-success-100 bg-success-50/60 text-success-800 flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs">
            <ShieldCheck className="text-success-600 h-4 w-4" />
            <div>
              <p className="font-semibold">Đã xác thực bởi Hội đồng Khảo thí</p>
              <p className="text-success-700/80 text-xxs">Kết quả được ghi nhận vào hệ thống</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar (Hidden in Print) */}
      <div className="mt-6 flex w-full max-w-3xl flex-col items-center justify-between gap-3 sm:flex-row print:hidden">
        <Button asChild variant="outline" className="w-full gap-2 sm:w-auto">
          <Link href="/exams">
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách đề thi
          </Link>
        </Button>

        <Button
          onClick={handlePrint}
          className="bg-primary-700 hover:bg-primary-800 w-full gap-2 sm:w-auto"
        >
          <Printer className="h-4 w-4" />
          In / Lưu phiếu chứng nhận
        </Button>
      </div>

      <p className="mt-3 text-xs text-neutral-400 print:hidden">
        Bạn có thể in hoặc lưu dưới dạng file PDF để làm minh chứng hoàn thành bài thi.
      </p>
    </div>
  );
}
