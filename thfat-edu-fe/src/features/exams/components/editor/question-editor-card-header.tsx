"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowDown, ArrowUp, Copy, ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { QuestionDeleteDialog } from "./question-delete-dialog";

export type TQuestionEditorCardHeaderProps = {
  questionNumber: number;
  pointsLabel: string;
  imageUrl?: string | null;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onImageChange: (url: string | null) => void;
};

export function QuestionEditorCardHeader({
  questionNumber,
  pointsLabel,
  imageUrl,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onImageChange,
}: TQuestionEditorCardHeaderProps) {
  const [showImageInput, setShowImageInput] = useState(Boolean(imageUrl));

  return (
    <TooltipProvider delayDuration={200}>
      <div className="border-border space-y-2 border-b pb-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-2 py-0.5 text-xs font-bold">
              Câu {questionNumber}
            </Badge>
            <Badge variant="outline" className="text-muted-foreground text-[10px] font-medium">
              {pointsLabel}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
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

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={onMoveUp}
                  disabled={!canMoveUp}
                  aria-label="Di chuyển lên"
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
