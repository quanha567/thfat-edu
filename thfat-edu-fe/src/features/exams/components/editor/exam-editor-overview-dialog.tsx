"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

import { type TExamStatus } from "../../types";

export type TExamEditorOverviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function ExamEditorOverviewDialog({
  open,
  onOpenChange,
  title,
  description,
  durationMinutes,
  totalPoints,
  status,
  pdfUrl,
  onChange,
}: TExamEditorOverviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Cài đặt thông tin chung đề thi</DialogTitle>
          <DialogDescription className="text-xs">
            Cập nhật tiêu đề, thời lượng thi, barem điểm tổng thể và tệp tài liệu gốc.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="space-y-1.5">
            <Label htmlFor="dialog-exam-title" className="text-xs font-semibold">
              Tên đề thi <span className="text-destructive">*</span>
            </Label>
            <Input
              id="dialog-exam-title"
              value={title}
              onChange={(e) => onChange("title", e.target.value)}
              placeholder="Ví dụ: Đề thi thử V-SAT Hóa học 2026 - Đề số 1"
              className="h-9 text-xs"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="dialog-exam-duration" className="text-xs font-semibold">
                Thời gian (phút)
              </Label>
              <Input
                id="dialog-exam-duration"
                type="number"
                min={1}
                value={durationMinutes}
                onChange={(e) => onChange("durationMinutes", Number(e.target.value) || 50)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dialog-exam-points" className="text-xs font-semibold">
                Tổng điểm
              </Label>
              <Input
                id="dialog-exam-points"
                value={totalPoints}
                onChange={(e) => onChange("totalPoints", e.target.value)}
                placeholder="150.00"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dialog-exam-status" className="text-xs font-semibold">
                Trạng thái
              </Label>
              <Select
                value={status}
                onValueChange={(val) => onChange("status", val as TExamStatus)}
              >
                <SelectTrigger id="dialog-exam-status" className="h-9 text-xs">
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

          <div className="space-y-1.5">
            <Label htmlFor="dialog-exam-pdf" className="text-xs font-semibold">
              Đường dẫn File PDF gốc (tùy chọn)
            </Label>
            <Input
              id="dialog-exam-pdf"
              value={pdfUrl ?? ""}
              onChange={(e) => onChange("pdfUrl", e.target.value)}
              placeholder="https://storage.../exam.pdf"
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dialog-exam-desc" className="text-xs font-semibold">
              Mô tả / Ghi chú
            </Label>
            <Textarea
              id="dialog-exam-desc"
              value={description ?? ""}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Ghi chú thêm về cấu trúc đề, nguồn biên soạn..."
              rows={3}
              className="text-xs"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-xs font-semibold"
          >
            Đóng & Tiếp tục sửa đề
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
