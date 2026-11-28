"use client";

import { ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export function ExamCreateHeader() {
  return (
    <div className="border-border space-y-1 border-b pb-4">
      <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
        <Link
          href="/admin/exams"
          className="hover:text-foreground flex items-center gap-1 font-medium transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Đề thi</span>
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-foreground font-semibold">Tạo đề thi mới</span>
      </div>

      <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
        Tạo đề thi mới
      </h1>
    </div>
  );
}
