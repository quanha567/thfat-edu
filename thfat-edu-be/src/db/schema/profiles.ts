import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { date, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { users } from "./users";

export const studentProfiles = pgTable("student_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  studentCode: varchar("student_code", { length: 50 }),
  grade: varchar("grade", { length: 20 }),
  schoolName: varchar("school_name", { length: 255 }),
  dateOfBirth: date("date_of_birth"),
  parentPhone: varchar("parent_phone", { length: 20 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const teacherProfiles = pgTable("teacher_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  teacherCode: varchar("teacher_code", { length: 50 }),
  department: varchar("department", { length: 100 }),
  bio: text("bio"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type TStudentProfile = InferSelectModel<typeof studentProfiles>;
export type TNewStudentProfile = InferInsertModel<typeof studentProfiles>;

export type TTeacherProfile = InferSelectModel<typeof teacherProfiles>;
export type TNewTeacherProfile = InferInsertModel<typeof teacherProfiles>;
