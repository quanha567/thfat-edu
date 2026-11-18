"use client";

import { type TExamRoomSection } from "../types";
import { ExamQuestionViewer } from "./exam-question-viewer";

export type TExamQuestionListProps = {
  sections: TExamRoomSection[];
  answersMap: Record<string, { selectedAnswer: string | null; isFlagged: boolean }>;
  onAnswerChange: (subItemId: string, value: string) => void;
  onToggleFlag: (subItemId: string) => void;
};

export function ExamQuestionList({
  sections,
  answersMap,
  onAnswerChange,
  onToggleFlag,
}: TExamQuestionListProps) {
  let questionCounter = 0;

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.id} className="space-y-4">
          <div className="rounded-lg bg-neutral-200/80 px-4 py-2 text-sm font-bold text-neutral-800">
            {section.title}
          </div>

          {section.questions.map((question) => {
            const currentQNum = questionCounter + 1;
            const subCount =
              section.sectionType === "group_mcq" ? question.subItems?.length || 1 : 1;
            questionCounter += subCount;

            return (
              <ExamQuestionViewer
                key={question.id}
                question={question}
                sectionType={section.sectionType}
                questionNumber={currentQNum}
                answersMap={answersMap}
                onAnswerChange={onAnswerChange}
                onToggleFlag={onToggleFlag}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
