"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { type TQuizQuestion, type TQuizSubItem } from "../../types";
import { ExamMarkdownEditor } from "./exam-markdown-editor";
import { QuestionEditorCardHeader } from "./question-editor-card-header";

export type TSectionEditorTrueFalseProps = {
  question: TQuizQuestion;
  questionNumber: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onUpdateQuestion: (updated: TQuizQuestion) => void;
};

export function SectionEditorTrueFalse({
  question,
  questionNumber,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onUpdateQuestion,
}: TSectionEditorTrueFalseProps) {
  const handleContextChange = (val: string) => {
    onUpdateQuestion({ ...question, contextContent: val });
  };

  const handleImageChange = (url: string | null) => {
    onUpdateQuestion({ ...question, imageUrl: url });
  };

  const handleSubItemChange = (index: number, patch: Partial<TQuizSubItem>) => {
    const updated = [...question.subItems];
    const target = updated[index];
    if (target) {
      updated[index] = { ...target, ...patch };
      onUpdateQuestion({ ...question, subItems: updated });
    }
  };

  return (
    <Card id={`question-card-0-${questionNumber - 1}`} className="border-border border shadow-xs">
      <CardContent className="space-y-4 p-4">
        <QuestionEditorCardHeader
          questionNumber={questionNumber}
          pointsLabel="Barem Đúng/Sai V-SAT (Tối đa 6đ)"
          imageUrl={question.imageUrl}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onImageChange={handleImageChange}
        />

        <ExamMarkdownEditor
          label="Nội dung ngữ cảnh câu hỏi"
          value={question.contextContent}
          onChange={handleContextChange}
          placeholder="Nhập thông tin đề bài hoặc thí nghiệm..."
          rows={3}
        />

        <div className="space-y-2.5">
          <Label className="text-foreground text-xs font-semibold">
            Các ý phát biểu (a, b, c, d):
          </Label>

          <div className="space-y-2">
            {question.subItems.map((subItem, sIdx) => {
              const isTrue = subItem.correctAnswer === "Đúng" || subItem.correctAnswer === "true";

              return (
                <div
                  key={subItem.id || sIdx}
                  className="bg-muted/20 border-border flex flex-col items-start gap-2 rounded-lg border p-2 text-xs sm:flex-row sm:items-center"
                >
                  <span className="bg-background text-primary border-border shrink-0 rounded-md border px-2.5 py-1 font-bold shadow-2xs">
                    {subItem.label || String.fromCharCode(97 + sIdx)})
                  </span>

                  <div className="w-full flex-1">
                    <Input
                      value={subItem.content}
                      onChange={(e) => handleSubItemChange(sIdx, { content: e.target.value })}
                      placeholder="Nội dung phát biểu..."
                      className="bg-background h-8 text-xs font-medium"
                    />
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <Button
                      type="button"
                      size="xs"
                      variant={isTrue ? "default" : "outline"}
                      className={`h-7 px-3 text-xs font-bold transition-all ${
                        isTrue
                          ? "bg-emerald-600 text-white shadow-xs hover:bg-emerald-700"
                          : "text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-700"
                      }`}
                      onClick={() => handleSubItemChange(sIdx, { correctAnswer: "Đúng" })}
                    >
                      Đúng
                    </Button>

                    <Button
                      type="button"
                      size="xs"
                      variant={!isTrue ? "destructive" : "outline"}
                      className={`h-7 px-3 text-xs font-bold transition-all ${
                        !isTrue
                          ? "bg-rose-600 text-white shadow-xs hover:bg-rose-700"
                          : "text-muted-foreground hover:bg-rose-500/10 hover:text-rose-700"
                      }`}
                      onClick={() => handleSubItemChange(sIdx, { correctAnswer: "Sai" })}
                    >
                      Sai
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
