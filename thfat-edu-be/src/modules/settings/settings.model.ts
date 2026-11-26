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

export const SettingsMetaSchema = t.Object({
  updatedAt: t.Nullable(t.String()),
  updatedByName: t.Nullable(t.String()),
});
export type TSettingsMeta = Static<typeof SettingsMetaSchema>;

export const ExamSettingsResponseSchema = t.Object({
  ...ExamSettingsSchema.properties,
  ...SettingsMetaSchema.properties,
});
export type TExamSettingsResponse = Static<typeof ExamSettingsResponseSchema>;

const OPTIONAL_URL_PATTERN = "^(https?://\\S+)?$";
const OPTIONAL_EMAIL_PATTERN = "^([^\\s@]+@[^\\s@]+\\.[^\\s@]+)?$";

const OptionalUrlSchema = t.String({ maxLength: 500, pattern: OPTIONAL_URL_PATTERN });

export const SiteInfoSchema = t.Object({
  siteName: t.String({ minLength: 1, maxLength: 60 }),
  slogan: t.String({ maxLength: 120 }),
  contactEmail: t.String({ maxLength: 254, pattern: OPTIONAL_EMAIL_PATTERN }),
  facebookUrl: OptionalUrlSchema,
  youtubeUrl: OptionalUrlSchema,
  zaloUrl: OptionalUrlSchema,
  tiktokUrl: OptionalUrlSchema,
  telegramUrl: OptionalUrlSchema,
  instagramUrl: OptionalUrlSchema,
});
export type TSiteInfo = Static<typeof SiteInfoSchema>;

export const UpdateSiteInfoSchema = SiteInfoSchema;
export type TUpdateSiteInfoInput = Static<typeof UpdateSiteInfoSchema>;

export const SiteInfoResponseSchema = t.Object({
  ...SiteInfoSchema.properties,
  ...SettingsMetaSchema.properties,
});
export type TSiteInfoResponse = Static<typeof SiteInfoResponseSchema>;

export const DEFAULT_SITE_INFO: TSiteInfo = {
  siteName: "ThFat Edu",
  slogan: "Học chắc bản chất, vững vàng phòng thi",
  contactEmail: "",
  facebookUrl: "",
  youtubeUrl: "",
  zaloUrl: "",
  tiktokUrl: "",
  telegramUrl: "",
  instagramUrl: "",
};
