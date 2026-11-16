"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useExamSettings } from "../hooks/use-exam-settings";
import { useUpdateExamSettings } from "../hooks/use-update-exam-settings";
import { examSettingsSchema, type TExamSettingsFormValues } from "../schemas/exam-settings.schema";
import { AttemptRulesCard } from "./attempt-rules-card";
import { ResultRulesCard } from "./result-rules-card";
import { SettingsPreviewPanel } from "./settings-preview-panel";

export function ExamSettingsForm() {
  const { data: settings, isLoading } = useExamSettings();
  const updateMutation = useUpdateExamSettings();

  const {
    control,
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<TExamSettingsFormValues>({
    resolver: zodResolver(examSettingsSchema),
    defaultValues: {
      maxAttempts: 1,
      scorePolicy: "highest",
      cooldownMinutes: 0,
      showScoreImmediately: true,
      showExplanationPolicy: "immediately",
    },
  });

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const onSubmit = (values: TExamSettingsFormValues) => {
    updateMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-7">
          <Skeleton className="h-72 w-full rounded-xl" />
          <Skeleton className="h-60 w-full rounded-xl" />
        </div>
        <div className="xl:col-span-5">
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-12">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        {/* Left Column: Form Controls */}
        <div className="space-y-6 xl:col-span-7">
          <AttemptRulesCard
            control={control}
            register={register}
            setValue={setValue}
            errors={errors}
          />

          <ResultRulesCard control={control} />

          <div className="border-border/80 bg-card flex items-center justify-between rounded-xl border p-4 shadow-2xs">
            <div>
              {isDirty ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <span className="inline-block size-2 animate-pulse rounded-full bg-amber-500" />
                  Có thay đổi chưa lưu
                </span>
              ) : (
                <span className="text-muted-foreground text-xs">
                  Cấu hình hiện tại đã đồng bộ với máy chủ
                </span>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!isDirty || updateMutation.isPending}
                onClick={() => settings && reset(settings)}
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Hủy thay đổi
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!isDirty || updateMutation.isPending}
                className="min-w-28"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Check className="mr-1.5 h-3.5 w-3.5" />
                    Lưu cấu hình
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Preview & Guidance Panel */}
        <div className="xl:col-span-5">
          <div className="sticky top-20">
            <SettingsPreviewPanel control={control} />
          </div>
        </div>
      </div>
    </form>
  );
}
