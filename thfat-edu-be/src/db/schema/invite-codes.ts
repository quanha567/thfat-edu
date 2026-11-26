import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { users } from "./users";

export const inviteCodes = pgTable(
  "invite_codes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 16 }).notNull().unique(),
    note: varchar("note", { length: 255 }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    usedAt: timestamp("used_at", { withTimezone: true }),
    usedByUserId: uuid("used_by_user_id").references(() => users.id, { onDelete: "set null" }),
    createdById: uuid("created_by_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_invite_codes_created_at").on(table.createdAt)],
);

export type TInviteCode = InferSelectModel<typeof inviteCodes>;
export type TNewInviteCode = InferInsertModel<typeof inviteCodes>;
