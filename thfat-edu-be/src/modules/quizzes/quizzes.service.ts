import { and, desc, eq, ilike, isNull, sql } from "drizzle-orm";

import { type Database, db } from "../../db";
import {
  quizQuestions,
  quizSections,
  quizSubItems,
  quizzes,
  type TQuiz,
} from "../../db/schema/quizzes";
import { NotFoundError } from "../../middlewares/error-handler";
import { type TParsedExamData } from "./exam-parser.service";
import {
  type TCreateQuizInput,
  type TQuizListQuery,
  type TQuizListResponse,
  type TQuizQuestionInput,
  type TQuizSectionInput,
  type TUpdateQuizInput,
} from "./quizzes.model";

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
      conditions.push(ilike(quizzes.title, `%${query.search.trim()}%`));
    }

    const whereClause = and(...conditions);

    const [totalResult] = await this.database
      .select({ count: sql<number>`count(*)::int` })
      .from(quizzes)
      .where(whereClause);

    const total = totalResult?.count ?? 0;

    const items = await this.database
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

    const formattedItems = await Promise.all(
      items.map(async (item) => {
        const [qCount] = await this.database
          .select({ count: sql<number>`count(*)::int` })
          .from(quizQuestions)
          .innerJoin(quizSections, eq(quizQuestions.sectionId, quizSections.id))
          .where(eq(quizSections.quizId, item.id));

        const [subCount] = await this.database
          .select({ count: sql<number>`count(*)::int` })
          .from(quizSubItems)
          .innerJoin(quizQuestions, eq(quizSubItems.questionId, quizQuestions.id))
          .innerJoin(quizSections, eq(quizQuestions.sectionId, quizSections.id))
          .where(eq(quizSections.quizId, item.id));

        return {
          ...item,
          totalQuestions: qCount?.count ?? 0,
          totalSubItems: subCount?.count ?? 0,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
        };
      }),
    );

    return {
      items: formattedItems,
      total,
      page,
      limit,
    };
  }

  public async getQuizById(id: string) {
    const [quiz] = await this.database
      .select()
      .from(quizzes)
      .where(and(eq(quizzes.id, id), isNull(quizzes.deletedAt)));

    if (!quiz) {
      throw new NotFoundError("Không tìm thấy đề thi yêu cầu.");
    }

    const sections = await this.database
      .select()
      .from(quizSections)
      .where(eq(quizSections.quizId, id))
      .orderBy(quizSections.orderIndex);

    const fullSections = await Promise.all(
      sections.map(async (sec) => {
        const questions = await this.database
          .select()
          .from(quizQuestions)
          .where(eq(quizQuestions.sectionId, sec.id))
          .orderBy(quizQuestions.orderIndex);

        const fullQuestions = await Promise.all(
          questions.map(async (q) => {
            const subItems = await this.database
              .select()
              .from(quizSubItems)
              .where(eq(quizSubItems.questionId, q.id))
              .orderBy(quizSubItems.orderIndex);

            return {
              ...q,
              createdAt: q.createdAt.toISOString(),
              subItems: subItems.map((s) => ({
                ...s,
                createdAt: s.createdAt.toISOString(),
              })),
            };
          }),
        );

        return {
          ...sec,
          createdAt: sec.createdAt.toISOString(),
          questions: fullQuestions,
        };
      }),
    );

    return {
      ...quiz,
      createdAt: quiz.createdAt.toISOString(),
      updatedAt: quiz.updatedAt.toISOString(),
      sections: fullSections,
    };
  }

  public async createQuiz(input: TCreateQuizInput, userId?: string): Promise<TQuiz> {
    const [quiz] = await this.database
      .insert(quizzes)
      .values({
        title: input.title,
        description: input.description,
        durationMinutes: input.durationMinutes ?? 50,
        totalPoints: input.totalPoints ?? "150.00",
        status: input.status ?? "draft",
        pdfUrl: input.pdfUrl,
        createdBy: userId,
      })
      .returning();

    if (input.sections && input.sections.length > 0) {
      await this.saveSections(quiz.id, input.sections);
    }

    return quiz;
  }

  public async importParsedQuiz(
    parsed: TParsedExamData,
    userId?: string,
    pdfUrl?: string,
  ): Promise<TQuiz> {
    return this.createQuiz(
      {
        title: parsed.title,
        description: parsed.description,
        durationMinutes: parsed.durationMinutes,
        totalPoints: parsed.totalPoints,
        status: "draft",
        pdfUrl,
        sections: parsed.sections,
      },
      userId,
    );
  }

  public async updateQuiz(id: string, input: TUpdateQuizInput) {
    const [existing] = await this.database
      .select()
      .from(quizzes)
      .where(and(eq(quizzes.id, id), isNull(quizzes.deletedAt)));

    if (!existing) {
      throw new NotFoundError("Không tìm thấy đề thi để cập nhật.");
    }

    await this.database
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
      await this.database.delete(quizSections).where(eq(quizSections.quizId, id));
      await this.saveSections(id, input.sections);
    }

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

  private async saveSections(quizId: string, sections: TQuizSectionInput[]): Promise<void> {
    await Promise.all(
      sections.map(async (sec) => {
        const [savedSection] = await this.database
          .insert(quizSections)
          .values({
            quizId,
            sectionType: sec.sectionType,
            title: sec.title,
            orderIndex: sec.orderIndex,
          })
          .returning();

        await this.saveQuestions(savedSection.id, sec.questions);
      }),
    );
  }

  private async saveQuestions(sectionId: string, questions: TQuizQuestionInput[]): Promise<void> {
    await Promise.all(
      questions.map(async (q) => {
        const [savedQuestion] = await this.database
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

          await this.database.insert(quizSubItems).values(subItemValues);
        }
      }),
    );
  }
}
