"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, CheckSquare2, Edit3, Layers, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { VSAT_SECTION_CONFIG } from "../../constants/exam-editor.constants";
import { useExamEditorState } from "../../hooks/use-exam-editor-state";
import { type TQuizDetail, type TSectionType } from "../../types";
import { ExamEditorHeader } from "./exam-editor-header";
import { ExamEditorOverviewCard } from "./exam-editor-overview-card";
import { ExamEditorToc } from "./exam-editor-toc";
import { SectionEditorMatching } from "./section-editor-matching";
import { SectionEditorMcq } from "./section-editor-mcq";
import { SectionEditorShortAnswer } from "./section-editor-short-answer";
import { SectionEditorTrueFalse } from "./section-editor-true-false";

export type TExamEditorContainerProps = {
  exam: TQuizDetail;
};

const SECTION_ICONS: Record<TSectionType, typeof CheckSquare2> = {
  true_false: CheckSquare2,
  group_mcq: Layers,
  matching: ArrowLeftRight,
  short_answer: Edit3,
};

export function ExamEditorContainer({ exam }: TExamEditorContainerProps) {
  const router = useRouter();
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

  const totalQuestions = state.sections.reduce((acc, s) => acc + s.questions.length, 0);

  return (
    <div className="bg-muted/10 min-h-full pb-24">
      <ExamEditorHeader
        title={state.title}
        isDirty={state.isDirty}
        isSaving={isSaving}
        examId={exam.id}
        onSave={handleSave}
        onBack={() => router.push("/admin/exams")}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-3">
            <ExamEditorOverviewCard
              title={state.title}
              description={state.description}
              durationMinutes={state.durationMinutes}
              totalPoints={state.totalPoints}
              status={state.status}
              pdfUrl={state.pdfUrl}
              onChange={updateOverview}
            />

            {state.sections.map((section, sIdx) => {
              const config = VSAT_SECTION_CONFIG[section.sectionType];
              const SectionIcon = SECTION_ICONS[section.sectionType] || Layers;

              return (
                <section key={section.sectionType || sIdx} className="space-y-4">
                  <div className="bg-card border-border flex flex-wrap items-center justify-between gap-2.5 rounded-lg border p-4 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                        <SectionIcon className="size-4.5" />
                      </div>
                      <div>
                        <h2 className="text-foreground text-sm font-bold sm:text-base">
                          {section.title}
                        </h2>
                        <p className="text-muted-foreground text-xs">{config?.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs font-semibold">
                        {config?.pointsLabel}
                      </Badge>
                      <Badge variant="outline" className="text-xs font-medium">
                        {section.questions.length} / {config?.expectedQuestions ?? 0} câu
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {section.questions.map((question, qIdx) => {
                      const itemKey = question.id || `${sIdx}-${qIdx}`;
                      const commonProps = {
                        question,
                        questionNumber: qIdx + 1,
                        canMoveUp: qIdx > 0,
                        canMoveDown: qIdx < section.questions.length - 1,
                        onMoveUp: () => moveQuestion(sIdx, qIdx, "up"),
                        onMoveDown: () => moveQuestion(sIdx, qIdx, "down"),
                        onDuplicate: () => duplicateQuestion(sIdx, qIdx),
                        onDelete: () => deleteQuestion(sIdx, qIdx),
                        onUpdateQuestion: (updated: typeof question) =>
                          updateQuestion(sIdx, qIdx, updated),
                      };

                      if (section.sectionType === "true_false") {
                        return <SectionEditorTrueFalse key={itemKey} {...commonProps} />;
                      }
                      if (section.sectionType === "group_mcq") {
                        return <SectionEditorMcq key={itemKey} {...commonProps} />;
                      }
                      if (section.sectionType === "matching") {
                        return <SectionEditorMatching key={itemKey} {...commonProps} />;
                      }

                      return <SectionEditorShortAnswer key={itemKey} {...commonProps} />;
                    })}
                  </div>

                  <div className="pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addQuestion(sIdx)}
                      className="border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 w-full border-dashed py-5 text-xs font-semibold transition-all"
                    >
                      <Plus className="mr-1.5 size-4" />
                      Thêm câu hỏi mới vào {section.title}
                    </Button>
                  </div>
                </section>
              );
            })}
          </div>

          <aside className="hidden lg:col-span-1 lg:block">
            <ExamEditorToc
              sections={state.sections}
              errorQuestionKeys={errorKeys}
              totalQuestions={totalQuestions}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
