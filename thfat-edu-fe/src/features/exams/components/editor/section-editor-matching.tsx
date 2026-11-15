"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  return (
    <Card id={`question-card-2-${questionNumber - 1}`} className="border-border border shadow-xs">
      <CardContent className="space-y-4 p-4">
        <QuestionEditorCardHeader
          questionNumber={questionNumber}
          pointsLabel="Ghép hợp (1.5đ / tiểu mục)"
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
          label="Nội dung ngữ cảnh & Hướng dẫn ghép nối"
          value={question.contextContent}
          onChange={handleContextChange}
          placeholder="Nhập thông tin bảng hoặc danh sách thông tin cần ghép nối..."
          rows={3}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-foreground text-xs font-semibold">
              Các cặp ghép nối ({question.subItems.length} cặp):
            </Label>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleAddPair}
              className="h-7 gap-1 text-xs font-medium"
            >
              <Plus className="size-3" />
              Thêm vế ghép
            </Button>
          </div>

          <div className="space-y-2.5">
            {question.subItems.map((subItem, sIdx) => (
              <div
                key={subItem.id || sIdx}
                className="bg-muted/20 border-border flex flex-col items-start gap-2.5 rounded-lg border p-2.5 text-xs sm:flex-row sm:items-center"
              >
                <span className="bg-background text-primary border-border shrink-0 rounded-md border px-2.5 py-1 font-bold shadow-2xs">
                  {subItem.label || `${sIdx + 1}`}
                </span>

                <div className="w-full flex-1">
                  <Input
                    value={subItem.content}
                    onChange={(e) => handleSubItemChange(sIdx, { content: e.target.value })}
                    placeholder="Nội dung vế ghép (cột trái)..."
                    className="bg-background h-8 text-xs font-medium"
                  />
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <ArrowRight className="text-muted-foreground size-3.5" />
                  <span className="text-muted-foreground text-[11px] font-semibold">Ghép với:</span>

                  <Select
                    value={subItem.correctAnswer ?? "A"}
                    onValueChange={(val) => handleSubItemChange(sIdx, { correctAnswer: val })}
                  >
                    <SelectTrigger className="h-8 w-16 text-xs font-bold">
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
                            className="text-destructive hover:bg-destructive/10 h-7 w-7"
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
        </div>
      </CardContent>
    </Card>
  );
}
