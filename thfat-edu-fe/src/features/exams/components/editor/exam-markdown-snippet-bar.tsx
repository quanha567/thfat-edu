"use client";

import { MATH_SNIPPETS } from "../../constants/exam-editor.constants";

export type TExamMarkdownSnippetBarProps = {
  onInsertSnippet: (snippet: string) => void;
};

export function ExamMarkdownSnippetBar({ onInsertSnippet }: TExamMarkdownSnippetBarProps) {
  return (
    <div className="border-border/30 bg-muted/25 flex flex-wrap items-center justify-between gap-1.5 border-b px-2.5 py-1">
      <span className="text-muted-foreground text-[11px] font-medium">Chèn tại con trỏ:</span>

      <div className="flex flex-wrap items-center gap-1">
        {MATH_SNIPPETS.map((item) => (
          <button
            key={item.label}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onInsertSnippet(item.snippet);
            }}
            className="bg-background text-muted-foreground hover:bg-primary/10 hover:text-primary inline-flex h-5 cursor-pointer items-center justify-center rounded px-1.5 font-mono text-[11px] shadow-2xs transition-colors"
            title={item.title}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
