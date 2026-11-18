"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, History, Trophy } from "lucide-react";
import {
  type Control,
  Controller,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
  useWatch,
} from "react-hook-form";

import { ATTEMPT_PRESETS, COOLDOWN_PRESETS } from "../constants/settings.constants";
import { type TExamSettingsFormValues } from "../schemas/exam-settings.schema";

type TAttemptRulesCardProps = {
  control: Control<TExamSettingsFormValues>;
  register: UseFormRegister<TExamSettingsFormValues>;
  setValue: UseFormSetValue<TExamSettingsFormValues>;
  errors: FieldErrors<TExamSettingsFormValues>;
};

export function AttemptRulesCard({ control, register, setValue, errors }: TAttemptRulesCardProps) {
  const currentMaxAttempts = useWatch({ control, name: "maxAttempts" });
  const currentCooldown = useWatch({ control, name: "cooldownMinutes" });

  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader className="border-border/40 border-b pb-4">
        <div className="text-primary-600 dark:text-primary-400 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <CardTitle className="text-base font-semibold">Quy định lượt thi</CardTitle>
        </div>
        <CardDescription>
          Thiết lập số lần làm bài và chính sách ghi nhận điểm số mặc định cho toàn hệ thống
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="maxAttempts" className="text-sm font-medium">
              Số lần làm bài tối đa
            </Label>
            <span className="text-muted-foreground text-xs">
              Hiện tại:{" "}
              <strong>
                {currentMaxAttempts === 0 ? "Không giới hạn" : `${currentMaxAttempts} lần`}
              </strong>
            </span>
          </div>

          <Input
            id="maxAttempts"
            type="number"
            min={0}
            placeholder="1"
            {...register("maxAttempts", { valueAsNumber: true })}
            className={errors.maxAttempts ? "border-destructive sm:w-1/2" : "sm:w-1/2"}
          />

          <div className="flex flex-wrap gap-1.5 pt-1">
            {ATTEMPT_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() =>
                  setValue("maxAttempts", preset.value, { shouldDirty: true, shouldValidate: true })
                }
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                  currentMaxAttempts === preset.value
                    ? "bg-primary-100 text-primary-800 ring-primary-500/30 dark:bg-primary-950 dark:text-primary-300 ring-1"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {errors.maxAttempts && (
            <p className="text-destructive text-xs">{errors.maxAttempts.message}</p>
          )}
        </div>

        <div className="space-y-2.5">
          <Label className="text-sm font-medium">Chính sách tính điểm khi thi nhiều lần</Label>
          <Controller
            control={control}
            name="scorePolicy"
            render={({ field }) => (
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => field.onChange("highest")}
                  className={`flex flex-col items-start gap-1.5 rounded-xl border p-3.5 text-left transition-all ${
                    field.value === "highest"
                      ? "border-primary-500 bg-primary-50/50 ring-primary-500/30 dark:border-primary-600 dark:bg-primary-950/30 ring-1"
                      : "border-border/70 hover:border-border hover:bg-muted/30"
                  }`}
                >
                  <div className="text-foreground flex items-center gap-2 text-sm font-semibold">
                    <Trophy className="text-warning-500 h-4 w-4" />
                    Lấy điểm cao nhất (Highest)
                  </div>
                  <p className="text-muted-foreground text-xs leading-normal">
                    Lấy kết quả của lần thi đạt điểm cao nhất để xếp hạng và hiển thị trên hồ sơ.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => field.onChange("latest")}
                  className={`flex flex-col items-start gap-1.5 rounded-xl border p-3.5 text-left transition-all ${
                    field.value === "latest"
                      ? "border-primary-500 bg-primary-50/50 ring-primary-500/30 dark:border-primary-600 dark:bg-primary-950/30 ring-1"
                      : "border-border/70 hover:border-border hover:bg-muted/30"
                  }`}
                >
                  <div className="text-foreground flex items-center gap-2 text-sm font-semibold">
                    <History className="text-primary-500 h-4 w-4" />
                    Lấy lần thi gần nhất (Latest)
                  </div>
                  <p className="text-muted-foreground text-xs leading-normal">
                    Lấy điểm của lần nộp bài mới nhất ghi nhận vào kết quả chung cuộc.
                  </p>
                </button>
              </div>
            )}
          />
        </div>

        <div className="border-border/40 space-y-2.5 border-t pt-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="cooldownMinutes" className="text-sm font-medium">
              Thời gian nghỉ giữa các lần thi (Phút)
            </Label>
            <span className="text-muted-foreground text-xs">
              Hiện tại:{" "}
              <strong>{currentCooldown === 0 ? "Thi lại ngay" : `${currentCooldown} phút`}</strong>
            </span>
          </div>

          <Input
            id="cooldownMinutes"
            type="number"
            min={0}
            placeholder="0"
            {...register("cooldownMinutes", { valueAsNumber: true })}
            className={errors.cooldownMinutes ? "border-destructive sm:w-1/2" : "sm:w-1/2"}
          />

          <div className="flex flex-wrap gap-1.5 pt-1">
            {COOLDOWN_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() =>
                  setValue("cooldownMinutes", preset.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                  currentCooldown === preset.value
                    ? "bg-primary-100 text-primary-800 ring-primary-500/30 dark:bg-primary-950 dark:text-primary-300 ring-1"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {errors.cooldownMinutes && (
            <p className="text-destructive text-xs">{errors.cooldownMinutes.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
