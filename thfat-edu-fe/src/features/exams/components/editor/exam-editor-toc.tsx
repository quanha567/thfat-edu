"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, ListOrdered } from "lucide-react";
import { useState } from "react";

import { type TQuizSection } from "../../types";

export type TExamEditorTocProps = {
  sections: TQuizSection[];
  errorQuestionKeys: Set<string>;
  totalQuestions: number;
};

export function ExamEditorToc({
  sections,
  errorQuestionKeys,
  totalQuestions,
}: TExamEditorTocProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleScrollToQuestion = (sectionIdx: number, questionIdx: number) => {
    const key = `${sectionIdx}-${questionIdx}`;
    setActiveKey(key);

    const el = document.getElementById(`question-card-${sectionIdx}-${questionIdx}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const errorCount = errorQuestionKeys.size;
  const validCount = Math.max(0, totalQuestions - errorCount);
  const percentComplete =
    totalQuestions > 0 ? Math.round((validCount / totalQuestions) * 100) : 100;
  const hasErrors = errorCount > 0;

  return (
    <Card className="border-border sticky top-20 max-h-[calc(100vh-6.5rem)] overflow-y-auto shadow-xs">
      <CardHeader className="border-border space-y-2 border-b p-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListOrdered className="text-primary size-4" />
            <CardTitle className="text-xs font-bold">Mục lục câu hỏi</CardTitle>
          </div>
          <Badge variant="outline" className="text-[10px] font-semibold">
            {totalQuestions} câu
          </Badge>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Tiến độ hợp lệ</span>
            <span className="font-mono font-semibold">{percentComplete}%</span>
          </div>
          <Progress value={percentComplete} className="h-1.5" />
        </div>

        {hasErrors ? (
          <div className="text-destructive flex items-center gap-1.5 pt-0.5 text-[11px] font-medium">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>Có {errorCount} câu cần kiểm tra</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 pt-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5 shrink-0" />
            <span>Tất cả câu hỏi đều hợp lệ</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3.5 p-3.5">
        {sections.map((section, sIdx) => (
          <div key={section.sectionType || sIdx} className="space-y-2">
            <div className="flex items-center justify-between gap-1 text-[11px]">
              <span className="text-foreground flex-1 truncate font-semibold" title={section.title}>
                {section.title}
              </span>
              <span className="text-muted-foreground shrink-0 text-[10px] font-medium">
                {section.questions.length} câu
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {section.questions.map((_, qIdx) => {
                const key = `${sIdx}-${qIdx}`;
                const isErr = errorQuestionKeys.has(key);
                const isActive = activeKey === key;

                let buttonClass =
                  "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary";

                if (isErr) {
                  buttonClass =
                    "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20";
                } else if (isActive) {
                  buttonClass =
                    "border-primary bg-primary text-primary-foreground font-bold shadow-xs";
                }

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleScrollToQuestion(sIdx, qIdx)}
                    className={`flex h-7 items-center justify-center rounded-md border text-xs font-semibold transition-all ${buttonClass}`}
                    title={
                      isErr
                        ? `Câu ${qIdx + 1}: Có thông tin còn trống hoặc chưa hoàn tất`
                        : `Câu ${qIdx + 1}`
                    }
                  >
                    {qIdx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
