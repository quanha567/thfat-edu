"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

import { type TQuizSubItem } from "../../types";

export type TSectionEditorMcqItemProps = {
  subItem: TQuizSubItem;
  index: number;
  canRemove: boolean;
  editorMode?: "edit" | "preview";
  onRemove: () => void;
  onChange: (patch: Partial<TQuizSubItem>) => void;
};

const OPTION_KEYS = ["A", "B", "C", "D"] as const;

export function SectionEditorMcqItem({
  subItem,
  index,
  canRemove,
  editorMode = "edit",
  onRemove,
  onChange,
}: TSectionEditorMcqItemProps) {
  const options =
    subItem.options && subItem.options.length === 4 ? subItem.options : ["", "", "", ""];

  const handleOptionChange = (optIdx: number, val: string) => {
    const updatedOptions = [...options];
    updatedOptions[optIdx] = val;
    onChange({ options: updatedOptions });
  };

  if (editorMode === "preview") {
    return (
      <div className="space-y-2 py-2">
        <div className="flex items-start gap-2">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
            {subItem.label || `${index + 1}`}
          </span>
          <div className="text-foreground text-xs leading-relaxed sm:text-sm">
            {subItem.content.trim() ? (
              <ChemRenderer content={subItem.content} />
            ) : (
              <span className="text-muted-foreground text-xs italic">
                Chưa có nội dung câu hỏi...
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 pt-1 pl-7 sm:grid-cols-2">
          {OPTION_KEYS.map((optKey, optIdx) => {
            const isSelected = (subItem.correctAnswer ?? "").trim().toUpperCase() === optKey;
            const optContent = options[optIdx] ?? "";

            return (
              <div
                key={optKey}
                className={cn(
                  "flex items-start gap-2 rounded-lg p-2 text-xs transition-colors",
                  isSelected
                    ? "bg-primary/10 font-medium text-foreground ring-1 ring-primary/30"
                    : "bg-muted/20 text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-foreground">
            {subItem.label || `Ý ${index + 1}`}
          </span>
          <span className="text-muted-foreground text-xs font-normal">• 1.5 điểm</span>
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
                  className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive size-6"
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

      <textarea
        value={subItem.content}
        onChange={(e) => onChange({ content: e.target.value })}
        placeholder="Nhập nội dung câu hỏi con..."
        rows={1}
        className="field-sizing-content min-h-[34px] w-full resize-none rounded-md bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-border/50"
      />

      <div className="grid grid-cols-1 gap-2 pt-0.5 sm:grid-cols-2">
        {OPTION_KEYS.map((optKey, optIdx) => {
          const isSelected = (subItem.correctAnswer ?? "").trim().toUpperCase() === optKey;

          return (
            <div
              key={optKey}
              className={cn(
                "flex items-center gap-2 rounded-lg bg-background p-1.5 transition-all",
                isSelected
                  ? "ring-1 ring-primary/40 bg-primary/5"
                  : "hover:bg-muted/30 border border-border/40",
              )}
            >
              <button
                type="button"
                onClick={() => onChange({ correctAnswer: optKey })}
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary",
                )}
                title={`Chọn ${optKey} làm đáp án đúng`}
              >
                {optKey}
              </button>

              <input
                value={options[optIdx] ?? ""}
                onChange={(e) => handleOptionChange(optIdx, e.target.value)}
                placeholder={`Phương án ${optKey}...`}
                className="h-7 w-full border-0 bg-transparent px-1 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
