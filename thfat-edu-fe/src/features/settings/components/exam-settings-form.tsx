"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { DEFAULT_EXAM_SETTINGS_VALUES } from "../constants/settings.constants";
import { useExamSettings } from "../hooks/use-exam-settings";
import { useUpdateExamSettings } from "../hooks/use-update-exam-settings";
import { examSettingsSchema, type TExamSettingsFormValues } from "../schemas/exam-settings.schema";
import { type TExamSettings } from "../types/settings.types";
import { AttemptRulesCard } from "./attempt-rules-card";
import { FormActionBar } from "./form-action-bar";
import { ResultRulesCard } from "./result-rules-card";

function toFormValues(settings: TExamSettings): TExamSettingsFormValues {
  return {
    maxAttempts: settings.maxAttempts,
    scorePolicy: settings.scorePolicy,
    cooldownMinutes: settings.cooldownMinutes,
    showScoreImmediately: settings.showScoreImmediately,
    showExplanationPolicy: settings.showExplanationPolicy,
  };
}

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
    defaultValues: DEFAULT_EXAM_SETTINGS_VALUES,
  });

  useEffect(() => {
    if (settings) {
      reset(toFormValues(settings));
    }
  }, [settings, reset]);

  if (isLoading) {
    return (
      <div className="grid gap-6 xl:grid-cols-2">
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((values) => updateMutation.mutate(values))}
      className="space-y-6 pb-12"
    >
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <AttemptRulesCard
          control={control}
          register={register}
          setValue={setValue}
          errors={errors}
        />
        <ResultRulesCard control={control} />
      </div>
      <FormActionBar
        meta={settings}
        isDirty={isDirty}
        isPending={updateMutation.isPending}
        onReset={() => settings && reset(toFormValues(settings))}
      />
    </form>
  );
}
