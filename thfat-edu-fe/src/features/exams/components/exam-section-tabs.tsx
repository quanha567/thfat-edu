"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useState } from "react";

import { SECTION_CONFIGS } from "../constants/exam.constants";
import { type TQuizQuestion, type TQuizSection, type TSectionType } from "../types";
import { QuestionCardGroupMcq } from "./question-card-group-mcq";
import { QuestionCardMatching } from "./question-card-matching";
import { QuestionCardShortAnswer } from "./question-card-short-answer";
import { QuestionCardTrueFalse } from "./question-card-true-false";

export type TExamSectionTabsProps = {
  sections: TQuizSection[];
  onChange: (updatedSections: TQuizSection[]) => void;
};

export function ExamSectionTabs({ sections, onChange }: TExamSectionTabsProps) {
  const [activeTab, setActiveTab] = useState<TSectionType>("true_false");

  const handleQuestionChange = (
    sectionType: TSectionType,
    questionIndex: number,
    updatedQuestion: TQuizQuestion,
  ) => {
    const updatedSections = sections.map((sec) => {
      if (sec.sectionType === sectionType) {
        const updatedQuestions = sec.questions.map((q, idx) => {
          if (idx === questionIndex) {
            return updatedQuestion;
          }

          return q;
        });

        return { ...sec, questions: updatedQuestions };
      }

      return sec;
    });

    onChange(updatedSections);
  };

  const handleAddQuestion = (sectionType: TSectionType) => {
    const targetSection = sections.find((s) => s.sectionType === sectionType);
    if (!targetSection) return;

    let newSubItems = [];
    if (sectionType === "true_false") {
      newSubItems = ["a", "b", "c", "d"].map((label, idx) => ({
        orderIndex: idx + 1,
        label,
        content: "",
        correctAnswer: "true",
        points: "1.50",
      }));
    } else if (sectionType === "group_mcq") {
      newSubItems = [1, 2, 3, 4].map((num) => ({
        orderIndex: num,
        label: String(num),
        content: "",
        options: ["", "", "", ""],
        correctAnswer: "A",
        points: "1.50",
      }));
    } else if (sectionType === "matching") {
      newSubItems = [1, 2, 3, 4].map((num) => ({
        orderIndex: num,
        label: String(num),
        content: "",
        correctAnswer: "",
        points: "1.50",
      }));
    } else {
      newSubItems = [
        {
          orderIndex: 1,
          label: "1",
          content: "",
          correctAnswer: "",
          acceptableAnswers: [],
          points: "6.00",
        },
      ];
    }

    const newQuestion: TQuizQuestion = {
      orderIndex: targetSection.questions.length + 1,
      contextContent: "",
      subItems: newSubItems,
    };

    const updatedSections = sections.map((sec) => {
      if (sec.sectionType === sectionType) {
        return { ...sec, questions: [...sec.questions, newQuestion] };
      }

      return sec;
    });

    onChange(updatedSections);
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={(val) => setActiveTab(val as TSectionType)}
      className="w-full space-y-4"
    >
      <TabsList className="grid h-auto grid-cols-2 gap-1.5 p-1.5 lg:grid-cols-4">
        {(["true_false", "group_mcq", "matching", "short_answer"] as const).map((sType) => {
          const config = SECTION_CONFIGS[sType];
          const section = sections.find((s) => s.sectionType === sType);
          const qCount = section?.questions.length ?? 0;

          return (
            <TabsTrigger
              key={sType}
              value={sType}
              className="data-[state=active]:bg-background flex flex-col items-center gap-1 px-3 py-2 text-xs data-[state=active]:shadow-xs"
            >
              <span className="font-semibold">{config.title.split(":")[1]?.trim()}</span>
              <div className="flex items-center gap-1.5">
                <Badge variant="secondary" className="h-4 px-1 py-0 text-[10px]">
                  {qCount} câu
                </Badge>
                <span className="text-muted-foreground text-[10px]">{config.totalRawPoints}đ</span>
              </div>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {(["true_false", "group_mcq", "matching", "short_answer"] as const).map((sType) => {
        const config = SECTION_CONFIGS[sType];
        const section = sections.find((s) => s.sectionType === sType) ?? {
          sectionType: sType,
          title: config.title,
          orderIndex: 0,
          questions: [],
        };

        return (
          <TabsContent key={sType} value={sType} className="space-y-4 outline-none">
            <div className="flex items-center justify-between border-b pb-1">
              <div>
                <h3 className="text-foreground text-sm font-semibold">{config.title}</h3>
                <p className="text-muted-foreground text-xs">{config.description}</p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddQuestion(sType)}
                className="h-8 gap-1 text-xs"
              >
                <Plus className="size-3.5" /> Thêm câu hỏi
              </Button>
            </div>

            {section.questions.length === 0 ? (
              <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-xs">
                Chưa có câu hỏi nào trong phần này. Nhấn &ldquo;Thêm câu hỏi&rdquo; để bắt đầu nhập.
              </div>
            ) : (
              <div className="space-y-4">
                {section.questions.map((question, qIdx) => {
                  const qKey = question.id ?? `${sType}-q-${question.orderIndex ?? qIdx}`;

                  if (sType === "true_false") {
                    return (
                      <QuestionCardTrueFalse
                        key={qKey}
                        question={question}
                        index={qIdx}
                        onChange={(updated) => handleQuestionChange(sType, qIdx, updated)}
                      />
                    );
                  }
                  if (sType === "group_mcq") {
                    return (
                      <QuestionCardGroupMcq
                        key={qKey}
                        question={question}
                        index={qIdx}
                        onChange={(updated) => handleQuestionChange(sType, qIdx, updated)}
                      />
                    );
                  }
                  if (sType === "matching") {
                    return (
                      <QuestionCardMatching
                        key={qKey}
                        question={question}
                        index={qIdx}
                        onChange={(updated) => handleQuestionChange(sType, qIdx, updated)}
                      />
                    );
                  }

                  return (
                    <QuestionCardShortAnswer
                      key={qKey}
                      question={question}
                      index={qIdx}
                      onChange={(updated) => handleQuestionChange(sType, qIdx, updated)}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
