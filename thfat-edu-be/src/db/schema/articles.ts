import { type InferInsertModel, type InferSelectModel, relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { users } from "./users";

export const articleStatusEnum = pgEnum("article_status", ["draft", "published", "archived"]);
export type TArticleStatus = (typeof articleStatusEnum.enumValues)[number];

export const articleCategories = pgTable("article_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const articleCategoriesRelations = relations(articleCategories, ({ many }) => ({
  articles: many(articles),
}));

export const articles = pgTable("articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  thumbnailUrl: text("thumbnail_url"),
  content: text("content").notNull(),
  status: articleStatusEnum("status").default("draft").notNull(),
  categoryId: uuid("category_id").references(() => articleCategories.id, { onDelete: "set null" }),
  authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  viewCount: integer("view_count").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const articlesRelations = relations(articles, ({ one }) => ({
  category: one(articleCategories, {
    fields: [articles.categoryId],
    references: [articleCategories.id],
  }),
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
  }),
}));

export type TArticleCategory = InferSelectModel<typeof articleCategories>;
export type TNewArticleCategory = InferInsertModel<typeof articleCategories>;
export type TArticle = InferSelectModel<typeof articles>;
export type TNewArticle = InferInsertModel<typeof articles>;
