"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowRight, Plus, Trash2 } from "lucide-react";

import { createEmptySubItem } from "../../constants/exam-editor.constants";
import { type TQuizQuestion, type TQuizSubItem } from "../../types";
import { ExamMarkdownEditor } from "./exam-markdown-editor";
import { QuestionEditorCardHeader } from "./question-editor-card-header";

export type TSectionEditorMatchingProps = {
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

const MATCHING_TARGETS = ["A", "B", "C", "D", "E", "F"] as const;

export function SectionEditorMatching({
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
}: TSectionEditorMatchingProps) {
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

  const handleAddPair = () => {
    const nextIdx = question.subItems.length;
    const newItem = createEmptySubItem({
      sectionType: "matching",
      orderIndex: nextIdx,
      label: `Vế ${nextIdx + 1}`,
    });
    onUpdateQuestion({ ...question, subItems: [...question.subItems, newItem] });
  };

  const handleRemovePair = (index: number) => {
    if (question.subItems.length <= 1) return;
    const updated = question.subItems.filter((_, idx) => idx !== index);
    onUpdateQuestion({ ...question, subItems: updated });
  };

  const hasContent = Boolean(question.contextContent?.trim());

  return (
    <Card
      id={`question-card-2-${questionNumber - 1}`}
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
          <span className="shrink-0 font-medium">{question.subItems.length} vế ghép</span>
        </button>
      ) : (
        <div className="space-y-4">
          <ExamMarkdownEditor
            value={question.contextContent}
            onChange={handleContextChange}
            editorMode={editorMode}
            placeholder="Nhập thông tin bảng hoặc danh sách thông tin cần ghép nối..."
            rows={3}
          />

          <div className="border-t border-border/40 pt-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-foreground text-xs font-semibold">
                Các cặp ghép nối ({question.subItems.length} cặp):
              </span>
              {editorMode === "edit" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={handleAddPair}
                  className="h-7 gap-1 text-xs font-semibold text-primary hover:bg-primary/10"
                >
                  <Plus className="size-3.5" />
                  Thêm vế ghép
                </Button>
              )}
            </div>

            {editorMode === "preview" ? (
              <div className="divide-y divide-border/25">
                {question.subItems.map((subItem, sIdx) => (
                  <div
                    key={subItem.id || sIdx}
                    className="flex items-start justify-between gap-3 py-2.5 first:pt-1 last:pb-1"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center font-mono text-xs font-bold text-muted-foreground">
                        {subItem.label || `${sIdx + 1}.`}
                      </span>
                      <div className="text-foreground text-xs leading-relaxed sm:text-sm">
                        {subItem.content.trim() ? (
                          <ChemRenderer content={subItem.content} />
                        ) : (
                          <span className="text-muted-foreground text-xs italic">
                            Chưa có nội dung vế ghép...
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 text-xs font-semibold">
                      <ArrowRight className="size-3.5 text-muted-foreground" />
                      <Badge variant="secondary" className="px-2 py-0.5 font-bold">
                        {subItem.correctAnswer || "A"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-border/25">
                {question.subItems.map((subItem, sIdx) => (
                  <div
                    key={subItem.id || sIdx}
                    className="flex items-start gap-2.5 py-2 first:pt-1 last:pb-1"
                  >
                    <span className="mt-1.5 flex size-5 shrink-0 items-center justify-center font-mono text-xs font-bold text-muted-foreground">
                      {subItem.label || `${sIdx + 1}.`}
                    </span>

                    <div className="w-full flex-1">
                      <textarea
                        value={subItem.content}
                        onChange={(e) =>
                          handleSubItemChange(sIdx, { content: e.target.value })
                        }
                        placeholder={`Nội dung vế ghép ${sIdx + 1}...`}
                        rows={1}
                        className="field-sizing-content min-h-[32px] w-full resize-none rounded-md bg-transparent px-2 py-1 text-xs font-medium text-foreground transition-colors placeholder:text-muted-foreground/50 hover:bg-muted/20 focus-visible:bg-muted/20 focus-visible:outline-none"
                      />
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <ArrowRight className="size-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground text-xs font-normal">Ghép với:</span>

                      <Select
                        value={subItem.correctAnswer ?? "A"}
                        onValueChange={(val) =>
                          handleSubItemChange(sIdx, { correctAnswer: val })
                        }
                      >
                        <SelectTrigger className="h-7 w-12 text-xs font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MATCHING_TARGETS.map((opt) => (
                            <SelectItem key={opt} value={opt} className="text-xs font-bold">
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {question.subItems.length > 1 && (
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => handleRemovePair(sIdx)}
                                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive size-6"
                                aria-label="Xóa cặp ghép này"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Xóa cặp ghép này</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
