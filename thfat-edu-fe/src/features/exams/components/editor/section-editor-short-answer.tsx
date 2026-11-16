"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { type TQuizQuestion, type TQuizSubItem } from "../../types";
import { ExamMarkdownEditor } from "./exam-markdown-editor";
import { QuestionEditorCardHeader } from "./question-editor-card-header";

export type TSectionEditorShortAnswerProps = {
  question: TQuizQuestion;
  questionNumber: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isCollapsed?: boolean;
  isSolving?: boolean;
  editorMode?: "edit" | "preview";
  onToggleCollapse?: () => void;
  onAutoSolve?: () => void;
  onFocus?: () => void;
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
  isCollapsed = false,
  isSolving = false,
  editorMode = "edit",
  onToggleCollapse,
  onAutoSolve,
  onFocus,
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
  const hasContent = Boolean(question.contextContent?.trim());

  return (
    <Card
      id={`question-card-3-${questionNumber - 1}`}
      onClick={onFocus}
      onFocusCapture={onFocus}
      className="border-border/70 rounded-xl border bg-card p-4 space-y-4 shadow-xs transition-shadow hover:shadow-sm"
    >
      <QuestionEditorCardHeader
        questionNumber={questionNumber}
        pointsLabel=""
        imageUrl={question.imageUrl}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        isCollapsed={isCollapsed}
        isSolving={isSolving}
        onToggleCollapse={onToggleCollapse}
        onAutoSolve={onAutoSolve}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        onImageChange={handleImageChange}
      />

      {isCollapsed ? (
        <button
          type="button"
          onClick={onToggleCollapse}
          className="text-muted-foreground hover:text-foreground flex w-full cursor-pointer items-center justify-between gap-3 text-left text-xs"
        >
          <p className="line-clamp-1 italic">
            {hasContent ? question.contextContent : "Chưa có nội dung đề bài..."}
          </p>
          <span className="font-mono font-bold text-foreground shrink-0">
            Đáp án: {primarySubItem.correctAnswer || "—"}
          </span>
        </button>
      ) : (
        <div className="space-y-4">
          <ExamMarkdownEditor
            value={question.contextContent}
            onChange={handleContextChange}
            editorMode={editorMode}
            placeholder="Nhập đề bài yêu cầu tính toán hoặc điền đáp án ngắn..."
            rows={3}
          />

          <div className="border-t border-border/40 pt-3 space-y-3">
            {editorMode === "preview" ? (
              <div className="space-y-2 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-muted-foreground">Đáp án đúng:</span>
                  <Badge variant="secondary" className="font-mono text-xs font-bold text-primary">
                    {primarySubItem.correctAnswer || "Chưa có đáp án"}
                  </Badge>
                  {acceptableList.length > 0 && (
                    <span className="text-muted-foreground">
                      (Chấp nhận tương đương: {acceptableList.join(", ")})
                    </span>
                  )}
                </div>

                {primarySubItem.explanation?.trim() ? (
                  <div className="border-t border-border/40 pt-2 text-muted-foreground">
                    <span className="font-semibold text-foreground">Lời giải: </span>
                    <ChemRenderer content={primarySubItem.explanation} />
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-foreground">
                    Đáp án chuẩn chính xác <span className="text-destructive">*</span>
                  </span>
                  <Input
                    id={`correct-ans-${questionNumber}`}
                    value={primarySubItem.correctAnswer ?? ""}
                    onChange={(e) => handleSubItemChange({ correctAnswer: e.target.value })}
                    placeholder="Ví dụ: 0.25 hoặc CO2"
                    className="h-8 font-mono text-xs font-bold text-primary bg-muted/15 border-border/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-foreground">
                    Đáp án chấp nhận tương đương
                  </span>
                  <Input
                    id={`acceptable-ans-${questionNumber}`}
                    value={acceptableList.join(", ")}
                    onChange={(e) => handleAcceptableAnswersChange(e.target.value)}
                    placeholder="Ví dụ: 1/4, 0,25 (cách nhau dấu phẩy)"
                    className="h-8 font-mono text-xs bg-muted/15 border-border/40"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <span className="text-xs font-semibold text-foreground">
                    Hướng dẫn giải / Lời giải chi tiết
                  </span>
                  <textarea
                    id={`explanation-${questionNumber}`}
                    value={primarySubItem.explanation ?? ""}
                    onChange={(e) => handleSubItemChange({ explanation: e.target.value })}
                    placeholder="Giải thích ngắn gọn cách tính hoặc công thức áp dụng..."
                    rows={1}
                    className="field-sizing-content min-h-[34px] w-full resize-none rounded-md bg-muted/15 px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors placeholder:text-muted-foreground border border-border/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
