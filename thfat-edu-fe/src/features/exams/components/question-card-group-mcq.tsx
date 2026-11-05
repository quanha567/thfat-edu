"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

import { type TQuizQuestion } from "../types";

export type TQuestionCardGroupMcqProps = {
  question: TQuizQuestion;
  index: number;
  onChange: (updated: TQuizQuestion) => void;
};

export function QuestionCardGroupMcq({ question, index, onChange }: TQuestionCardGroupMcqProps) {
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

  const handleOptionChange = (itemIndex: number, optIndex: number, value: string) => {
    const targetItem = question.subItems[itemIndex];
    if (!targetItem) return;

    const currentOptions = targetItem.options ?? ["", "", "", ""];
    const updatedOptions = [...currentOptions];
    updatedOptions[optIndex] = value;

    const updatedSubItems = question.subItems.map((item, idx) => {
      if (idx === itemIndex) {
        return { ...item, options: updatedOptions };
      }

      return item;
    });
    onChange({ ...question, subItems: updatedSubItems });
  };

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <Card className="border-border/60">
      <CardHeader className="bg-muted/30 flex flex-row items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-semibold">
            Chùm câu {index + 1}
          </Badge>
          <span className="text-muted-foreground text-xs">
            MCQs nhóm (4 câu con • 6.00 điểm thô)
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs font-semibold uppercase">
            Đoạn thông tin / Ngữ cảnh chung
          </Label>
          <Textarea
            value={question.contextContent}
            onChange={(e) => handleContextChange(e.target.value)}
            placeholder="Nhập thông tin bảng biểu, bài toán thực nghiệm dùng chung..."
            className="min-h-[80px] text-sm"
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

        <div className="space-y-4 pt-2">
          <Label className="text-muted-foreground text-xs font-semibold uppercase">
            Các câu hỏi trắc nghiệm con
          </Label>

          {question.subItems.map((item, subIdx) => {
            const options =
              item.options && item.options.length === 4 ? item.options : ["", "", "", ""];

            return (
              <div
                key={item.id ?? `group-${item.label}-${item.orderIndex}`}
                className="border-border/50 bg-background/50 space-y-3 rounded-lg border p-3.5"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-semibold">
                      Câu {index + 1}.{subIdx + 1}:
                    </span>
                    <Input
                      value={item.content}
                      onChange={(e) => handleSubItemChange(subIdx, "content", e.target.value)}
                      placeholder="Nội dung câu hỏi con..."
                      className="h-8 flex-1 text-sm"
                    />
                  </div>
                  {item.content && (
                    <ChemRenderer
                      content={item.content}
                      className="text-muted-foreground pl-6 text-xs"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2 pl-2 sm:grid-cols-2">
                  {optionLabels.map((optLabel, optIdx) => (
                    <div key={optLabel} className="flex items-center gap-2">
                      <span className="w-4 text-xs font-bold">{optLabel}.</span>
                      <Input
                        value={options[optIdx] ?? ""}
                        onChange={(e) => handleOptionChange(subIdx, optIdx, e.target.value)}
                        placeholder={`Lựa chọn ${optLabel}...`}
                        className="h-8 text-xs"
                      />
                    </div>
                  ))}
                </div>

                <div className="border-border/30 flex items-center justify-between border-t pt-1 text-xs">
                  <span className="text-muted-foreground font-medium">Đáp án đúng:</span>
                  <RadioGroup
                    value={item.correctAnswer ?? ""}
                    onValueChange={(val) => handleSubItemChange(subIdx, "correctAnswer", val)}
                    className="flex items-center gap-4"
                  >
                    {optionLabels.map((optLabel) => (
                      <div key={optLabel} className="flex items-center space-x-1">
                        <RadioGroupItem
                          value={optLabel}
                          id={`group-q${index}-${subIdx}-${optLabel}`}
                        />
                        <Label
                          htmlFor={`group-q${index}-${subIdx}-${optLabel}`}
                          className="cursor-pointer font-bold"
                        >
                          {optLabel}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
