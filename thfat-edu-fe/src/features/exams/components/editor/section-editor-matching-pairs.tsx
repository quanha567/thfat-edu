"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowRight, Plus, Trash2 } from "lucide-react";

import { type TQuizSubItem } from "../../types";
import { type TMatchingOption } from "../matching.types";
import { ExamMarkdownEditor } from "./exam-markdown-editor";

export type TSectionEditorMatchingPairsProps = {
  subItems: TQuizSubItem[];
  options: TMatchingOption[];
  title?: string;
  editorMode?: "edit" | "preview";
  onSubItemChange: (index: number, patch: Partial<TQuizSubItem>) => void;
  onAddPair: () => void;
  onRemovePair: (index: number) => void;
};

export function SectionEditorMatchingPairs({
  subItems,
  options,
  title = "Các vế ghép (Cột 1 - Yêu cầu)",
  editorMode = "edit",
  onSubItemChange,
  onAddPair,
  onRemovePair,
}: TSectionEditorMatchingPairsProps) {
  return (
    <div className="border-border/60 bg-muted/10 space-y-2 rounded-lg border p-3">
      <div className="border-border/40 flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-1.5">
          <span className="bg-primary/20 text-primary text-xxs flex size-4 items-center justify-center rounded-full font-bold">
            A
          </span>
          <span className="text-foreground text-xs font-semibold">
            {title} ({subItems.length}):
          </span>
        </div>

        {editorMode === "edit" && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onAddPair}
            className="text-primary hover:bg-primary/10 h-6 gap-1 text-xs font-semibold"
          >
            <Plus className="size-3" />
            Thêm vế ghép
          </Button>
        )}
      </div>

      {editorMode === "preview" ? (
        <div className="space-y-1.5">
          {subItems.map((subItem, sIdx) => {
            const matchedOption = options.find((opt) => opt.letter === subItem.correctAnswer);

            return (
              <div
                key={subItem.id || sIdx}
                className="border-border/40 bg-background/80 flex items-start justify-between gap-3 rounded-lg border p-2 sm:px-2.5"
              >
                <div className="flex min-w-0 flex-1 items-start gap-2.5">
                  <span className="bg-primary/10 text-primary border-primary/20 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold shadow-2xs">
                    {subItem.label || sIdx + 1}
                  </span>
                  <div className="text-foreground mt-0.5 text-xs leading-relaxed sm:text-sm">
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
                  <ArrowRight className="text-muted-foreground size-3.5" />
                  <Badge
                    variant="outline"
                    className="border-success-500/30 bg-success-500/10 text-success-700 dark:text-success-400 px-2 py-0.5 font-mono font-bold"
                  >
                    {matchedOption ? (
                      <span title={matchedOption.content} className="flex items-center gap-1">
                        <span>{matchedOption.letter}</span>
                        {matchedOption.content.trim() ? (
                          <span className="flex items-center gap-0.5 font-normal">
                            (
                            <ChemRenderer
                              content={matchedOption.content}
                              className="inline text-xs [&>div]:inline [&>p]:m-0 [&>p]:inline"
                            />
                            )
                          </span>
                        ) : null}
                      </span>
                    ) : (
                      subItem.correctAnswer || "Chưa ghép"
                    )}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-1.5">
          {subItems.map((subItem, sIdx) => (
            <div
              key={subItem.id || sIdx}
              className="border-border/40 bg-background/80 hover:border-border hover:bg-muted/10 flex items-start gap-2.5 rounded-lg border p-1.5 transition-all sm:px-2.5"
            >
              <span className="bg-primary/10 text-primary border-primary/20 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold shadow-2xs">
                {subItem.label || sIdx + 1}
              </span>

              <div className="w-full min-w-0 flex-1">
                <ExamMarkdownEditor
                  value={subItem.content}
                  onChange={(val) => onSubItemChange(sIdx, { content: val })}
                  placeholder={`Nội dung vế ghép ${sIdx + 1}...`}
                  rows={1}
                  compact
                />
              </div>

              <div className="flex shrink-0 items-center gap-1 pt-0.5">
                <ArrowRight className="text-muted-foreground size-3" />
                <span className="text-muted-foreground text-xs font-normal whitespace-nowrap">
                  Ghép:
                </span>

                <Select
                  value={subItem.correctAnswer ?? ""}
                  onValueChange={(val) => onSubItemChange(sIdx, { correctAnswer: val })}
                >
                  <SelectTrigger className="bg-background border-border/60 h-7 min-w-16 px-2 text-xs font-bold">
                    <SelectValue placeholder="Chọn" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((opt) => (
                      <SelectItem key={opt.letter} value={opt.letter} className="text-xs">
                        <span className="text-primary mr-1.5 shrink-0 font-bold">
                          {opt.letter}.
                        </span>
                        <div className="max-w-[200px] truncate leading-normal">
                          {opt.content.trim() ? (
                            <ChemRenderer
                              content={opt.content}
                              className="inline text-xs [&>div]:inline [&>p]:m-0 [&>p]:inline"
                            />
                          ) : (
                            `Phương án ${opt.letter}`
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {subItems.length > 1 && (
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => onRemovePair(sIdx)}
                          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive size-6"
                          aria-label="Xóa vế ghép này"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Xóa vế ghép này</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
