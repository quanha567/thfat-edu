"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Trash2 } from "lucide-react";

import { formatMatchingOption, type TMatchingOption } from "../matching.types";
import { ExamMarkdownEditor } from "./exam-markdown-editor";

export type TSectionEditorMatchingOptionsProps = {
  options: TMatchingOption[];
  title?: string;
  editorMode?: "edit" | "preview";
  onOptionsChange: (updatedRawOptions: string[]) => void;
};

export function SectionEditorMatchingOptions({
  options,
  title = "Phương án đối chiếu (Cột 2 - Giá trị)",
  editorMode = "edit",
  onOptionsChange,
}: TSectionEditorMatchingOptionsProps) {
  const handleTextChange = (optIndex: number, newText: string) => {
    const updated = options.map((opt, idx) => {
      if (idx !== optIndex) return opt.raw;

      return formatMatchingOption(opt.letter, newText);
    });
    onOptionsChange(updated);
  };

  const handleAddOption = () => {
    const nextLetter = String.fromCharCode(65 + options.length);
    const updated = [...options.map((o) => o.raw), nextLetter];
    onOptionsChange(updated);
  };

  const handleRemoveOption = (optIndex: number) => {
    if (options.length <= 2) return;
    const remaining = options.filter((_, idx) => idx !== optIndex);
    const updated = remaining.map((opt, newIdx) => {
      const newLetter = String.fromCharCode(65 + newIdx);

      return formatMatchingOption(newLetter, opt.content);
    });
    onOptionsChange(updated);
  };

  return (
    <div className="border-border/60 bg-muted/10 space-y-2 rounded-lg border p-3">
      <div className="border-border/40 flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-1.5">
          <span className="bg-primary/20 text-primary text-xxs flex size-4 items-center justify-center rounded-full font-bold">
            B
          </span>
          <span className="text-foreground text-xs font-semibold">
            {title} ({options.length}):
          </span>
        </div>

        {editorMode === "edit" && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleAddOption}
            className="text-primary hover:bg-primary/10 h-6 gap-1 text-xs font-semibold"
          >
            <Plus className="size-3" />
            Thêm phương án
          </Button>
        )}
      </div>

      {editorMode === "preview" ? (
        <div className="space-y-1.5">
          {options.map((opt) => (
            <div
              key={opt.letter}
              className="border-border/40 bg-background/80 flex items-start gap-2.5 rounded-lg border p-2 sm:px-2.5"
            >
              <span className="bg-primary/10 text-primary border-primary/20 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold shadow-2xs">
                {opt.letter}
              </span>
              <div className="text-foreground mt-0.5 text-xs leading-relaxed sm:text-sm">
                {opt.content.trim() ? (
                  <ChemRenderer content={opt.content} />
                ) : (
                  <span className="text-muted-foreground text-xs italic">
                    Chưa có nội dung phương án {opt.letter}...
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1.5">
          {options.map((opt, idx) => (
            <div
              key={opt.letter}
              className="border-border/50 bg-background/80 focus-within:border-primary/50 hover:border-border flex items-center gap-2 rounded-lg border p-1.5 transition-colors"
            >
              <span className="bg-primary/10 text-primary border-primary/20 flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold shadow-2xs">
                {opt.letter}
              </span>

              <div className="w-full min-w-0 flex-1">
                <ExamMarkdownEditor
                  value={opt.content}
                  onChange={(val) => handleTextChange(idx, val)}
                  placeholder={`Nội dung phương án ${opt.letter} (ví dụ: HCl)...`}
                  rows={1}
                  compact
                />
              </div>

              {options.length > 2 && (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleRemoveOption(idx)}
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive size-6 shrink-0"
                        aria-label={`Xóa phương án ${opt.letter}`}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Xóa phương án {opt.letter}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
