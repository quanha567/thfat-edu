"use client";

import { useState } from "react";
import { toast } from "sonner";

import { type TQuizQuestion, type TQuizSection } from "../types";
import { useSolveQuestion } from "./use-solve-question";

export function useAutoSolveQuestion(
  sections: TQuizSection[],
  onUpdateQuestion: (sIdx: number, qIdx: number, question: TQuizQuestion) => void,
) {
  const [solvingKey, setSolvingKey] = useState<string | null>(null);
  const solveMutation = useSolveQuestion();

  const handleAutoSolveQuestion = async (sIdx: number, qIdx: number) => {
    const targetSection = sections[sIdx];
    const targetQuestion = targetSection?.questions[qIdx];
    if (!targetSection || !targetQuestion) return;

    const hasContext = Boolean(targetQuestion.contextContent?.trim());
    const hasSubItemContent = targetQuestion.subItems.some((item) => Boolean(item.content?.trim()));

    if (!hasContext && !hasSubItemContent) {
      toast.warning("Vui lòng nhập nội dung đề bài trước khi yêu cầu AI giải.");

      return;
    }

    const key = `${sIdx}-${qIdx}`;
    setSolvingKey(key);

    try {
      const result = await solveMutation.mutateAsync({
        sectionType: targetSection.sectionType,
        question: targetQuestion,
      });

      if (result.subItems && result.subItems.length > 0) {
        const updatedSubItems = targetQuestion.subItems.map((subItem, index) => {
          const solved =
            result.subItems.find((s) => s.orderIndex === subItem.orderIndex) ??
            result.subItems[index];

          if (!solved) return subItem;

          return {
            ...subItem,
            correctAnswer: solved.correctAnswer,
            ...(solved.acceptableAnswers ? { acceptableAnswers: solved.acceptableAnswers } : {}),
            ...(solved.explanation ? { explanation: solved.explanation } : {}),
          };
        });

        onUpdateQuestion(sIdx, qIdx, {
          ...targetQuestion,
          subItems: updatedSubItems,
        });

        toast.success(`Đã tự động điền đáp án cho câu ${qIdx + 1}!`);
      }
    } catch (err) {
      toast.error((err as Error).message || "Không thể giải câu hỏi bằng AI.");
    } finally {
      setSolvingKey(null);
    }
  };

  return {
    solvingKey,
    handleAutoSolveQuestion,
  };
}
