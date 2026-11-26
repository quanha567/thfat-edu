"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { type TQuizQuestion, type TQuizSubItem } from "../../types";
import { ExamMarkdownEditor } from "./exam-markdown-editor";
import { QuestionEditorCardHeader } from "./question-editor-card-header";
import { TrueFalseBinarySwitch } from "./true-false-binary-switch";

export type TSectionEditorTrueFalseProps = {
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

export function SectionEditorTrueFalse({
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
}: TSectionEditorTrueFalseProps) {
  const hasContent = Boolean(question.contextContent?.trim());
  const handleContextChange = (val: string) =>
    onUpdateQuestion({ ...question, contextContent: val });
  const handleSubItemChange = (index: number, patch: Partial<TQuizSubItem>) => {
    const updated = [...question.subItems];
    if (updated[index]) {
      updated[index] = { ...updated[index], ...patch };
      onUpdateQuestion({ ...question, subItems: updated });
    }
  };

  return (
    <Card
      id={id ?? `question-card-0-${questionNumber - 1}`}
      onClick={onFocus}
      onFocusCapture={onFocus}
      className="group border-border/70 bg-card space-y-2.5 rounded-xl border p-3.5 shadow-xs transition-shadow hover:shadow-sm sm:p-4"
    >
      <QuestionEditorCardHeader
        questionNumber={questionNumber}
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
      />

      {isCollapsed ? (
        <button
          type="button"
          onClick={onToggleCollapse}
          className="text-muted-foreground hover:text-foreground flex w-full cursor-pointer items-center justify-between gap-3 text-left text-xs"
        >
          <p className="line-clamp-1 italic">
            {hasContent ? question.contextContent : "Chưa có nội dung ngữ cảnh..."}
          </p>
          <span className="shrink-0 font-medium">{question.subItems.length} ý phát biểu</span>
        </button>
      ) : (
        <div className="space-y-2.5">
          <ExamMarkdownEditor
            label="Nội dung / Ngữ cảnh đề bài"
            value={question.contextContent}
            onChange={handleContextChange}
            editorMode={editorMode}
            placeholder="Nhập nội dung đề bài, ngữ cảnh thí nghiệm..."
            rows={3}
          />

          <div className="border-border/40 space-y-2 border-t pt-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-foreground text-xs font-semibold">Các ý phát biểu:</span>
              <span className="text-muted-foreground text-xxs font-medium">
                {question.subItems.length} ý phát biểu
              </span>
            </div>

            {editorMode === "preview" ? (
              <div className="space-y-1.5">
                {question.subItems.map((subItem, sIdx) => {
                  const isTrue =
                    subItem.correctAnswer === "Đúng" || subItem.correctAnswer === "true";

                  return (
                    <div
                      key={subItem.id || sIdx}
                      className="border-border/40 bg-muted/10 flex items-start justify-between gap-3 rounded-lg border p-2 sm:px-2.5"
                    >
                      <div className="flex min-w-0 flex-1 items-start gap-2.5">
                        <span className="bg-primary/10 text-primary border-primary/20 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold shadow-2xs">
                          {subItem.label || sIdx + 1}
                        </span>
                        <div className="text-foreground mt-0.5 text-xs leading-relaxed sm:text-sm">
                          {subItem.content.trim() ? (
                            <ChemRenderer content={subItem.content} />
                          ) : (
                            <span className="text-muted-foreground text-xs italic">
                              Chưa có nội dung phát biểu...
                            </span>
                          )}
                        </div>
                      </div>

                      <Badge
                        variant={isTrue ? "default" : "destructive"}
                        className={cn(
                          "shrink-0 px-2 py-0.5 text-xs font-semibold",
                          isTrue
                            ? "bg-success-500/15 text-success-700 dark:text-success-400"
                            : "bg-error-500/15 text-error-700 dark:text-error-400",
                        )}
                      >
                        {isTrue ? "Đúng" : "Sai"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-1.5">
                {question.subItems.map((subItem, sIdx) => {
                  const isTrue =
                    subItem.correctAnswer === "Đúng" || subItem.correctAnswer === "true";

                  return (
                    <div
                      key={subItem.id || sIdx}
                      className="border-border/40 bg-muted/10 hover:border-border hover:bg-muted/20 flex items-start gap-2.5 rounded-lg border p-1.5 transition-all sm:px-2.5"
                    >
                      <span className="bg-primary/10 text-primary border-primary/20 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold shadow-2xs">
                        {subItem.label || sIdx + 1}
                      </span>

                      <div className="w-full min-w-0 flex-1">
                        <ExamMarkdownEditor
                          value={subItem.content}
                          onChange={(val) => handleSubItemChange(sIdx, { content: val })}
                          placeholder={`Nhập ý phát biểu ${sIdx + 1}...`}
                          rows={1}
                          compact
                        />
                      </div>

                      <div className="mt-0.5">
                        <TrueFalseBinarySwitch
                          isTrue={isTrue}
                          onChange={(val) => handleSubItemChange(sIdx, { correctAnswer: val })}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
