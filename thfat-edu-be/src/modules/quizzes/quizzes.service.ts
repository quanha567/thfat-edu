import { and, desc, eq, ilike, isNull, sql } from "drizzle-orm";

import { type Database, db } from "../../db";
import { containsPattern } from "../../db/like";
import { examAttempts } from "../../db/schema/attempts";
import {
  quizQuestions,
  quizSections,
  quizSubItems,
  quizzes,
  type TQuiz,
} from "../../db/schema/quizzes";
import { ConflictError, NotFoundError } from "../../middlewares/error-handler";
import { nvidiaNimService } from "../../services/ai/nvidia-nim.service";
import { loadQuizCounts, loadQuizStructure } from "./quiz-structure";
import {
  type TCreateQuizInput,
  type TQuizListQuery,
  type TQuizListResponse,
  type TQuizQuestionInput,
  type TQuizSectionInput,
  type TSolveQuestionInput,
  type TSolveQuestionResponse,
  type TUpdateQuizInput,
} from "./quizzes.model";

type TExecutor = Parameters<Parameters<Database["transaction"]>[0]>[0] | Database;

export class QuizzesService {
  constructor(private readonly database: Database = db) {}

  public async listQuizzes(query: TQuizListQuery): Promise<TQuizListResponse> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;

    const conditions = [isNull(quizzes.deletedAt)];

    if (query.status) {
      conditions.push(eq(quizzes.status, query.status));
    }

    if (query.search) {
      conditions.push(ilike(quizzes.title, containsPattern(query.search)));
    }

    const whereClause = and(...conditions);

    const [totalResult] = await this.database
      .select({ count: sql<number>`count(*)::int` })
      .from(quizzes)
      .where(whereClause);

    const total = totalResult?.count ?? 0;

    const quizList = await this.database
      .select({
        id: quizzes.id,
        title: quizzes.title,
        description: quizzes.description,
        durationMinutes: quizzes.durationMinutes,
        totalPoints: quizzes.totalPoints,
        status: quizzes.status,
        pdfUrl: quizzes.pdfUrl,
        createdAt: quizzes.createdAt,
        updatedAt: quizzes.updatedAt,
      })
      .from(quizzes)
      .where(whereClause)
      .orderBy(desc(quizzes.createdAt))
      .limit(limit)
      .offset(offset);

    const counts = await loadQuizCounts(
      this.database,
      quizList.map((quiz) => quiz.id),
    );

    const items = quizList.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      durationMinutes: quiz.durationMinutes,
      totalPoints: quiz.totalPoints,
      status: quiz.status,
      pdfUrl: quiz.pdfUrl,
      totalQuestions: counts.get(quiz.id)?.totalQuestions ?? 0,
      totalSubItems: counts.get(quiz.id)?.totalSubItems ?? 0,
      createdAt: quiz.createdAt.toISOString(),
      updatedAt: quiz.updatedAt.toISOString(),
    }));

    return {
      items,
      total,
      page,
      limit,
    };
  }

  public async getQuizById(id: string): Promise<TQuiz & { sections: unknown[] }> {
    const [quiz] = await this.database
      .select()
      .from(quizzes)
      .where(and(eq(quizzes.id, id), isNull(quizzes.deletedAt)));

    if (!quiz) {
      throw new NotFoundError("Không tìm thấy đề thi.");
    }

    const sections = await loadQuizStructure(this.database, id);

    return {
      ...quiz,
      sections,
    };
  }

  public async createQuiz(input: TCreateQuizInput, userId?: string): Promise<TQuiz> {
    return this.database.transaction(async (tx) => {
      const [quiz] = await tx
        .insert(quizzes)
        .values({
          title: input.title,
          description: input.description,
          durationMinutes: input.durationMinutes,
          totalPoints: input.totalPoints ?? "150.00",
          status: input.status ?? "draft",
          pdfUrl: input.pdfUrl,
          createdBy: userId,
        })
        .returning();

      if (input.sections && input.sections.length > 0) {
        await this.saveSections(tx, quiz.id, input.sections);
      }

      return quiz;
    });
  }

  public async updateQuiz(id: string, input: TUpdateQuizInput) {
    const [existing] = await this.database
      .select()
      .from(quizzes)
      .where(and(eq(quizzes.id, id), isNull(quizzes.deletedAt)));

    if (!existing) {
      throw new NotFoundError("Không tìm thấy đề thi để cập nhật.");
    }

    if (input.sections) {
      // Thay toàn bộ cấu trúc sẽ xoá (cascade) bài làm và điểm của học sinh đã thi đề này.
      const [attempt] = await this.database
        .select({ id: examAttempts.id })
        .from(examAttempts)
        .where(eq(examAttempts.quizId, id))
        .limit(1);

      if (attempt) {
        throw new ConflictError(
          "Đề thi đã có học sinh làm bài nên không thể thay đổi cấu trúc câu hỏi. Hãy nhân bản thành đề mới.",
        );
      }
    }

    await this.database.transaction(async (tx) => {
      await tx
        .update(quizzes)
        .set({
          title: input.title ?? existing.title,
          description: input.description !== undefined ? input.description : existing.description,
          durationMinutes: input.durationMinutes ?? existing.durationMinutes,
          totalPoints: input.totalPoints ?? existing.totalPoints,
          status: input.status ?? existing.status,
          pdfUrl: input.pdfUrl !== undefined ? input.pdfUrl : existing.pdfUrl,
          updatedAt: new Date(),
        })
        .where(eq(quizzes.id, id));

      if (input.sections) {
        await tx.delete(quizSections).where(eq(quizSections.quizId, id));
        await this.saveSections(tx, id, input.sections);
      }
    });

    return this.getQuizById(id);
  }

  public async deleteQuiz(id: string): Promise<{ success: boolean }> {
    const [existing] = await this.database
      .select()
      .from(quizzes)
      .where(and(eq(quizzes.id, id), isNull(quizzes.deletedAt)));

    if (!existing) {
      throw new NotFoundError("Không tìm thấy đề thi để xóa.");
    }

    await this.database.update(quizzes).set({ deletedAt: new Date() }).where(eq(quizzes.id, id));

    return { success: true };
  }

  private async saveSections(
    executor: TExecutor,
    quizId: string,
    sections: TQuizSectionInput[],
  ): Promise<void> {
    await Promise.all(
      sections.map(async (sec) => {
        const [savedSection] = await executor
          .insert(quizSections)
          .values({
            quizId,
            sectionType: sec.sectionType,
            title: sec.title,
            orderIndex: sec.orderIndex,
          })
          .returning();

        await this.saveQuestions(executor, savedSection.id, sec.questions);
      }),
    );
  }

  private async saveQuestions(
    executor: TExecutor,
    sectionId: string,
    questions: TQuizQuestionInput[],
  ): Promise<void> {
    await Promise.all(
      questions.map(async (q) => {
        const [savedQuestion] = await executor
          .insert(quizQuestions)
          .values({
            sectionId,
            orderIndex: q.orderIndex,
            contextContent: q.contextContent,
            imageUrl: q.imageUrl,
          })
          .returning();

        if (q.subItems && q.subItems.length > 0) {
          const subItemValues = q.subItems.map((item) => ({
            questionId: savedQuestion.id,
            orderIndex: item.orderIndex,
            label: item.label,
            content: item.content,
            options: item.options,
            correctAnswer: item.correctAnswer,
            acceptableAnswers: item.acceptableAnswers,
            points: item.points,
            explanation: item.explanation,
          }));

          await executor.insert(quizSubItems).values(subItemValues);
        }
      }),
    );
  }

  public async solveQuestion(input: TSolveQuestionInput): Promise<TSolveQuestionResponse> {
    return nvidiaNimService.solveExamQuestion(input);
  }
}
