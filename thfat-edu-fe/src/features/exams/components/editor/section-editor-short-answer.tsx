"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { type TQuizQuestion, type TQuizSubItem } from "../../types";
import { ExamMarkdownEditor } from "./exam-markdown-editor";
import { QuestionEditorCardHeader } from "./question-editor-card-header";

export type TSectionEditorShortAnswerProps = {
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

export function SectionEditorShortAnswer({
  question,
  questionNumber,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onUpdateQuestion,
}: TSectionEditorShortAnswerProps) {
  const primarySubItem = question.subItems[0] ?? {
    orderIndex: 0,
    label: `Câu ${questionNumber}`,
    content: "",
    correctAnswer: "",
    acceptableAnswers: [],
    points: "6.00",
  };

  const handleContextChange = (val: string) => {
    onUpdateQuestion({ ...question, contextContent: val });
  };

  const handleImageChange = (url: string | null) => {
    onUpdateQuestion({ ...question, imageUrl: url });
  };

  const handleSubItemChange = (patch: Partial<TQuizSubItem>) => {
    const updatedSubItem = { ...primarySubItem, ...patch };
    onUpdateQuestion({ ...question, subItems: [updatedSubItem] });
  };

  const handleAcceptableAnswersChange = (raw: string) => {
    const arr = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    handleSubItemChange({ acceptableAnswers: arr });
  };

  const acceptableList = primarySubItem.acceptableAnswers ?? [];

  return (
    <Card id={`question-card-3-${questionNumber - 1}`} className="border-border border shadow-xs">
      <CardContent className="space-y-4 p-4">
        <QuestionEditorCardHeader
          questionNumber={questionNumber}
          pointsLabel="Trả lời ngắn (6.0đ / câu)"
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
          label="Nội dung đề bài câu hỏi trả lời ngắn"
          value={question.contextContent}
          onChange={handleContextChange}
          placeholder="Nhập đề bài yêu cầu tính toán hoặc điền đáp án ngắn..."
          rows={3}
        />

        <div className="bg-muted/20 border-border space-y-3.5 rounded-lg border p-3.5">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`correct-ans-${questionNumber}`} className="text-xs font-semibold">
                Đáp án chuẩn chính xác <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`correct-ans-${questionNumber}`}
                value={primarySubItem.correctAnswer ?? ""}
                onChange={(e) => handleSubItemChange({ correctAnswer: e.target.value })}
                placeholder="Ví dụ: 0.25 hoặc CO2"
                className="bg-background text-primary h-8 font-mono text-xs font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`acceptable-ans-${questionNumber}`} className="text-xs font-semibold">
                Đáp án chấp nhận tương đương (cách nhau dấu phẩy)
              </Label>
              <Input
                id={`acceptable-ans-${questionNumber}`}
                value={acceptableList.join(", ")}
                onChange={(e) => handleAcceptableAnswersChange(e.target.value)}
                placeholder="Ví dụ: 1/4, 0,25"
                className="bg-background h-8 font-mono text-xs"
              />
              {acceptableList.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  <span className="text-muted-foreground text-[10px]">Được chấp nhận:</span>
                  {acceptableList.map((ans) => (
                    <Badge
                      key={ans}
                      variant="secondary"
                      className="px-1.5 py-0 font-mono text-[10px]"
                    >
                      {ans}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`explanation-${questionNumber}`} className="text-xs font-semibold">
              Hướng dẫn giải / Lời giải chi tiết
            </Label>
            <Input
              id={`explanation-${questionNumber}`}
              value={primarySubItem.explanation ?? ""}
              onChange={(e) => handleSubItemChange({ explanation: e.target.value })}
              placeholder="Giải thích ngắn gọn cách tính hoặc công thức áp dụng..."
              className="bg-background h-8 text-xs font-medium"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
