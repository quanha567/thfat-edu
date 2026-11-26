import { asc, eq, inArray, sql } from "drizzle-orm";

import { type Database } from "../../db";
import { quizQuestions, quizSections, quizSubItems } from "../../db/schema/quizzes";

type TSectionRow = typeof quizSections.$inferSelect;
type TQuestionRow = typeof quizQuestions.$inferSelect;
type TSubItemRow = typeof quizSubItems.$inferSelect;

export type TQuizStructureQuestion = TQuestionRow & { subItems: TSubItemRow[] };
export type TQuizStructureSection = TSectionRow & { questions: TQuizStructureQuestion[] };

function groupBy<TItem>(items: TItem[], getKey: (item: TItem) => string): Map<string, TItem[]> {
  const groups = new Map<string, TItem[]>();

  for (const item of items) {
    const key = getKey(item);
    const bucket = groups.get(key);

    if (bucket) {
      bucket.push(item);
    } else {
      groups.set(key, [item]);
    }
  }

  return groups;
}

/**
 * Nạp toàn bộ cấu trúc đề (section → question → subItem) bằng đúng 3 truy vấn, thay cho việc truy
 * vấn lồng nhau theo từng section/câu hỏi (N+1).
 */
export async function loadQuizStructure(
  database: Database,
  quizId: string,
): Promise<TQuizStructureSection[]> {
  const sections = await database
    .select()
    .from(quizSections)
    .where(eq(quizSections.quizId, quizId))
    .orderBy(asc(quizSections.orderIndex));

  if (sections.length === 0) {
    return [];
  }

  const questions = await database
    .select()
    .from(quizQuestions)
    .where(
      inArray(
        quizQuestions.sectionId,
        sections.map((section) => section.id),
      ),
    )
    .orderBy(asc(quizQuestions.orderIndex));

  const subItems =
    questions.length === 0
      ? []
      : await database
          .select()
          .from(quizSubItems)
          .where(
            inArray(
              quizSubItems.questionId,
              questions.map((question) => question.id),
            ),
          )
          .orderBy(asc(quizSubItems.orderIndex));

  const subItemsByQuestion = groupBy(subItems, (item) => item.questionId);
  const questionsBySection = groupBy(questions, (question) => question.sectionId);

  return sections.map((section) => ({
    ...section,
    questions: (questionsBySection.get(section.id) ?? []).map((question) => ({
      ...question,
      subItems: subItemsByQuestion.get(question.id) ?? [],
    })),
  }));
}

export type TQuizCounts = { totalQuestions: number; totalSubItems: number };

/** Đếm câu hỏi và câu con cho nhiều đề bằng một truy vấn gộp (thay cho 2 truy vấn mỗi đề). */
export async function loadQuizCounts(
  database: Database,
  quizIds: string[],
): Promise<Map<string, TQuizCounts>> {
  const result = new Map<string, TQuizCounts>();

  if (quizIds.length === 0) {
    return result;
  }

  const rows = await database
    .select({
      quizId: quizSections.quizId,
      totalQuestions: sql<number>`count(distinct ${quizQuestions.id})::int`,
      totalSubItems: sql<number>`count(${quizSubItems.id})::int`,
    })
    .from(quizSections)
    .leftJoin(quizQuestions, eq(quizQuestions.sectionId, quizSections.id))
    .leftJoin(quizSubItems, eq(quizSubItems.questionId, quizQuestions.id))
    .where(inArray(quizSections.quizId, quizIds))
    .groupBy(quizSections.quizId);

  for (const row of rows) {
    result.set(row.quizId, {
      totalQuestions: row.totalQuestions,
      totalSubItems: row.totalSubItems,
    });
  }

  return result;
}
