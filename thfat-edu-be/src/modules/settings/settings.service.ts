import { eq } from "drizzle-orm";

import { type Database, db } from "../../db";
import { systemSettings } from "../../db/schema";
import {
  DEFAULT_EXAM_SETTINGS,
  type TExamSettings,
  type TUpdateExamSettingsInput,
} from "./settings.model";

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
      .where(eq(systemSettings.key, "exam_config"))
      .limit(1);

    if (!row || !row.value) {
      this.cachedExamSettings = { ...DEFAULT_EXAM_SETTINGS };

      return this.cachedExamSettings;
    }

    const value = row.value as Partial<TExamSettings>;

    this.cachedExamSettings = {
      maxAttempts: typeof value.maxAttempts === "number" ? value.maxAttempts : DEFAULT_EXAM_SETTINGS.maxAttempts,
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

  public async updateExamSettings(
    input: TUpdateExamSettingsInput,
    userId: string,
  ): Promise<TExamSettings> {
    await this.database
      .insert(systemSettings)
      .values({
        key: "exam_config",
        category: "exam",
        description: "Cấu hình quy chế và tham số khảo thí mặc định",
        value: input,
        updatedBy: userId,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: systemSettings.key,
        set: {
          value: input,
          updatedBy: userId,
          updatedAt: new Date(),
        },
      });

    this.cachedExamSettings = input;

    return this.cachedExamSettings;
  }
}

export const settingsService = new SettingsService();
