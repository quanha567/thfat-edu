"use client";

import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ExamPageHero() {
  return (
    <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3.5">
        <div className="relative size-12 shrink-0 overflow-hidden drop-shadow-sm">
          <Image
            src="/images/admin/exam-header-icon-3d.png"
            alt="Quản lý đề thi"
            fill
            sizes="48px"
            className="object-contain"
            priority
          />
        </div>

        <div className="space-y-0.5">
          <h1 className="text-h2 text-foreground font-bold tracking-tight">Quản lý đề thi</h1>
          <p className="text-body-sm text-muted-foreground">
            Tạo, quản lý và theo dõi các đề thi V-SAT hiệu quả
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
          <Link href="/admin/exams/create">
            <Sparkles className="text-primary size-3.5" />
            <span>Import Đề bằng AI</span>
          </Link>
        </Button>

        <Button asChild size="sm" className="gap-1.5 text-xs font-semibold">
          <Link href="/admin/exams/create">
            <Plus className="size-3.5" />
            <span>Tạo đề thi mới</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
