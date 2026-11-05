"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

import { type TQuizQuestion } from "../types";

export type TQuestionCardTrueFalseProps = {
  question: TQuizQuestion;
  index: number;
  onChange: (updated: TQuizQuestion) => void;
};

export function QuestionCardTrueFalse({ question, index, onChange }: TQuestionCardTrueFalseProps) {
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
            Câu {index + 1}
          </Badge>
          <span className="text-muted-foreground text-xs">Đúng / Sai (4 ý • 6.00 điểm thô)</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs font-semibold uppercase">
            Ngữ cảnh / Dẫn chứng câu hỏi
          </Label>
          <Textarea
            value={question.contextContent}
            onChange={(e) => handleContextChange(e.target.value)}
            placeholder="Nhập nội dung dẫn chứng thí nghiệm hoặc hiện tượng Hóa học..."
            className="min-h-[70px] text-sm"
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

        <div className="space-y-3 pt-2">
          <Label className="text-muted-foreground text-xs font-semibold uppercase">
            Các mệnh đề tiểu mục (a, b, c, d)
          </Label>

          {question.subItems.map((item, idx) => (
            <div
              key={item.id ?? `tf-${item.label}-${item.orderIndex}`}
              className="border-border/50 bg-background/50 space-y-2.5 rounded-lg border p-3"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-primary mt-1 text-sm font-bold uppercase">{item.label})</span>
                <div className="flex-1 space-y-1">
                  <Textarea
                    value={item.content}
                    onChange={(e) => handleSubItemChange(idx, "content", e.target.value)}
                    placeholder={`Nội dung mệnh đề ${item.label}...`}
                    className="min-h-[44px] text-sm"
                  />
                  {item.content && (
                    <ChemRenderer
                      content={item.content}
                      className="text-muted-foreground text-xs"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pl-6 text-xs">
                <span className="text-muted-foreground font-medium">Đáp án đúng:</span>
                <RadioGroup
                  value={item.correctAnswer ?? ""}
                  onValueChange={(val) => handleSubItemChange(idx, "correctAnswer", val)}
                  className="flex items-center gap-4"
                >
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="true" id={`q${index}-item${idx}-true`} />
                    <Label
                      htmlFor={`q${index}-item${idx}-true`}
                      className="cursor-pointer font-semibold text-emerald-600"
                    >
                      Đúng
                    </Label>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="false" id={`q${index}-item${idx}-false`} />
                    <Label
                      htmlFor={`q${index}-item${idx}-false`}
                      className="cursor-pointer font-semibold text-rose-600"
                    >
                      Sai
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
