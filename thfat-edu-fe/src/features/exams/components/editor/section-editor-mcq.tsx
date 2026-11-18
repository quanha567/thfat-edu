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
  id?: string;
  question: TQuizQuestion;
  questionNumber: number;
  groupRange?: { start: number; end: number };
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

function getBadgeLabel(
  groupRange: { start: number; end: number } | undefined,
  subItemsLength: number,
  questionNumber: number
): string {
  if (groupRange) {
    if (groupRange.start === groupRange.end) {
      return `Câu ${groupRange.start}`;
    }

    return `Chùm câu hỏi (Câu ${groupRange.start} – ${groupRange.end})`;
  }

  if (subItemsLength > 1) {
    return `Chùm câu hỏi (Câu ${questionNumber} – ${questionNumber + subItemsLength - 1})`;
  }

  return `Câu ${questionNumber}`;
}

export function SectionEditorMcq({
  id,
  question,
  questionNumber,
  groupRange,
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
  const badgeLabel = getBadgeLabel(groupRange, question.subItems.length, questionNumber);

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
    const computedNum = groupRange ? groupRange.start + nextIdx : questionNumber + nextIdx;
    const newItem = createEmptySubItem({
      sectionType: "group_mcq",
      orderIndex: nextIdx,
      label: `Câu ${computedNum}`,
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
      id={id ?? `question-card-1-${questionNumber - 1}`}
      onClick={onFocus}
      onFocusCapture={onFocus}
      className="group border-border/70 bg-card space-y-2.5 rounded-xl border p-3.5 shadow-xs transition-shadow hover:shadow-sm sm:p-4"
    >
      <QuestionEditorCardHeader
        questionNumber={questionNumber}
        customBadge={badgeLabel}
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
          <span className="shrink-0 font-medium">{question.subItems.length} câu hỏi trong chùm</span>
        </button>
      ) : (
        <div className="space-y-2.5">
          <ExamMarkdownEditor
            label="Nội dung / Ngữ cảnh bài đọc chung"
            value={question.contextContent}
            onChange={handleContextChange}
            editorMode={editorMode}
            placeholder="Nhập thông tin, bảng số liệu hoặc đoạn văn bài đọc chung cho chùm câu hỏi..."
            rows={3}
          />

          <div className="border-border/40 space-y-2 border-t pt-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-foreground text-xs font-semibold">Danh sách câu hỏi trong chùm:</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-[11px] font-medium">
                  {question.subItems.length} câu hỏi
                </span>
                {editorMode === "edit" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={handleAddSubItem}
                    className="text-primary hover:bg-primary/10 h-6 gap-1 px-2 text-xs font-semibold"
                  >
                    <Plus className="size-3.5" />
                    Thêm câu hỏi
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {question.subItems.map((subItem, sIdx) => {
                const subQuestionNumber = groupRange
                  ? groupRange.start + sIdx
                  : questionNumber + sIdx;

                return (
                  <SectionEditorMcqItem
                    key={subItem.id || sIdx}
                    id={`subitem-${id ?? ""}-${sIdx}`}
                    subItem={subItem}
                    index={sIdx}
                    questionNumber={subQuestionNumber}
                    canRemove={question.subItems.length > 1}
                    editorMode={editorMode}
                    onRemove={() => handleRemoveSubItem(sIdx)}
                    onChange={(patch) => handleSubItemChange(sIdx, patch)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
