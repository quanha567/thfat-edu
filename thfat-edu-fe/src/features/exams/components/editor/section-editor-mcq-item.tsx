"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Trash2 } from "lucide-react";

import { type TQuizSubItem } from "../../types";

export type TSectionEditorMcqItemProps = {
  subItem: TQuizSubItem;
  index: number;
  canRemove: boolean;
  onRemove: () => void;
  onChange: (patch: Partial<TQuizSubItem>) => void;
};

const OPTION_KEYS = ["A", "B", "C", "D"] as const;

export function SectionEditorMcqItem({
  subItem,
  index,
  canRemove,
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

  return (
    <div className="bg-muted/25 border-border space-y-2.5 rounded-lg border p-3 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-bold">
            {subItem.label || `Ý ${index + 1}`}
          </span>
          <span className="text-muted-foreground text-[10px]">(1.5 điểm)</span>
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
                  className="text-destructive hover:bg-destructive/10 h-6 w-6"
                  aria-label="Xóa câu hỏi con"
                >
                  <Trash2 className="size-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Xóa câu hỏi con này</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <Input
        value={subItem.content}
        onChange={(e) => onChange({ content: e.target.value })}
        placeholder="Nhập nội dung câu hỏi con..."
        className="bg-background h-8 text-xs font-medium"
      />

      <div className="grid grid-cols-1 gap-2 pt-0.5 sm:grid-cols-2">
        {OPTION_KEYS.map((optKey, optIdx) => {
          const isSelected = (subItem.correctAnswer ?? "").trim().toUpperCase() === optKey;

          return (
            <div
              key={optKey}
              className={`flex items-center gap-2 rounded-md border p-1.5 transition-colors ${
                isSelected
                  ? "border-primary/50 bg-primary/10 ring-primary/20 ring-1"
                  : "border-border bg-background hover:bg-muted/40"
              }`}
            >
              <button
                type="button"
                onClick={() => onChange({ correctAnswer: optKey })}
                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary"
                }`}
                title={`Chọn ${optKey} làm đáp án đúng`}
              >
                {optKey}
              </button>

              <Input
                value={options[optIdx] ?? ""}
                onChange={(e) => handleOptionChange(optIdx, e.target.value)}
                placeholder={`Phương án ${optKey}...`}
                className="h-7 border-0 bg-transparent px-1 text-xs shadow-none focus-visible:ring-0"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
