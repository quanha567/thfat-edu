"use client";

import { ChemRenderer, cleanMathBackslashes } from "@/components/chemistry/chem-renderer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Check, Pencil } from "lucide-react";
import { type FocusEvent, useRef, useState } from "react";

import { ExamMarkdownSnippetBar } from "./exam-markdown-snippet-bar";

export type TExamMarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  error?: string;
  className?: string;
  editorMode?: "edit" | "preview";
  clickToEdit?: boolean;
  compact?: boolean;
};

export function ExamMarkdownEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  rows = 3,
  label,
  error,
  className = "",
  editorMode = "edit",
  clickToEdit = true,
  compact = false,
}: TExamMarkdownEditorProps) {
  const [isEditing, setIsEditing] = useState(!value.trim());
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInsertSnippet = (snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value ? `${value} ${snippet}` : snippet);

      return;
    }

    const start = textarea.selectionStart ?? value.length;
    const end = textarea.selectionEnd ?? value.length;
    const nextValue = value.slice(0, start) + snippet + value.slice(end);
    onChange(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const nextPos = start + snippet.length;
      textarea.setSelectionRange(nextPos, nextPos);
    });
  };

  const handleStartEditing = () => {
    const cleaned = cleanMathBackslashes(value);
    if (cleaned !== value) {
      onChange(cleaned);
    }
    setIsEditing(true);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!clickToEdit || !value.trim()) return;
    if (!containerRef.current?.contains(e.relatedTarget as Node | null)) {
      const cleaned = cleanMathBackslashes(value);
      if (cleaned !== value) {
        onChange(cleaned);
      }
      setIsEditing(false);
    }
  };

  if (editorMode === "preview") {
    return (
      <div className={`space-y-1 ${className}`}>
        {label ? (
          <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
            {label}
          </span>
        ) : null}
        <div className="text-foreground text-xs leading-relaxed sm:text-sm">
          {value.trim() ? (
            <ChemRenderer content={value} />
          ) : (
            <p className="text-muted-foreground text-xs italic">
              {placeholder || "Chưa có nội dung..."}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (compact) {
    if (clickToEdit && !isEditing && Boolean(value.trim())) {
      return (
        <button
          type="button"
          onClick={handleStartEditing}
          className={cn(
            "group/compact flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1 text-left text-xs sm:text-sm transition-colors hover:bg-muted/40",
            className,
          )}
          title="Nhấp để chỉnh sửa"
        >
          <div className="text-foreground leading-relaxed">
            <ChemRenderer content={value} />
          </div>
          <Pencil className="text-muted-foreground/50 group-hover/compact:text-primary ml-2 size-3 shrink-0 opacity-0 transition-opacity group-hover/compact:opacity-100" />
        </button>
      );
    }

    return (
      <div ref={containerRef} onBlur={handleBlur} className={cn("space-y-1", className)}>
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const cleaned = cleanMathBackslashes(value);
              if (cleaned !== value) {
                onChange(cleaned);
              }
              setIsEditing(false);
            }
          }}
          placeholder={placeholder}
          rows={1}
          className="border-border/60 bg-muted/20 text-foreground placeholder:text-muted-foreground/50 hover:bg-muted/30 focus-visible:border-primary/60 focus-visible:bg-background focus-visible:ring-primary/20 field-sizing-content min-h-[34px] w-full resize-none rounded-md border px-2 py-1 text-xs font-medium transition-colors focus-visible:ring-1"
        />
        {error ? <p className="text-destructive text-[11px] font-medium">{error}</p> : null}
      </div>
    );
  }

  const showRenderedView = clickToEdit && !isEditing && Boolean(value.trim());

  return (
    <div
      ref={containerRef}
      onBlur={handleBlur}
      className={cn(
        "group/editor rounded-lg border border-border/50 bg-muted/15 transition-all",
        isEditing
          ? "border-primary/60 bg-background shadow-xs ring-2 ring-primary/15"
          : "hover:border-primary/40 hover:bg-muted/25",
        className,
      )}
    >
      {(label || showRenderedView) && (
        <div className="border-border/35 flex items-center justify-between border-b px-3 py-1.5 text-xs">
          {label ? (
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              {label}
            </span>
          ) : (
            <div />
          )}

          {showRenderedView ? (
            <button
              type="button"
              onClick={handleStartEditing}
              className="text-primary hover:text-primary/80 flex cursor-pointer items-center gap-1 text-[11px] font-semibold transition-colors"
            >
              <Pencil className="size-3" />
              <span>Nhấp để sửa</span>
            </button>
          ) : null}
        </div>
      )}

      {showRenderedView ? (
        <button
          type="button"
          onClick={handleStartEditing}
          className="text-foreground w-full cursor-pointer p-3 text-left text-xs leading-relaxed sm:text-sm"
          title="Nhấp để chỉnh sửa nội dung"
        >
          <ChemRenderer content={value} />
        </button>
      ) : (
        <div>
          <ExamMarkdownSnippetBar onInsertSnippet={handleInsertSnippet} />

          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className={`placeholder:text-muted-foreground/60 field-sizing-content min-h-[64px] resize-none border-0 bg-transparent p-2.5 text-xs font-medium focus-visible:ring-0 sm:text-sm ${
              error ? "border-destructive focus-visible:ring-destructive" : ""
            }`}
          />

          {clickToEdit && value.trim() ? (
            <div className="border-border/30 bg-muted/15 flex items-center justify-end border-t px-2 py-1">
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => {
                  const cleaned = cleanMathBackslashes(value);
                  if (cleaned !== value) {
                    onChange(cleaned);
                  }
                  setIsEditing(false);
                }}
                className="text-muted-foreground hover:text-foreground h-6 gap-1 px-2 text-[11px] font-semibold"
              >
                <Check className="text-success-600 dark:text-success-400 size-3" />
                Xong (Xem trước)
              </Button>
            </div>
          ) : null}
        </div>
      )}

      {error ? <p className="text-destructive p-2 text-[11px] font-medium">{error}</p> : null}
    </div>
  );
}
