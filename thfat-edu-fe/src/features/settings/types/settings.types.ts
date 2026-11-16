export type TScorePolicy = "highest" | "latest";

export type TShowExplanationPolicy = "immediately" | "exam_closed" | "never";

export type TExamSettings = {
  maxAttempts: number;
  scorePolicy: TScorePolicy;
  cooldownMinutes: number;
  showScoreImmediately: boolean;
  showExplanationPolicy: TShowExplanationPolicy;
};

export type TUpdateExamSettingsInput = {
  maxAttempts: number;
  scorePolicy: TScorePolicy;
  cooldownMinutes: number;
  showScoreImmediately: boolean;
  showExplanationPolicy: TShowExplanationPolicy;
};
