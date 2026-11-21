"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  FileText,
  SlidersHorizontal,
  Trophy,
} from "lucide-react";
import { useState } from "react";

import { type TExamStatus } from "../../types";

export type TExamEditorOverviewCardProps = {
  title: string;
  description?: string | null;
  durationMinutes: number;
  totalPoints: string;
  status: TExamStatus;
  pdfUrl?: string | null;
  onChange: (
    field: "title" | "description" | "durationMinutes" | "totalPoints" | "status" | "pdfUrl",
    value: string | number,
  ) => void;
};

const STATUS_ITEMS = [
  { value: "draft", label: "Bản nháp", variant: "secondary" as const },
  { value: "published", label: "Xuất bản", variant: "default" as const },
  { value: "archived", label: "Lưu trữ", variant: "outline" as const },
];

export function ExamEditorOverviewCard({
  title,
  description,
  durationMinutes,
  totalPoints,
  status,
  pdfUrl,
  onChange,
}: TExamEditorOverviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const currentStatus = STATUS_ITEMS.find((s) => s.value === status) || STATUS_ITEMS[0];

  return (
    <div className="border-border/70 bg-card rounded-xl border shadow-xs transition-shadow hover:shadow-sm">
      <div className="border-border/40 flex items-center justify-between border-b px-3.5 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="bg-primary/10 text-primary flex size-6.5 shrink-0 items-center justify-center rounded-md">
            <SlidersHorizontal className="size-3.5" />
          </div>
          <span className="text-foreground text-xs font-bold sm:text-sm">
            Thông tin chung đề thi
          </span>
          {!isExpanded && (
            <div className="text-muted-foreground hidden items-center gap-2 text-xs sm:flex">
              <span className="text-foreground max-w-xs truncate font-medium">• {title}</span>
              <span>• {durationMinutes}p</span>
              <span>• {totalPoints}đ</span>
              <Badge variant={currentStatus.variant} className="text-xxs">
                {currentStatus.label}
              </Badge>
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="text-muted-foreground hover:text-foreground h-7 cursor-pointer gap-1 text-xs font-semibold"
        >
          {isExpanded ? "Thu gọn" : "Chỉnh sửa"}
          {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </Button>
      </div>

      {isExpanded ? (
        <div className="space-y-3 p-3.5 text-xs sm:p-4">
          <div className="space-y-1">
            <Label htmlFor="exam-title-input" className="text-foreground text-xs font-semibold">
              Tên đề thi <span className="text-destructive">*</span>
            </Label>
            <Input
              id="exam-title-input"
              value={title}
              onChange={(e) => onChange("title", e.target.value)}
              placeholder="Ví dụ: Đề thi thử V-SAT Hóa học 2026 - Đề số 1"
              className="bg-muted/15 border-border/50 h-8.5 text-xs font-semibold sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <div className="space-y-1">
              <Label
                htmlFor="exam-duration-input"
                className="text-foreground flex items-center gap-1 text-xs font-semibold"
              >
                <Clock className="text-muted-foreground size-3" />
                Thời gian (phút)
              </Label>
              <Input
                id="exam-duration-input"
                type="number"
                min={1}
                value={durationMinutes}
                onChange={(e) => onChange("durationMinutes", Number(e.target.value) || 50)}
                className="bg-muted/15 border-border/50 h-8.5 text-xs font-medium"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="exam-points-input"
                className="text-foreground flex items-center gap-1 text-xs font-semibold"
              >
                <Trophy className="text-muted-foreground size-3" />
                Tổng điểm
              </Label>
              <Input
                id="exam-points-input"
                value={totalPoints}
                onChange={(e) => onChange("totalPoints", e.target.value)}
                placeholder="150.00"
                className="bg-muted/15 border-border/50 h-8.5 text-xs font-medium"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="exam-status-select"
                className="text-foreground block text-xs font-semibold"
              >
                Trạng thái
              </Label>
              <Select
                value={status}
                onValueChange={(val) => onChange("status", val as TExamStatus)}
              >
                <SelectTrigger
                  id="exam-status-select"
                  className="bg-muted/15 border-border/50 h-8.5 text-xs font-medium"
                >
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_ITEMS.map((item) => (
                    <SelectItem key={item.value} value={item.value} className="text-xs">
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div className="space-y-1">
              <Label
                htmlFor="exam-pdf-input"
                className="text-foreground flex items-center justify-between text-xs font-semibold"
              >
                <span className="flex items-center gap-1">
                  <FileText className="text-muted-foreground size-3" />
                  File PDF đề gốc (tùy chọn)
                </span>
                {pdfUrl ? (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-xxs inline-flex items-center gap-0.5 font-normal hover:underline"
                  >
                    Mở PDF <ExternalLink className="size-2.5" />
                  </a>
                ) : null}
              </Label>
              <Input
                id="exam-pdf-input"
                value={pdfUrl ?? ""}
                onChange={(e) => onChange("pdfUrl", e.target.value)}
                placeholder="https://storage.../exam.pdf"
                className="bg-muted/15 border-border/50 h-8.5 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="exam-desc-input" className="text-foreground text-xs font-semibold">
                Mô tả / Ghi chú đề thi
              </Label>
              <Textarea
                id="exam-desc-input"
                value={description ?? ""}
                onChange={(e) => onChange("description", e.target.value)}
                placeholder="Ghi chú về nguồn đề, mục tiêu ôn tập..."
                rows={1}
                className="bg-muted/15 border-border/50 field-sizing-content min-h-[34px] resize-none text-xs"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
