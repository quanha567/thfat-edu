import { type Static, t } from "elysia";

export const DateOrStringSchema = t.Union([t.String(), t.Date()]);

export const ArticleStatusSchema = t.Union([
  t.Literal("draft"),
  t.Literal("published"),
  t.Literal("archived"),
]);
export type TArticleStatus = Static<typeof ArticleStatusSchema>;

// Category Schemas
export const CategorySchema = t.Object({
  id: t.String(),
  name: t.String({ minLength: 1, maxLength: 128 }),
  slug: t.String({ minLength: 1, maxLength: 128 }),
  description: t.Nullable(t.String()),
  articleCount: t.Optional(t.Number()),
  createdAt: DateOrStringSchema,
  updatedAt: DateOrStringSchema,
});
export type TCategory = Static<typeof CategorySchema>;

export const CreateCategorySchema = t.Object({
  name: t.String({ minLength: 1, maxLength: 128 }),
  slug: t.Optional(t.String({ minLength: 1, maxLength: 128 })),
  description: t.Optional(t.String()),
});
export type TCreateCategoryInput = Static<typeof CreateCategorySchema>;

export const UpdateCategorySchema = t.Object({
  name: t.Optional(t.String({ minLength: 1, maxLength: 128 })),
  slug: t.Optional(t.String({ minLength: 1, maxLength: 128 })),
  description: t.Optional(t.String()),
});
export type TUpdateCategoryInput = Static<typeof UpdateCategorySchema>;

// Article Schemas
export const ArticleAuthorSchema = t.Object({
  id: t.String(),
  fullName: t.String(),
  avatarUrl: t.Nullable(t.String()),
});

export const ArticleCategoryRefSchema = t.Object({
  id: t.String(),
  name: t.String(),
  slug: t.String(),
});

export const ArticleItemSchema = t.Object({
  id: t.String(),
  title: t.String(),
  slug: t.String(),
  excerpt: t.Nullable(t.String()),
  thumbnailUrl: t.Nullable(t.String()),
  status: ArticleStatusSchema,
  categoryId: t.Nullable(t.String()),
  category: t.Optional(t.Nullable(ArticleCategoryRefSchema)),
  authorId: t.Nullable(t.String()),
  author: t.Optional(t.Nullable(ArticleAuthorSchema)),
  viewCount: t.Number(),
  publishedAt: t.Nullable(DateOrStringSchema),
  createdAt: DateOrStringSchema,
  updatedAt: DateOrStringSchema,
});
export type TArticleItem = Static<typeof ArticleItemSchema>;

export const ArticleDetailSchema = t.Object({
  id: t.String(),
  title: t.String(),
  slug: t.String(),
  excerpt: t.Nullable(t.String()),
  thumbnailUrl: t.Nullable(t.String()),
  content: t.String(),
  status: ArticleStatusSchema,
  categoryId: t.Nullable(t.String()),
  category: t.Optional(t.Nullable(ArticleCategoryRefSchema)),
  authorId: t.Nullable(t.String()),
  author: t.Optional(t.Nullable(ArticleAuthorSchema)),
  viewCount: t.Number(),
  publishedAt: t.Nullable(DateOrStringSchema),
  createdAt: DateOrStringSchema,
  updatedAt: DateOrStringSchema,
});
export type TArticleDetail = Static<typeof ArticleDetailSchema>;

export const CreateArticleSchema = t.Object({
  title: t.String({ minLength: 1, maxLength: 255 }),
  slug: t.Optional(t.String({ minLength: 1, maxLength: 255 })),
  excerpt: t.Optional(t.String()),
  thumbnailUrl: t.Optional(t.String()),
  content: t.String({ minLength: 1 }),
  status: t.Optional(ArticleStatusSchema),
  categoryId: t.Optional(t.Nullable(t.String())),
});
export type TCreateArticleInput = Static<typeof CreateArticleSchema>;

export const UpdateArticleSchema = t.Object({
  title: t.Optional(t.String({ minLength: 1, maxLength: 255 })),
  slug: t.Optional(t.String({ minLength: 1, maxLength: 255 })),
  excerpt: t.Optional(t.String()),
  thumbnailUrl: t.Optional(t.String()),
  content: t.Optional(t.String({ minLength: 1 })),
  status: t.Optional(ArticleStatusSchema),
  categoryId: t.Optional(t.Nullable(t.String())),
});
export type TUpdateArticleInput = Static<typeof UpdateArticleSchema>;

export const ArticleQuerySchema = t.Object({
  page: t.Optional(t.Numeric({ minimum: 1, default: 1 })),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 10 })),
  status: t.Optional(ArticleStatusSchema),
  categoryId: t.Optional(t.String()),
  search: t.Optional(t.String()),
});
export type TArticleQuery = Static<typeof ArticleQuerySchema>;

export const PaginatedArticlesSchema = t.Object({
  items: t.Array(ArticleItemSchema),
  total: t.Number(),
  page: t.Number(),
  limit: t.Number(),
});
export type TPaginatedArticles = Static<typeof PaginatedArticlesSchema>;

// AI Assistant Schemas
export const AiEnhancePromptInputSchema = t.Object({
  topic: t.String({ minLength: 3, maxLength: 2000 }),
});
export type TAiEnhancePromptInput = Static<typeof AiEnhancePromptInputSchema>;

export const AiEnhancePromptResponseSchema = t.Object({
  enhancedPrompt: t.String(),
});
export type TAiEnhancePromptResponse = Static<typeof AiEnhancePromptResponseSchema>;

export const AiGenerateArticleInputSchema = t.Object({
  prompt: t.String({ minLength: 5, maxLength: 8000 }),
});
export type TAiGenerateArticleInput = Static<typeof AiGenerateArticleInputSchema>;
