"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Clock, Info, Trophy } from "lucide-react";
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

  return (
    <Card className="mx-auto max-w-xl border-neutral-200 shadow-sm">
      <CardHeader className="pb-4 text-center">
        <div className="bg-primary-50 text-primary-600 mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full">
          <Trophy className="h-7 w-7 text-amber-500" />
        </div>
        <CardTitle className="text-2xl font-bold text-neutral-900">Kết quả thi thử</CardTitle>
        <p className="text-sm font-medium text-neutral-600">{result.quizTitle}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-6 text-center">
          <span className="text-sm font-medium tracking-wider text-neutral-500 uppercase">
            Điểm đạt được
          </span>
          <div className="text-primary-700 mt-2 text-5xl font-extrabold">
            {result.score}
            <span className="text-2xl font-semibold text-neutral-400"> / {result.totalPoints}</span>
          </div>
          <p className="mt-1 text-xs font-medium text-neutral-500">
            Đạt tỉ lệ {percentage}% điểm tối đa
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-white p-3.5">
            <Clock className="h-5 w-5 shrink-0 text-neutral-400" />
            <div>
              <p className="text-xs text-neutral-500">Thời gian làm bài</p>
              <p className="font-semibold text-neutral-800">{timeFormatted}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-white p-3.5">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
            <div>
              <p className="text-xs text-neutral-500">Số câu đã trả lời</p>
              <p className="font-semibold text-neutral-800">
                {result.totalAnswered} / {result.totalSubItems} ý
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-lg border border-blue-100 bg-blue-50/80 p-3.5 text-xs text-blue-800">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          <p>
            Theo quy chế thi thử của ThFat Edu, đáp án và lời giải chi tiết hiện chưa được mở. Điểm
            số của bạn đã được ghi nhận vào hệ thống.
          </p>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button asChild variant="outline" className="w-full gap-2">
          <Link href="/exams">
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách đề thi
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
