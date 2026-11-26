"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { OptionButton, PresetChips } from "./option-button";

type TAttemptRulesCardProps = {
  control: Control<TExamSettingsFormValues>;
  register: UseFormRegister<TExamSettingsFormValues>;
  setValue: UseFormSetValue<TExamSettingsFormValues>;
  errors: FieldErrors<TExamSettingsFormValues>;
};

export function AttemptRulesCard({ control, register, setValue, errors }: TAttemptRulesCardProps) {
  const currentMaxAttempts = useWatch({ control, name: "maxAttempts" });
  const currentCooldown = useWatch({ control, name: "cooldownMinutes" });

  function applyPreset(name: "maxAttempts" | "cooldownMinutes", value: number) {
    setValue(name, value, { shouldDirty: true, shouldValidate: true });
  }

  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader className="border-border/40 border-b pb-4">
        <CardTitle className="text-base font-semibold">Quy định lượt thi</CardTitle>
        <CardDescription>
          Số lần làm bài và chính sách ghi nhận điểm mặc định cho toàn hệ thống
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

          <PresetChips
            presets={ATTEMPT_PRESETS}
            current={currentMaxAttempts}
            onSelect={(value) => applyPreset("maxAttempts", value)}
          />

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
                <OptionButton
                  selected={field.value === "highest"}
                  onSelect={() => field.onChange("highest")}
                >
                  <span className="text-foreground text-sm font-semibold">Điểm cao nhất</span>
                  <span className="text-muted-foreground text-xs leading-normal">
                    Lấy lần thi đạt điểm cao nhất để xếp hạng và hiển thị trên hồ sơ.
                  </span>
                </OptionButton>

                <OptionButton
                  selected={field.value === "latest"}
                  onSelect={() => field.onChange("latest")}
                >
                  <span className="text-foreground text-sm font-semibold">Lần thi gần nhất</span>
                  <span className="text-muted-foreground text-xs leading-normal">
                    Lấy điểm của lần nộp bài mới nhất làm kết quả chung cuộc.
                  </span>
                </OptionButton>
              </div>
            )}
          />
        </div>

        <div className="border-border/40 space-y-2.5 border-t pt-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="cooldownMinutes" className="text-sm font-medium">
              Thời gian nghỉ giữa các lần thi (phút)
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

          <PresetChips
            presets={COOLDOWN_PRESETS}
            current={currentCooldown}
            onSelect={(value) => applyPreset("cooldownMinutes", value)}
          />

          {errors.cooldownMinutes && (
            <p className="text-destructive text-xs">{errors.cooldownMinutes.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
