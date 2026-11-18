"use client";

import { getApiBaseUrl } from "@/lib/api";
import { useCallback, useRef, useState } from "react";

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
  reset: () => void;
};

export function useExamImport(): TUseExamImportReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<TImportProgress | null>(null);
  const [logs, setLogs] = useState<TImportLog[]>([]);
  const [rawStreamOutput, setRawStreamOutput] = useState("");
  const [parsedData, setParsedData] = useState<TCreateQuizInput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);

  const addLog = useCallback((message: string, type: "info" | "success" | "section" = "info") => {
    const time = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLogs((prev) => [...prev, { timestamp: time, message, type }]);
  }, []);

  const reset = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsUploading(false);
    setIsProcessing(false);
    setProgress(null);
    setLogs([]);
    setRawStreamOutput("");
    setParsedData(null);
    setError(null);
  }, []);

  const startImport = useCallback(
    async (file: File) => {
      reset();
      setIsUploading(true);

      try {
        const baseUrl = getApiBaseUrl();
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${baseUrl}/quizzes/import/jobs`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => null);
          throw new Error(errJson?.message || "Không thể upload file đề thi.");
        }

        const { jobId } = (await res.json()) as { jobId: string };

        setIsUploading(false);
        setIsProcessing(true);
        addLog("Khởi tạo kết nối trực tiếp với server xử lý AI...", "info");

        const streamUrl = `${baseUrl}/quizzes/import/jobs/${jobId}/stream`;
        const es = new EventSource(streamUrl, { withCredentials: true });
        eventSourceRef.current = es;

        es.addEventListener("progress", (event) => {
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
            const data = JSON.parse(event.data) as {
              sectionIndex: number;
              title: string;
              questionsCount: number;
            };
            addLog(`Đã bóc tách xong: ${data.title} (${data.questionsCount} câu hỏi)`, "section");
          } catch {
            // ignore
          }
        });

        es.addEventListener("ai_raw_token", (event) => {
          try {
            const data = JSON.parse(event.data) as {
              section: string;
              chunk: string;
            };
            setRawStreamOutput((prev) => prev + data.chunk);
          } catch {
            // ignore
          }
        });

        es.addEventListener("completed", (event) => {
          try {
            const data = JSON.parse(event.data) as TCreateQuizInput;
            setParsedData(data);
            setIsProcessing(false);
            addLog("Bóc tách toàn bộ đề thi thành công!", "success");
            es.close();
          } catch {
            setIsProcessing(false);
            setError("Lỗi xử lý dữ liệu trả về từ server.");
            es.close();
          }
        });

        es.addEventListener("failed", (event) => {
          try {
            const data = JSON.parse(event.data) as { error: string };
            setError(data.error || "Quá trình import thất bại.");
          } catch {
            setError("Quá trình import thất bại.");
          }
          setIsProcessing(false);
          es.close();
        });

        es.onerror = () => {
          // Chỉ ngắt khi kết nối thực sự đã bị đóng
          if (es.readyState === EventSource.CLOSED) {
            setIsProcessing(false);
            setError("Mất kết nối theo dõi tiến trình import từ máy chủ.");
            es.close();
          }
        };
      } catch (err) {
        setIsUploading(false);
        setIsProcessing(false);
        setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
      }
    },
    [addLog, reset],
  );

  return {
    isUploading,
    isProcessing,
    progress,
    logs,
    rawStreamOutput,
    parsedData,
    error,
    startImport,
    reset,
  };
}
