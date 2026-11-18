"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Eye, PenLine, Sparkles } from "lucide-react";
import { useRef, useState } from "react";

import { ArticleMarkdownRenderer } from "../article-markdown-renderer";
import { MarkdownToolbar } from "./markdown-toolbar";

export type TMarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  isStreaming?: boolean;
};

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Soạn thảo nội dung bài viết bằng Markdown (hỗ trợ công thức Toán/Hóa KaTeX)...",
  className,
  readOnly = false,
  isStreaming = false,
}: TMarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const handleInsert = (prefix: string, suffix = "", defaultText = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end) || defaultText;
    const replacement = `${prefix}${selected}${suffix}`;
    const nextValue = value.slice(0, start) + replacement + value.slice(end);

    onChange(nextValue);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      const nextPos = start + prefix.length + selected.length;
      textarea.setSelectionRange(nextPos, nextPos);
    }, 0);
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card shadow-2xs overflow-hidden transition-all",
        isStreaming && "ring-2 ring-primary/40 border-primary/50",
        className,
      )}
    >
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "write" | "preview")}
        className="w-full"
      >
        <div className="border-border bg-muted/20 flex flex-wrap items-center justify-between border-b px-3 py-1.5">
          <TabsList className="bg-muted/60 h-8 p-0.5">
            <TabsTrigger value="write" className="h-7 gap-1.5 px-3 text-xs">
              <PenLine className="size-3.5" />
              <span>Soạn thảo</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="h-7 gap-1.5 px-3 text-xs">
              <Eye className="size-3.5" />
              <span>Xem trước</span>
            </TabsTrigger>
          </TabsList>

          {isStreaming && (
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary animate-pulse gap-1.5 text-xs font-medium"
            >
              <Sparkles className="text-primary size-3 animate-spin" />
              <span>AI đang gõ bài viết...</span>
            </Badge>
          )}
        </div>

        <TabsContent value="write" className="m-0 p-0 focus-visible:outline-none">
          <MarkdownToolbar onInsert={handleInsert} disabled={readOnly || isStreaming} />

          <textarea
            ref={textareaRef}
            value={value}
            disabled={readOnly || isStreaming}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={18}
            className={cn(
              "w-full resize-y bg-background p-4 sm:p-6 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-85",
              isStreaming && "cursor-wait bg-muted/10",
            )}
          />
        </TabsContent>

        <TabsContent
          value="preview"
          className="m-0 min-h-[420px] p-4 focus-visible:outline-none sm:p-6"
        >
          {value.trim() ? (
            <ArticleMarkdownRenderer content={value} />
          ) : (
            <div className="text-muted-foreground flex h-64 flex-col items-center justify-center text-sm">
              Chưa có nội dung để xem trước.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
