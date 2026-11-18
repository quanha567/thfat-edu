"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { Badge } from "@/components/ui/badge";
import { Eye, HelpCircle } from "lucide-react";
import Image from "next/image";

import { type TQuizQuestion, type TSectionType } from "../../types";
import { parseMatchingOption } from "../matching.types";

export type TExamEditorLivePreviewProps = {
  question: TQuizQuestion | null;
  sectionTitle?: string;
  sectionType?: TSectionType;
  questionNumber?: number;
};

export function ExamEditorLivePreview({
  question,
  sectionType,
  questionNumber = 1,
}: TExamEditorLivePreviewProps) {
  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="bg-primary/10 text-primary mb-2 flex size-8 items-center justify-center rounded-full">
          <Eye className="size-4" />
        </div>
        <p className="text-foreground text-xs font-semibold">Chưa chọn câu hỏi</p>
        <p className="text-muted-foreground mt-1 text-[11px]">
          Nhấp chuột vào bất kỳ câu hỏi nào trong mục lục để xem kết quả hiển thị trực tiếp.
        </p>
      </div>
    );
  }

  const hasContext = Boolean(question.contextContent?.trim());
  const hasSubItems = question.subItems && question.subItems.length > 0;

  return (
    <div className="space-y-3.5 text-xs">
      {hasContext ? (
        <div className="text-foreground bg-muted/20 border-border/50 rounded-md border p-3 leading-relaxed">
          <ChemRenderer content={question.contextContent} />
        </div>
      ) : (
        <div className="text-muted-foreground bg-muted/10 border-border flex items-center gap-1.5 rounded-md border border-dashed p-2.5 text-[11px] italic">
          <HelpCircle className="size-3.5" />
          <span>Chưa nhập nội dung ngữ cảnh đề bài...</span>
        </div>
      )}

      {question.imageUrl && (
        <div className="border-border bg-background relative inline-block max-w-full rounded border p-1">
          <Image
            src={question.imageUrl}
            alt={`Xem trước ảnh câu ${questionNumber}`}
            width={350}
            height={180}
            unoptimized
            className="max-h-48 w-auto rounded object-contain"
          />
        </div>
      )}

      {hasSubItems && sectionType === "true_false" && (
        <div className="border-border space-y-1.5 border-t pt-2.5">
          <span className="text-muted-foreground text-[11px] font-semibold">Các ý phát biểu:</span>
          <div className="space-y-1">
            {question.subItems.map((sub, idx) => {
              const isTrue = sub.correctAnswer === "Đúng" || sub.correctAnswer === "true";

              return (
                <div
                  key={sub.id || idx}
                  className="bg-muted/30 border-border flex items-start justify-between gap-2 rounded-md border p-2"
                >
                  <div className="flex items-start gap-1.5">
                    <span className="text-primary font-bold">
                      {sub.label || `${String.fromCharCode(97 + idx)})`}
                    </span>
                    <div className="text-[11px]">
                      <ChemRenderer content={sub.content || "..."} />
                    </div>
                  </div>

                  <Badge
                    variant={isTrue ? "default" : "destructive"}
                    className="shrink-0 px-1.5 py-0 text-[10px]"
                  >
                    {isTrue ? "Đúng" : "Sai"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {hasSubItems && sectionType === "group_mcq" && (
        <div className="border-border space-y-2 border-t pt-2.5">
          {question.subItems.map((sub, idx) => {
            const options = sub.options || [];

            return (
              <div key={sub.id || idx} className="space-y-1">
                <div className="text-foreground flex items-start gap-1 text-[11px] font-semibold">
                  <span className="shrink-0">Ý {idx + 1}:</span>
                  <ChemRenderer content={sub.content || "..."} />
                </div>
                {options.length > 0 && (
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    {options.map((optContent, optIdx) => {
                      const optKey = ["A", "B", "C", "D"][optIdx] || String(optIdx + 1);
                      const isCorrect = optKey === sub.correctAnswer;

                      return (
                        <div
                          key={optKey}
                          className={`flex items-start gap-1 rounded border px-2 py-1 ${
                            isCorrect
                              ? "border-primary bg-primary/10 text-primary font-semibold"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          <span className="shrink-0 font-bold">{optKey}.</span>
                          <ChemRenderer content={optContent} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {hasSubItems && sectionType === "matching" && (
        <div className="border-border space-y-2 border-t pt-2.5">
          <div className="space-y-1">
            <span className="text-muted-foreground text-[11px] font-semibold">Các cặp ghép:</span>
            {question.subItems.map((sub, idx) => (
              <div
                key={sub.id || idx}
                className="bg-muted/30 border-border flex items-center justify-between rounded border px-2 py-1 text-[11px]"
              >
                <div className="max-w-[200px] truncate">
                  <ChemRenderer content={sub.content || `Vế ${idx + 1}`} />
                </div>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  ➜ {sub.correctAnswer || "Chưa ghép"}
                </Badge>
              </div>
            ))}
          </div>

          {question.subItems[0]?.options && question.subItems[0].options.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="text-muted-foreground text-[11px] font-semibold">
                Phương án đối chiếu:
              </span>
              <div className="grid grid-cols-1 gap-1">
                {question.subItems[0].options.map((opt, idx) => {
                  const parsed = parseMatchingOption(opt, idx);

                  return (
                    <div
                      key={parsed.letter}
                      className="bg-muted/20 border-border/60 flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px]"
                    >
                      <span className="text-primary font-mono font-bold">{parsed.letter}.</span>
                      <div className="truncate">
                        <ChemRenderer content={parsed.content || opt} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {hasSubItems && sectionType === "short_answer" && (
        <div className="border-border space-y-1.5 border-t pt-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground font-semibold">Đáp án chuẩn:</span>
            <Badge variant="default" className="font-mono text-xs">
              {question.subItems[0]?.correctAnswer || "Chưa nhập"}
            </Badge>
          </div>
          {question.subItems[0]?.acceptableAnswers &&
            question.subItems[0].acceptableAnswers.length > 0 && (
              <div className="text-muted-foreground text-[10px]">
                Chấp nhận: {question.subItems[0].acceptableAnswers.join(", ")}
              </div>
            )}
        </div>
      )}
    </div>
  );
}
