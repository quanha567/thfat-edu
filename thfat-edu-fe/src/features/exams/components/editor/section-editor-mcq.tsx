"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

  return (
    <Card id={`question-card-1-${questionNumber - 1}`} className="border-border border shadow-xs">
      <CardContent className="space-y-4 p-4">
        <QuestionEditorCardHeader
          questionNumber={questionNumber}
          pointsLabel="MCQ Nhóm (1.5đ / tiểu mục)"
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
          label="Ngữ cảnh chung của nhóm câu hỏi (Context)"
          value={question.contextContent}
          onChange={handleContextChange}
          placeholder="Nhập thông tin, bảng số liệu hoặc văn bản chung cho nhóm..."
          rows={3}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-foreground text-xs font-semibold">
              Danh sách câu hỏi con ({question.subItems.length} câu):
            </span>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleAddSubItem}
              className="h-7 gap-1 text-xs font-medium"
            >
              <Plus className="size-3" />
              Thêm câu hỏi con
            </Button>
          </div>

          <div className="space-y-2.5">
            {question.subItems.map((subItem, sIdx) => (
              <SectionEditorMcqItem
                key={subItem.id || sIdx}
                subItem={subItem}
                index={sIdx}
                canRemove={question.subItems.length > 1}
                onRemove={() => handleRemoveSubItem(sIdx)}
                onChange={(patch) => handleSubItemChange(sIdx, patch)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
