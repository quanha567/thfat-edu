"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, CheckSquare2, Edit3, Layers, Plus } from "lucide-react";

import { VSAT_SECTION_CONFIG } from "../../constants/exam-editor.constants";
import { type TQuizQuestion, type TQuizSection, type TSectionType } from "../../types";
import { SectionEditorMatching } from "./section-editor-matching";
import { SectionEditorMcq } from "./section-editor-mcq";
import { SectionEditorShortAnswer } from "./section-editor-short-answer";
import { SectionEditorTrueFalse } from "./section-editor-true-false";

export type TExamEditorSectionCardProps = {
  section: TQuizSection;
  sectionIndex: number;
  startQuestionNumber?: number;
  collapsedKeys: Set<string>;
  solvingKey?: string | null;
  editorMode?: "edit" | "preview";
  onToggleCollapse: (key: string) => void;
  onFocusQuestion: (key: string) => void;
  onMoveQuestion: (sIdx: number, qIdx: number, direction: "up" | "down") => void;
  onDuplicateQuestion: (sIdx: number, qIdx: number) => void;
  onDeleteQuestion: (sIdx: number, qIdx: number) => void;
  onUpdateQuestion: (sIdx: number, qIdx: number, question: TQuizQuestion) => void;
  onAutoSolveQuestion?: (sIdx: number, qIdx: number) => void;
  onAddQuestion: (sIdx: number) => void;
};

const SECTION_ICONS: Record<TSectionType, typeof CheckSquare2> = {
  true_false: CheckSquare2,
  group_mcq: Layers,
  matching: ArrowLeftRight,
  short_answer: Edit3,
};

export function ExamEditorSectionCard({
  section,
  sectionIndex,
  startQuestionNumber = 1,
  collapsedKeys,
  solvingKey,
  editorMode = "edit",
  onToggleCollapse,
  onFocusQuestion,
  onMoveQuestion,
  onDuplicateQuestion,
  onDeleteQuestion,
  onUpdateQuestion,
  onAutoSolveQuestion,
  onAddQuestion,
}: TExamEditorSectionCardProps) {
  const config = VSAT_SECTION_CONFIG[section.sectionType];
  const SectionIcon = SECTION_ICONS[section.sectionType] || Layers;

  return (
    <section className="space-y-3.5">
      <div className="bg-card border-border flex flex-wrap items-center justify-between gap-2.5 rounded-lg border p-3.5 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
            <SectionIcon className="size-4" />
          </div>
          <div>
            <h2 className="text-foreground text-sm font-bold">{section.title}</h2>
            <p className="text-muted-foreground text-xs">{config?.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs font-semibold">
            {config?.pointsLabel}
          </Badge>
          <Badge variant="outline" className="text-xs font-medium">
            {section.sectionType === "group_mcq"
              ? `${section.questions.reduce((acc, q) => acc + (q.subItems?.length || 1), 0)} / ${config?.expectedQuestions ?? 6} câu (${section.questions.length} chùm)`
              : `${section.questions.length} / ${config?.expectedQuestions ?? 0} câu`}
          </Badge>
        </div>
      </div>

      <div className="space-y-3.5">
        {section.questions.map((question, qIdx) => {
          const itemKey = `${sectionIndex}-${qIdx}`;
          const isCollapsed = collapsedKeys.has(itemKey);
          const isSolving = solvingKey === itemKey;
          const currentQuestionNumber = startQuestionNumber + qIdx;
          const cardId = `question-card-${sectionIndex}-${qIdx}`;

          let runningSubOffset = 0;
          for (let i = 0; i < qIdx; i++) {
            runningSubOffset += section.questions[i]?.subItems?.length || 1;
          }
          const currentGroupStartNum = startQuestionNumber + runningSubOffset;
          const currentGroupEndNum = currentGroupStartNum + (question.subItems?.length || 1) - 1;

          const commonProps = {
            id: cardId,
            question,
            questionNumber: currentQuestionNumber,
            canMoveUp: qIdx > 0,
            canMoveDown: qIdx < section.questions.length - 1,
            isCollapsed,
            isSolving,
            editorMode,
            onToggleCollapse: () => onToggleCollapse(itemKey),
            onFocus: () => onFocusQuestion(itemKey),
            onAutoSolve: onAutoSolveQuestion
              ? () => onAutoSolveQuestion(sectionIndex, qIdx)
              : undefined,
            onMoveUp: () => onMoveQuestion(sectionIndex, qIdx, "up"),
            onMoveDown: () => onMoveQuestion(sectionIndex, qIdx, "down"),
            onDuplicate: () => onDuplicateQuestion(sectionIndex, qIdx),
            onDelete: () => onDeleteQuestion(sectionIndex, qIdx),
            onUpdateQuestion: (updated: TQuizQuestion) =>
              onUpdateQuestion(sectionIndex, qIdx, updated),
          };

          if (section.sectionType === "true_false") {
            return <SectionEditorTrueFalse key={itemKey} {...commonProps} />;
          }
          if (section.sectionType === "group_mcq") {
            return (
              <SectionEditorMcq
                key={itemKey}
                {...commonProps}
                groupRange={{ start: currentGroupStartNum, end: currentGroupEndNum }}
              />
            );
          }
          if (section.sectionType === "matching") {
            return <SectionEditorMatching key={itemKey} {...commonProps} />;
          }

          return <SectionEditorShortAnswer key={itemKey} {...commonProps} />;
        })}
      </div>

      <div className="pt-0.5">
        <Button
          type="button"
          variant="outline"
          onClick={() => onAddQuestion(sectionIndex)}
          className="border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 w-full border-dashed py-4 text-xs font-semibold transition-all"
        >
          <Plus className="mr-1.5 size-4" />
          Thêm câu hỏi mới vào {section.title}
        </Button>
      </div>
    </section>
  );
}
