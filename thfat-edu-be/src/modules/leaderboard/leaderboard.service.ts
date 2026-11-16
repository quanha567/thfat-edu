import { type SQL, sql } from "drizzle-orm";

import { type Database, db as defaultDb } from "../../db";
import {
  type TLeaderboardItem,
  type TLeaderboardQuery,
  type TLeaderboardResponse,
  type TTimeframe,
} from "./leaderboard.model";

type TRankedUserRow = {
  rank: string | number;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  school_name: string | null;
  total_score: string | number;
  total_exams: string | number;
  total_duration_seconds: string | number;
};

type TCountRow = { count: string | number };

type TExecuteRankOptions = {
  baseQuery: SQL;
  limit: number;
  offset: number;
  currentUserId?: string;
};

function extractRows<TRow>(result: unknown): TRow[] {
  if (Array.isArray(result)) return result as TRow[];
  if (result && typeof result === "object" && "rows" in result && Array.isArray((result as { rows: unknown }).rows)) {
    return (result as { rows: TRow[] }).rows;
  }

  return [];
}

function mapRowToLeaderboardItem(row: TRankedUserRow): TLeaderboardItem {
  return {
    rank: Number(row.rank),
    userId: row.user_id,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    schoolName: row.school_name,
    totalScore: Number(row.total_score),
    totalExams: Number(row.total_exams),
    totalDurationSeconds: Number(row.total_duration_seconds),
  };
}

export class LeaderboardService {
  constructor(private readonly db: Database = defaultDb) {}

  public getCutoffDate(timeframe: TTimeframe, referenceDate = new Date()): Date | null {
    if (timeframe === "this_week") {
      const date = new Date(referenceDate);
      const day = date.getDay();
      date.setDate(date.getDate() - day + (day === 0 ? -6 : 1));
      date.setHours(0, 0, 0, 0);

      return date;
    }

    if (timeframe === "this_month") {
      return new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1, 0, 0, 0, 0);
    }

    return null;
  }

  private async executeRankQuery(
    options: TExecuteRankOptions,
  ): Promise<{ items: TLeaderboardItem[]; total: number; myRank: TLeaderboardItem | null }> {
    const { baseQuery, limit, offset, currentUserId } = options;

    const countResult = await this.db.execute(sql`
      ${baseQuery}
      SELECT COUNT(*)::text AS count FROM ranked_users;
    `);
    const total = Number(extractRows<TCountRow>(countResult)[0]?.count ?? "0");

    const itemsResult = await this.db.execute(sql`
      ${baseQuery}
      SELECT * FROM ranked_users ORDER BY rank ASC LIMIT ${limit} OFFSET ${offset};
    `);
    const items = extractRows<TRankedUserRow>(itemsResult).map(mapRowToLeaderboardItem);

    let myRank: TLeaderboardItem | null = null;
    if (currentUserId) {
      const myRankResult = await this.db.execute(sql`
        ${baseQuery}
        SELECT * FROM ranked_users WHERE user_id = ${currentUserId}::uuid LIMIT 1;
      `);
      const myRankRows = extractRows<TRankedUserRow>(myRankResult);
      if (myRankRows[0]) {
        myRank = mapRowToLeaderboardItem(myRankRows[0]);
      }
    }

    return { items, total, myRank };
  }

  public async getGlobalLeaderboard(
    query: TLeaderboardQuery,
    currentUserId?: string,
  ): Promise<TLeaderboardResponse> {
    const timeframe = query.timeframe ?? "all_time";
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(50, Math.max(1, query.limit ?? 20));
    const offset = (page - 1) * limit;
    const cutoff = this.getCutoffDate(timeframe);

    const timeFilter = cutoff ? sql`AND ea.submitted_at >= ${cutoff.toISOString()}::timestamptz` : sql``;

    const baseRankQuery = sql`
      WITH user_best_per_quiz AS (
        SELECT ea.user_id, ea.quiz_id, MAX(COALESCE(ea.score::numeric, 0)) AS best_score,
          MIN(GREATEST(0, EXTRACT(EPOCH FROM (ea.submitted_at - ea.started_at)))) AS best_duration
        FROM exam_attempts ea WHERE ea.status = 'submitted' ${timeFilter} GROUP BY ea.user_id, ea.quiz_id
      ),
      aggregated_scores AS (
        SELECT ub.user_id, SUM(ub.best_score)::numeric(10,2) AS total_score,
          COUNT(ub.quiz_id)::integer AS total_exams, SUM(ub.best_duration)::integer AS total_duration_seconds
        FROM user_best_per_quiz ub GROUP BY ub.user_id
      ),
      ranked_users AS (
        SELECT DENSE_RANK() OVER (ORDER BY ag.total_score DESC, ag.total_duration_seconds ASC) AS rank,
          ag.user_id, u.full_name, u.avatar_url, sp.school_name,
          ag.total_score, ag.total_exams, ag.total_duration_seconds
        FROM aggregated_scores ag
        JOIN users u ON u.id = ag.user_id
        LEFT JOIN student_profiles sp ON sp.user_id = ag.user_id
        WHERE u.is_active = true
      )
    `;

    const result = await this.executeRankQuery({
      baseQuery: baseRankQuery,
      limit,
      offset,
      currentUserId,
    });

    return {
      ...result,
      page,
      limit,
    };
  }

  public async getQuizLeaderboard(
    quizId: string,
    query: TLeaderboardQuery,
    currentUserId?: string,
  ): Promise<TLeaderboardResponse> {
    const timeframe = query.timeframe ?? "all_time";
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(50, Math.max(1, query.limit ?? 20));
    const offset = (page - 1) * limit;
    const cutoff = this.getCutoffDate(timeframe);

    const timeFilter = cutoff ? sql`AND ea.submitted_at >= ${cutoff.toISOString()}::timestamptz` : sql``;

    const baseQuizRankQuery = sql`
      WITH user_best_attempt AS (
        SELECT ea.user_id, MAX(COALESCE(ea.score::numeric, 0)) AS best_score,
          MIN(GREATEST(0, EXTRACT(EPOCH FROM (ea.submitted_at - ea.started_at)))) AS best_duration
        FROM exam_attempts ea WHERE ea.status = 'submitted' AND ea.quiz_id = ${quizId}::uuid ${timeFilter}
        GROUP BY ea.user_id
      ),
      ranked_users AS (
        SELECT DENSE_RANK() OVER (ORDER BY ub.best_score DESC, ub.best_duration ASC) AS rank,
          ub.user_id, u.full_name, u.avatar_url, sp.school_name,
          ub.best_score AS total_score, 1 AS total_exams, ub.best_duration::integer AS total_duration_seconds
        FROM user_best_attempt ub
        JOIN users u ON u.id = ub.user_id
        LEFT JOIN student_profiles sp ON sp.user_id = ub.user_id
        WHERE u.is_active = true
      )
    `;

    const result = await this.executeRankQuery({
      baseQuery: baseQuizRankQuery,
      limit,
      offset,
      currentUserId,
    });

    return {
      ...result,
      page,
      limit,
    };
  }
}
