"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

import { type TQuizSubItem } from "../../types";
import { ExamMarkdownEditor } from "./exam-markdown-editor";

export type TSectionEditorMcqItemProps = {
  id?: string;
  subItem: TQuizSubItem;
  index: number;
  questionNumber?: number;
  canRemove: boolean;
  editorMode?: "edit" | "preview";
  onRemove: () => void;
  onChange: (patch: Partial<TQuizSubItem>) => void;
};

const OPTION_KEYS = ["A", "B", "C", "D"] as const;

export function SectionEditorMcqItem({
  id,
  subItem,
  index,
  questionNumber,
  canRemove,
  editorMode = "edit",
  onRemove,
  onChange,
}: TSectionEditorMcqItemProps) {
  const options =
    subItem.options && subItem.options.length === 4 ? subItem.options : ["", "", "", ""];

  const handleOptionChange = (optIdx: number, val: string) => {
    const cleanedVal = val.replace(/^[A-D]\.\s*/i, "");
    const updatedOptions = [...options];
    updatedOptions[optIdx] = cleanedVal;
    onChange({ options: updatedOptions });
  };

  const displayLabel =
    subItem.label || (questionNumber ? `Câu ${questionNumber}` : `Câu ${index + 1}`);

  if (editorMode === "preview") {
    return (
      <div
        id={id}
        className="border-border/40 bg-muted/10 space-y-2 rounded-lg border p-2 sm:px-2.5"
      >
        <div className="flex items-start gap-2.5">
          <span className="bg-primary/10 text-primary border-primary/20 mt-0.5 inline-flex h-6 shrink-0 items-center justify-center rounded-md border px-2 font-mono text-xs font-bold shadow-2xs">
            {displayLabel}
          </span>
          <div className="text-foreground mt-0.5 min-w-0 flex-1 text-xs leading-relaxed sm:text-sm">
            {subItem.content.trim() ? (
              <ChemRenderer content={subItem.content} />
            ) : (
              <span className="text-muted-foreground text-xs italic">
                Chưa có nội dung câu hỏi...
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-1.5 pl-0 sm:grid-cols-2 sm:pl-8.5">
          {OPTION_KEYS.map((optKey, optIdx) => {
            const isSelected = (subItem.correctAnswer ?? "").trim().toUpperCase() === optKey;
            const optContent = options[optIdx] ?? "";

            return (
              <div
                key={optKey}
                className={cn(
                  "flex items-start gap-2 rounded-lg p-2 text-xs transition-colors border",
                  isSelected
                    ? "bg-success-500/15 border-success-500/30 text-success-800 dark:text-success-300 font-medium"
                    : "border-border/30 bg-muted/20 text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full text-xxs font-bold",
                    isSelected
                      ? "bg-success-600 text-white shadow-2xs"
                      : "bg-muted text-muted-foreground border border-border/40",
                  )}
                >
                  {optKey}
                </span>
                <div className="flex-1 leading-snug">
                  {optContent.trim() ? (
                    <ChemRenderer content={optContent} />
                  ) : (
                    <span className="text-muted-foreground/60 italic">Chưa nhập phương án...</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      id={id}
      className="group/item border-border/40 bg-muted/10 hover:border-border hover:bg-muted/20 space-y-2 rounded-lg border p-2 transition-all sm:px-2.5"
    >
      <div className="flex items-start gap-2.5">
        <span className="bg-primary/10 text-primary border-primary/20 mt-0.5 inline-flex h-6 shrink-0 items-center justify-center rounded-md border px-2 font-mono text-xs font-bold shadow-2xs">
          {displayLabel}
        </span>

        <div className="w-full min-w-0 flex-1">
          <ExamMarkdownEditor
            value={subItem.content}
            onChange={(val) => onChange({ content: val })}
            placeholder={`Nhập nội dung cho ${displayLabel}...`}
            rows={1}
            compact
          />
        </div>

        {canRemove && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={onRemove}
                  className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive mt-0.5 size-6 shrink-0"
                  aria-label="Xóa câu hỏi con"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Xóa câu hỏi con này</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="grid grid-cols-1 gap-1.5 pl-0 sm:grid-cols-2 sm:pl-8.5">
        {OPTION_KEYS.map((optKey, optIdx) => {
          const isSelected = (subItem.correctAnswer ?? "").trim().toUpperCase() === optKey;

          return (
            <div
              key={optKey}
              className={cn(
                "flex items-center gap-2 rounded-lg bg-background p-1.5 transition-all border",
                isSelected
                  ? "border-success-500/50 bg-success-500/10 ring-1 ring-success-500/30 text-success-950 dark:text-success-200"
                  : "border-border/50 hover:bg-muted/30 hover:border-border",
              )}
            >
              <button
                type="button"
                onClick={() => onChange({ correctAnswer: optKey })}
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer",
                  isSelected
                    ? "bg-success-600 text-white shadow-2xs"
                    : "bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary",
                )}
                title={`Chọn ${optKey} làm đáp án đúng`}
              >
                {optKey}
              </button>

              <div className="w-full min-w-0 flex-1">
                <ExamMarkdownEditor
                  value={options[optIdx] ?? ""}
                  onChange={(val) => handleOptionChange(optIdx, val)}
                  placeholder={`Phương án ${optKey}...`}
                  rows={1}
                  compact
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
