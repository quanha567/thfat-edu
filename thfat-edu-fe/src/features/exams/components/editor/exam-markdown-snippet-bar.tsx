"use client";

import { ImagePlus, Loader2 } from "lucide-react";

import { MATH_SNIPPETS } from "../../constants/exam-editor.constants";

export type TExamMarkdownSnippetBarProps = {
  onInsertSnippet: (snippet: string) => void;
  onRequestImage?: () => void;
  isUploadingImage?: boolean;
};

export function ExamMarkdownSnippetBar({
  onInsertSnippet,
  onRequestImage,
  isUploadingImage = false,
}: TExamMarkdownSnippetBarProps) {
  return (
    <div className="border-border/30 bg-muted/25 flex flex-wrap items-center justify-between gap-1.5 border-b px-2.5 py-1">
      <span className="text-muted-foreground text-xxs font-medium">Chèn tại con trỏ:</span>

      <div className="flex flex-wrap items-center gap-1">
        {MATH_SNIPPETS.map((item) => (
          <button
            key={item.label}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onInsertSnippet(item.snippet);
            }}
            className="bg-background text-muted-foreground hover:bg-primary/10 hover:text-primary text-xxs inline-flex h-5 cursor-pointer items-center justify-center rounded px-1.5 font-mono shadow-2xs transition-colors"
            title={item.title}
          >
            {item.label}
          </button>
        ))}

        {onRequestImage ? (
          <button
            type="button"
            disabled={isUploadingImage}
            onMouseDown={(e) => {
              e.preventDefault();
              onRequestImage();
            }}
            className="bg-background text-muted-foreground hover:bg-primary/10 hover:text-primary text-xxs inline-flex h-5 cursor-pointer items-center justify-center gap-1 rounded px-1.5 shadow-2xs transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            title="Chèn ảnh tại con trỏ (hoặc dán ảnh trực tiếp vào ô nhập)"
          >
            {isUploadingImage ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <ImagePlus className="size-3" />
            )}
            Ảnh
          </button>
        ) : null}
      </div>
    </div>
  );
}
