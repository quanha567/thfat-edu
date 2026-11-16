"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < flatQuestions.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      const prev = flatQuestions[currentIndex - 1];
      onSelectQuestion(prev.sIdx, prev.qIdx);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      const next = flatQuestions[currentIndex + 1];
      onSelectQuestion(next.sIdx, next.qIdx);
    }
  };

  const handleJumpToEditor = () => {
    if (activeKey) {
      const [sIdx, qIdx] = activeKey.split("-").map(Number);
      onSelectQuestion(sIdx, qIdx);
    }
  };

  return (
    <Card className="border-border/70 shadow-xs h-[calc(100vh-9.5rem)] flex flex-col overflow-hidden bg-card rounded-2xl">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "index" | "preview")}
        className="flex flex-col flex-1 h-full min-h-0 gap-0 overflow-hidden"
      >
        <div className="border-border/60 bg-muted/20 border-b p-2 shrink-0">
          <TabsList className="grid w-full grid-cols-2 bg-muted/60 p-1 rounded-xl h-9">
            <TabsTrigger
              value="index"
              className="flex items-center gap-1.5 text-xs font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-xs transition-all"
            >
              <ListOrdered className="size-3.5" />
              <span>Mục lục</span>
              <span className="rounded-full bg-background/80 dark:bg-background/40 px-1.5 py-0.2 text-[10px] font-bold text-muted-foreground shadow-2xs">
                {totalQuestions}
              </span>
              {hasErrors && (
                <span className="bg-destructive text-destructive-foreground size-2 rounded-full animate-pulse ml-0.5" />
              )}
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="flex items-center gap-1.5 text-xs font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-xs transition-all"
            >
              <Eye className="size-3.5" />
              <span>Xem trước</span>
              {activeQuestionNumber ? (
                <Badge
                  variant="secondary"
                  className="h-4.5 px-1.5 text-[10px] font-bold bg-primary/10 text-primary dark:bg-primary/20"
                >
                  Câu {activeQuestionNumber}
                </Badge>
              ) : null}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="index" className="flex flex-col flex-1 min-h-0 overflow-hidden m-0 outline-none">
          <ExamEditorSidebarIndexTab
            sections={sections}
            errorQuestionKeys={errorQuestionKeys}
            totalQuestions={totalQuestions}
            activeKey={activeKey}
            activeQuestionNumber={activeQuestionNumber}
            onSelectQuestion={onSelectQuestion}
            onExpandAll={onExpandAll}
            onCollapseAll={onCollapseAll}
            onSwitchToPreview={() => setActiveTab("preview")}
          />
        </TabsContent>

        <TabsContent value="preview" className="flex flex-col flex-1 min-h-0 overflow-hidden m-0 outline-none">
          <ExamEditorSidebarPreviewTab
            activeQuestion={activeQuestion}
            activeSectionTitle={activeSectionTitle}
            activeSectionType={activeSectionType}
            activeQuestionNumber={activeQuestionNumber}
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
    </Card>
  );
}
