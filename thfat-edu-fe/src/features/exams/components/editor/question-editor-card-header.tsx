"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Copy,
  ImageIcon,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { QuestionDeleteDialog } from "./question-delete-dialog";

export type TQuestionEditorCardHeaderProps = {
  questionNumber: number;
  pointsLabel?: string;
  imageUrl?: string | null;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isCollapsed?: boolean;
  isSolving?: boolean;
  onToggleCollapse?: () => void;
  onAutoSolve?: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onImageChange: (url: string | null) => void;
};

export function QuestionEditorCardHeader({
  questionNumber,
  pointsLabel: _pointsLabel,
  imageUrl,
  canMoveUp,
  canMoveDown,
  isCollapsed,
  isSolving = false,
  onToggleCollapse,
  onAutoSolve,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onImageChange,
}: TQuestionEditorCardHeaderProps) {
  const [showImageInput, setShowImageInput] = useState(Boolean(imageUrl));

  return (
    <TooltipProvider delayDuration={200}>
      <div className={`space-y-2 ${isCollapsed ? "" : "border-b border-border/30 pb-2"}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {onToggleCollapse && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={onToggleCollapse}
                className="text-muted-foreground hover:text-foreground"
                aria-label={isCollapsed ? "Mở rộng câu hỏi" : "Thu gọn câu hỏi"}
              >
                {isCollapsed ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
              </Button>
            )}

            <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-bold">
              Câu {questionNumber}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            {onAutoSolve && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={onAutoSolve}
                    disabled={isSolving}
                    className="text-primary hover:bg-primary/10 hover:text-primary h-7 px-2 text-xs font-semibold"
                  >
                    {isSolving ? (
                      <Loader2 className="mr-1 size-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="mr-1 size-3.5" />
                    )}
                    {isSolving ? "Đang giải..." : "AI Giải câu này"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Tự động suy luận và điền đáp án bằng AI</TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => setShowImageInput((prev) => !prev)}
                  className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                >
                  <ImageIcon className="mr-1 size-3.5" />
                  {imageUrl ? "Sửa ảnh" : "Thêm ảnh"}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Đính kèm hoặc sửa ảnh minh họa</TooltipContent>
            </Tooltip>

            <div className="mx-0.5 h-3.5 w-px bg-border/60" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={onMoveUp}
                  disabled={!canMoveUp}
                  aria-label="Di chuyển lên"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowUp className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Di chuyển lên</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={onMoveDown}
                  disabled={!canMoveDown}
                  aria-label="Di chuyển xuống"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowDown className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Di chuyển xuống</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={onDuplicate}
                  aria-label="Nhân bản câu hỏi"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Copy className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Nhân bản câu hỏi</TooltipContent>
            </Tooltip>

            <QuestionDeleteDialog questionNumber={questionNumber} onDelete={onDelete} />
          </div>
        </div>

        {showImageInput && (
          <div className="bg-muted/30 border-border flex items-center gap-2 rounded-md border p-2">
            <Input
              value={imageUrl ?? ""}
              onChange={(e) => onImageChange(e.target.value || null)}
              placeholder="Dán đường dẫn ảnh minh họa (URL)..."
              className="h-7 text-xs"
            />
            {imageUrl && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => onImageChange(null)}
                aria-label="Xóa ảnh"
              >
                <X className="size-3" />
              </Button>
            )}
          </div>
        )}

        {imageUrl && (
          <div className="border-border bg-background relative inline-block max-w-sm rounded border p-1 shadow-2xs">
            <Image
              src={imageUrl}
              alt={`Ảnh minh họa câu hỏi ${questionNumber}`}
              width={400}
              height={200}
              unoptimized
              className="max-h-48 w-auto rounded object-contain"
            />
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
