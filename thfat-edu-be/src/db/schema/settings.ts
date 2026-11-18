import { type InferInsertModel, type InferSelectModel, relations } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { users } from "./users";

export const systemSettings = pgTable("system_settings", {
  key: varchar("key", { length: 64 }).primaryKey(),
  value: jsonb("value").notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  description: text("description"),
  updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const systemSettingsRelations = relations(systemSettings, ({ one }) => ({
  updater: one(users, {
    fields: [systemSettings.updatedBy],
    references: [users.id],
  }),
}));

export type TSystemSetting = InferSelectModel<typeof systemSettings>;
export type TNewSystemSetting = InferInsertModel<typeof systemSettings>;
