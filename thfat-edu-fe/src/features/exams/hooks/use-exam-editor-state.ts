"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { createDefaultSections, createEmptyQuestion } from "../constants/exam-editor.constants";
import {
  type TExamStatus,
  type TQuizDetail,
  type TQuizQuestion,
  type TQuizSection,
} from "../types";
import { validateExamSections } from "../utils/validate-exam";
import { useUpdateExam } from "./use-update-exam";

export function useExamEditorState(initialExam: TQuizDetail) {
  const [title, setTitle] = useState(initialExam.title ?? "");
  const [description, setDescription] = useState(initialExam.description ?? "");
  const [durationMinutes, setDurationMinutes] = useState(initialExam.durationMinutes ?? 50);
  const [totalPoints, setTotalPoints] = useState(initialExam.totalPoints ?? "150.00");
  const [status, setStatus] = useState<TExamStatus>(initialExam.status ?? "draft");
  const [pdfUrl, setPdfUrl] = useState(initialExam.pdfUrl ?? "");

  const [sections, setSections] = useState<TQuizSection[]>(() => {
    if (initialExam.sections && initialExam.sections.length > 0) {
      return initialExam.sections;
    }

    return createDefaultSections();
  });

  const [isDirty, setIsDirty] = useState(false);
  const [errorKeys, setErrorKeys] = useState<Set<string>>(new Set());

  const updateMutation = useUpdateExam(initialExam.id);

  // Warn before leaving if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  const updateOverview = (field: string, value: unknown) => {
    markDirty();
    if (field === "title") setTitle(String(value));
    if (field === "description") setDescription(String(value));
    if (field === "durationMinutes") setDurationMinutes(Number(value));
    if (field === "totalPoints") setTotalPoints(String(value));
    if (field === "status") setStatus(value as TExamStatus);
    if (field === "pdfUrl") setPdfUrl(String(value));
  };

  const updateQuestion = (sIdx: number, qIdx: number, updated: TQuizQuestion) => {
    markDirty();
    setSections((prev) => {
      const next = [...prev];
      const targetSection = next[sIdx];
      if (!targetSection) return prev;
      const nextQuestions = [...targetSection.questions];
      nextQuestions[qIdx] = updated;
      next[sIdx] = { ...targetSection, questions: nextQuestions };

      return next;
    });
  };

  const addQuestion = (sIdx: number) => {
    markDirty();
    setSections((prev) => {
      const next = [...prev];
      const targetSection = next[sIdx];
      if (!targetSection) return prev;
      const newQ = createEmptyQuestion({
        sectionType: targetSection.sectionType,
        orderIndex: targetSection.questions.length,
      });
      next[sIdx] = { ...targetSection, questions: [...targetSection.questions, newQ] };

      return next;
    });
  };

  const moveQuestion = (sIdx: number, qIdx: number, direction: "up" | "down") => {
    markDirty();
    setSections((prev) => {
      const next = [...prev];
      const targetSection = next[sIdx];
      if (!targetSection) return prev;
      const questions = [...targetSection.questions];
      const targetIdx = direction === "up" ? qIdx - 1 : qIdx + 1;
      if (targetIdx < 0 || targetIdx >= questions.length) return prev;

      const current = questions[qIdx];
      const neighbor = questions[targetIdx];
      if (!current || !neighbor) return prev;

      questions[qIdx] = neighbor;
      questions[targetIdx] = current;
      next[sIdx] = { ...targetSection, questions };

      return next;
    });
  };

  const duplicateQuestion = (sIdx: number, qIdx: number) => {
    markDirty();
    setSections((prev) => {
      const next = [...prev];
      const targetSection = next[sIdx];
      if (!targetSection) return prev;
      const source = targetSection.questions[qIdx];
      if (!source) return prev;

      const copy = {
        ...JSON.parse(JSON.stringify(source)),
        id: undefined,
        orderIndex: targetSection.questions.length,
      };
      const questions = [...targetSection.questions];
      questions.splice(qIdx + 1, 0, copy);
      next[sIdx] = { ...targetSection, questions };

      return next;
    });
  };

  const deleteQuestion = (sIdx: number, qIdx: number) => {
    markDirty();
    setSections((prev) => {
      const next = [...prev];
      const targetSection = next[sIdx];
      if (!targetSection) return prev;
      const questions = targetSection.questions.filter((_, idx) => idx !== qIdx);
      next[sIdx] = { ...targetSection, questions };

      return next;
    });
  };

  const validate = (): boolean => {
    const errs = validateExamSections(sections);
    setErrorKeys(errs);

    if (errs.size > 0) {
      toast.error(`Có ${errs.size} câu hỏi còn thiếu nội dung hoặc đáp án.`);
      const firstKey = Array.from(errs)[0];
      if (firstKey) {
        const el = document.getElementById(`question-card-${firstKey}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      await updateMutation.mutateAsync({
        id: initialExam.id,
        title,
        description,
        durationMinutes,
        totalPoints,
        status,
        pdfUrl,
        sections,
      });

      setIsDirty(false);
      toast.success("Đã lưu đề thi thành công!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra khi lưu đề thi.");
    }
  };

  return {
    state: { title, description, durationMinutes, totalPoints, status, pdfUrl, sections, isDirty },
    errorKeys,
    isSaving: updateMutation.isPending,
    updateOverview,
    updateQuestion,
    addQuestion,
    moveQuestion,
    duplicateQuestion,
    deleteQuestion,
    handleSave,
  };
}
