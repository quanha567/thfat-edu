import { type InferInsertModel, type InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgSequence,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { users } from "./users";

export const quizStatusEnum = pgEnum("quiz_status", ["draft", "published", "archived"]);

export const sectionTypeEnum = pgEnum("section_type", [
  "true_false",
  "group_mcq",
  "matching",
  "short_answer",
]);

export const quizCodeSeq = pgSequence("quiz_code_seq");

export const quizzes = pgTable("quizzes", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 16 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes").default(50).notNull(),
  totalPoints: numeric("total_points", { precision: 5, scale: 2 }).default("150.00").notNull(),
  status: quizStatusEnum("status").default("draft").notNull(),
  pdfUrl: text("pdf_url"),
  maxAttempts: integer("max_attempts"),
  scorePolicy: varchar("score_policy", { length: 32 }),
  cooldownMinutes: integer("cooldown_minutes"),
  showScoreImmediately: boolean("show_score_immediately"),
  showExplanationPolicy: varchar("show_explanation_policy", { length: 32 }),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const quizSections = pgTable(
  "quiz_sections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    sectionType: sectionTypeEnum("section_type").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    orderIndex: integer("order_index").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_quiz_sections_quiz_id").on(table.quizId)],
);

export const quizQuestions = pgTable(
  "quiz_questions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sectionId: uuid("section_id")
      .notNull()
      .references(() => quizSections.id, { onDelete: "cascade" }),
    orderIndex: integer("order_index").default(0).notNull(),
    contextContent: text("context_content").notNull(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_quiz_questions_section_id").on(table.sectionId)],
);

export const quizSubItems = pgTable(
  "quiz_sub_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    questionId: uuid("question_id")
      .notNull()
      .references(() => quizQuestions.id, { onDelete: "cascade" }),
    orderIndex: integer("order_index").default(0).notNull(),
    label: varchar("label", { length: 32 }).notNull(),
    content: text("content").notNull(),
    options: jsonb("options").$type<string[]>(),
    correctAnswer: text("correct_answer"),
    acceptableAnswers: jsonb("acceptable_answers").$type<string[]>(),
    points: numeric("points", { precision: 4, scale: 2 }).default("1.50").notNull(),
    explanation: text("explanation"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_quiz_sub_items_question_id").on(table.questionId)],
);

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  author: one(users, {
    fields: [quizzes.createdBy],
    references: [users.id],
  }),
  sections: many(quizSections),
}));

export const quizSectionsRelations = relations(quizSections, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [quizSections.quizId],
    references: [quizzes.id],
  }),
  questions: many(quizQuestions),
}));

export const quizQuestionsRelations = relations(quizQuestions, ({ one, many }) => ({
  section: one(quizSections, {
    fields: [quizQuestions.sectionId],
    references: [quizSections.id],
  }),
  subItems: many(quizSubItems),
}));

export const quizSubItemsRelations = relations(quizSubItems, ({ one }) => ({
  question: one(quizQuestions, {
    fields: [quizSubItems.questionId],
    references: [quizQuestions.id],
  }),
}));

export type TQuiz = InferSelectModel<typeof quizzes>;
export type TNewQuiz = InferInsertModel<typeof quizzes>;
export type TQuizStatus = (typeof quizStatusEnum.enumValues)[number];

export type TQuizSection = InferSelectModel<typeof quizSections>;
export type TNewQuizSection = InferInsertModel<typeof quizSections>;
export type TSectionType = (typeof sectionTypeEnum.enumValues)[number];

export type TQuizQuestion = InferSelectModel<typeof quizQuestions>;
export type TNewQuizQuestion = InferInsertModel<typeof quizQuestions>;

export type TQuizSubItem = InferSelectModel<typeof quizSubItems>;
export type TNewQuizSubItem = InferInsertModel<typeof quizSubItems>;
