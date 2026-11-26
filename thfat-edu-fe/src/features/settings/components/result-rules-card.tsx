"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { type Control, Controller } from "react-hook-form";

import { EXPLANATION_OPTIONS } from "../constants/settings.constants";
import { type TExamSettingsFormValues } from "../schemas/exam-settings.schema";
import { OptionButton } from "./option-button";

type TResultRulesCardProps = {
  control: Control<TExamSettingsFormValues>;
};

export function ResultRulesCard({ control }: TResultRulesCardProps) {
  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader className="border-border/40 border-b pb-4">
        <CardTitle className="text-base font-semibold">Quy định công bố kết quả</CardTitle>
        <CardDescription>
          Thời điểm học sinh được biết điểm số và xem lời giải chi tiết
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="border-border/70 flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-1 pr-4">
            <Label htmlFor="showScoreImmediately" className="cursor-pointer text-sm font-semibold">
              Xem điểm số ngay sau khi nộp bài
            </Label>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Bật để học sinh biết ngay điểm và số câu đúng/sai. Nếu tắt, điểm sẽ tạm ẩn.
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
              <div className="grid gap-3">
                {EXPLANATION_OPTIONS.map((option) => (
                  <OptionButton
                    key={option.value}
                    selected={field.value === option.value}
                    onSelect={() => field.onChange(option.value)}
                  >
                    <span className="text-foreground text-xs font-semibold">{option.title}</span>
                    <span className="text-muted-foreground text-xs leading-relaxed">
                      {option.description}
                    </span>
                  </OptionButton>
                ))}
              </div>
            )}
          />
        </div>

        <p className="text-muted-foreground text-xs">
          Đề thi có quy chế riêng sẽ ưu tiên cấu hình của đề đó.
        </p>
      </CardContent>
    </Card>
  );
}
