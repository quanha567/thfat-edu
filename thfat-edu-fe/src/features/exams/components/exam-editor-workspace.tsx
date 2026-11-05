"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Check, FileText, PanelLeftClose, PanelLeftOpen, Save } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { useUpdateExam } from "../hooks/use-update-exam";
import { type TExamStatus, type TQuizDetail, type TQuizSection } from "../types";
import { ExamSectionTabs } from "./exam-section-tabs";

export type TExamEditorWorkspaceProps = {
  exam: TQuizDetail;
};

export function ExamEditorWorkspace({ exam }: TExamEditorWorkspaceProps) {
  const [title, setTitle] = useState(exam.title);
  const [durationMinutes, setDurationMinutes] = useState(exam.durationMinutes);
  const [status, setStatus] = useState<TExamStatus>(exam.status);
  const [sections, setSections] = useState<TQuizSection[]>(exam.sections ?? []);
  const [showPdfSide, setShowPdfSide] = useState(Boolean(exam.pdfUrl));

  const updateMutation = useUpdateExam(exam.id);

  const handleSave = async (customStatus?: TExamStatus) => {
    try {
      await updateMutation.mutateAsync({
        title: title.trim(),
        durationMinutes,
        status: customStatus ?? status,
        sections,
      });

      if (customStatus) {
        setStatus(customStatus);
      }
      toast.success("Đã lưu các thay đổi của đề thi thành công.");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="border-border/70 bg-card flex flex-col gap-4 rounded-xl border p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="size-8">
            <Link href="/admin/exams">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>

          <div className="space-y-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 w-[320px] text-base font-bold sm:w-[420px]"
              placeholder="Tên đề thi..."
            />
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <span>Chuẩn 150 điểm thô</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span>Thời lượng:</span>
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="h-5 w-12 rounded border bg-transparent text-center text-xs"
                />
                <span>phút</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {exam.pdfUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPdfSide(!showPdfSide)}
              className="h-9 gap-1.5"
            >
              {showPdfSide ? (
                <>
                  <PanelLeftClose className="size-4" /> Ẩn PDF gốc
                </>
              ) : (
                <>
                  <PanelLeftOpen className="size-4" /> Hiện PDF gốc
                </>
              )}
            </Button>
          )}

          <Select value={status} onValueChange={(val) => setStatus(val as TExamStatus)}>
            <SelectTrigger className="h-9 w-[140px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Bản nháp</SelectItem>
              <SelectItem value="published">Xuất bản</SelectItem>
              <SelectItem value="archived">Lưu trữ</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => handleSave()}
            disabled={updateMutation.isPending}
            className="h-9 gap-1.5 bg-[#1C3480] hover:bg-[#1C3480]/90"
          >
            <Save className="size-4" />
            {updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>

          {status === "draft" && (
            <Button
              onClick={() => handleSave("published")}
              disabled={updateMutation.isPending}
              variant="outline"
              className="h-9 gap-1.5 border-emerald-600/40 text-emerald-600 hover:bg-emerald-50"
            >
              <Check className="size-4" /> Xuất bản đề
            </Button>
          )}
        </div>
      </div>

      {/* Main Workspace (Side-by-side if PDF available) */}
      <div
        className={`grid gap-6 ${showPdfSide && exam.pdfUrl ? "lg:grid-cols-2" : "grid-cols-1"}`}
      >
        {showPdfSide && exam.pdfUrl && (
          <Card className="border-border/60 sticky top-6 h-[calc(100vh-230px)] overflow-hidden">
            <div className="bg-muted/40 text-muted-foreground flex items-center justify-between border-b p-3 text-xs">
              <span className="flex items-center gap-1.5 font-semibold">
                <FileText className="text-primary size-3.5" /> File PDF gốc đối chiếu
              </span>
              <Badge variant="outline" className="text-[10px]">
                Preview Mode
              </Badge>
            </div>
            <CardContent className="h-full p-0">
              <iframe
                src={exam.pdfUrl}
                title="Đề thi PDF gốc"
                sandbox="allow-same-origin"
                className="h-full w-full border-0"
              />
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <ExamSectionTabs sections={sections} onChange={setSections} />
        </div>
      </div>
    </div>
  );
}
