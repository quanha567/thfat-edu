import { Elysia, t } from "elysia";

import { parseExamWithNvidia } from "./exam-parser.service";
import {
  CreateQuizSchema,
  ImportPdfSchema,
  QuizListQuerySchema,
  UpdateQuizSchema,
} from "./quizzes.model";
import { QuizzesService } from "./quizzes.service";

export const quizzesRoutes = new Elysia({ prefix: "/quizzes" })
  .decorate("quizzesService", new QuizzesService())
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
  .get(
    "/:id",
    async ({ quizzesService, params: { id } }) => {
      return quizzesService.getQuizById(id);
    },
    {
      params: t.Object({ id: t.String() }),
      detail: {
        tags: ["Quizzes"],
        summary: "Lấy chi tiết đề thi gồm 4 phần và các tiểu mục",
      },
    },
  )
  .post(
    "/",
    async ({ quizzesService, body }) => {
      return quizzesService.createQuiz(body);
    },
    {
      body: CreateQuizSchema,
      detail: {
        tags: ["Quizzes"],
        summary: "Tạo mới đề thi (Draft hoặc Published)",
      },
    },
  )
  .post(
    "/import-pdf",
    async ({ quizzesService, body }) => {
      const parsedData = await parseExamWithNvidia([body.pdfBase64]);
      if (body.title) {
        parsedData.title = body.title;
      }

      return quizzesService.importParsedQuiz(parsedData, undefined, body.pdfUrl);
    },
    {
      body: ImportPdfSchema,
      detail: {
        tags: ["Quizzes"],
        summary: "Bóc tách đề thi từ PDF bằng NVIDIA Vision và lưu bản nháp",
      },
    },
  )
  .put(
    "/:id",
    async ({ quizzesService, params: { id }, body }) => {
      return quizzesService.updateQuiz(id, body);
    },
    {
      params: t.Object({ id: t.String() }),
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
      params: t.Object({ id: t.String() }),
      detail: {
        tags: ["Quizzes"],
        summary: "Xóa đề thi (Soft delete)",
      },
    },
  );
