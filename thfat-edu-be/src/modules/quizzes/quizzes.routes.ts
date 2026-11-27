import crypto from "node:crypto";

import { Elysia, t } from "elysia";

import { requireAuth } from "../auth/auth.guard";
import { examImportJobManager, processExamPdfImport } from "./quizzes-import.service";
import {
  CreateQuizSchema,
  QuizListQuerySchema,
  SolveQuestionInputSchema,
  UpdateQuizSchema,
} from "./quizzes.model";
import { QuizzesService } from "./quizzes.service";

export const quizzesRoutes = new Elysia({ prefix: "/quizzes" })
  .decorate("quizzesService", new QuizzesService())
  .use(
    requireAuth({
      roles: ["teacher", "admin"],
      forbiddenMessage: "Chỉ giáo viên và quản trị viên mới có quyền quản lý đề thi.",
    }),
  )
  .get(
    "/",
    async ({ quizzesService, query }) => {
      return quizzesService.listQuizzes(query);
    },
    {
      query: QuizListQuerySchema,
      detail: {
        tags: ["Quizzes"],
        summary: "Lấy danh sách đề thi (Ngân hàng đề)",
      },
    },
  )
  .post(
    "/ai/solve-question",
    async ({ quizzesService, body }) => {
      return quizzesService.solveQuestion(body);
    },
    {
      body: SolveQuestionInputSchema,
      detail: {
        tags: ["Quizzes"],
        summary: "AI tự động giải câu hỏi và suy luận đáp án chuẩn theo phân loại phần thi",
      },
    },
  )
  .get(
    "/:id",
    async ({ quizzesService, params: { id } }) => {
      return quizzesService.getQuizById(id);
    },
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
      detail: {
        tags: ["Quizzes"],
        summary: "Lấy chi tiết đề thi gồm 4 phần và các tiểu mục",
      },
    },
  )
  .post(
    "/",
    async ({ quizzesService, body, currentUser }) => {
      return quizzesService.createQuiz(body, currentUser.id);
    },
    {
      body: CreateQuizSchema,
      detail: {
        tags: ["Quizzes"],
        summary: "Tạo mới đề thi (Draft hoặc Published)",
      },
    },
  )
  .put(
    "/:id",
    async ({ quizzesService, params: { id }, body }) => {
      return quizzesService.updateQuiz(id, body);
    },
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
      body: UpdateQuizSchema,
      detail: {
        tags: ["Quizzes"],
        summary: "Cập nhật đề thi và danh sách câu hỏi",
      },
    },
  )
  .delete(
    "/:id",
    async ({ quizzesService, params: { id } }) => {
      return quizzesService.deleteQuiz(id);
    },
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
      detail: {
        tags: ["Quizzes"],
        summary: "Xóa đề thi (Soft delete)",
      },
    },
  )
  .post(
    "/import/jobs",
    async ({ body, set }) => {
      const { file } = body;
      if (!file || !(file instanceof File)) {
        set.status = 400;

        return { message: "Vui lòng đính kèm file PDF hợp lệ." };
      }

      const jobId = crypto.randomUUID();
      examImportJobManager.createJob(jobId);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Trigger async processing in background
      void processExamPdfImport(jobId, buffer, file.name);

      return { jobId, message: "Job import đề thi đã được khởi tạo thành công." };
    },
    {
      body: t.Object({
        file: t.File({
          type: "application/pdf",
          maxSize: "20m",
        }),
      }),
      detail: {
        tags: ["Quizzes"],
        summary: "Upload PDF đề thi để khởi tạo tác vụ import bằng AI",
      },
    },
  )
  .get(
    "/import/jobs/:jobId/stream",
    ({ params: { jobId }, set }) => {
      const job = examImportJobManager.getJob(jobId);
      if (!job) {
        set.status = 404;

        return { message: "Không tìm thấy job import." };
      }

      set.headers["Content-Type"] = "text/event-stream; charset=utf-8";
      set.headers["Cache-Control"] = "no-cache, no-transform";
      set.headers["Connection"] = "keep-alive";
      set.headers["X-Accel-Buffering"] = "no";

      let pingInterval: ReturnType<typeof setInterval> | undefined;
      let unsubscribe: (() => void) | undefined;
      const cleanupStream = () => {
        if (pingInterval) clearInterval(pingInterval);
        unsubscribe?.();
      };

      return new Response(
        new ReadableStream({
          start(controller) {
            const sendEvent = (event: string, data: unknown) => {
              const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
              controller.enqueue(new TextEncoder().encode(payload));
            };

            // Gửi initial ping & progress
            sendEvent("progress", job.progress);

            // Heartbeat ping mỗi 15 giây để ngăn trình duyệt/proxy timeout kết nối SSE
            pingInterval = setInterval(() => {
              try {
                controller.enqueue(new TextEncoder().encode(": keep-alive ping\n\n"));
              } catch {
                cleanupStream();
              }
            }, 15000);

            if (job.status === "completed" && job.data) {
              cleanupStream();
              sendEvent("completed", job.data);
              controller.close();

              return;
            }

            if (job.status === "failed" || job.status === "cancelled") {
              cleanupStream();
              sendEvent(job.status, { error: job.error });
              controller.close();

              return;
            }

            unsubscribe = examImportJobManager.subscribe(jobId, (event, data) => {
              sendEvent(event, data);

              if (event === "completed" || event === "failed" || event === "cancelled") {
                cleanupStream();
                controller.close();
              }
            });
          },
          // Client đóng tab / back ra: chỉ ngừng theo dõi, job vẫn chạy tiếp trên server.
          cancel() {
            cleanupStream();
          },
        }),
        {
          headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no",
          },
        },
      );
    },
    {
      params: t.Object({ jobId: t.String({ format: "uuid" }) }),
      detail: {
        tags: ["Quizzes"],
        summary: "SSE Stream cập nhật tiến trình bóc tách đề thi theo thời gian thực",
      },
    },
  )
  .delete(
    "/import/jobs/:jobId",
    ({ params: { jobId }, set }) => {
      if (!examImportJobManager.cancelJob(jobId)) {
        set.status = 404;

        return { message: "Không tìm thấy job import." };
      }

      return { message: "Đã huỷ tác vụ import đề thi." };
    },
    {
      params: t.Object({ jobId: t.String({ format: "uuid" }) }),
      detail: {
        tags: ["Quizzes"],
        summary: "Huỷ tác vụ import đề thi đang chạy",
      },
    },
  );
