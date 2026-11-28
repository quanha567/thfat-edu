import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";

import { type Database, db } from "../../db";
import { containsPattern } from "../../db/like";
import {
  examAnswers,
  examAttempts,
  quizQuestions,
  quizSections,
  quizSubItems,
  quizzes,
  studentProfiles,
  type TAttemptStatus,
  type TExamAttempt,
  users,
} from "../../db/schema";
import { BadRequestError, NotFoundError } from "../../middlewares/error-handler";
import { loadQuizCounts, loadQuizStructure } from "../quizzes/quiz-structure";
import { type SettingsService, settingsService as defaultSettingsService } from "../settings";
import {
  type TAttemptResult,
  type TStudentExamListItem,
  type TStudentExamListResponse,
  type TSubmitAttemptResponse,
  type TSyncAnswerItem,
} from "./attempts.model";

// ── Grading Helpers ────────────────────────────────────────────────────

export function normalizeBooleanAnswer(value: unknown): "true" | "false" | null {
  if (typeof value !== "string" && typeof value !== "boolean" && typeof value !== "number") {
    return null;
  }

  const raw = String(value).trim().toLowerCase();

  if (["true", "t", "đ", "d", "1", "đúng", "dung"].includes(raw)) {
    return "true";
  }

  if (["false", "f", "s", "0", "sai"].includes(raw)) {
    return "false";
  }

  return null;
}

export function calculateGraduatedTrueFalsePoints(
  correctCount: number,
  totalPoints: number = 6.0,
): number {
  if (correctCount <= 0) {
    return 0;
  }

  if (totalPoints > 2.0) {
    const vsatScale: Record<number, number> = {
      0: 0,
      1: 1.0,
      2: 2.0,
      3: 3.0,
      4: 6.0,
    };
    const base = vsatScale[correctCount] ?? 0;

    return Number(((base / 6.0) * totalPoints).toFixed(2));
  }

  const moetScale: Record<number, number> = {
    0: 0,
    1: 0.1,
    2: 0.25,
    3: 0.5,
    4: 1.0,
  };

  const ratio = moetScale[correctCount] ?? 0;

  return Number((ratio * totalPoints).toFixed(2));
}

export function removeVietnameseTones(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

export function normalizeShortAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "").replace(",", ".");
}

export function isShortAnswerCorrect(
  userAnswer: string | null | undefined,
  correctAnswer: string | null | undefined,
  acceptableAnswers?: unknown,
): boolean {
  if (!userAnswer) {
    return false;
  }

  const normalizedUser = normalizeShortAnswer(userAnswer);
  const userNoTone = removeVietnameseTones(normalizedUser);

  const checkMatch = (target: string): boolean => {
    const normalizedTarget = normalizeShortAnswer(target);

    return (
      normalizedTarget === normalizedUser || removeVietnameseTones(normalizedTarget) === userNoTone
    );
  };

  if (correctAnswer && checkMatch(correctAnswer)) {
    return true;
  }

  if (Array.isArray(acceptableAnswers)) {
    return acceptableAnswers.some((ans) => {
      if (typeof ans === "string") {
        return checkMatch(ans);
      }

      return false;
    });
  }

  return false;
}

type TGradedAnswerRow = {
  attemptId: string;
  subItemId: string;
  selectedAnswer: string | null;
  isCorrect: boolean;
  pointsEarned: string;
};

// ── Service Options Types ──────────────────────────────────────────────

export type TListStudentExamsOptions = {
  page?: number;
  limit?: number;
  search?: string;
};

export type TExamRoomSubItem = {
  id: string;
  orderIndex: number;
  label: string;
  content: string;
  options: string[] | null;
  points: string;
};

export type TExamRoomQuestion = {
  id: string;
  orderIndex: number;
  contextContent: string;
  imageUrl: string | null;
  subItems: TExamRoomSubItem[];
};

export type TExamRoomSection = {
  id: string;
  sectionType: string;
  title: string;
  orderIndex: number;
  questions: TExamRoomQuestion[];
};

export type TExamRoomData = {
  attempt: {
    id: string;
    quizId: string;
    startedAt: string;
    durationMinutes: number;
    remainingSeconds: number;
    status: TAttemptStatus;
  };
  quiz: {
    id: string;
    title: string;
    description: string | null;
    durationMinutes: number;
    totalPoints: string;
    sections: TExamRoomSection[];
  };
  savedAnswers: Array<{
    subItemId: string;
    selectedAnswer: string | null;
    isFlagged: boolean;
  }>;
};

// ── Attempts Service ───────────────────────────────────────────────────

export class AttemptsService {
  constructor(
    private readonly database: Database = db,
    private readonly settingsService: SettingsService = defaultSettingsService,
  ) {}

  public async listStudentExams(
    userId: string | null = null,
    options: TListStudentExamsOptions = {},
  ): Promise<TStudentExamListResponse> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 10));
    const offset = (page - 1) * limit;

    const baseConditions = [eq(quizzes.status, "published"), sql`${quizzes.deletedAt} IS NULL`];

    if (options.search) {
      const pattern = containsPattern(options.search);
      const searchCondition = or(ilike(quizzes.title, pattern), ilike(quizzes.code, pattern));

      if (searchCondition) baseConditions.push(searchCondition);
    }

    const whereClause = and(...baseConditions);

    const [{ count }] = await this.database
      .select({ count: sql<number>`cast(count(${quizzes.id}) as integer)` })
      .from(quizzes)
      .where(whereClause);

    const globalSettings = await this.settingsService.getExamSettings();

    const quizRows = await this.database
      .select({
        id: quizzes.id,
        code: quizzes.code,
        title: quizzes.title,
        description: quizzes.description,
        durationMinutes: quizzes.durationMinutes,
        totalPoints: quizzes.totalPoints,
        maxAttempts: quizzes.maxAttempts,
        scorePolicy: quizzes.scorePolicy,
        cooldownMinutes: quizzes.cooldownMinutes,
        showScoreImmediately: quizzes.showScoreImmediately,
        showExplanationPolicy: quizzes.showExplanationPolicy,
      })
      .from(quizzes)
      .where(whereClause)
      .orderBy(desc(quizzes.createdAt))
      .limit(limit)
      .offset(offset);

    const items: TStudentExamListItem[] = [];
    const quizIds = quizRows.map((quiz) => quiz.id);
    const countsByQuiz = await loadQuizCounts(this.database, quizIds);
    const attemptsByQuiz = await this.loadUserAttemptsByQuiz(userId, quizIds);

    for (const quiz of quizRows) {
      const userAttempts = attemptsByQuiz.get(quiz.id) ?? [];

      const effectiveMaxAttempts = quiz.maxAttempts ?? globalSettings.maxAttempts;
      const effectiveScorePolicy = quiz.scorePolicy ?? globalSettings.scorePolicy;
      const effectiveCooldownMinutes = quiz.cooldownMinutes ?? globalSettings.cooldownMinutes;
      const effectiveShowScoreImmediately =
        quiz.showScoreImmediately ?? globalSettings.showScoreImmediately;

      const inProgressAttempt = userAttempts.find((a) => a.status === "in_progress") ?? null;
      const submittedAttempts = userAttempts.filter((a) => a.status === "submitted");
      const attemptCount = submittedAttempts.length;

      const cooldownRemainingSeconds = this.calculateCooldownRemainingSeconds(
        submittedAttempts,
        effectiveCooldownMinutes,
      );

      let canTakeExam = true;
      if (inProgressAttempt) {
        canTakeExam = true;
      } else if (effectiveMaxAttempts > 0 && attemptCount >= effectiveMaxAttempts) {
        canTakeExam = false;
      } else if (cooldownRemainingSeconds > 0) {
        canTakeExam = false;
      }

      let displayScore: string | null = null;
      if (submittedAttempts.length > 0 && effectiveShowScoreImmediately) {
        if (effectiveScorePolicy === "highest") {
          const validScores = submittedAttempts
            .map((a) => (a.score ? parseFloat(a.score) : 0))
            .filter((s) => !isNaN(s));
          displayScore = validScores.length > 0 ? Math.max(...validScores).toFixed(2) : null;
        } else {
          const sortedSubmitted = [...submittedAttempts].sort(
            (a, b) => (b.submittedAt?.getTime() ?? 0) - (a.submittedAt?.getTime() ?? 0),
          );
          displayScore = sortedSubmitted[0]?.score ?? null;
        }
      }

      const latestAttempt = userAttempts[0] ?? null;
      const { attemptStatus, attemptId, score, submittedAt } = await this.resolveAttemptStatus(
        latestAttempt,
        quiz.durationMinutes,
      );

      const totalQuestions = countsByQuiz.get(quiz.id)?.totalQuestions ?? 0;
      const totalSubItems = countsByQuiz.get(quiz.id)?.totalSubItems ?? 0;

      items.push({
        id: quiz.id,
        code: quiz.code,
        title: quiz.title,
        description: quiz.description,
        durationMinutes: quiz.durationMinutes,
        totalPoints: quiz.totalPoints,
        totalQuestions,
        totalSubItems,
        attemptStatus,
        attemptId,
        score: effectiveShowScoreImmediately ? score : null,
        submittedAt,
        maxAttempts: effectiveMaxAttempts > 0 ? effectiveMaxAttempts : null,
        attemptCount,
        canTakeExam,
        cooldownRemainingSeconds,
        displayScore,
      });
    }

    return {
      items,
      total: count,
      page,
      limit,
    };
  }

  public async startOrResumeAttempt(quizId: string, userId: string): Promise<TExamRoomData> {
    const [quiz] = await this.database
      .select()
      .from(quizzes)
      .where(and(eq(quizzes.id, quizId), eq(quizzes.status, "published"), sql`deleted_at IS NULL`))
      .limit(1);

    if (!quiz) {
      throw new NotFoundError("Đề thi không tồn tại hoặc chưa được phát hành.");
    }

    const globalSettings = await this.settingsService.getExamSettings();
    const effectiveMaxAttempts = quiz.maxAttempts ?? globalSettings.maxAttempts;
    const effectiveCooldownMinutes = quiz.cooldownMinutes ?? globalSettings.cooldownMinutes;

    const userAttempts = await this.database
      .select()
      .from(examAttempts)
      .where(and(eq(examAttempts.quizId, quizId), eq(examAttempts.userId, userId)))
      .orderBy(desc(examAttempts.createdAt));

    let inProgressAttempt = userAttempts.find((a) => a.status === "in_progress") ?? null;

    if (inProgressAttempt) {
      const endTime = inProgressAttempt.startedAt.getTime() + quiz.durationMinutes * 60 * 1000;
      if (Date.now() > endTime) {
        await this.submitAndGradeAttempt(inProgressAttempt.id, userId);
        inProgressAttempt = null;
      }
    }

    let attempt: TExamAttempt;

    if (inProgressAttempt) {
      attempt = inProgressAttempt;
    } else {
      const submittedAttempts = userAttempts.filter((a) => a.status === "submitted");

      if (effectiveMaxAttempts > 0 && submittedAttempts.length >= effectiveMaxAttempts) {
        throw new BadRequestError(
          `Bạn đã sử dụng hết số lần làm bài cho phép (tối đa ${effectiveMaxAttempts} lần).`,
        );
      }

      const cooldownRemainingSeconds = this.calculateCooldownRemainingSeconds(
        submittedAttempts,
        effectiveCooldownMinutes,
      );
      if (cooldownRemainingSeconds > 0) {
        const waitMinutes = Math.ceil(cooldownRemainingSeconds / 60);
        throw new BadRequestError(
          `Vui lòng đợi thêm ${waitMinutes} phút trước khi bắt đầu lượt thi tiếp theo.`,
        );
      }

      // Unique index một lượt `in_progress` cho mỗi (quiz, user): bấm đúp/2 tab cùng lúc sẽ không
      // tạo lượt thứ hai mà dùng lại lượt vừa được tạo.
      const [newAttempt] = await this.database
        .insert(examAttempts)
        .values({
          quizId,
          userId,
          status: "in_progress",
          startedAt: new Date(),
        })
        .onConflictDoNothing()
        .returning();

      if (newAttempt) {
        attempt = newAttempt;
      } else {
        const [existing] = await this.database
          .select()
          .from(examAttempts)
          .where(
            and(
              eq(examAttempts.quizId, quizId),
              eq(examAttempts.userId, userId),
              eq(examAttempts.status, "in_progress"),
            ),
          )
          .limit(1);

        if (!existing) {
          throw new BadRequestError("Không thể bắt đầu bài thi. Vui lòng thử lại.");
        }

        attempt = existing;
      }
    }

    const remainingSeconds = Math.max(
      0,
      Math.floor(
        (attempt.startedAt.getTime() + quiz.durationMinutes * 60 * 1000 - Date.now()) / 1000,
      ),
    );

    const savedAnswersRows = await this.database
      .select({
        subItemId: examAnswers.subItemId,
        selectedAnswer: examAnswers.selectedAnswer,
        isFlagged: examAnswers.isFlagged,
      })
      .from(examAnswers)
      .where(eq(examAnswers.attemptId, attempt.id));

    const sections = await this.loadExamRoomSections(quizId);

    return {
      attempt: {
        id: attempt.id,
        quizId: quiz.id,
        startedAt: attempt.startedAt.toISOString(),
        durationMinutes: quiz.durationMinutes,
        remainingSeconds,
        status: attempt.status,
      },
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        durationMinutes: quiz.durationMinutes,
        totalPoints: quiz.totalPoints,
        sections,
      },
      savedAnswers: savedAnswersRows,
    };
  }

  public async syncAnswers(
    attemptId: string,
    userId: string,
    answers: TSyncAnswerItem[],
  ): Promise<{ syncedCount: number }> {
    const attempt = await this.getAttemptById(attemptId);

    if (!attempt || attempt.userId !== userId) {
      throw new NotFoundError("Không tìm thấy phiên làm bài.");
    }

    if (attempt.status !== "in_progress") {
      throw new BadRequestError("Phiên làm bài đã kết thúc.");
    }

    const [quiz] = await this.database
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, attempt.quizId))
      .limit(1);

    if (quiz) {
      const endTime = attempt.startedAt.getTime() + quiz.durationMinutes * 60 * 1000;
      if (Date.now() > endTime) {
        await this.submitAndGradeAttempt(attempt.id, userId);
        throw new BadRequestError("Thời gian làm bài đã hết. Bài thi đã được tự động thu.");
      }
    }

    // Với cùng một subItemId, bản ghi sau cùng thắng.
    const latestById = new Map<string, TSyncAnswerItem>();
    for (const item of answers) {
      latestById.set(item.subItemId, item);
    }

    const uniqueItems = [...latestById.values()];

    if (uniqueItems.length > 0) {
      await this.assertSubItemsBelongToQuiz(
        attempt.quizId,
        uniqueItems.map((item) => item.subItemId),
      );

      const withFlag = uniqueItems.filter((item) => item.isFlagged !== undefined);
      const withoutFlag = uniqueItems.filter((item) => item.isFlagged === undefined);

      if (withFlag.length > 0) {
        await this.database
          .insert(examAnswers)
          .values(
            withFlag.map((item) => ({
              attemptId,
              subItemId: item.subItemId,
              selectedAnswer: item.selectedAnswer,
              isFlagged: item.isFlagged ?? false,
            })),
          )
          .onConflictDoUpdate({
            target: [examAnswers.attemptId, examAnswers.subItemId],
            set: {
              selectedAnswer: sql`excluded.selected_answer`,
              isFlagged: sql`excluded.is_flagged`,
              updatedAt: new Date(),
            },
          });
      }

      if (withoutFlag.length > 0) {
        await this.database
          .insert(examAnswers)
          .values(
            withoutFlag.map((item) => ({
              attemptId,
              subItemId: item.subItemId,
              selectedAnswer: item.selectedAnswer,
            })),
          )
          .onConflictDoUpdate({
            target: [examAnswers.attemptId, examAnswers.subItemId],
            set: {
              selectedAnswer: sql`excluded.selected_answer`,
              updatedAt: new Date(),
            },
          });
      }
    }

    const [{ answeredCount }] = await this.database
      .select({
        answeredCount: sql<number>`cast(count(${examAnswers.id}) as integer)`,
      })
      .from(examAnswers)
      .where(
        and(
          eq(examAnswers.attemptId, attemptId),
          sql`${examAnswers.selectedAnswer} IS NOT NULL AND ${examAnswers.selectedAnswer} != ''`,
        ),
      );

    await this.database
      .update(examAttempts)
      .set({
        totalAnswered: answeredCount,
        updatedAt: new Date(),
      })
      .where(eq(examAttempts.id, attemptId));

    return { syncedCount: answers.length };
  }

  public async submitAndGradeAttempt(
    attemptId: string,
    userId: string,
  ): Promise<TSubmitAttemptResponse> {
    const attempt = await this.getAttemptById(attemptId);

    if (!attempt || attempt.userId !== userId) {
      throw new NotFoundError("Không tìm thấy phiên làm bài.");
    }

    if (attempt.status === "submitted") {
      return {
        attemptId: attempt.id,
        score: attempt.score ?? "0.00",
        totalQuestionsAnswered: attempt.totalAnswered,
        submittedAt: attempt.submittedAt?.toISOString() ?? new Date().toISOString(),
        status: "submitted",
        message: "Bài thi đã được nộp trước đó.",
      };
    }

    const quizWithStructure = await this.loadFullQuizForGrading(attempt.quizId);
    const userAnswers = await this.database
      .select()
      .from(examAnswers)
      .where(eq(examAnswers.attemptId, attemptId));

    const answerMap = new Map<string, string | null>();
    for (const ans of userAnswers) {
      answerMap.set(ans.subItemId, ans.selectedAnswer);
    }

    let grandTotalPoints = 0;
    let totalQuestionsAnswered = 0;
    const gradedRows: TGradedAnswerRow[] = [];

    for (const section of quizWithStructure.sections) {
      for (const question of section.questions) {
        const isTrueFalse = section.sectionType === "true_false";
        const result = isTrueFalse
          ? this.gradeTrueFalseQuestion(attemptId, question.subItems, answerMap)
          : this.gradeStandardQuestion({
              attemptId,
              sectionType: section.sectionType,
              subItems: question.subItems,
              answerMap,
            });

        grandTotalPoints += result.points;
        totalQuestionsAnswered += result.answeredCount;
        gradedRows.push(...result.rows);
      }
    }

    await this.upsertGradedAnswers(gradedRows);

    const submittedAt = new Date();
    const maxQuizPoints = parseFloat(quizWithStructure.totalPoints || "150.00");
    const clampedScore =
      !isNaN(maxQuizPoints) && maxQuizPoints > 0
        ? Math.min(grandTotalPoints, maxQuizPoints)
        : grandTotalPoints;
    const finalScore = clampedScore.toFixed(2);

    // Chỉ một request thắng việc chuyển `in_progress` → `submitted`; request đồng thời còn lại
    // trả kết quả đã chốt.
    const [claimed] = await this.database
      .update(examAttempts)
      .set({
        status: "submitted",
        score: finalScore,
        totalAnswered: totalQuestionsAnswered,
        submittedAt,
        updatedAt: submittedAt,
      })
      .where(and(eq(examAttempts.id, attemptId), eq(examAttempts.status, "in_progress")))
      .returning({ id: examAttempts.id });

    if (!claimed) {
      const settled = await this.getAttemptById(attemptId);

      return {
        attemptId,
        score: settled?.score ?? "0.00",
        totalQuestionsAnswered: settled?.totalAnswered ?? 0,
        submittedAt: settled?.submittedAt?.toISOString() ?? submittedAt.toISOString(),
        status: "submitted",
        message: "Bài thi đã được nộp trước đó.",
      };
    }

    return {
      attemptId,
      score: finalScore,
      totalQuestionsAnswered,
      submittedAt: submittedAt.toISOString(),
      status: "submitted",
      message: "Nộp bài thi và chấm điểm thành công.",
    };
  }

  public async getAttemptResult(quizId: string, userId: string): Promise<TAttemptResult> {
    const [attempt] = await this.database
      .select()
      .from(examAttempts)
      .where(and(eq(examAttempts.quizId, quizId), eq(examAttempts.userId, userId)))
      .orderBy(desc(examAttempts.createdAt))
      .limit(1);

    if (!attempt || attempt.status !== "submitted") {
      throw new NotFoundError("Chưa có kết quả làm bài cho đề thi này.");
    }

    const [quiz] = await this.database
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, quizId))
      .limit(1);

    if (!quiz) {
      throw new NotFoundError("Không tìm thấy đề thi.");
    }

    const [{ totalSubItems }] = await this.database
      .select({
        totalSubItems: sql<number>`cast(count(${quizSubItems.id}) as integer)`,
      })
      .from(quizSubItems)
      .innerJoin(quizQuestions, eq(quizSubItems.questionId, quizQuestions.id))
      .innerJoin(quizSections, eq(quizQuestions.sectionId, quizSections.id))
      .where(eq(quizSections.quizId, quiz.id));

    const [userInfo] = await this.database
      .select({
        fullName: users.fullName,
        studentCode: studentProfiles.studentCode,
      })
      .from(users)
      .leftJoin(studentProfiles, eq(users.id, studentProfiles.userId))
      .where(eq(users.id, attempt.userId))
      .limit(1);

    const submittedTime = attempt.submittedAt ?? new Date();
    const timeSpentSeconds = Math.max(
      0,
      Math.floor((submittedTime.getTime() - attempt.startedAt.getTime()) / 1000),
    );

    const globalSettings = await this.settingsService.getExamSettings();
    const effectiveShowScoreImmediately =
      quiz.showScoreImmediately ?? globalSettings.showScoreImmediately;

    return {
      attemptId: attempt.id,
      quizId: quiz.id,
      quizTitle: quiz.title,
      studentName: userInfo?.fullName ?? "Thí sinh",
      studentCode: userInfo?.studentCode ?? null,
      score: effectiveShowScoreImmediately ? (attempt.score ?? "0.00") : "---",
      totalPoints: quiz.totalPoints,
      totalAnswered: attempt.totalAnswered,
      totalSubItems,
      startedAt: attempt.startedAt.toISOString(),
      submittedAt: submittedTime.toISOString(),
      durationMinutes: quiz.durationMinutes,
      timeSpentSeconds,
      showScoreImmediately: effectiveShowScoreImmediately,
    };
  }

  /** Lấy mọi lượt thi của một user cho nhiều đề trong một truy vấn (mới nhất trước). */
  private async loadUserAttemptsByQuiz(
    userId: string | null,
    quizIds: string[],
  ): Promise<Map<string, TExamAttempt[]>> {
    const byQuiz = new Map<string, TExamAttempt[]>();

    if (!userId || quizIds.length === 0) {
      return byQuiz;
    }

    const rows = await this.database
      .select()
      .from(examAttempts)
      .where(and(eq(examAttempts.userId, userId), inArray(examAttempts.quizId, quizIds)))
      .orderBy(desc(examAttempts.createdAt));

    for (const row of rows) {
      const bucket = byQuiz.get(row.quizId);

      if (bucket) {
        bucket.push(row);
      } else {
        byQuiz.set(row.quizId, [row]);
      }
    }

    return byQuiz;
  }

  private calculateCooldownRemainingSeconds(
    submittedAttempts: TExamAttempt[],
    cooldownMinutes: number,
  ): number {
    if (submittedAttempts.length === 0 || cooldownMinutes <= 0) {
      return 0;
    }

    const sortedSubmitted = [...submittedAttempts].sort(
      (a, b) => (b.submittedAt?.getTime() ?? 0) - (a.submittedAt?.getTime() ?? 0),
    );
    const lastSubmitted = sortedSubmitted[0];
    if (!lastSubmitted?.submittedAt) {
      return 0;
    }

    const cooldownEnd = lastSubmitted.submittedAt.getTime() + cooldownMinutes * 60 * 1000;

    return Math.max(0, Math.ceil((cooldownEnd - Date.now()) / 1000));
  }

  private async getAttemptById(attemptId: string): Promise<TExamAttempt | null> {
    const [attempt] = await this.database
      .select()
      .from(examAttempts)
      .where(eq(examAttempts.id, attemptId))
      .limit(1);

    return attempt ?? null;
  }

  private async assertSubItemsBelongToQuiz(quizId: string, subItemIds: string[]): Promise<void> {
    const rows = await this.database
      .select({ id: quizSubItems.id })
      .from(quizSubItems)
      .innerJoin(quizQuestions, eq(quizSubItems.questionId, quizQuestions.id))
      .innerJoin(quizSections, eq(quizQuestions.sectionId, quizSections.id))
      .where(and(eq(quizSections.quizId, quizId), inArray(quizSubItems.id, subItemIds)));

    if (rows.length !== subItemIds.length) {
      throw new BadRequestError("Có câu trả lời không thuộc đề thi này.");
    }
  }

  /** Ghi điểm từng câu con theo lô (một câu lệnh cho mỗi 500 dòng) thay vì từng dòng một. */
  private async upsertGradedAnswers(rows: TGradedAnswerRow[]): Promise<void> {
    const BATCH_SIZE = 500;
    const batches: TGradedAnswerRow[][] = [];

    for (let index = 0; index < rows.length; index += BATCH_SIZE) {
      batches.push(rows.slice(index, index + BATCH_SIZE));
    }

    for (const batch of batches) {
      // oxlint-disable-next-line no-await-in-loop -- tuần tự để không vượt kết nối của lambda
      await this.database
        .insert(examAnswers)
        .values(batch)
        .onConflictDoUpdate({
          target: [examAnswers.attemptId, examAnswers.subItemId],
          set: {
            isCorrect: sql`excluded.is_correct`,
            pointsEarned: sql`excluded.points_earned`,
            updatedAt: new Date(),
          },
        });
    }
  }

  private async resolveAttemptStatus(
    attempt: TExamAttempt | null,
    durationMinutes: number,
  ): Promise<{
    attemptStatus: "not_started" | "in_progress" | "submitted";
    attemptId: string | null;
    score: string | null;
    submittedAt: string | null;
  }> {
    if (!attempt) {
      return {
        attemptStatus: "not_started",
        attemptId: null,
        score: null,
        submittedAt: null,
      };
    }

    if (attempt.status === "submitted") {
      return {
        attemptStatus: "submitted",
        attemptId: attempt.id,
        score: attempt.score,
        submittedAt: attempt.submittedAt?.toISOString() ?? null,
      };
    }

    const expirationTime = attempt.startedAt.getTime() + durationMinutes * 60 * 1000;

    if (Date.now() <= expirationTime) {
      return {
        attemptStatus: "in_progress",
        attemptId: attempt.id,
        score: null,
        submittedAt: null,
      };
    }

    await this.submitAndGradeAttempt(attempt.id, attempt.userId);
    const updated = await this.getAttemptById(attempt.id);

    return {
      attemptStatus: "submitted",
      attemptId: attempt.id,
      score: updated?.score ?? "0.00",
      submittedAt: updated?.submittedAt?.toISOString() ?? null,
    };
  }

  private gradeTrueFalseQuestion(
    attemptId: string,
    subItems: Array<typeof quizSubItems.$inferSelect>,
    answerMap: Map<string, string | null>,
  ): { points: number; answeredCount: number; rows: TGradedAnswerRow[] } {
    let correctCount = 0;
    let totalPoints = 0;
    let answeredCount = 0;
    const rows: TGradedAnswerRow[] = [];

    for (const subItem of subItems) {
      totalPoints += Number(subItem.points || "1.50");
      const userAnswer = answerMap.get(subItem.id);

      if (userAnswer) {
        answeredCount++;
      }

      const normalizedUser = normalizeBooleanAnswer(userAnswer);
      const normalizedCorrect = normalizeBooleanAnswer(subItem.correctAnswer);

      const isCorrect =
        Boolean(userAnswer) &&
        normalizedUser !== null &&
        normalizedCorrect !== null &&
        normalizedUser === normalizedCorrect;

      if (isCorrect) {
        correctCount++;
      }

      rows.push({
        attemptId,
        subItemId: subItem.id,
        selectedAnswer: userAnswer ?? null,
        isCorrect,
        pointsEarned: "0.00",
      });
    }

    let effectiveTotalPoints = 6.0;
    if (totalPoints > 0 && totalPoints <= 6.0) {
      effectiveTotalPoints = totalPoints;
    }

    const points = calculateGraduatedTrueFalsePoints(correctCount, effectiveTotalPoints);

    if (points > 0 && correctCount > 0) {
      const pointPerCorrect = Number((points / correctCount).toFixed(2)).toFixed(2);

      for (const row of rows) {
        if (row.isCorrect) {
          row.pointsEarned = pointPerCorrect;
        }
      }
    }

    return { points, answeredCount, rows };
  }

  private gradeStandardQuestion({
    attemptId,
    sectionType,
    subItems,
    answerMap,
  }: {
    attemptId: string;
    sectionType: string;
    subItems: Array<typeof quizSubItems.$inferSelect>;
    answerMap: Map<string, string | null>;
  }): { points: number; answeredCount: number; rows: TGradedAnswerRow[] } {
    let earnedPoints = 0;
    let answeredCount = 0;
    const rows: TGradedAnswerRow[] = [];

    for (const subItem of subItems) {
      const userAnswer = answerMap.get(subItem.id);

      if (userAnswer) {
        answeredCount++;
      }

      const isCorrect =
        sectionType === "short_answer"
          ? isShortAnswerCorrect(userAnswer, subItem.correctAnswer, subItem.acceptableAnswers)
          : Boolean(userAnswer) &&
            String(userAnswer).trim().toUpperCase() ===
              String(subItem.correctAnswer ?? "")
                .trim()
                .toUpperCase();

      let defaultPoint = "1.50";
      if (sectionType === "group_mcq" || sectionType === "short_answer") {
        defaultPoint = "6.00";
      }

      let pointsValue = Number(subItem.points || defaultPoint);
      if (sectionType === "matching" && pointsValue > 1.5) {
        pointsValue = 1.5;
      }

      const pointsEarned = isCorrect ? pointsValue : 0;

      earnedPoints += pointsEarned;

      rows.push({
        attemptId,
        subItemId: subItem.id,
        selectedAnswer: userAnswer ?? null,
        isCorrect,
        pointsEarned: pointsEarned.toFixed(2),
      });
    }

    return { points: earnedPoints, answeredCount, rows };
  }

  private async loadExamRoomSections(quizId: string): Promise<TExamRoomSection[]> {
    const structure = await loadQuizStructure(this.database, quizId);

    // Không gửi đáp án đúng/giải thích xuống học sinh: chỉ chọn các trường được phép.
    return structure.map((section) => ({
      id: section.id,
      sectionType: section.sectionType,
      title: section.title,
      orderIndex: section.orderIndex,
      questions: section.questions.map((question) => ({
        id: question.id,
        orderIndex: question.orderIndex,
        contextContent: question.contextContent,
        imageUrl: question.imageUrl,
        subItems: question.subItems.map((si) => ({
          id: si.id,
          orderIndex: si.orderIndex,
          label: si.label,
          content: si.content,
          options: si.options,
          points: si.points,
        })),
      })),
    }));
  }

  private async loadFullQuizForGrading(quizId: string) {
    const [quiz] = await this.database
      .select({ totalPoints: quizzes.totalPoints })
      .from(quizzes)
      .where(eq(quizzes.id, quizId))
      .limit(1);

    const sections = await loadQuizStructure(this.database, quizId);

    return { totalPoints: quiz?.totalPoints ?? "150.00", sections };
  }
}

export const attemptsService = new AttemptsService();
