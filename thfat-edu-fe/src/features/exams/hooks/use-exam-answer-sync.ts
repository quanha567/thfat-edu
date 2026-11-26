import { useCallback, useEffect, useRef } from "react";

import { type TSyncAnswerPayload } from "../types";
import { useSyncAnswers } from "./use-exam-room";

const SYNC_INTERVAL_MS = 3000;

export type TAnswerState = { selectedAnswer: string | null; isFlagged: boolean };

export type TUseExamAnswerSyncOptions = {
  attemptId: string | undefined;
  answersMap: Record<string, TAnswerState>;
};

/**
 * Đồng bộ đáp án định kỳ. Các mục chưa lưu được giữ lại nếu request lỗi; `flush` cho phép đẩy nốt
 * trước khi nộp bài / rời phòng thi.
 */
export function useExamAnswerSync({ attemptId, answersMap }: TUseExamAnswerSyncOptions) {
  const { mutateAsync } = useSyncAnswers();
  const pendingRef = useRef<Set<string>>(new Set());
  const answersRef = useRef(answersMap);
  const queueRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    answersRef.current = answersMap;
  }, [answersMap]);

  const markDirty = useCallback((subItemId: string) => {
    pendingRef.current.add(subItemId);
  }, []);

  const flush = useCallback((): Promise<void> => {
    if (!attemptId) return Promise.resolve();

    const run = async () => {
      if (pendingRef.current.size === 0) return;

      const ids = Array.from(pendingRef.current);
      pendingRef.current.clear();

      const answers: TSyncAnswerPayload[] = ids.map((subItemId) => ({
        subItemId,
        selectedAnswer: answersRef.current[subItemId]?.selectedAnswer ?? null,
        isFlagged: answersRef.current[subItemId]?.isFlagged ?? false,
      }));

      try {
        await mutateAsync({ attemptId, answers });
      } catch {
        for (const id of ids) pendingRef.current.add(id);
      }
    };

    queueRef.current = queueRef.current.then(run, run);

    return queueRef.current;
  }, [attemptId, mutateAsync]);

  useEffect(() => {
    if (!attemptId) return;

    const interval = setInterval(() => void flush(), SYNC_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [attemptId, flush]);

  return { markDirty, flush };
}
