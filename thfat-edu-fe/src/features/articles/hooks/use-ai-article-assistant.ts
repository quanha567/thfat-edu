"use client";

import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

export type TUseAiArticleAssistantOptions = {
  onUpdateContent: (content: string) => void;
  onAutoFillMeta?: (title?: string, excerpt?: string) => void;
};

export function extractTitleAndExcerpt(markdownText: string): {
  title?: string;
  excerpt?: string;
} {
  const lines = markdownText.trimStart().split("\n");
  let title: string | undefined;
  let excerpt: string | undefined;

  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i]?.trim() ?? "";

    if (!title && line.startsWith("# ")) {
      title = line.slice(2).trim();
      continue;
    }

    if (!excerpt && line.startsWith("> ")) {
      excerpt = line.slice(2).trim();
      continue;
    }

    if (title && excerpt) break;
  }

  return { title, excerpt };
}

function parseSseLine(line: string): { text?: string; isDone?: boolean; error?: string } | null {
  const trimmed = line.trim();
  if (!trimmed || !trimmed.startsWith("data:")) return null;
  if (trimmed === "data: [DONE]") return { isDone: true };

  try {
    return JSON.parse(trimmed.slice(5).trim()) as { text?: string; error?: string };
  } catch {
    return null;
  }
}

function processChunkLines(lines: string[], onToken: (chunk: string) => void): boolean {
  for (const line of lines) {
    const parsed = parseSseLine(line);
    if (!parsed) continue;
    if (parsed.isDone) return true;
    if (parsed.error) throw new Error(parsed.error);
    if (parsed.text) onToken(parsed.text);
  }

  return false;
}

export function useAiArticleAssistant({
  onUpdateContent,
  onAutoFillMeta,
}: TUseAiArticleAssistantOptions) {
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const enhancePromptMutation = useMutation<string, Error, string>({
    mutationFn: async (topic: string) => {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/admin/articles/ai/enhance-prompt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ topic }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          extractApiErrorMessage(errorData, "Không thể phân tích và cải tiến prompt."),
        );
      }

      const data = (await res.json()) as { enhancedPrompt: string };

      return data.enhancedPrompt;
    },
    onError: (error) => {
      toast.error(error.message || "Lỗi khi cải tiến prompt.");
    },
  });

  const stopGenerating = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    toast.info("Đã dừng quá trình tạo bài viết.");
  }, []);

  const generateArticle = useCallback(
    async (prompt: string, mode: "overwrite" | "append", currentContent: string) => {
      if (!prompt.trim()) {
        toast.error("Vui lòng cung cấp prompt hoặc dàn ý bài viết.");

        return;
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      setIsStreaming(true);

      const baseUrl = getApiBaseUrl();
      let streamedBuffer = "";
      const prefixContent =
        mode === "append" && currentContent.trim() ? `${currentContent.trim()}\n\n` : "";

      try {
        const res = await fetch(`${baseUrl}/admin/articles/ai/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          signal: abortController.signal,
          body: JSON.stringify({ prompt }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(extractApiErrorMessage(errorData, "Không thể kết nối tới AI service."));
        }

        if (!res.body) {
          throw new Error("Không nhận được dữ liệu stream từ AI.");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          // oxlint-disable-next-line no-await-in-loop
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          const isFinished = processChunkLines(lines, (token) => {
            streamedBuffer += token;
            const nextContent = `${prefixContent}${streamedBuffer}`;
            onUpdateContent(nextContent);

            const { title, excerpt } = extractTitleAndExcerpt(streamedBuffer);
            if (onAutoFillMeta && (title || excerpt)) {
              onAutoFillMeta(title, excerpt);
            }
          });

          if (isFinished) break;
        }

        if (buffer.trim()) {
          processChunkLines([buffer], (token) => {
            streamedBuffer += token;
            const nextContent = `${prefixContent}${streamedBuffer}`;
            onUpdateContent(nextContent);
          });
        }

        toast.success("AI đã hoàn thành soạn thảo bài viết!");
      } catch (err: unknown) {
        if (abortController.signal.aborted) {
          return;
        }

        const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra trong quá trình stream.";
        toast.error(msg);
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [onUpdateContent, onAutoFillMeta],
  );

  return {
    isEnhancing: enhancePromptMutation.isPending,
    enhancedPrompt: enhancePromptMutation.data,
    enhancePrompt: enhancePromptMutation.mutateAsync,
    isStreaming,
    generateArticle,
    stopGenerating,
  };
}
