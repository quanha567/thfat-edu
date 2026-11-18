"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, ListOrdered } from "lucide-react";
import { useState } from "react";

import { type TQuizQuestion, type TQuizSection, type TSectionType } from "../../types";
import { ExamEditorSidebarIndexTab } from "./exam-editor-sidebar-index-tab";
import { ExamEditorSidebarPreviewTab } from "./exam-editor-sidebar-preview-tab";

export type TExamEditorSidebarProps = {
  sections: TQuizSection[];
  errorQuestionKeys: Set<string>;
  totalQuestions: number;
  activeKey: string | null;
  onSelectQuestion: (sectionIdx: number, questionIdx: number) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  activeQuestion: TQuizQuestion | null;
  activeSectionTitle?: string;
  activeSectionType?: TSectionType;
  activeQuestionNumber?: number;
};

export function ExamEditorSidebar({
  sections,
  errorQuestionKeys,
  totalQuestions,
  activeKey,
  onSelectQuestion,
  onExpandAll,
  onCollapseAll,
  activeQuestion,
  activeSectionTitle,
  activeSectionType,
  activeQuestionNumber = 1,
}: TExamEditorSidebarProps) {
  const [activeTab, setActiveTab] = useState<"index" | "preview">("index");
  const hasErrors = errorQuestionKeys.size > 0;

  const flatQuestions = sections.flatMap((sec, sIdx) =>
    sec.questions.map((_, qIdx) => ({
      sIdx,
      qIdx,
      key: `${sIdx}-${qIdx}`,
    })),
  );

  const currentIndex = flatQuestions.findIndex((item) => item.key === activeKey);
  const resolvedQuestionNumber = currentIndex >= 0 ? currentIndex + 1 : activeQuestionNumber;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < flatQuestions.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      const prev = flatQuestions[currentIndex - 1];
      if (prev) {
        onSelectQuestion(prev.sIdx, prev.qIdx);
      }
    }
  };

  const handleNext = () => {
    if (hasNext) {
      const next = flatQuestions[currentIndex + 1];
      if (next) {
        onSelectQuestion(next.sIdx, next.qIdx);
      }
    }
  };

  const handleJumpToEditor = () => {
    if (activeKey) {
      const [sIdx, qIdx] = activeKey.split("-").map(Number);
      if (typeof sIdx === "number" && typeof qIdx === "number") {
        onSelectQuestion(sIdx, qIdx);
      }
    }
  };

  return (
    <div className="border-border/70 bg-card flex h-[calc(100vh-9.5rem)] flex-col overflow-hidden rounded-xl border shadow-xs">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "index" | "preview")}
        className="flex h-full min-h-0 flex-1 flex-col gap-0 overflow-hidden"
      >
        <div className="border-border/40 bg-muted/15 shrink-0 border-b p-1.5">
          <TabsList className="bg-muted/60 grid h-8 w-full grid-cols-2 rounded-lg p-0.5">
            <TabsTrigger
              value="index"
              className="data-[state=active]:bg-background data-[state=active]:text-primary flex cursor-pointer items-center justify-center gap-1.5 rounded-md text-xs font-semibold transition-all data-[state=active]:shadow-2xs"
            >
              <ListOrdered className="size-3.5" />
              <span>Mục lục</span>
              <span className="bg-muted py-0.2 text-muted-foreground rounded px-1.5 text-[10px] font-bold">
                {totalQuestions}
              </span>
              {hasErrors && (
                <span className="bg-destructive ml-0.5 size-1.5 animate-pulse rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-background data-[state=active]:text-primary flex cursor-pointer items-center justify-center gap-1.5 rounded-md text-xs font-semibold transition-all data-[state=active]:shadow-2xs"
            >
              <Eye className="size-3.5" />
              <span>Xem trước</span>
              {resolvedQuestionNumber ? (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary h-4 border-0 px-1.5 text-[10px] font-bold"
                >
                  Câu {resolvedQuestionNumber}
                </Badge>
              ) : null}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="index"
          className="m-0 flex min-h-0 flex-1 flex-col overflow-hidden outline-none"
        >
          <ExamEditorSidebarIndexTab
            sections={sections}
            errorQuestionKeys={errorQuestionKeys}
            totalQuestions={totalQuestions}
            activeKey={activeKey}
            activeQuestionNumber={resolvedQuestionNumber}
            onSelectQuestion={onSelectQuestion}
            onExpandAll={onExpandAll}
            onCollapseAll={onCollapseAll}
            onSwitchToPreview={() => setActiveTab("preview")}
          />
        </TabsContent>

        <TabsContent
          value="preview"
          className="m-0 flex min-h-0 flex-1 flex-col overflow-hidden outline-none"
        >
          <ExamEditorSidebarPreviewTab
            activeQuestion={activeQuestion}
            activeSectionTitle={activeSectionTitle}
            activeSectionType={activeSectionType}
            activeQuestionNumber={resolvedQuestionNumber}
            currentIndex={currentIndex}
            totalQuestions={flatQuestions.length}
            hasPrev={hasPrev}
            hasNext={hasNext}
            onPrev={handlePrev}
            onNext={handleNext}
            onJumpToEditor={handleJumpToEditor}
            onSwitchToIndex={() => setActiveTab("index")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
