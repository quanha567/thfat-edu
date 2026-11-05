"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { type TQuizQuestion } from "../types";

export type TQuestionCardShortAnswerProps = {
  question: TQuizQuestion;
  index: number;
  onChange: (updated: TQuizQuestion) => void;
};

export function QuestionCardShortAnswer({
  question,
  index,
  onChange,
}: TQuestionCardShortAnswerProps) {
  const handleContextChange = (contextContent: string) => {
    onChange({ ...question, contextContent });
  };

  const handleSubItemChange = (field: "content" | "correctAnswer", value: string) => {
    const primaryItem = question.subItems[0] ?? {
      orderIndex: 1,
      label: "1",
      content: "",
      points: "6.00",
    };

    let acceptableAnswers = primaryItem.acceptableAnswers ?? [];
    if (field === "correctAnswer") {
      const parts = value
        .split(/[,;|]/)
        .map((s) => s.trim())
        .filter(Boolean);
      acceptableAnswers = Array.from(new Set([value.trim(), ...parts]));
    }

    const updatedSubItems = [
      {
        ...primaryItem,
        [field]: value,
        acceptableAnswers,
      },
    ];

    onChange({ ...question, subItems: updatedSubItems });
  };

  const primaryItem = question.subItems[0];

  return (
    <Card className="border-border/60">
      <CardHeader className="bg-muted/30 flex flex-row items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-semibold">
            Câu điền số {index + 1}
          </Badge>
          <span className="text-muted-foreground text-xs">
            Trả lời ngắn (1 kết quả • 6.00 điểm thô)
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs font-semibold uppercase">
            Nội dung bài toán / Yêu cầu tính toán
          </Label>
          <Textarea
            value={question.contextContent}
            onChange={(e) => handleContextChange(e.target.value)}
            placeholder="Nhập đề bài toán tính toán (khối lượng, nồng độ, số nguyên tử)..."
            className="min-h-[75px] text-sm"
          />
          {question.contextContent && (
            <div className="bg-muted/40 border-border/40 mt-2 rounded-md border p-2.5">
              <span className="text-muted-foreground mb-1 block text-[11px] font-semibold uppercase">
                Xem trước KaTeX:
              </span>
              <ChemRenderer content={question.contextContent} className="text-sm" />
            </div>
          )}
        </div>

        <div className="border-border/50 bg-background/50 space-y-2 rounded-lg border p-3">
          <div className="space-y-1">
            <Label className="text-foreground text-xs font-semibold">
              Đáp án chính xác (chấp nhận số thập phân , hoặc .)
            </Label>
            <Input
              value={primaryItem?.correctAnswer ?? ""}
              onChange={(e) => handleSubItemChange("correctAnswer", e.target.value)}
              placeholder="Ví dụ: 2.5 hoặc 2,5"
              className="h-9 max-w-sm text-sm"
            />
          </div>

          {primaryItem?.acceptableAnswers && primaryItem.acceptableAnswers.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-muted-foreground text-[11px]">
                Các biến thể được chấm đúng:
              </span>
              {primaryItem.acceptableAnswers.map((ans) => (
                <Badge key={ans} variant="secondary" className="font-mono text-xs">
                  {ans}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
