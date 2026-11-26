import { type InferInsertModel, type InferSelectModel, relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { quizSubItems, quizzes } from "./quizzes";
import { users } from "./users";

export const attemptStatusEnum = pgEnum("attempt_status", [
  "in_progress",
  "submitted",
  "abandoned",
]);

export const examAttempts = pgTable(
  "exam_attempts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    status: attemptStatusEnum("status").default("in_progress").notNull(),
    score: numeric("score", { precision: 5, scale: 2 }),
    totalAnswered: integer("total_answered").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_exam_attempts_quiz_user").on(table.quizId, table.userId),
    index("idx_exam_attempts_user_id").on(table.userId),
    uniqueIndex("uq_exam_attempts_one_in_progress")
      .on(table.quizId, table.userId)
      .where(sql`${table.status} = 'in_progress'`),
  ],
);

export const examAnswers = pgTable(
  "exam_answers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    attemptId: uuid("attempt_id")
      .notNull()
      .references(() => examAttempts.id, { onDelete: "cascade" }),
    subItemId: uuid("sub_item_id")
      .notNull()
      .references(() => quizSubItems.id, { onDelete: "cascade" }),
    selectedAnswer: text("selected_answer"),
    isCorrect: boolean("is_correct"),
    pointsEarned: numeric("points_earned", { precision: 4, scale: 2 }).default("0.00"),
    isFlagged: boolean("is_flagged").default(false).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("uq_exam_answers_attempt_sub_item").on(table.attemptId, table.subItemId),
    index("idx_exam_answers_sub_item_id").on(table.subItemId),
  ],
);

export const examAttemptsRelations = relations(examAttempts, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [examAttempts.quizId],
    references: [quizzes.id],
  }),
  user: one(users, {
    fields: [examAttempts.userId],
    references: [users.id],
  }),
  answers: many(examAnswers),
}));

export const examAnswersRelations = relations(examAnswers, ({ one }) => ({
  attempt: one(examAttempts, {
    fields: [examAnswers.attemptId],
    references: [examAttempts.id],
  }),
  subItem: one(quizSubItems, {
    fields: [examAnswers.subItemId],
    references: [quizSubItems.id],
  }),
}));

export type TExamAttempt = InferSelectModel<typeof examAttempts>;
export type TNewExamAttempt = InferInsertModel<typeof examAttempts>;
export type TAttemptStatus = (typeof attemptStatusEnum.enumValues)[number];

export type TExamAnswer = InferSelectModel<typeof examAnswers>;
export type TNewExamAnswer = InferInsertModel<typeof examAnswers>;
