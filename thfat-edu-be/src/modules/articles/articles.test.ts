import { describe, expect, it } from "bun:test";

import { Elysia } from "elysia";

import { errorHandlerPlugin, UnauthorizedError } from "../../middlewares/error-handler";
import { type AuthService } from "../auth/auth.service";
import type { TArticleDetail, TArticleItem, TCategory } from "./articles.model";
import { createArticlesRoutes } from "./articles.routes";
import { type ArticlesService, slugify } from "./articles.service";

describe("Articles Module - slugify helper", () => {
  it("converts Vietnamese text with accents to clean slugs", () => {
    expect(slugify("Hướng Dẫn Ôn Thi Vào 10 - Năm 2026")).toBe("huong-dan-on-thi-vao-10-nam-2026");
    expect(slugify("Đề Thi Thử Toán Học Kỳ 1")).toBe("de-thi-thu-toan-hoc-ky-1");
  });
});

describe("Articles Module - Routes & Access Control", () => {
  const mockAdminUser = {
    id: "a0000000-0000-0000-0000-000000000001",
    email: "admin@thfat.edu.vn",
    fullName: "Quản Trị Viên",
    avatarUrl: null,
    role: "admin" as const,
    isActive: true,
  };

  const mockStudentUser = {
    id: "s0000000-0000-0000-0000-000000000002",
    email: "student@thfat.edu.vn",
    fullName: "Học Viên A",
    avatarUrl: null,
    role: "student" as const,
    isActive: true,
  };

  const mockAuthService = {
    getCurrentUser: async (token: string) => {
      if (!token) throw new UnauthorizedError("Unauthorized");
      if (token === "admin-token") return mockAdminUser;
      if (token === "student-token") return mockStudentUser;
      throw new UnauthorizedError("Invalid token");
    },
  } as unknown as AuthService;

  const mockCategories: TCategory[] = [
    {
      id: "c0000000-0000-0000-0000-000000000001",
      name: "Tin tức",
      slug: "tin-tuc",
      description: "Tin tức hệ thống",
      articleCount: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockArticle: TArticleDetail = {
    id: "a0000000-0000-0000-0000-000000000010",
    title: "Khai giảng khóa mới",
    slug: "khai-giang-khoa-moi",
    excerpt: "Thông báo khai giảng",
    thumbnailUrl: null,
    content: "<p>Nội dung bài viết khai giảng</p>",
    status: "published",
    categoryId: "c0000000-0000-0000-0000-000000000001",
    category: {
      id: "c0000000-0000-0000-0000-000000000001",
      name: "Tin tức",
      slug: "tin-tuc",
    },
    authorId: mockAdminUser.id,
    author: {
      id: mockAdminUser.id,
      fullName: mockAdminUser.fullName,
      avatarUrl: null,
    },
    viewCount: 10,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockArticlesService = {
    getCategories: async () => mockCategories,
    getCategoryById: async (id: string) => mockCategories.find((c) => c.id === id) ?? null,
    createCategory: async (input: { name: string; slug?: string; description?: string }) => ({
      id: "c0000000-0000-0000-0000-000000000002",
      name: input.name,
      slug: input.slug ?? "slug-moi",
      description: input.description ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    updateCategory: async (id: string, input: { name?: string }) => {
      const existing = mockCategories[0];
      if (!existing) {
        throw new Error("Category not found");
      }

      return {
        ...existing,
        name: input.name ?? existing.name,
      };
    },
    deleteCategory: async () => true,
    getArticles: async () => ({
      items: [mockArticle as TArticleItem],
      total: 1,
      page: 1,
      limit: 10,
    }),
    getArticleById: async (id: string) => (id === mockArticle.id ? mockArticle : null),
    getArticleBySlug: async (slug: string) => (slug === mockArticle.slug ? mockArticle : null),
    createArticle: async () => mockArticle,
    updateArticle: async () => mockArticle,
    deleteArticle: async () => true,
    enhancePrompt: async (topic: string) => `Dàn ý chi tiết cho chủ đề: ${topic}`,
    streamGenerateArticle: async (prompt: string, onChunk: (chunk: string) => void) => {
      onChunk("# Tiêu đề\n\n> Tóm tắt\n\nNội dung");

      return "# Tiêu đề\n\n> Tóm tắt\n\nNội dung";
    },
  } as unknown as ArticlesService;

  const app = new Elysia().use(errorHandlerPlugin).use(
    createArticlesRoutes({
      articlesService: mockArticlesService,
      authService: mockAuthService,
    }),
  );

  it("GET /articles allows public access to published articles", async () => {
    const res = await app.handle(new Request("http://localhost/articles"));
    expect(res.status).toBe(200);

    const body = (await res.json()) as { items: TArticleItem[]; total: number };
    expect(body.items.length).toBe(1);
    expect(body.items[0]?.title).toBe("Khai giảng khóa mới");
  });

  it("GET /categories allows public access", async () => {
    const res = await app.handle(new Request("http://localhost/categories"));
    expect(res.status).toBe(200);

    const body = (await res.json()) as TCategory[];
    expect(body.length).toBe(1);
    expect(body[0]?.name).toBe("Tin tức");
  });

  it("GET /admin/articles rejects requests without token with 401", async () => {
    const res = await app.handle(new Request("http://localhost/admin/articles"));
    expect(res.status).toBe(401);
  });

  it("GET /admin/articles rejects student token with 403", async () => {
    const res = await app.handle(
      new Request("http://localhost/admin/articles", {
        headers: { Authorization: "Bearer student-token" },
      }),
    );
    expect(res.status).toBe(403);
  });

  it("GET /admin/articles allows admin token with 200", async () => {
    const res = await app.handle(
      new Request("http://localhost/admin/articles", {
        headers: { Authorization: "Bearer admin-token" },
      }),
    );
    expect(res.status).toBe(200);

    const body = (await res.json()) as { items: TArticleItem[]; total: number };
    expect(body.total).toBe(1);
  });

  it("POST /admin/articles/ai/enhance-prompt generates enhanced prompt for admin", async () => {
    const res = await app.handle(
      new Request("http://localhost/admin/articles/ai/enhance-prompt", {
        method: "POST",
        headers: {
          Authorization: "Bearer admin-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: "Phương pháp giải este" }),
      }),
    );
    expect(res.status).toBe(200);

    const body = (await res.json()) as { enhancedPrompt: string };
    expect(body.enhancedPrompt).toContain("Phương pháp giải este");
  });

  it("POST /admin/articles/ai/generate streams generated article chunks for admin", async () => {
    const res = await app.handle(
      new Request("http://localhost/admin/articles/ai/generate", {
        method: "POST",
        headers: {
          Authorization: "Bearer admin-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: "Dàn ý chi tiết bài este" }),
      }),
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/event-stream");

    const text = await res.text();
    expect(text).toContain("Tiêu đề");
    expect(text).toContain("[DONE]");
  });
});
