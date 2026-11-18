"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { useAutoSolveQuestion } from "../../hooks/use-auto-solve-question";
import { useExamEditorState } from "../../hooks/use-exam-editor-state";
import { type TQuizDetail } from "../../types";
import { ExamEditorHeader } from "./exam-editor-header";
import { ExamEditorOverviewCard } from "./exam-editor-overview-card";
import { ExamEditorSectionCard } from "./exam-editor-section-card";
import { ExamEditorSidebar } from "./exam-editor-sidebar";

export type TExamEditorContainerProps = {
  exam: TQuizDetail;
};

export function ExamEditorContainer({ exam }: TExamEditorContainerProps) {
  const router = useRouter();
  const [editorMode, setEditorMode] = useState<"edit" | "preview">("edit");
  const [activeKey, setActiveKey] = useState<string>("0-0");
  const [collapsedKeys, setCollapsedKeys] = useState<Set<string>>(new Set());

  const {
    state,
    errorKeys,
    isSaving,
    updateOverview,
    updateQuestion,
    addQuestion,
    moveQuestion,
    duplicateQuestion,
    deleteQuestion,
    handleSave,
  } = useExamEditorState(exam);

  const { solvingKey, handleAutoSolveQuestion } = useAutoSolveQuestion(
    state.sections,
    updateQuestion,
  );

  const totalQuestions = state.sections.reduce((acc, s) => acc + s.questions.length, 0);

  const [activeSIdx, activeQIdx] = activeKey.split("-").map(Number);
  const activeSection = state.sections[activeSIdx];
  const activeQuestion = activeSection?.questions[activeQIdx] ?? null;

  const sectionOffsets = useMemo(() => {
    const offsets: number[] = [];
    let running = 0;

    for (const sec of state.sections) {
      offsets.push(running);
      if (sec.sectionType === "group_mcq") {
        const totalSubs = sec.questions.reduce((acc, q) => acc + (q.subItems?.length || 1), 0);
        running += Math.max(sec.questions.length, totalSubs);
      } else {
        running += sec.questions.length;
      }
    }

    return offsets;
  }, [state.sections]);

  const activeQuestionNumber =
    typeof activeSIdx === "number" &&
    !isNaN(activeSIdx) &&
    typeof activeQIdx === "number" &&
    !isNaN(activeQIdx)
      ? (sectionOffsets[activeSIdx] ?? 0) + activeQIdx + 1
      : 1;

  const handleToggleCollapse = (key: string) => {
    setCollapsedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  };

  const handleCollapseAll = () => {
    const allKeys = new Set<string>();
    state.sections.forEach((sec, sIdx) => {
      sec.questions.forEach((_, qIdx) => {
        allKeys.add(`${sIdx}-${qIdx}`);
      });
    });
    setCollapsedKeys(allKeys);
  };

  const handleExpandAll = () => {
    setCollapsedKeys(new Set());
  };

  const handleSelectQuestion = (sIdx: number, qIdx: number) => {
    const key = `${sIdx}-${qIdx}`;
    setActiveKey(key);
    setCollapsedKeys((prev) => {
      if (prev.has(key)) {
        const next = new Set(prev);
        next.delete(key);

        return next;
      }

      return prev;
    });

    const el = document.getElementById(`question-card-${sIdx}-${qIdx}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="bg-muted/10 min-h-full w-full pb-24">
      <ExamEditorHeader
        title={state.title}
        isDirty={state.isDirty}
        isSaving={isSaving}
        examId={exam.id}
        editorMode={editorMode}
        onToggleEditorMode={setEditorMode}
        onSave={handleSave}
        onBack={() => router.push("/admin/exams")}
      />

      <div className="mx-auto w-full max-w-[1720px] px-3 py-5 sm:px-4 md:px-6 xl:px-8">
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
          <div className="space-y-5 xl:col-span-8 2xl:col-span-8">
            <ExamEditorOverviewCard
              title={state.title}
              description={state.description}
              durationMinutes={state.durationMinutes}
              totalPoints={state.totalPoints}
              status={state.status}
              pdfUrl={state.pdfUrl}
              onChange={updateOverview}
            />

            {state.sections.map((section, sIdx) => (
              <ExamEditorSectionCard
                key={section.sectionType || sIdx}
                section={section}
                sectionIndex={sIdx}
                startQuestionNumber={(sectionOffsets[sIdx] ?? 0) + 1}
                collapsedKeys={collapsedKeys}
                solvingKey={solvingKey}
                editorMode={editorMode}
                onToggleCollapse={handleToggleCollapse}
                onFocusQuestion={(key) => setActiveKey(key)}
                onMoveQuestion={moveQuestion}
                onDuplicateQuestion={duplicateQuestion}
                onDeleteQuestion={deleteQuestion}
                onUpdateQuestion={updateQuestion}
                onAutoSolveQuestion={handleAutoSolveQuestion}
                onAddQuestion={addQuestion}
              />
            ))}
          </div>

          <aside className="sticky top-[4.5rem] hidden self-start xl:col-span-4 xl:block 2xl:col-span-4">
            <ExamEditorSidebar
              sections={state.sections}
              errorQuestionKeys={errorKeys}
              totalQuestions={totalQuestions}
              activeKey={activeKey}
              onSelectQuestion={handleSelectQuestion}
              onExpandAll={handleExpandAll}
              onCollapseAll={handleCollapseAll}
              activeQuestion={activeQuestion}
              activeSectionTitle={activeSection?.title}
              activeSectionType={activeSection?.sectionType}
              activeQuestionNumber={activeQuestionNumber}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
