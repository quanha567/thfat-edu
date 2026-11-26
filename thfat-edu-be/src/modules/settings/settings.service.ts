import { eq } from "drizzle-orm";

import { type Database, db } from "../../db";
import { systemSettings, users } from "../../db/schema";
import {
  DEFAULT_EXAM_SETTINGS,
  DEFAULT_SITE_INFO,
  type TExamSettings,
  type TExamSettingsResponse,
  type TSettingsMeta,
  type TSiteInfo,
  type TSiteInfoResponse,
  type TUpdateExamSettingsInput,
  type TUpdateSiteInfoInput,
} from "./settings.model";

const EXAM_KEY = "exam_config";
const SITE_KEY = "site_info";

function readString(value: Record<string, unknown>, key: keyof TSiteInfo): string {
  const raw = value[key];

  return typeof raw === "string" ? raw : DEFAULT_SITE_INFO[key];
}

function normalizeSiteInfo(value: unknown): TSiteInfo {
  if (typeof value !== "object" || value === null) {
    return { ...DEFAULT_SITE_INFO };
  }

  const record = value as Record<string, unknown>;
  const siteName = readString(record, "siteName").trim();

  return {
    siteName: siteName || DEFAULT_SITE_INFO.siteName,
    slogan: readString(record, "slogan"),
    contactEmail: readString(record, "contactEmail"),
    facebookUrl: readString(record, "facebookUrl"),
    youtubeUrl: readString(record, "youtubeUrl"),
    zaloUrl: readString(record, "zaloUrl"),
    tiktokUrl: readString(record, "tiktokUrl"),
    telegramUrl: readString(record, "telegramUrl"),
    instagramUrl: readString(record, "instagramUrl"),
  };
}

export class SettingsService {
  private cachedExamSettings: TExamSettings | null = null;

  constructor(private readonly database: Database = db) {}

  public async getExamSettings(): Promise<TExamSettings> {
    if (this.cachedExamSettings) {
      return this.cachedExamSettings;
    }

    const [row] = await this.database
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, EXAM_KEY))
      .limit(1);

    if (!row || !row.value) {
      this.cachedExamSettings = { ...DEFAULT_EXAM_SETTINGS };

      return this.cachedExamSettings;
    }

    const value = row.value as Partial<TExamSettings>;

    this.cachedExamSettings = {
      maxAttempts:
        typeof value.maxAttempts === "number"
          ? value.maxAttempts
          : DEFAULT_EXAM_SETTINGS.maxAttempts,
      scorePolicy: value.scorePolicy === "latest" ? "latest" : "highest",
      cooldownMinutes:
        typeof value.cooldownMinutes === "number"
          ? value.cooldownMinutes
          : DEFAULT_EXAM_SETTINGS.cooldownMinutes,
      showScoreImmediately:
        typeof value.showScoreImmediately === "boolean"
          ? value.showScoreImmediately
          : DEFAULT_EXAM_SETTINGS.showScoreImmediately,
      showExplanationPolicy:
        value.showExplanationPolicy === "exam_closed" || value.showExplanationPolicy === "never"
          ? value.showExplanationPolicy
          : "immediately",
    };

    return this.cachedExamSettings;
  }

  public async getExamSettingsWithMeta(): Promise<TExamSettingsResponse> {
    const settings = await this.getExamSettings();
    const meta = await this.getMeta(EXAM_KEY);

    return { ...settings, ...meta };
  }

  public async updateExamSettings(
    input: TUpdateExamSettingsInput,
    userId: string,
  ): Promise<TExamSettingsResponse> {
    await this.upsert({
      key: EXAM_KEY,
      category: "exam",
      description: "Cấu hình quy chế và tham số khảo thí mặc định",
      value: input,
      userId,
    });

    this.cachedExamSettings = input;

    return this.getExamSettingsWithMeta();
  }

  public async getSiteInfo(): Promise<TSiteInfo> {
    const [row] = await this.database
      .select({ value: systemSettings.value })
      .from(systemSettings)
      .where(eq(systemSettings.key, SITE_KEY))
      .limit(1);

    return normalizeSiteInfo(row?.value);
  }

  public async getSiteInfoWithMeta(): Promise<TSiteInfoResponse> {
    const info = await this.getSiteInfo();
    const meta = await this.getMeta(SITE_KEY);

    return { ...info, ...meta };
  }

  public async updateSiteInfo(
    input: TUpdateSiteInfoInput,
    userId: string,
  ): Promise<TSiteInfoResponse> {
    await this.upsert({
      key: SITE_KEY,
      category: "site",
      description: "Thông tin nhận diện và liên hệ hiển thị công khai",
      value: { ...input, siteName: input.siteName.trim() },
      userId,
    });

    return this.getSiteInfoWithMeta();
  }

  private async getMeta(key: string): Promise<TSettingsMeta> {
    const [row] = await this.database
      .select({ updatedAt: systemSettings.updatedAt, updatedByName: users.fullName })
      .from(systemSettings)
      .leftJoin(users, eq(systemSettings.updatedBy, users.id))
      .where(eq(systemSettings.key, key))
      .limit(1);

    if (!row) {
      return { updatedAt: null, updatedByName: null };
    }

    return { updatedAt: row.updatedAt.toISOString(), updatedByName: row.updatedByName };
  }

  private async upsert(options: {
    key: string;
    category: string;
    description: string;
    value: unknown;
    userId: string;
  }): Promise<void> {
    const { key, category, description, value, userId } = options;
    const updatedAt = new Date();

    await this.database
      .insert(systemSettings)
      .values({ key, category, description, value, updatedBy: userId, updatedAt })
      .onConflictDoUpdate({
        target: systemSettings.key,
        set: { value, updatedBy: userId, updatedAt },
      });
  }
}

export const settingsService = new SettingsService();
