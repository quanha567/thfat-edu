"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Eye, Info, RotateCcw, Shield, Trophy, Zap } from "lucide-react";
import { useWatch, type Control } from "react-hook-form";

import { type TExamSettingsFormValues } from "../schemas/exam-settings.schema";

type TSettingsPreviewPanelProps = {
  control: Control<TExamSettingsFormValues>;
};

function renderPreviewAction(maxAttempts: number, cooldownMinutes: number) {
  if (maxAttempts === 1) {
    return (
      <Button size="sm" variant="secondary" className="flex-1 text-xs opacity-70" disabled>
        Hết lượt thi
      </Button>
    );
  }

  if (cooldownMinutes > 0) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="flex-1 text-xs text-warning-700 dark:text-warning-400"
        disabled
      >
        Chờ {cooldownMinutes}p thi lại
      </Button>
    );
  }

  return (
    <Button size="sm" className="flex-1 text-xs" disabled>
      <RotateCcw className="mr-1 h-3 w-3" />
      Thi lại
    </Button>
  );
}

function getExplanationPolicyText(policy: string): string {
  if (policy === "immediately") {
    return "Học sinh được xem ngay đáp án và lời giải chi tiết.";
  }

  if (policy === "exam_closed") {
    return "Chỉ được xem đáp án & lời giải sau khi kỳ thi kết thúc.";
  }

  return "Không bao giờ hiển thị đáp án và lời giải chi tiết.";
}

export function SettingsPreviewPanel({ control }: TSettingsPreviewPanelProps) {
  const formValues = useWatch({ control });

  const maxAttempts = formValues.maxAttempts ?? 1;
  const scorePolicy = formValues.scorePolicy ?? "highest";
  const cooldownMinutes = formValues.cooldownMinutes ?? 0;
  const showScoreImmediately = formValues.showScoreImmediately ?? true;
  const showExplanationPolicy = formValues.showExplanationPolicy ?? "immediately";

  return (
    <div className="space-y-6">
      {/* Live Preview Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Eye className="text-muted-foreground h-4 w-4" />
            <CardTitle className="text-sm font-semibold">
              Giao diện hiển thị phía học sinh
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Mô phỏng trực quan trạng thái thẻ đề thi dựa trên quy chế đang cấu hình
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-border bg-muted/20 rounded-lg border p-4">
            <div className="flex items-center justify-between gap-2 pb-2">
              <Badge variant="secondary" className="text-xs">
                Đã nộp bài (Lần 1)
              </Badge>

              {showScoreImmediately ? (
                <span className="text-foreground text-sm font-bold">
                  135.00
                  <span className="text-muted-foreground text-xs font-normal"> / 150đ</span>
                </span>
              ) : (
                <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
                  Điểm tạm ẩn
                </span>
              )}
            </div>

            <h4 className="text-foreground text-sm font-semibold">
              Đề thi thử Tốt nghiệp THPT môn Hóa học - Đề số 01
            </h4>

            <div className="border-border text-muted-foreground mt-3 flex items-center justify-between border-t pt-2.5 text-xs">
              <div className="flex items-center gap-1">
                <Clock className="size-3.5" />
                <span>50 phút</span>
              </div>
              <span className="font-medium">
                {maxAttempts > 0 ? (
                  <>
                    Lượt thi: <strong className="text-foreground">1</strong>/{maxAttempts}
                  </>
                ) : (
                  <>
                    Đã thi: <strong>1</strong> lần (Không giới hạn)
                  </>
                )}
              </span>
            </div>

            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 text-xs" disabled>
                Xem kết quả
              </Button>
              {renderPreviewAction(maxAttempts, cooldownMinutes)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Policy Impact Summary Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Info className="text-muted-foreground h-4 w-4" />
            <CardTitle className="text-sm font-semibold">Tác động vận hành</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3 text-xs leading-relaxed">
          <div className="flex items-start gap-2.5">
            <Trophy className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />
            <div>
              <strong className="text-foreground">Xếp hạng:</strong>{" "}
              {scorePolicy === "highest"
                ? "Lấy điểm cao nhất trong mọi lần nộp bài để đưa vào bảng xếp hạng."
                : "Lấy điểm của lần thi mới nhất ghi nhận vào kết quả chung cuộc."}
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />
            <div>
              <strong className="text-foreground">Thời gian nghỉ:</strong>{" "}
              {cooldownMinutes > 0
                ? `Thí sinh phải đợi ${cooldownMinutes} phút sau khi nộp bài mới được phép thi lượt tiếp theo.`
                : "Thí sinh có thể bắt đầu lượt thi mới ngay lập tức mà không cần chờ."}
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Zap className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />
            <div>
              <strong className="text-foreground">Hiển thị điểm:</strong>{" "}
              {showScoreImmediately
                ? "Học sinh được xem tổng điểm và số câu đúng/sai ngay sau khi nộp."
                : "Điểm số được tạm ẩn cho đến khi có thông báo công bố chính thức."}
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Shield className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />
            <div>
              <strong className="text-foreground">Bảo mật đề thi:</strong>{" "}
              {getExplanationPolicyText(showExplanationPolicy)}
            </div>
          </div>

          <div className="border-border bg-muted/40 text-muted-foreground rounded-md border p-2.5 text-[11px]">
            Lưu ý: Các đề thi đã thiết lập quy chế riêng sẽ ưu tiên cấu hình cụ thể của đề đó.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
