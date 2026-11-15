"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, FileText, Settings2 } from "lucide-react";
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

  return (
    <Card className="shadow-xs">
      <CardHeader className="border-border flex flex-row items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Settings2 className="text-primary size-4" />
          <CardTitle className="text-sm font-bold">Thông tin chung đề thi</CardTitle>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="text-muted-foreground hover:text-foreground gap-1 text-xs"
        >
          {isExpanded ? (
            <>
              Thu gọn <ChevronUp className="size-3.5" />
            </>
          ) : (
            <>
              Mở rộng <ChevronDown className="size-3.5" />
            </>
          )}
        </Button>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4 p-4 text-xs">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="exam-title" className="text-xs font-semibold">
                Tên đề thi <span className="text-destructive">*</span>
              </Label>
              <Input
                id="exam-title"
                value={title}
                onChange={(e) => onChange("title", e.target.value)}
                placeholder="Ví dụ: Đề thi thử V-SAT Hóa học 2026 - Đề số 1"
                className="h-9 text-xs sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="exam-duration" className="text-xs font-semibold">
                  Thời gian (phút)
                </Label>
                <Input
                  id="exam-duration"
                  type="number"
                  min={1}
                  value={durationMinutes}
                  onChange={(e) => onChange("durationMinutes", Number(e.target.value) || 50)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="exam-points" className="text-xs font-semibold">
                  Tổng điểm
                </Label>
                <Input
                  id="exam-points"
                  value={totalPoints}
                  onChange={(e) => onChange("totalPoints", e.target.value)}
                  placeholder="150.00"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Trạng thái</Label>
                <Select
                  value={status}
                  onValueChange={(val) => onChange("status", val as TExamStatus)}
                >
                  <SelectTrigger className="h-9 w-full text-xs">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft" className="text-xs">
                      Bản nháp
                    </SelectItem>
                    <SelectItem value="published" className="text-xs">
                      Xuất bản
                    </SelectItem>
                    <SelectItem value="archived" className="text-xs">
                      Lưu trữ
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="exam-description" className="text-xs font-semibold">
                Mô tả / Ghi chú
              </Label>
              <Input
                id="exam-description"
                value={description ?? ""}
                onChange={(e) => onChange("description", e.target.value)}
                placeholder="Ghi chú về nguồn đề, mục tiêu ôn tập..."
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="exam-pdf-url"
                className="flex items-center gap-1 text-xs font-semibold"
              >
                <FileText className="text-muted-foreground size-3" />
                URL File PDF gốc (tùy chọn)
              </Label>
              <Input
                id="exam-pdf-url"
                value={pdfUrl ?? ""}
                onChange={(e) => onChange("pdfUrl", e.target.value)}
                placeholder="https://storage.../exam.pdf"
                className="h-9 text-xs"
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
