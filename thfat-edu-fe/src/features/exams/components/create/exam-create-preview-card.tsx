"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, CheckCircle2, Clock, Loader2 } from "lucide-react";

import { type TCreateQuizInput } from "../../types";

export type TExamCreatePreviewCardProps = {
  parsedData: TCreateQuizInput | null;
  customTitle: string;
  onChangeTitle: (title: string) => void;
  isProcessing: boolean;
};

type TPreviewSubItems = NonNullable<
  NonNullable<TCreateQuizInput["sections"]>[number]["questions"][number]["subItems"]
>;

/** Phần tự luận ngắn có nội dung câu hỏi nằm hết ở contextContent, sub-item chỉ là ô trả lời rỗng. */
function visibleSubItems(subItems: TPreviewSubItems | undefined): TPreviewSubItems {
  return (subItems ?? []).filter((si) => si.content.trim().length > 0);
}

export function ExamCreatePreviewCard({
  parsedData,
  customTitle,
  onChangeTitle,
  isProcessing,
}: TExamCreatePreviewCardProps) {
  if (!parsedData && !isProcessing) {
    return (
      <Card className="border-border bg-card flex h-full min-h-[420px] flex-col items-center justify-center p-8 text-center shadow-xs">
        <div className="bg-muted text-muted-foreground mb-3 flex size-12 items-center justify-center rounded-lg border">
          <BookOpen className="size-6" />
        </div>
        <h3 className="text-foreground text-sm font-bold">Chưa có dữ liệu xem trước</h3>
        <p className="text-muted-foreground mt-1 max-w-sm text-xs leading-relaxed">
          Tải lên tệp PDF đề thi ở cột bên trái và bấm &ldquo;Bắt đầu bóc tách câu hỏi&rdquo; để xem
          nội dung được nhận diện tại đây.
        </p>
      </Card>
    );
  }

  if (isProcessing && !parsedData) {
    return (
      <Card className="border-border bg-card flex h-full min-h-[420px] flex-col items-center justify-center p-8 text-center shadow-xs">
        <div className="bg-muted text-muted-foreground mb-3 flex size-12 items-center justify-center rounded-lg border">
          <Loader2 className="size-6 animate-spin" />
        </div>
        <h3 className="text-foreground text-sm font-bold">Đang bóc tách và chuẩn hóa đề thi...</h3>
        <p className="text-muted-foreground mt-1 text-xs">
          Nội dung xem trước sẽ xuất hiện ngay khi quá trình hoàn tất.
        </p>
      </Card>
    );
  }

  if (!parsedData) return null;

  const totalQuestions = (parsedData.sections ?? []).reduce(
    (acc, sec) => acc + (sec.questions?.length ?? 0),
    0,
  );

  return (
    <Card className="border-border shadow-xs">
      <CardHeader className="border-border space-y-3 border-b pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-success-500/10 text-success-600 flex size-7 items-center justify-center rounded-md">
              <CheckCircle2 className="size-4" />
            </div>
            <CardTitle className="text-sm font-bold">
              Xem trước cấu trúc đề thi đã bóc tách
            </CardTitle>
          </div>

          <Badge variant="outline" className="gap-1 text-xs font-semibold">
            <span>{totalQuestions} câu hỏi</span>
            <span>·</span>
            <span>{(parsedData.sections ?? []).length} phần thi</span>
          </Badge>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="exam-title-input" className="text-muted-foreground text-xs font-semibold">
            Tiêu đề đề thi:
          </label>
          <Input
            id="exam-title-input"
            value={customTitle}
            onChange={(e) => onChangeTitle(e.target.value)}
            placeholder="Nhập tiêu đề đề thi..."
            className="bg-background h-9 text-sm font-bold"
          />
        </div>

        <div className="text-muted-foreground flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            Thời gian: {parsedData.durationMinutes} phút
          </span>
          <span>Tổng điểm: {parsedData.totalPoints}</span>
          <span>Trạng thái: Nháp (Draft)</span>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <Tabs defaultValue="section-0" className="w-full">
          <TabsList className="grid h-9 w-full grid-cols-4">
            {(parsedData.sections ?? []).map((sec, idx) => (
              <TabsTrigger key={sec.orderIndex} value={`section-${idx}`} className="text-xs">
                Phần {idx + 1} ({sec.questions.length})
              </TabsTrigger>
            ))}
          </TabsList>

          {(parsedData.sections ?? []).map((sec, idx) => (
            <TabsContent
              key={sec.orderIndex}
              value={`section-${idx}`}
              className="mt-3.5 max-h-[500px] space-y-3 overflow-y-auto pr-1"
            >
              <div className="bg-muted/30 flex items-center justify-between rounded-md px-3 py-2">
                <span className="text-foreground text-xs font-bold">{sec.title}</span>
                <span className="text-muted-foreground text-xxs">
                  {sec.questions.length} câu hỏi
                </span>
              </div>

              {sec.questions.map((q, qIdx) => (
                <div
                  key={q.orderIndex || qIdx}
                  className="border-border bg-card space-y-2 rounded-lg border p-3 text-xs"
                >
                  <div className="flex items-start gap-2">
                    <span className="bg-primary-100 text-primary-800 text-xxs shrink-0 rounded px-2 py-0.5 font-bold">
                      Câu {qIdx + 1}
                    </span>
                    <div className="text-foreground flex-1 font-medium">
                      <ChemRenderer content={q.contextContent || `Câu hỏi ${qIdx + 1}`} />
                    </div>
                  </div>

                  {visibleSubItems(q.subItems).length > 0 && (
                    <div className="border-border mt-2 space-y-1.5 border-l-2 pl-3">
                      {visibleSubItems(q.subItems).map((si, sIdx) => (
                        <div
                          key={si.orderIndex || sIdx}
                          className="text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-foreground shrink-0 font-bold">{si.label}:</span>
                          <div className="flex-1">
                            <ChemRenderer content={si.content} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
