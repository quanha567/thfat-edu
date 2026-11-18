"use client";

import { type TExamRoomSection } from "../types";
import { ExamQuestionViewer } from "./exam-question-viewer";

export type TExamQuestionListProps = {
  sections: TExamRoomSection[];
  answersMap: Record<string, { selectedAnswer: string | null; isFlagged: boolean }>;
  onAnswerChange: (subItemId: string, value: string) => void;
  onToggleFlag: (subItemId: string) => void;
};

function getNumberedSections(sections: TExamRoomSection[]) {
  let counter = 0;

  return sections.map((section) => ({
    ...section,
    numberedQuestions: section.questions.map((question) => {
      const currentQNum = counter + 1;
      const subCount = section.sectionType === "group_mcq" ? question.subItems?.length || 1 : 1;
      counter += subCount;

      return {
        question,
        questionNumber: currentQNum,
      };
    }),
  }));
}

export function ExamQuestionList({
  sections,
  answersMap,
  onAnswerChange,
  onToggleFlag,
}: TExamQuestionListProps) {
  const numberedSections = getNumberedSections(sections);

  return (
    <div className="space-y-6">
      {numberedSections.map((section) => (
        <div key={section.id} className="space-y-4">
          <div className="rounded-lg bg-neutral-200/80 px-4 py-2 text-sm font-bold text-neutral-800">
            {section.title}
          </div>

          {section.numberedQuestions.map(({ question, questionNumber }) => (
            <ExamQuestionViewer
              key={question.id}
              question={question}
              sectionType={section.sectionType}
              questionNumber={questionNumber}
              answersMap={answersMap}
              onAnswerChange={onAnswerChange}
              onToggleFlag={onToggleFlag}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
