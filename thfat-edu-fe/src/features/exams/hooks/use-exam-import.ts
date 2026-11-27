"use client";

import { getApiBaseUrl } from "@/lib/api";
import { useCallback, useEffect, useRef, useState } from "react";

import { type TCreateQuizInput } from "../types";

export type TImportProgress = {
  step: number;
  totalSteps: number;
  message: string;
};

export type TImportLog = {
  timestamp: string;
  message: string;
  type: "info" | "success" | "section";
};

export type TUseExamImportReturn = {
  isUploading: boolean;
  isProcessing: boolean;
  progress: TImportProgress | null;
  logs: TImportLog[];
  rawStreamOutput: string;
  parsedData: TCreateQuizInput | null;
  error: string | null;
  startImport: (file: File) => Promise<void>;
  cancel: () => Promise<void>;
  reset: () => void;
};

// Lưu jobId để back ra rồi quay lại trang vẫn nối lại được tác vụ đang chạy / kết quả đã xong.
const ACTIVE_JOB_STORAGE_KEY = "thfat-exam-import-job";

function readStoredJobId(): string | null {
  try {
    return window.sessionStorage.getItem(ACTIVE_JOB_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredJobId(jobId: string | null): void {
  try {
    if (jobId) window.sessionStorage.setItem(ACTIVE_JOB_STORAGE_KEY, jobId);
    else window.sessionStorage.removeItem(ACTIVE_JOB_STORAGE_KEY);
  } catch {
    // storage không khả dụng: bỏ qua, chỉ mất khả năng khôi phục
  }
}

export function useExamImport(): TUseExamImportReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<TImportProgress | null>(null);
  const [logs, setLogs] = useState<TImportLog[]>([]);
  const [rawStreamOutput, setRawStreamOutput] = useState("");
  const [parsedData, setParsedData] = useState<TCreateQuizInput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const jobIdRef = useRef<string | null>(null);

  const addLog = useCallback((message: string, type: "info" | "success" | "section" = "info") => {
    const time = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLogs((prev) => [...prev, { timestamp: time, message, type }]);
  }, []);

  const closeStream = useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
  }, []);

  const reset = useCallback(() => {
    closeStream();
    jobIdRef.current = null;
    writeStoredJobId(null);
    setIsUploading(false);
    setIsProcessing(false);
    setProgress(null);
    setLogs([]);
    setRawStreamOutput("");
    setParsedData(null);
    setError(null);
  }, [closeStream]);

  const connectToJob = useCallback(
    (jobId: string) => {
      closeStream();
      jobIdRef.current = jobId;
      setIsProcessing(true);

      const streamUrl = `${getApiBaseUrl()}/quizzes/import/jobs/${jobId}/stream`;
      const es = new EventSource(streamUrl, { withCredentials: true });
      eventSourceRef.current = es;
      let receivedAny = false;

      const finish = () => {
        setIsProcessing(false);
        es.close();
      };

      es.addEventListener("progress", (event) => {
        receivedAny = true;
        try {
          const data = JSON.parse(event.data) as TImportProgress;
          setProgress(data);
          addLog(data.message, "info");
        } catch {
          // ignore parse error
        }
      });

      es.addEventListener("section_stream", (event) => {
        try {
          const data = JSON.parse(event.data) as { title: string; questionsCount: number };
          addLog(`Đã bóc tách xong: ${data.title} (${data.questionsCount} câu hỏi)`, "section");
        } catch {
          // ignore
        }
      });

      es.addEventListener("ai_raw_token", (event) => {
        try {
          const data = JSON.parse(event.data) as { chunk: string };
          setRawStreamOutput((prev) => prev + data.chunk);
        } catch {
          // ignore
        }
      });

      es.addEventListener("completed", (event) => {
        try {
          setParsedData(JSON.parse(event.data) as TCreateQuizInput);
          addLog("Bóc tách toàn bộ đề thi thành công!", "success");
        } catch {
          setError("Lỗi xử lý dữ liệu trả về từ server.");
        }
        finish();
      });

      es.addEventListener("failed", (event) => {
        try {
          const data = JSON.parse(event.data) as { error: string };
          setError(data.error || "Quá trình import thất bại.");
        } catch {
          setError("Quá trình import thất bại.");
        }
        writeStoredJobId(null);
        finish();
      });

      es.addEventListener("cancelled", () => {
        addLog("Đã huỷ tác vụ import.", "info");
        writeStoredJobId(null);
        finish();
      });

      es.onerror = () => {
        if (es.readyState !== EventSource.CLOSED) return;

        // Job không còn trên server (hết hạn / server restart): bỏ qua lặng lẽ khi đang nối lại.
        writeStoredJobId(null);
        if (receivedAny) setError("Mất kết nối theo dõi tiến trình import từ máy chủ.");
        finish();
      };
    },
    [addLog, closeStream],
  );

  const startImport = useCallback(
    async (file: File) => {
      reset();
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${getApiBaseUrl()}/quizzes/import/jobs`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => null);
          throw new Error(errJson?.message || "Không thể upload file đề thi.");
        }

        const { jobId } = (await res.json()) as { jobId: string };

        writeStoredJobId(jobId);
        setIsUploading(false);
        addLog("Khởi tạo kết nối trực tiếp với server xử lý AI...", "info");
        connectToJob(jobId);
      } catch (err) {
        setIsUploading(false);
        setIsProcessing(false);
        setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
      }
    },
    [addLog, connectToJob, reset],
  );

  const cancel = useCallback(async () => {
    const jobId = jobIdRef.current;

    reset();
    if (!jobId) return;

    await fetch(`${getApiBaseUrl()}/quizzes/import/jobs/${jobId}`, {
      method: "DELETE",
      credentials: "include",
    }).catch(() => null);
  }, [reset]);

  // Nối lại job đang chạy / đã xong khi quay lại trang; rời trang chỉ ngừng theo dõi, không huỷ job.
  useEffect(() => {
    const storedJobId = readStoredJobId();

    if (storedJobId) {
      addLog("Đang khôi phục tác vụ import trước đó...", "info");
      connectToJob(storedJobId);
    }

    return closeStream;
  }, [addLog, connectToJob, closeStream]);

  return {
    isUploading,
    isProcessing,
    progress,
    logs,
    rawStreamOutput,
    parsedData,
    error,
    startImport,
    cancel,
    reset,
  };
}
