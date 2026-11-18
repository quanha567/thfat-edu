import { type Static, t } from "elysia";

export const ScorePolicySchema = t.Union([t.Literal("highest"), t.Literal("latest")]);
export type TScorePolicy = Static<typeof ScorePolicySchema>;

export const ShowExplanationPolicySchema = t.Union([
  t.Literal("immediately"),
  t.Literal("exam_closed"),
  t.Literal("never"),
]);
export type TShowExplanationPolicy = Static<typeof ShowExplanationPolicySchema>;

export const ExamSettingsSchema = t.Object({
  maxAttempts: t.Number({ minimum: 0, default: 1 }),
  scorePolicy: ScorePolicySchema,
  cooldownMinutes: t.Number({ minimum: 0, default: 0 }),
  showScoreImmediately: t.Boolean({ default: true }),
  showExplanationPolicy: ShowExplanationPolicySchema,
});
export type TExamSettings = Static<typeof ExamSettingsSchema>;

export const UpdateExamSettingsSchema = t.Object({
  maxAttempts: t.Number({ minimum: 0 }),
  scorePolicy: ScorePolicySchema,
  cooldownMinutes: t.Number({ minimum: 0 }),
  showScoreImmediately: t.Boolean(),
  showExplanationPolicy: ShowExplanationPolicySchema,
});
export type TUpdateExamSettingsInput = Static<typeof UpdateExamSettingsSchema>;

export const DEFAULT_EXAM_SETTINGS: TExamSettings = {
  maxAttempts: 1,
  scorePolicy: "highest",
  cooldownMinutes: 0,
  showScoreImmediately: true,
  showExplanationPolicy: "immediately",
};
