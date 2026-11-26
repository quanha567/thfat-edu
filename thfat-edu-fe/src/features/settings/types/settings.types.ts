import { type Nullable } from "@thfat-edu/shared";

export type TScorePolicy = "highest" | "latest";

export type TShowExplanationPolicy = "immediately" | "exam_closed" | "never";

export type TSettingsMeta = {
  updatedAt: Nullable<string>;
  updatedByName: Nullable<string>;
};

export type TExamSettingsValues = {
  maxAttempts: number;
  scorePolicy: TScorePolicy;
  cooldownMinutes: number;
  showScoreImmediately: boolean;
  showExplanationPolicy: TShowExplanationPolicy;
};

export type TExamSettings = TExamSettingsValues & TSettingsMeta;

export type TUpdateExamSettingsInput = TExamSettingsValues;

export type TSiteInfoValues = {
  siteName: string;
  slogan: string;
  contactEmail: string;
  facebookUrl: string;
  youtubeUrl: string;
  zaloUrl: string;
  tiktokUrl: string;
  telegramUrl: string;
  instagramUrl: string;
};

export type TSiteInfo = TSiteInfoValues & TSettingsMeta;

export type TUpdateSiteInfoInput = TSiteInfoValues;
