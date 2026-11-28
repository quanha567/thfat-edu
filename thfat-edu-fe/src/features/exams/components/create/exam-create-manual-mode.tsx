"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PenLine } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import { createDefaultSections } from "../../constants/exam-editor.constants";
import { useCreateExam } from "../../hooks/use-create-exam";

const DEFAULT_DURATION_MINUTES = 50;

export function ExamCreateManualMode() {
  const router = useRouter();
  const createExamMutation = useCreateExam();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(String(DEFAULT_DURATION_MINUTES));

  const parsedDuration = Number(duration);
  const isDurationValid = Number.isInteger(parsedDuration) && parsedDuration > 0;
  const canSubmit = title.trim().length > 0 && isDurationValid && !createExamMutation.isPending;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    try {
      const created = await createExamMutation.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        durationMinutes: parsedDuration,
        status: "draft",
        sections: createDefaultSections(),
      });

      toast.success("Đã tạo đề thi nháp. Hãy thêm câu hỏi!");
      router.push(`/admin/exams/${created.id}/edit`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không thể tạo đề thi.");
    }
  };

  return (
    <Card className="border-border mx-auto w-full max-w-2xl shadow-xs">
      <CardHeader className="border-border border-b pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-bold">
          <PenLine className="text-primary size-4" />
          Thông tin đề thi
        </CardTitle>
        <p className="text-muted-foreground text-xs">
          Tạo đề trống với 4 phần thi chuẩn, sau đó nhập từng câu hỏi trong trình soạn thảo.
        </p>
      </CardHeader>

      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="manual-exam-title" className="text-xs font-semibold">
              Tiêu đề đề thi
            </Label>
            <Input
              id="manual-exam-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Đề thi thử Hóa học số 1"
              maxLength={255}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="manual-exam-description" className="text-xs font-semibold">
              Mô tả (tuỳ chọn)
            </Label>
            <Textarea
              id="manual-exam-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ghi chú ngắn về đề thi..."
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="manual-exam-duration" className="text-xs font-semibold">
              Thời gian làm bài (phút)
            </Label>
            <Input
              id="manual-exam-duration"
              type="number"
              min={1}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-32"
              aria-invalid={!isDurationValid}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button asChild type="button" variant="outline" size="sm" className="text-xs">
              <Link href="/admin/exams">Hủy bỏ</Link>
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!canSubmit}
              className="gap-1.5 text-xs font-semibold"
            >
              {createExamMutation.isPending && <Loader2 className="size-3.5 animate-spin" />}
              Tạo đề &amp; bắt đầu soạn
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
