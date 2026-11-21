"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Terminal } from "lucide-react";
import { useEffect, useRef } from "react";

import { type TImportLog, type TImportProgress } from "../../hooks/use-exam-import";

export type TExamCreateProgressCardProps = {
  isUploading: boolean;
  progress: TImportProgress | null;
  logs: TImportLog[];
  error: string | null;
};

export function ExamCreateProgressCard({
  isUploading,
  progress,
  logs,
  error,
}: TExamCreateProgressCardProps) {
  const logContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (logs.length > 0 && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs.length]);

  function getPercent() {
    if (progress) {
      return Math.round((progress.step / progress.totalSteps) * 100);
    }
    if (isUploading) {
      return 15;
    }

    return 0;
  }

  function getStatusMessage() {
    if (progress) {
      return progress.message;
    }
    if (isUploading) {
      return "Đang tải file PDF lên server...";
    }

    return "Chờ bắt đầu tác vụ";
  }

  const percent = getPercent();

  return (
    <Card className="border-border shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-bold">
            <Terminal className="text-primary size-4" />
            <span>Tiến trình xử lý AI</span>
          </CardTitle>
          <span className="text-primary text-xs font-bold">{percent}%</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3.5">
        <Progress value={percent} className="h-2 w-full" />

        <div className="text-muted-foreground text-xs font-medium">{getStatusMessage()}</div>

        {error && (
          <div className="bg-destructive/10 text-destructive flex items-start gap-2 rounded-lg p-3 text-xs">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div
          ref={logContainerRef}
          className="text-xxs max-h-48 space-y-1.5 overflow-y-auto rounded-lg bg-neutral-950 p-3 font-mono text-neutral-200 shadow-inner"
        >
          {logs.length === 0 ? (
            <p className="text-neutral-500 italic">Nhật ký xử lý sẽ hiển thị tại đây...</p>
          ) : (
            logs.map((log) => (
              <div
                key={`${log.timestamp}-${log.message}`}
                className="flex items-start gap-1.5 leading-relaxed"
              >
                <span className="text-neutral-500 select-none">[{log.timestamp}]</span>
                {log.type === "section" ? (
                  <span className="text-success-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="inline size-3 shrink-0" />
                    {log.message}
                  </span>
                ) : (
                  <span className="text-neutral-300">{log.message}</span>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
