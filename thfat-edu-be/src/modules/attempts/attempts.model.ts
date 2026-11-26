import { type Static, t } from "elysia";

export const SyncAnswerItemSchema = t.Object({
  subItemId: t.String({ format: "uuid" }),
  selectedAnswer: t.Nullable(t.String({ maxLength: 2000 })),
  isFlagged: t.Optional(t.Boolean()),
});

export const SyncAnswersBodySchema = t.Object({
  answers: t.Array(SyncAnswerItemSchema, { maxItems: 500 }),
});

export const SubmitAttemptResponseSchema = t.Object({
  attemptId: t.String(),
  score: t.String(),
  totalQuestionsAnswered: t.Number(),
  submittedAt: t.String(),
  status: t.String(),
  message: t.String(),
});

export const AttemptResultSchema = t.Object({
  attemptId: t.String(),
  quizId: t.String(),
  quizTitle: t.String(),
  studentName: t.String(),
  studentCode: t.Nullable(t.String()),
  score: t.String(),
  totalPoints: t.String(),
  totalAnswered: t.Number(),
  totalSubItems: t.Number(),
  startedAt: t.String(),
  submittedAt: t.String(),
  durationMinutes: t.Number(),
  timeSpentSeconds: t.Number(),
  showScoreImmediately: t.Optional(t.Boolean()),
});

export const StudentExamListItemSchema = t.Object({
  id: t.String(),
  title: t.String(),
  description: t.Nullable(t.String()),
  durationMinutes: t.Number(),
  totalPoints: t.String(),
  totalQuestions: t.Number(),
  totalSubItems: t.Number(),
  attemptStatus: t.Union([
    t.Literal("not_started"),
    t.Literal("in_progress"),
    t.Literal("submitted"),
  ]),
  attemptId: t.Nullable(t.String()),
  score: t.Nullable(t.String()),
  submittedAt: t.Nullable(t.String()),
  maxAttempts: t.Nullable(t.Number()),
  attemptCount: t.Number(),
  canTakeExam: t.Boolean(),
  cooldownRemainingSeconds: t.Number(),
  displayScore: t.Nullable(t.String()),
});

export const StudentExamListResponseSchema = t.Object({
  items: t.Array(StudentExamListItemSchema),
  total: t.Number(),
  page: t.Number(),
  limit: t.Number(),
});

export type TSyncAnswerItem = Static<typeof SyncAnswerItemSchema>;
export type TSyncAnswersBody = Static<typeof SyncAnswersBodySchema>;
export type TSubmitAttemptResponse = Static<typeof SubmitAttemptResponseSchema>;
export type TAttemptResult = Static<typeof AttemptResultSchema>;
export type TStudentExamListItem = Static<typeof StudentExamListItemSchema>;
export type TStudentExamListResponse = Static<typeof StudentExamListResponseSchema>;
