"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { Textarea } from "@/components/ui/textarea";

import { MATH_SNIPPETS } from "../../constants/exam-editor.constants";

export type TExamMarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  error?: string;
  className?: string;
  editorMode?: "edit" | "preview";
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
}: TExamMarkdownEditorProps) {
  const handleInsertSnippet = (snippet: string) => {
    const updated = value ? `${value} ${snippet}` : snippet;
    onChange(updated);
  };

  if (editorMode === "preview") {
    return (
      <div className={`space-y-1.5 ${className}`}>
        {label ? (
          <span className="text-muted-foreground text-xs font-semibold">{label}</span>
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

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        {label ? <span className="text-foreground text-xs font-semibold">{label}</span> : <div />}

        <div className="flex flex-wrap items-center gap-1">
          <span className="text-muted-foreground text-[11px] font-medium">Chèn nhanh:</span>
          {MATH_SNIPPETS.map((item) => (
            <button
              key={item.label}
              type="button"
              className="inline-flex h-5 items-center justify-center rounded bg-muted/60 px-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => handleInsertSnippet(item.snippet)}
              title={item.title}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`field-sizing-content min-h-[72px] resize-none rounded-lg bg-muted/15 p-2.5 text-xs sm:text-sm font-medium transition-colors placeholder:text-muted-foreground/60 focus-visible:bg-background border border-border/40 focus-visible:border-primary/50 ${
          error ? "border-destructive focus-visible:ring-destructive" : ""
        }`}
      />

      {error ? <p className="text-destructive text-[11px] font-medium">{error}</p> : null}
    </div>
  );
}
