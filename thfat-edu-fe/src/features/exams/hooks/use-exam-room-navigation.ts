"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { type TExamRoomQuestion } from "../types";

export function useExamRoomNavigation(allQuestions: TExamRoomQuestion[]) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeQuestionId = selectedId ?? allQuestions[0]?.id ?? null;

  useEffect(() => {
    if (allQuestions.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);

        if (visible.length > 0) {
          const qId = visible[0].target.id.replace("question-", "");
          setSelectedId(qId);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 },
    );

    for (const q of allQuestions) {
      const el = document.getElementById(`question-${q.id}`);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [allQuestions]);

  const currentQuestionIndex = useMemo(
    () => allQuestions.findIndex((q) => q.id === activeQuestionId),
    [allQuestions, activeQuestionId],
  );

  const handleSelectQuestion = useCallback((questionId: string) => {
    setSelectedId(questionId);
    document.getElementById(`question-${questionId}`)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handlePrevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      handleSelectQuestion(allQuestions[currentQuestionIndex - 1].id);
    }
  }, [currentQuestionIndex, allQuestions, handleSelectQuestion]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex >= 0 && currentQuestionIndex < allQuestions.length - 1) {
      handleSelectQuestion(allQuestions[currentQuestionIndex + 1].id);
    }
  }, [currentQuestionIndex, allQuestions, handleSelectQuestion]);

  return {
    activeQuestionId,
    currentQuestionIndex,
    handleSelectQuestion,
    handlePrevQuestion,
    handleNextQuestion,
    canPrev: currentQuestionIndex > 0,
    canNext: currentQuestionIndex >= 0 && currentQuestionIndex < allQuestions.length - 1,
  };
}
