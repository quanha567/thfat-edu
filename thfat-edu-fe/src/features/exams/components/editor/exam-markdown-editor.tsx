"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Eye, PenLine } from "lucide-react";
import { useState } from "react";

import { MATH_SNIPPETS } from "../../constants/exam-editor.constants";

export type TExamMarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  error?: string;
  className?: string;
};

export function ExamMarkdownEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  rows = 3,
  label,
  error,
  className = "",
}: TExamMarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");

  const handleInsertSnippet = (snippet: string) => {
    const updated = value ? `${value} ${snippet}` : snippet;
    onChange(updated);
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <Tabs
        value={tab}
        onValueChange={(val) => setTab(val as "write" | "preview")}
        className="w-full"
      >
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          {label ? <Label className="text-xs font-semibold">{label}</Label> : <div />}

          <TabsList className="h-7 p-0.5">
            <TabsTrigger value="write" className="gap-1 px-2.5 py-0.5 text-xs font-medium">
              <PenLine className="size-3" />
              Soạn thảo
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-1 px-2.5 py-0.5 text-xs font-medium">
              <Eye className="size-3" />
              Xem trước
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="write" className="mt-1.5 space-y-1.5">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-muted-foreground text-[11px] font-medium">Chèn nhanh:</span>
            {MATH_SNIPPETS.map((item) => (
              <Button
                key={item.label}
                type="button"
                variant="outline"
                size="xs"
                className="h-5 px-1.5 font-mono text-[11px]"
                onClick={() => handleInsertSnippet(item.snippet)}
                title={item.title}
              >
                {item.label}
              </Button>
            ))}
          </div>

          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className={`font-sans text-xs sm:text-sm ${
              error ? "border-destructive focus-visible:ring-destructive" : ""
            }`}
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-1.5">
          <div
            className={`bg-muted/20 min-h-[72px] rounded-md border p-3 text-xs sm:text-sm ${
              error ? "border-destructive" : "border-border"
            }`}
          >
            {value.trim() ? (
              <ChemRenderer content={value} />
            ) : (
              <p className="text-muted-foreground text-xs italic">
                Chưa có nội dung để hiển thị xem trước...
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {error ? <p className="text-destructive text-[11px] font-medium">{error}</p> : null}
    </div>
  );
}
