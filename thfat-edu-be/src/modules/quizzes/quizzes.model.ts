import { type Static, t } from "elysia";

export const QuizStatusSchema = t.Union([
  t.Literal("draft"),
  t.Literal("published"),
  t.Literal("archived"),
]);

export const SectionTypeSchema = t.Union([
  t.Literal("true_false"),
  t.Literal("group_mcq"),
  t.Literal("matching"),
  t.Literal("short_answer"),
]);

export const QuizListQuerySchema = t.Object({
  page: t.Optional(t.Numeric({ default: 1 })),
  limit: t.Optional(t.Numeric({ default: 10 })),
  status: t.Optional(QuizStatusSchema),
  search: t.Optional(t.String()),
});

export type TQuizListQuery = Static<typeof QuizListQuerySchema>;

export const QuizSubItemInputSchema = t.Object({
  id: t.Optional(t.String()),
  orderIndex: t.Number(),
  label: t.String(),
  content: t.String(),
  options: t.Optional(t.Array(t.String())),
  correctAnswer: t.Optional(t.String()),
  acceptableAnswers: t.Optional(t.Array(t.String())),
  points: t.String(),
  explanation: t.Optional(t.String()),
});

export type TQuizSubItemInput = Static<typeof QuizSubItemInputSchema>;

export const QuizQuestionInputSchema = t.Object({
  id: t.Optional(t.String()),
  orderIndex: t.Number(),
  contextContent: t.String(),
  imageUrl: t.Optional(t.String()),
  subItems: t.Array(QuizSubItemInputSchema),
});

export type TQuizQuestionInput = Static<typeof QuizQuestionInputSchema>;

export const QuizSectionInputSchema = t.Object({
  id: t.Optional(t.String()),
  sectionType: SectionTypeSchema,
  title: t.String(),
  orderIndex: t.Number(),
  questions: t.Array(QuizQuestionInputSchema),
});

export type TQuizSectionInput = Static<typeof QuizSectionInputSchema>;

export const CreateQuizSchema = t.Object({
  title: t.String({ minLength: 1, maxLength: 255 }),
  description: t.Optional(t.String()),
  durationMinutes: t.Optional(t.Number({ default: 50 })),
  totalPoints: t.Optional(t.String({ default: "150.00" })),
  status: t.Optional(QuizStatusSchema),
  pdfUrl: t.Optional(t.String()),
  sections: t.Optional(t.Array(QuizSectionInputSchema)),
});

export type TCreateQuizInput = Static<typeof CreateQuizSchema>;

export const UpdateQuizSchema = t.Object({
  title: t.Optional(t.String({ minLength: 1, maxLength: 255 })),
  description: t.Optional(t.String()),
  durationMinutes: t.Optional(t.Number()),
  totalPoints: t.Optional(t.String()),
  status: t.Optional(QuizStatusSchema),
  pdfUrl: t.Optional(t.String()),
  sections: t.Optional(t.Array(QuizSectionInputSchema)),
});

export type TUpdateQuizInput = Static<typeof UpdateQuizSchema>;

export const ImportPdfSchema = t.Object({
  title: t.Optional(t.String()),
  pdfBase64: t.String({ minLength: 1 }),
  pdfUrl: t.Optional(t.String()),
});

export type TImportPdfInput = Static<typeof ImportPdfSchema>;

export const QuizListItemSchema = t.Object({
  id: t.String(),
  title: t.String(),
  description: t.Nullable(t.String()),
  durationMinutes: t.Number(),
  totalPoints: t.String(),
  status: QuizStatusSchema,
  pdfUrl: t.Nullable(t.String()),
  totalQuestions: t.Number(),
  totalSubItems: t.Number(),
  createdAt: t.String(),
  updatedAt: t.String(),
});

export const QuizListResponseSchema = t.Object({
  items: t.Array(QuizListItemSchema),
  total: t.Number(),
  page: t.Number(),
  limit: t.Number(),
});

export type TQuizListResponse = Static<typeof QuizListResponseSchema>;
