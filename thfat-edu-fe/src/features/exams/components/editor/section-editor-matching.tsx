"use client";

import { Card } from "@/components/ui/card";

import { createEmptySubItem } from "../../constants/exam-editor.constants";
import { type TQuizQuestion, type TQuizSubItem } from "../../types";
import { extractMatchingHeaders, getMatchingOptions, parseMatchingOption } from "../matching.types";
import { ExamMarkdownEditor } from "./exam-markdown-editor";
import { QuestionEditorCardHeader } from "./question-editor-card-header";
import { SectionEditorMatchingOptions } from "./section-editor-matching-options";
import { SectionEditorMatchingPairs } from "./section-editor-matching-pairs";

export type TSectionEditorMatchingProps = {
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

export function SectionEditorMatching({
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
}: TSectionEditorMatchingProps) {
  const options = getMatchingOptions(question.subItems);
  const { col1Title, col2Title } = extractMatchingHeaders(question.contextContent);

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
    const newItem: TQuizSubItem = {
      ...createEmptySubItem({
        sectionType: "matching",
        orderIndex: nextIdx,
        label: `${nextIdx + 1}`,
      }),
      options: options.map((opt) => opt.raw),
      correctAnswer: options[0]?.letter ?? "A",
    };
    onUpdateQuestion({ ...question, subItems: [...question.subItems, newItem] });
  };

  const handleRemovePair = (index: number) => {
    if (question.subItems.length <= 1) return;
    const updated = question.subItems.filter((_, idx) => idx !== index);
    onUpdateQuestion({ ...question, subItems: updated });
  };

  const handleOptionsChange = (updatedRawOptions: string[]) => {
    const validLetters = new Set(
      updatedRawOptions.map((opt, idx) => parseMatchingOption(opt, idx).letter),
    );
    const fallbackLetter = updatedRawOptions[0]
      ? parseMatchingOption(updatedRawOptions[0], 0).letter
      : null;

    const updatedSubItems = question.subItems.map((sub) => {
      const currentAnswer = sub.correctAnswer?.toUpperCase();
      const isValid = currentAnswer ? validLetters.has(currentAnswer) : false;

      return {
        ...sub,
        options: updatedRawOptions,
        correctAnswer: isValid ? sub.correctAnswer : fallbackLetter,
      };
    });

    onUpdateQuestion({ ...question, subItems: updatedSubItems });
  };

  const hasContent = Boolean(question.contextContent?.trim());

  return (
    <Card
      id={id ?? `question-card-2-${questionNumber - 1}`}
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
            {hasContent ? question.contextContent : "Chưa có nội dung ngữ cảnh..."}
          </p>
          <div className="flex shrink-0 items-center gap-2 font-medium">
            <span>{question.subItems.length} vế ghép</span>
            <span>•</span>
            <span>{options.length} phương án</span>
          </div>
        </button>
      ) : (
        <div className="space-y-2.5">
          <ExamMarkdownEditor
            label="Nội dung / Ngữ cảnh đề bài"
            value={question.contextContent}
            onChange={handleContextChange}
            editorMode={editorMode}
            placeholder="Nhập thông tin bối cảnh hoặc đoạn văn dẫn nhập cho câu hỏi ghép nối..."
            rows={3}
          />

          <div className="border-border/40 space-y-2 border-t pt-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-foreground text-xs font-semibold">
                Cấu hình các vế ghép và phương án:
              </span>
              <span className="text-muted-foreground text-[11px] font-medium">
                {question.subItems.length} vế ghép • {options.length} phương án
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-7">
                <SectionEditorMatchingPairs
                  subItems={question.subItems}
                  options={options}
                  title={col1Title}
                  editorMode={editorMode}
                  onSubItemChange={handleSubItemChange}
                  onAddPair={handleAddPair}
                  onRemovePair={handleRemovePair}
                />
              </div>

              <div className="lg:col-span-5">
                <SectionEditorMatchingOptions
                  options={options}
                  title={col2Title}
                  editorMode={editorMode}
                  onOptionsChange={handleOptionsChange}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
