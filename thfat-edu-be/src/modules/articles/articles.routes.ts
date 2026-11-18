import { Elysia, t } from "elysia";

import { ForbiddenError, UnauthorizedError } from "../../middlewares/error-handler";
import { extractSessionToken, SESSION_COOKIE_NAME } from "../auth/auth.cookie";
import { type AuthService, authService as defaultAuthService } from "../auth/auth.service";
import {
  AiEnhancePromptInputSchema,
  AiEnhancePromptResponseSchema,
  AiGenerateArticleInputSchema,
  ArticleDetailSchema,
  ArticleQuerySchema,
  CategorySchema,
  CreateArticleSchema,
  CreateCategorySchema,
  PaginatedArticlesSchema,
  UpdateArticleSchema,
  UpdateCategorySchema,
} from "./articles.model";
import {
  type ArticlesService,
  articlesService as defaultArticlesService,
} from "./articles.service";

export type TArticlesRoutesOptions = {
  articlesService?: ArticlesService;
  authService?: AuthService;
};

export function createPublicArticlesRoutes(options?: TArticlesRoutesOptions) {
  const service = options?.articlesService ?? defaultArticlesService;

  return new Elysia()
    .decorate("articlesService", service)
    .group("/articles", (group) =>
      group
        .get(
          "/",
          async ({ articlesService, query }) => {
            return articlesService.getArticles(query, true);
          },
          {
            query: ArticleQuerySchema,
            response: PaginatedArticlesSchema,
            detail: {
              tags: ["Articles - Public"],
              summary: "Danh sách bài viết đã xuất bản cho học viên",
            },
          },
        )
        .get(
          "/:slug",
          async ({ articlesService, params }) => {
            return articlesService.getArticleBySlug(params.slug, true);
          },
          {
            params: t.Object({ slug: t.String() }),
            response: ArticleDetailSchema,
            detail: {
              tags: ["Articles - Public"],
              summary: "Chi tiết bài viết công khai theo slug",
            },
          },
        ),
    )
    .group("/categories", (group) =>
      group.get(
        "/",
        async ({ articlesService }) => {
          return articlesService.getCategories();
        },
        {
          response: t.Array(CategorySchema),
          detail: {
            tags: ["Categories - Public"],
            summary: "Danh sách chuyên mục bài viết",
          },
        },
      ),
    );
}

export function createAdminArticlesRoutes(options?: TArticlesRoutesOptions) {
  const service = options?.articlesService ?? defaultArticlesService;
  const auth = options?.authService ?? defaultAuthService;

  return new Elysia({ prefix: "/admin" })
    .decorate("articlesService", service)
    .decorate("authService", auth)
    .derive(async ({ cookie, request, authService: activeAuthService }) => {
      let token = extractSessionToken(cookie[SESSION_COOKIE_NAME]?.value);
      if (!token) {
        const authHeader = request.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
          token = authHeader.slice(7).trim();
        }
      }

      if (!token) {
        throw new UnauthorizedError("Bạn cần đăng nhập để thực hiện thao tác này.");
      }

      const currentAuthService = activeAuthService ?? auth;
      const currentUser = await currentAuthService.getCurrentUser(token);
      if (!currentUser || currentUser.role !== "admin") {
        throw new ForbiddenError("Chỉ quản trị viên mới có quyền truy cập chức năng này.");
      }

      return { currentUser, sessionToken: token };
    })
    .group("/articles", (group) =>
      group
        .get(
          "/",
          async ({ articlesService, query }) => {
            return articlesService.getArticles(query, false);
          },
          {
            query: ArticleQuerySchema,
            response: PaginatedArticlesSchema,
            detail: {
              tags: ["Admin - Articles"],
              summary: "Lấy danh sách tất cả bài viết kèm bộ lọc",
            },
          },
        )
        .post(
          "/ai/enhance-prompt",
          async ({ articlesService, body }) => {
            const enhancedPrompt = await articlesService.enhancePrompt(body.topic);

            return { enhancedPrompt };
          },
          {
            body: AiEnhancePromptInputSchema,
            response: AiEnhancePromptResponseSchema,
            detail: {
              tags: ["Admin - Articles - AI"],
              summary: "Phân tích và cải tiến prompt viết bài",
            },
          },
        )
        .post(
          "/ai/generate",
          async ({ articlesService, body, set }) => {
            const encoder = new TextEncoder();

            const stream = new ReadableStream({
              async start(controller) {
                try {
                  await articlesService.streamGenerateArticle(body.prompt, (chunk) => {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`),
                    );
                  });
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                  controller.close();
                } catch (err: unknown) {
                  const errorMsg =
                    err instanceof Error ? err.message : "Đã có lỗi xảy ra khi tạo bài viết.";
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ error: errorMsg })}\n\n`),
                  );
                  controller.close();
                }
              },
            });

            set.headers["content-type"] = "text/event-stream; charset=utf-8";
            set.headers["cache-control"] = "no-cache";
            set.headers["connection"] = "keep-alive";

            return new Response(stream, {
              headers: {
                "Content-Type": "text/event-stream; charset=utf-8",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
              },
            });
          },
          {
            body: AiGenerateArticleInputSchema,
            detail: {
              tags: ["Admin - Articles - AI"],
              summary: "Stream tạo bài viết hoàn chỉnh bằng AI",
            },
          },
        )
        .get(
          "/:id",
          async ({ articlesService, params }) => {
            return articlesService.getArticleById(params.id);
          },
          {
            params: t.Object({ id: t.String({ format: "uuid" }) }),
            response: ArticleDetailSchema,
            detail: {
              tags: ["Admin - Articles"],
              summary: "Lấy chi tiết bài viết theo ID",
            },
          },
        )
        .post(
          "/",
          async ({ articlesService, body, currentUser }) => {
            return articlesService.createArticle(body, currentUser.id);
          },
          {
            body: CreateArticleSchema,
            response: ArticleDetailSchema,
            detail: {
              tags: ["Admin - Articles"],
              summary: "Tạo bài viết mới",
            },
          },
        )
        .put(
          "/:id",
          async ({ articlesService, params, body }) => {
            return articlesService.updateArticle(params.id, body);
          },
          {
            params: t.Object({ id: t.String({ format: "uuid" }) }),
            body: UpdateArticleSchema,
            response: ArticleDetailSchema,
            detail: {
              tags: ["Admin - Articles"],
              summary: "Cập nhật bài viết",
            },
          },
        )
        .delete(
          "/:id",
          async ({ articlesService, params }) => {
            const success = await articlesService.deleteArticle(params.id);

            return { success };
          },
          {
            params: t.Object({ id: t.String({ format: "uuid" }) }),
            response: t.Object({ success: t.Boolean() }),
            detail: {
              tags: ["Admin - Articles"],
              summary: "Xóa bài viết",
            },
          },
        ),
    )
    .group("/categories", (group) =>
      group
        .get(
          "/",
          async ({ articlesService }) => {
            return articlesService.getCategories();
          },
          {
            response: t.Array(CategorySchema),
            detail: {
              tags: ["Admin - Categories"],
              summary: "Lấy danh sách chuyên mục cho Admin",
            },
          },
        )
        .post(
          "/",
          async ({ articlesService, body }) => {
            return articlesService.createCategory(body);
          },
          {
            body: CreateCategorySchema,
            response: CategorySchema,
            detail: {
              tags: ["Admin - Categories"],
              summary: "Tạo chuyên mục mới",
            },
          },
        )
        .put(
          "/:id",
          async ({ articlesService, params, body }) => {
            return articlesService.updateCategory(params.id, body);
          },
          {
            params: t.Object({ id: t.String({ format: "uuid" }) }),
            body: UpdateCategorySchema,
            response: CategorySchema,
            detail: {
              tags: ["Admin - Categories"],
              summary: "Cập nhật chuyên mục",
            },
          },
        )
        .delete(
          "/:id",
          async ({ articlesService, params }) => {
            const success = await articlesService.deleteCategory(params.id);

            return { success };
          },
          {
            params: t.Object({ id: t.String({ format: "uuid" }) }),
            response: t.Object({ success: t.Boolean() }),
            detail: {
              tags: ["Admin - Categories"],
              summary: "Xóa chuyên mục",
            },
          },
        ),
    );
}

export function createArticlesRoutes(options?: TArticlesRoutesOptions) {
  return new Elysia()
    .use(createPublicArticlesRoutes(options))
    .use(createAdminArticlesRoutes(options));
}

export const publicArticlesRoutes = createPublicArticlesRoutes();
export const adminArticlesRoutes = createAdminArticlesRoutes();
export const articlesRoutes = createArticlesRoutes();
