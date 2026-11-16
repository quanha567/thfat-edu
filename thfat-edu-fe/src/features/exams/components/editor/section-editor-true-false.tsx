"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

import { type TQuizQuestion, type TQuizSubItem } from "../../types";
import { ExamMarkdownEditor } from "./exam-markdown-editor";
import { QuestionEditorCardHeader } from "./question-editor-card-header";

export type TSectionEditorTrueFalseProps = {
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

  const hasContent = Boolean(question.contextContent?.trim());

  return (
    <Card
      id={`question-card-0-${questionNumber - 1}`}
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
            {hasContent ? question.contextContent : "Chưa có nội dung ngữ cảnh..."}
          </p>
          <span className="shrink-0 font-medium">{question.subItems.length} ý phát biểu</span>
        </button>
      ) : (
        <div className="space-y-4">
          <ExamMarkdownEditor
            value={question.contextContent}
            onChange={handleContextChange}
            editorMode={editorMode}
            placeholder="Nhập nội dung đề bài, ngữ cảnh thí nghiệm..."
            rows={3}
          />

          <div className="border-t border-border/40 pt-3 space-y-2">
            <span className="text-foreground text-xs font-semibold">
              Các ý phát biểu:
            </span>

            {editorMode === "preview" ? (
              <div className="divide-y divide-border/25">
                {question.subItems.map((subItem, sIdx) => {
                  const isTrue =
                    subItem.correctAnswer === "Đúng" || subItem.correctAnswer === "true";

                  return (
                    <div
                      key={subItem.id || sIdx}
                      className="flex items-start justify-between gap-3 py-2.5 first:pt-1 last:pb-1"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center font-mono text-xs font-bold text-muted-foreground">
                          {subItem.label || `${String.fromCharCode(97 + sIdx)}.`}
                        </span>
                        <div className="text-foreground text-xs leading-relaxed sm:text-sm">
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
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                            : "bg-rose-500/15 text-rose-700 dark:text-rose-400",
                        )}
                      >
                        {isTrue ? "Đúng" : "Sai"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="divide-y divide-border/25">
                {question.subItems.map((subItem, sIdx) => {
                  const isTrue =
                    subItem.correctAnswer === "Đúng" || subItem.correctAnswer === "true";

                  return (
                    <div
                      key={subItem.id || sIdx}
                      className="flex items-start gap-2.5 py-2 first:pt-1 last:pb-1"
                    >
                      <span className="mt-1.5 flex size-5 shrink-0 items-center justify-center font-mono text-xs font-bold text-muted-foreground">
                        {subItem.label || `${String.fromCharCode(97 + sIdx)}.`}
                      </span>

                      <div className="w-full flex-1">
                        <textarea
                          value={subItem.content}
                          onChange={(e) =>
                            handleSubItemChange(sIdx, { content: e.target.value })
                          }
                          placeholder={`Nhập ý phát biểu ${String.fromCharCode(97 + sIdx)}...`}
                          rows={1}
                          className="field-sizing-content min-h-[32px] w-full resize-none rounded-md bg-transparent px-2 py-1 text-xs font-medium text-foreground transition-colors placeholder:text-muted-foreground/50 hover:bg-muted/20 focus-visible:bg-muted/20 focus-visible:outline-none"
                        />
                      </div>

                      <div className="flex shrink-0 items-center rounded-md bg-muted/60 p-0.5">
                        <button
                          type="button"
                          onClick={() => handleSubItemChange(sIdx, { correctAnswer: "Đúng" })}
                          className={cn(
                            "flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold transition-all",
                            isTrue
                              ? "bg-emerald-500/20 font-bold text-emerald-700 dark:text-emerald-400"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <Check className="size-3" />
                          Đúng
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSubItemChange(sIdx, { correctAnswer: "Sai" })}
                          className={cn(
                            "flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold transition-all",
                            !isTrue
                              ? "bg-rose-500/20 font-bold text-rose-700 dark:text-rose-400"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <X className="size-3" />
                          Sai
                        </button>
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
