"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CalendarCheck, Eye, ShieldCheck, Zap } from "lucide-react";
import { type Control, Controller } from "react-hook-form";

import { type TExamSettingsFormValues } from "../schemas/exam-settings.schema";

type TResultRulesCardProps = {
  control: Control<TExamSettingsFormValues>;
};

const EXPLANATION_OPTIONS = [
  {
    value: "immediately",
    icon: Zap,
    title: "Hiển thị ngay sau nộp",
    description: "Thí sinh xem được đáp án đúng và lời giải chi tiết ngay khi thi xong.",
  },
  {
    value: "exam_closed",
    icon: CalendarCheck,
    title: "Khi kỳ thi kết thúc",
    description: "Chỉ hiển thị lời giải khi toàn bộ kỳ thi đã chính thức đóng hạn làm bài.",
  },
  {
    value: "never",
    icon: ShieldCheck,
    title: "Bảo mật đề (Không hiển thị)",
    description: "Ẩn tuyệt đối đáp án và giải thích để tránh lộ ngân hàng câu hỏi.",
  },
] as const;

export function ResultRulesCard({ control }: TResultRulesCardProps) {
  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader className="border-border/40 border-b pb-4">
        <div className="text-primary-600 dark:text-primary-400 flex items-center gap-2">
          <Eye className="h-5 w-5" />
          <CardTitle className="text-base font-semibold">Quy định công bố kết quả</CardTitle>
        </div>
        <CardDescription>
          Kiểm soát thời điểm thí sinh được biết điểm số và xem lời giải chi tiết
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="border-border/70 hover:bg-muted/20 flex items-center justify-between rounded-xl border p-4 transition-colors">
          <div className="space-y-1 pr-4">
            <Label htmlFor="showScoreImmediately" className="cursor-pointer text-sm font-semibold">
              Xem điểm số ngay sau khi nộp bài
            </Label>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Bật để học sinh biết ngay số điểm và tổng số câu đúng/sai sau khi hoàn thành. Nếu tắt,
              điểm sẽ tạm ẩn.
            </p>
          </div>
          <Controller
            control={control}
            name="showScoreImmediately"
            render={({ field }) => (
              <Switch
                id="showScoreImmediately"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="space-y-2.5">
          <Label className="text-sm font-medium">
            Quy định xem lại đáp án đúng và lời giải chi tiết
          </Label>
          <Controller
            control={control}
            name="showExplanationPolicy"
            render={({ field }) => (
              <div className="grid gap-3 sm:grid-cols-3">
                {EXPLANATION_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = field.value === opt.value;

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => field.onChange(opt.value)}
                      className={`flex flex-col items-start gap-2 rounded-xl border p-3.5 text-left transition-all ${
                        isSelected
                          ? "border-primary-500 bg-primary-50/50 ring-primary-500/30 dark:border-primary-600 dark:bg-primary-950/30 ring-1"
                          : "border-border/70 hover:border-border hover:bg-muted/30"
                      }`}
                    >
                      <div className="text-foreground flex items-center gap-2 text-xs font-semibold">
                        <Icon
                          className={`h-4 w-4 ${isSelected ? "text-primary-600 dark:text-primary-400" : "text-muted-foreground"}`}
                        />
                        <span>{opt.title}</span>
                      </div>
                      <p className="text-muted-foreground text-xxs leading-relaxed">
                        {opt.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
