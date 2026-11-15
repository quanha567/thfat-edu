"use client";

import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useStartExam, useSubmitExam, useSyncAnswers } from "../hooks/use-exam-room";
import { useExamRoomNavigation } from "../hooks/use-exam-room-navigation";
import { type TExamRoomData } from "../types";
import { ExamQuestionBottomBar } from "./exam-question-bottom-bar";
import { ExamQuestionList } from "./exam-question-list";
import { ExamRoomHeader } from "./exam-room-header";
import { ExamSubmitDialog } from "./exam-submit-dialog";

export type TExamRoomContainerProps = {
  params: Promise<{ id: string }>;
};

export function ExamRoomContainer({ params }: TExamRoomContainerProps) {
  const { id: examId } = use(params);
  const router = useRouter();

  const startExamMutation = useStartExam();
  const syncMutation = useSyncAnswers();
  const submitMutation = useSubmitExam();

  const [roomData, setRoomData] = useState<TExamRoomData | null>(null);
  const [answersMap, setAnswersMap] = useState<
    Record<string, { selectedAnswer: string | null; isFlagged: boolean }>
  >({});
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const pendingSyncRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    startExamMutation.mutate(examId, {
      onSuccess: (data) => {
        setRoomData(data);
        const initialMap = Object.fromEntries(
          data.savedAnswers.map((ans) => [
            ans.subItemId,
            { selectedAnswer: ans.selectedAnswer, isFlagged: ans.isFlagged },
          ]),
        );
        setAnswersMap(initialMap);
      },
      onError: () => {
        router.replace(`/exams/${examId}/result`);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  useEffect(() => {
    if (!roomData?.attempt.id) return;

    const interval = setInterval(() => {
      if (pendingSyncRef.current.size === 0) return;

      const itemsToSync = Array.from(pendingSyncRef.current).map((subItemId) => ({
        subItemId,
        selectedAnswer: answersMap[subItemId]?.selectedAnswer ?? null,
        isFlagged: answersMap[subItemId]?.isFlagged ?? false,
      }));

      pendingSyncRef.current.clear();
      syncMutation.mutate({ attemptId: roomData.attempt.id, answers: itemsToSync });
    }, 3000);

    return () => clearInterval(interval);
  }, [roomData?.attempt.id, answersMap, syncMutation]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const allQuestions = useMemo(
    () => roomData?.quiz.sections.flatMap((s) => s.questions) ?? [],
    [roomData],
  );

  const {
    activeQuestionId,
    handleSelectQuestion,
    handlePrevQuestion,
    handleNextQuestion,
    canPrev,
    canNext,
  } = useExamRoomNavigation(allQuestions);

  const handleAnswerChange = (subItemId: string, value: string) => {
    setAnswersMap((prev) => ({
      ...prev,
      [subItemId]: {
        selectedAnswer: value,
        isFlagged: prev[subItemId]?.isFlagged ?? false,
      },
    }));
    pendingSyncRef.current.add(subItemId);
  };

  const handleToggleFlag = (subItemId: string) => {
    setAnswersMap((prev) => ({
      ...prev,
      [subItemId]: {
        selectedAnswer: prev[subItemId]?.selectedAnswer ?? null,
        isFlagged: !prev[subItemId]?.isFlagged,
      },
    }));
    pendingSyncRef.current.add(subItemId);
  };

  const handleConfirmSubmit = useCallback(() => {
    if (!roomData?.attempt.id) return;

    submitMutation.mutate(roomData.attempt.id, {
      onSuccess: () => {
        router.replace(`/exams/${examId}/result`);
      },
    });
  }, [roomData?.attempt.id, submitMutation, router, examId]);

  const handleBack = useCallback(() => {
    if (roomData?.attempt.id && pendingSyncRef.current.size > 0) {
      const itemsToSync = Array.from(pendingSyncRef.current).map((subItemId) => ({
        subItemId,
        selectedAnswer: answersMap[subItemId]?.selectedAnswer ?? null,
        isFlagged: answersMap[subItemId]?.isFlagged ?? false,
      }));
      pendingSyncRef.current.clear();
      syncMutation.mutate({ attemptId: roomData.attempt.id, answers: itemsToSync });
    }
    router.push("/exams");
  }, [roomData?.attempt.id, answersMap, syncMutation, router]);

  if (startExamMutation.isPending || !roomData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-neutral-50">
        <Spinner className="text-primary-600 h-8 w-8" />
        <p className="text-sm font-medium text-neutral-600">Đang chuẩn bị phòng thi...</p>
      </div>
    );
  }

  const allSubItems = roomData.quiz.sections.flatMap((s) => s.questions.flatMap((q) => q.subItems));
  const totalSubItems = allSubItems.length;
  const answeredCount = allSubItems.filter((si) =>
    Boolean(answersMap[si.id]?.selectedAnswer),
  ).length;

  return (
    <div className="flex min-h-screen flex-col bg-neutral-100">
      <ExamRoomHeader
        title={roomData.quiz.title}
        initialRemainingSeconds={roomData.attempt.remainingSeconds}
        onTimeout={handleConfirmSubmit}
        onSubmitClick={() => setIsSubmitDialogOpen(true)}
        onBack={handleBack}
        isSubmitting={submitMutation.isPending}
      />

      <main className="container mx-auto w-full flex-1 px-4 pt-4 pb-52 sm:px-6 sm:pt-6 sm:pb-60">
        <ExamQuestionList
          sections={roomData.quiz.sections}
          answersMap={answersMap}
          onAnswerChange={handleAnswerChange}
          onToggleFlag={handleToggleFlag}
        />
      </main>

      <ExamQuestionBottomBar
        sections={roomData.quiz.sections}
        answersMap={answersMap}
        activeQuestionId={activeQuestionId}
        onSelectQuestion={handleSelectQuestion}
        onPrevQuestion={handlePrevQuestion}
        onNextQuestion={handleNextQuestion}
        canPrev={canPrev}
        canNext={canNext}
      />

      <ExamSubmitDialog
        isOpen={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
        onConfirmSubmit={handleConfirmSubmit}
        totalSubItems={totalSubItems}
        answeredCount={answeredCount}
        isSubmitting={submitMutation.isPending}
      />
    </div>
  );
}
