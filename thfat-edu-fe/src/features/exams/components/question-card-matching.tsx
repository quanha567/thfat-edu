"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { type TQuizQuestion } from "../types";

export type TQuestionCardMatchingProps = {
  question: TQuizQuestion;
  index: number;
  onChange: (updated: TQuizQuestion) => void;
};

export function QuestionCardMatching({ question, index, onChange }: TQuestionCardMatchingProps) {
  const handleContextChange = (contextContent: string) => {
    onChange({ ...question, contextContent });
  };

  const handleSubItemChange = (
    itemIndex: number,
    field: "content" | "correctAnswer",
    value: string,
  ) => {
    const updatedSubItems = question.subItems.map((item, idx) => {
      if (idx === itemIndex) {
        return { ...item, [field]: value };
      }

      return item;
    });
    onChange({ ...question, subItems: updatedSubItems });
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="bg-muted/30 flex flex-row items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-semibold">
            Câu ghép {index + 1}
          </Badge>
          <span className="text-muted-foreground text-xs">
            Ghép hợp nối cột (4 cặp • 6.00 điểm thô)
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs font-semibold uppercase">
            Mô tả yêu cầu ghép nối
          </Label>
          <Textarea
            value={question.contextContent}
            onChange={(e) => handleContextChange(e.target.value)}
            placeholder="Ví dụ: Ghép mỗi chất ở Cột A với tính chất/ứng dụng tương ứng ở Cột B..."
            className="min-h-[60px] text-sm"
          />
          {question.contextContent && (
            <div className="bg-muted/40 border-border/40 mt-2 rounded-md border p-2.5">
              <ChemRenderer content={question.contextContent} className="text-sm" />
            </div>
          )}
        </div>

        <div className="space-y-3 pt-2">
          <Label className="text-muted-foreground text-xs font-semibold uppercase">
            Các cặp ghép hợp
          </Label>

          {question.subItems.map((item, idx) => (
            <div
              key={item.id ?? `matching-${item.label}-${item.orderIndex}`}
              className="border-border/50 bg-background/50 flex flex-col items-center gap-3 rounded-lg border p-3 sm:flex-row"
            >
              <div className="w-full flex-1 space-y-1">
                <span className="text-muted-foreground text-xs font-medium">Vế 1 (Cột A):</span>
                <Input
                  value={item.content}
                  onChange={(e) => handleSubItemChange(idx, "content", e.target.value)}
                  placeholder={`Mục ${idx + 1}...`}
                  className="h-8 text-sm"
                />
              </div>

              <div className="text-muted-foreground shrink-0 font-bold">⟷</div>

              <div className="w-full flex-1 space-y-1">
                <span className="text-muted-foreground text-xs font-medium">
                  Đáp án ghép đúng (Cột B):
                </span>
                <Input
                  value={item.correctAnswer ?? ""}
                  onChange={(e) => handleSubItemChange(idx, "correctAnswer", e.target.value)}
                  placeholder="Mục tương ứng ở cột B..."
                  className="h-8 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
