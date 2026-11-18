"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { type TQuizQuestion, type TQuizSubItem } from "../../types";
import { ExamMarkdownEditor } from "./exam-markdown-editor";
import { QuestionEditorCardHeader } from "./question-editor-card-header";

export type TSectionEditorShortAnswerProps = {
  id?: string;
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
  id,
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
  const handleContextChange = (val: string) =>
    onUpdateQuestion({ ...question, contextContent: val });
  const handleImageChange = (url: string | null) =>
    onUpdateQuestion({ ...question, imageUrl: url });
  const handleSubItemChange = (patch: Partial<TQuizSubItem>) => {
    onUpdateQuestion({ ...question, subItems: [{ ...primarySubItem, ...patch }] });
  };
  const handleAcceptableAnswersChange = (raw: string) => {
    handleSubItemChange({
      acceptableAnswers: raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
  };

  const acceptableList = primarySubItem.acceptableAnswers ?? [];
  const hasContent = Boolean(question.contextContent?.trim());

  return (
    <Card
      id={id ?? `question-card-3-${questionNumber - 1}`}
      onClick={onFocus}
      onFocusCapture={onFocus}
      className="group border-border/70 bg-card space-y-2.5 rounded-xl border p-3.5 shadow-xs transition-shadow hover:shadow-sm sm:p-4"
    >
      <QuestionEditorCardHeader
        questionNumber={questionNumber}
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
          <span className="text-foreground shrink-0 font-mono font-bold">
            Đáp án: {primarySubItem.correctAnswer || "—"}
          </span>
        </button>
      ) : (
        <div className="space-y-2.5">
          <ExamMarkdownEditor
            label="Nội dung / Ngữ cảnh đề bài"
            value={question.contextContent}
            onChange={handleContextChange}
            editorMode={editorMode}
            placeholder="Nhập đề bài yêu cầu tính toán hoặc điền đáp án ngắn..."
            rows={3}
          />

          <div className="border-border/40 space-y-2 border-t pt-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-foreground text-xs font-semibold">
                Thiết lập đáp án & Lời giải:
              </span>
              <span className="text-muted-foreground text-[11px] font-medium">1 ô trả lời</span>
            </div>

            {editorMode === "preview" ? (
              <div className="border-border/40 bg-muted/10 space-y-2 rounded-lg border p-2.5 text-xs sm:px-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground font-semibold">Đáp án đúng:</span>
                  <Badge className="border-success-500/30 bg-success-500/15 text-success-700 dark:text-success-400 border font-mono text-xs font-bold">
                    {primarySubItem.correctAnswer ? (
                      <ChemRenderer
                        content={primarySubItem.correctAnswer}
                        className="inline text-xs [&>div]:inline [&>p]:m-0 [&>p]:inline"
                      />
                    ) : (
                      "Chưa có đáp án"
                    )}
                  </Badge>
                  {acceptableList.length > 0 && (
                    <span className="text-muted-foreground">
                      (Chấp nhận tương đương: {acceptableList.join(", ")})
                    </span>
                  )}
                </div>

                {primarySubItem.explanation?.trim() ? (
                  <div className="border-border/40 text-muted-foreground border-t pt-2">
                    <span className="text-foreground font-semibold">Lời giải: </span>
                    <ChemRenderer content={primarySubItem.explanation} />
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="border-border/40 bg-muted/10 hover:border-border hover:bg-muted/15 space-y-2.5 rounded-lg border p-2.5 transition-all sm:px-3">
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <div className="space-y-1">
                    <span className="text-foreground text-xs font-semibold">
                      Đáp án chuẩn chính xác <span className="text-destructive">*</span>
                    </span>
                    <Input
                      id={`correct-ans-${questionNumber}`}
                      value={primarySubItem.correctAnswer ?? ""}
                      onChange={(e) => handleSubItemChange({ correctAnswer: e.target.value })}
                      placeholder="Ví dụ: 0.25 hoặc CO2"
                      className="border-border/60 bg-background text-success-700 focus-visible:border-success-500/60 focus-visible:ring-success-500/20 dark:text-success-400 h-8 font-mono text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-foreground text-xs font-semibold">
                      Đáp án chấp nhận tương đương
                    </span>
                    <Input
                      id={`acceptable-ans-${questionNumber}`}
                      value={acceptableList.join(", ")}
                      onChange={(e) => handleAcceptableAnswersChange(e.target.value)}
                      placeholder="Ví dụ: 1/4, 0,25 (cách nhau dấu phẩy)"
                      className="border-border/60 bg-background focus-visible:border-primary/60 focus-visible:ring-primary/20 h-8 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-0.5">
                  <ExamMarkdownEditor
                    label="Hướng dẫn giải / Lời giải chi tiết"
                    value={primarySubItem.explanation ?? ""}
                    onChange={(val) => handleSubItemChange({ explanation: val })}
                    placeholder="Giải thích ngắn gọn cách tính hoặc công thức áp dụng..."
                    rows={2}
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
