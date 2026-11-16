"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

import { createEmptySubItem } from "../../constants/exam-editor.constants";
import { type TQuizQuestion, type TQuizSubItem } from "../../types";
import { ExamMarkdownEditor } from "./exam-markdown-editor";
import { QuestionEditorCardHeader } from "./question-editor-card-header";
import { SectionEditorMcqItem } from "./section-editor-mcq-item";

export type TSectionEditorMcqProps = {
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

export function SectionEditorMcq({
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
}: TSectionEditorMcqProps) {
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

  const handleAddSubItem = () => {
    const nextIdx = question.subItems.length;
    const newItem = createEmptySubItem({
      sectionType: "group_mcq",
      orderIndex: nextIdx,
      label: `Ý ${nextIdx + 1}`,
    });
    onUpdateQuestion({ ...question, subItems: [...question.subItems, newItem] });
  };

  const handleRemoveSubItem = (index: number) => {
    if (question.subItems.length <= 1) return;
    const updated = question.subItems.filter((_, idx) => idx !== index);
    onUpdateQuestion({ ...question, subItems: updated });
  };

  const hasContent = Boolean(question.contextContent?.trim());

  return (
    <Card
      id={`question-card-1-${questionNumber - 1}`}
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
          <span className="shrink-0 font-medium">{question.subItems.length} câu hỏi con</span>
        </button>
      ) : (
        <div className="space-y-4">
          <ExamMarkdownEditor
            value={question.contextContent}
            onChange={handleContextChange}
            editorMode={editorMode}
            placeholder="Nhập thông tin, bảng số liệu hoặc đề bài chung cho nhóm câu hỏi..."
            rows={3}
          />

          <div className="border-t border-border/40 pt-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-foreground text-xs font-semibold">
                Danh sách câu hỏi con ({question.subItems.length} câu):
              </span>
              {editorMode === "edit" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={handleAddSubItem}
                  className="h-7 gap-1 text-xs font-semibold text-primary hover:bg-primary/10"
                >
                  <Plus className="size-3.5" />
                  Thêm câu hỏi con
                </Button>
              )}
            </div>

            <div className="divide-y divide-border/25">
              {question.subItems.map((subItem, sIdx) => (
                <div key={subItem.id || sIdx} className="py-3 first:pt-0 last:pb-0">
                  <SectionEditorMcqItem
                    subItem={subItem}
                    index={sIdx}
                    canRemove={question.subItems.length > 1}
                    editorMode={editorMode}
                    onRemove={() => handleRemoveSubItem(sIdx)}
                    onChange={(patch) => handleSubItemChange(sIdx, patch)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
