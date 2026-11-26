import { Elysia, t } from "elysia";

import { requireAuth } from "../auth/auth.guard";
import { AuthService } from "../auth/auth.service";
import {
  AttemptResultSchema,
  StudentExamListResponseSchema,
  SubmitAttemptResponseSchema,
  SyncAnswersBodySchema,
} from "./attempts.model";
import { AttemptsService } from "./attempts.service";

export const StudentExamListQuerySchema = t.Object({
  page: t.Optional(t.Numeric({ default: 1 })),
  limit: t.Optional(t.Numeric({ default: 10 })),
  search: t.Optional(t.String()),
});

export const attemptsRoutes = new Elysia({ prefix: "/student-exams" })
  .decorate("attemptsService", new AttemptsService())
  .decorate("authService", new AuthService())
  .use(requireAuth({ unauthorizedMessage: "Vui lòng đăng nhập để tham gia thi thử." }))
  .get(
    "/",
    async ({ attemptsService, currentUser, query }) => {
      return attemptsService.listStudentExams(currentUser.id, {
        page: query.page ? Number(query.page) : 1,
        limit: query.limit ? Number(query.limit) : 10,
        search: query.search,
      });
    },
    {
      query: StudentExamListQuerySchema,
      response: StudentExamListResponseSchema,
      detail: {
        tags: ["Student Exams"],
        summary: "Lấy danh sách đề thi kèm trạng thái làm bài của học sinh",
      },
    },
  )
  .post(
    "/:id/start",
    async ({ attemptsService, currentUser, params: { id } }) => {
      return attemptsService.startOrResumeAttempt(id, currentUser.id);
    },
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
      detail: {
        tags: ["Student Exams"],
        summary: "Bắt đầu hoặc khôi phục phiên làm bài thi thử",
      },
    },
  )
  .put(
    "/:id/sync",
    async ({ attemptsService, currentUser, params: { id }, body }) => {
      return attemptsService.syncAnswers(id, currentUser.id, body.answers);
    },
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
      body: SyncAnswersBodySchema,
      detail: {
        tags: ["Student Exams"],
        summary: "Đồng bộ câu trả lời thi thử (Auto-sync)",
      },
    },
  )
  .post(
    "/:id/submit",
    async ({ attemptsService, currentUser, params: { id } }) => {
      return attemptsService.submitAndGradeAttempt(id, currentUser.id);
    },
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
      response: SubmitAttemptResponseSchema,
      detail: {
        tags: ["Student Exams"],
        summary: "Nộp bài và chấm điểm bài thi thử tự động",
      },
    },
  )
  .get(
    "/:id/result",
    async ({ attemptsService, currentUser, params: { id } }) => {
      return attemptsService.getAttemptResult(id, currentUser.id);
    },
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
      response: AttemptResultSchema,
      detail: {
        tags: ["Student Exams"],
        summary: "Lấy bảng điểm tổng kết bài thi thử",
      },
    },
  );
