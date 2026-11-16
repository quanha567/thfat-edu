"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Loader2, Sparkles, Square, Wand2 } from "lucide-react";
import { useState } from "react";

import { useAiArticleAssistant } from "../hooks/use-ai-article-assistant";

export type TAiArticleAssistantProps = {
  getCurrentContent?: () => string;
  currentContent?: string;
  onUpdateContent: (content: string) => void;
  onAutoFillMeta?: (title?: string, excerpt?: string) => void;
  onStreamingChange?: (isStreaming: boolean) => void;
};

export function AiArticleAssistant({
  getCurrentContent,
  currentContent,
  onUpdateContent,
  onAutoFillMeta,
  onStreamingChange,
}: TAiArticleAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [refinedPrompt, setRefinedPrompt] = useState("");
  const [mode, setMode] = useState<"overwrite" | "append">("overwrite");

  const { isEnhancing, isStreaming, enhancePrompt, generateArticle, stopGenerating } =
    useAiArticleAssistant({
      onUpdateContent,
      onAutoFillMeta,
    });

  // Notify parent of streaming state changes if needed
  const handleStreamingChange = (streaming: boolean) => {
    onStreamingChange?.(streaming);
  };

  const handleEnhance = async () => {
    if (!topic.trim()) return;

    try {
      const result = await enhancePrompt(topic.trim());
      setRefinedPrompt(result);
    } catch {
      // Error handled in hook toast
    }
  };

  const handleStartGenerate = async () => {
    const promptToSend = refinedPrompt.trim() || topic.trim();
    if (!promptToSend) return;

    const baseContent = getCurrentContent ? getCurrentContent() : currentContent || "";

    handleStreamingChange(true);
    await generateArticle(promptToSend, mode, baseContent);
    handleStreamingChange(false);
  };

  const handleStop = () => {
    stopGenerating();
    handleStreamingChange(false);
  };

  return (
    <Card className="border-primary/30 bg-gradient-to-r from-primary/5 via-background to-primary/5 shadow-xs">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between p-3.5 sm:px-4 text-left transition-colors hover:bg-primary/5 rounded-t-xl"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground text-sm">
                Trợ lý AI viết bài (AI Writing Assistant)
              </span>
              <Badge variant="secondary" className="font-medium text-[10px]">
                NVIDIA Nemotron 3
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">
              Nhập ý tưởng sơ lược để AI gợi ý dàn ý và tự động gõ bài viết vào Editor
            </p>
          </div>
        </div>

        <span className="flex size-8 items-center justify-center text-muted-foreground">
          {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </span>
      </button>

      {isOpen && (
        <CardContent className="space-y-4 border-t border-border/60 p-4 pt-3.5">
          {/* Step 1: Raw Idea Input */}
          <div className="space-y-1.5">
            <Label htmlFor="ai-topic" className="font-semibold text-xs text-foreground">
              Bước 1: Nhập chủ đề hoặc ý tưởng bài viết
            </Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Textarea
                id="ai-topic"
                value={topic}
                disabled={isEnhancing || isStreaming}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ví dụ: Phương pháp giải bài toán este đa chức có liên kết đôi, các lỗi học sinh hay mắc phải..."
                rows={2}
                className="resize-none text-xs leading-relaxed"
              />
              <Button
                type="button"
                onClick={handleEnhance}
                disabled={isEnhancing || isStreaming || !topic.trim()}
                className="h-auto shrink-0 gap-1.5 px-4 text-xs font-semibold"
              >
                {isEnhancing ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Đang phân tích...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="size-3.5" />
                    <span>Cải tiến Prompt</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Step 2: Refined Prompt & Generation */}
          {(refinedPrompt || isStreaming) && (
            <div className="space-y-3 rounded-xl border border-border/80 bg-background/80 p-3.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="ai-refined-prompt"
                  className="font-semibold text-xs text-foreground"
                >
                  Bước 2: Dàn ý & Prompt đã được AI tối ưu (Có thể chỉnh sửa lại)
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  Chuẩn hóa theo format giáo dục & KaTeX
                </span>
              </div>

              <Textarea
                id="ai-refined-prompt"
                value={refinedPrompt}
                disabled={isStreaming}
                onChange={(e) => setRefinedPrompt(e.target.value)}
                rows={6}
                className="font-mono text-xs leading-relaxed"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <RadioGroup
                  value={mode}
                  onValueChange={(val) => setMode(val as "overwrite" | "append")}
                  disabled={isStreaming}
                  className="flex items-center gap-4"
                >
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="overwrite" id="mode-overwrite" />
                    <Label htmlFor="mode-overwrite" className="cursor-pointer text-xs">
                      Ghi đè nội dung
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="append" id="mode-append" />
                    <Label htmlFor="mode-append" className="cursor-pointer text-xs">
                      Chèn tiếp vào cuối
                    </Label>
                  </div>
                </RadioGroup>

                <div className="flex items-center gap-2">
                  {isStreaming ? (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleStop}
                      className="gap-1.5 text-xs font-semibold"
                    >
                      <Square className="size-3.5 fill-current" />
                      <span>Dừng tạo</span>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleStartGenerate}
                      disabled={!refinedPrompt.trim() && !topic.trim()}
                      className="gap-1.5 text-xs font-semibold shadow-xs"
                    >
                      <Sparkles className="size-3.5" />
                      <span>Viết vào Editor</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
