"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Loader2, RotateCcw, Upload, X } from "lucide-react";
import { type ChangeEvent, type DragEvent, useState } from "react";

export type TExamCreateUploadCardProps = {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;
  onStart: () => void;
  onCancel: () => void;
  isUploading: boolean;
  isProcessing: boolean;
  hasResult: boolean;
};

export function ExamCreateUploadCard({
  selectedFile,
  onSelectFile,
  onStart,
  onCancel,
  isUploading,
  isProcessing,
  hasResult,
}: TExamCreateUploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      onSelectFile(file);
    }
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelectFile(file);
    }
  };

  const isBusy = isUploading || isProcessing;

  return (
    <Card className="border-border shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-bold">
          <span>Tài liệu PDF đề thi</span>
          {selectedFile && (
            <span className="text-muted-foreground text-xs font-normal">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {!selectedFile ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 bg-muted/20"
            }`}
          >
            <div className="bg-primary/10 text-primary mb-3 flex size-12 items-center justify-center rounded-full">
              <Upload className="size-6" />
            </div>

            <p className="text-foreground text-sm font-semibold">Kéo thả file PDF đề thi vào đây</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Hỗ trợ định dạng .pdf chuẩn thi tốt nghiệp THPT hoặc ĐGNL (tối đa 20MB)
            </p>

            <label className="mt-4">
              <input
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleInput}
                disabled={isBusy}
              />
              <span className="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex h-8 cursor-pointer items-center justify-center rounded-md px-3 text-xs font-medium shadow-2xs transition-colors">
                Chọn file từ máy tính
              </span>
            </label>
          </div>
        ) : (
          <div className="border-border bg-muted/30 flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                <FileText className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-foreground truncate text-xs font-bold">{selectedFile.name}</p>
                <p className="text-muted-foreground text-xxs">
                  PDF Document · {(selectedFile.size / 1024).toFixed(0)} KB
                </p>
              </div>
            </div>

            {!isBusy && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => onSelectFile(null)}
                className="text-muted-foreground hover:text-foreground shrink-0"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        )}

        <Button
          type="button"
          onClick={onStart}
          disabled={!selectedFile || isBusy}
          className="w-full gap-2 text-xs font-semibold shadow-xs"
        >
          {isBusy && (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Đang phân tích & bóc tách...</span>
            </>
          )}
          {!isBusy && hasResult && (
            <>
              <RotateCcw className="size-4" />
              <span>Bóc tách lại tệp này</span>
            </>
          )}
          {!isBusy && !hasResult && (
            <>
              <FileText className="size-4" />
              <span>Bắt đầu bóc tách câu hỏi</span>
            </>
          )}
        </Button>

        {isBusy && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full gap-2 text-xs font-semibold"
          >
            <X className="size-4" />
            <span>Huỷ tác vụ</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
