import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";

import { type Database, db } from "../../db";
import {
  articleCategories,
  articles,
  systemSettings,
  type TArticleCategory,
  users,
} from "../../db/schema";
import { NotFoundError } from "../../middlewares/error-handler";
import { NvidiaNimService } from "../../services/ai/nvidia-nim.service";
import type {
  TArticleDetail,
  TArticleItem,
  TArticleQuery,
  TCategory,
  TCreateArticleInput,
  TCreateCategoryInput,
  TPaginatedArticles,
  TUpdateArticleInput,
  TUpdateCategoryInput,
} from "./articles.model";

export const ENHANCE_PROMPT_SYSTEM = `Bạn là một chuyên gia sư phạm và biên tập viên giáo dục cao cấp của nền tảng ThFat Edu.
Nhiệm vụ của bạn là nhận chủ đề/ý tưởng bài viết sơ lược từ tác giả và chuyển đổi nó thành một Dàn ý chi tiết & Kế hoạch bài viết chất lượng cao dành cho học sinh THPT và ôn thi đại học.

Định dạng trả về là văn bản Markdown rõ ràng, bao gồm:
1. **Mục tiêu bài viết**: Nêu rõ học sinh sẽ nắm được gì sau khi đọc.
2. **Đối tượng hướng đến**: Ví dụ: Học sinh lớp 12, thí sinh ôn thi THPT Quốc gia, bồi dưỡng HSG...
3. **Dàn ý chi tiết**: Các đề mục chính (##, ###), kèm gạch đầu dòng nội dung cần viết cho từng phần.
4. **Công thức & Ví dụ dự kiến**: Các công thức Toán học / Hóa học (bắt buộc dùng định dạng LaTeX $...$ hoặc $$...$$) và bài toán mẫu cần phân tích.
5. **Gợi ý lưu ý / Lỗi sai thường gặp**: Những điểm học sinh dễ nhầm lẫn.

Hãy viết bằng tiếng Việt chuẩn mực, cấu trúc khoa học, rõ ràng và truyền cảm hứng học tập.`;

export const GENERATE_ARTICLE_SYSTEM = `Bạn là chuyên gia giáo dục của nền tảng ThFat Edu. Nhiệm vụ của bạn là viết một bài viết hoàn chỉnh, sâu sắc, chuẩn mực sư phạm dựa trên dàn ý/yêu cầu được cung cấp.

BẮT BUỘC TUÂN THỦ CẤU TRÚC ĐẦU RA SAU ĐÂY:
- Dòng đầu tiên: Bắt đầu bằng duy nhất 1 dấu thăng và tiêu đề bài viết:
# <Tiêu đề bài viết hấp dẫn, chuẩn giáo dục>

- Ngay dưới tiêu đề: Một đoạn trích dẫn ngắn (1-2 câu) tóm tắt giá trị cốt lõi của bài viết:
> <Đoạn tóm tắt ngắn gọn, súc tích>

- Toàn bộ phần sau: Thân bài viết bằng định dạng Markdown hoàn chỉnh:
  + Dùng các heading ##, ### hợp lý, phân chia rõ ràng các mục lý thuyết, phương pháp giải, ví dụ mẫu có lời giải chi tiết.
  + ĐỐI VỚI CÔNG THỨC TOÁN HỌC HOẶC HÓA HỌC: BẮT BUỘC dùng LaTeX tiêu chuẩn:
    - Công thức nội dòng (inline): kẹp giữa cặp dấu $ như $H_2SO_4$, $f'(x) = 2x$.
    - Công thức khối (block): kẹp giữa cặp dấu $$ trên dòng riêng như $$\\Delta = b^2 - 4ac$$.
  + Lời văn trong sáng, dễ hiểu, khích lệ tinh thần học tập, có các bảng hoặc danh sách bullet points khi cần thiết.
  + BẮT BUỘC VIẾT HOÀN CHỈNH BÀI VIẾT TỪ ĐẦU ĐẾN CUỐI (gồm lý thuyết, các dạng bài, ví dụ mẫu và phần kết luận/tổng kết), KHÔNG ĐƯỢC DỪNG DỞ DANG HOẶC CẮT BỚT NỘI DUNG.`;

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export class ArticlesService {
  constructor(
    private readonly database: Database = db,
    private readonly nimService: NvidiaNimService = new NvidiaNimService(),
  ) {}

  // ================= AI Assistant =================

  public async getArticleAiModel(): Promise<string> {
    const envModel = process.env.AI_ARTICLE_MODEL;
    if (envModel) return envModel;

    try {
      const setting = await Promise.race([
        this.database
          .select()
          .from(systemSettings)
          .where(eq(systemSettings.key, "ai_article_model"))
          .limit(1),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("DB timeout")), 1500)),
      ]);

      if (setting[0]?.value) {
        const val =
          typeof setting[0].value === "string"
            ? setting[0].value
            : (setting[0].value as { model?: string })?.model;
        if (val) return val;
      }
    } catch {
      // Fallback default
    }

    return "nvidia/nemotron-3-ultra-550b-a55b";
  }

  public async enhancePrompt(topic: string): Promise<string> {
    const model = await this.getArticleAiModel();

    return this.nimService.chatCompletion({
      model,
      messages: [
        { role: "system", content: ENHANCE_PROMPT_SYSTEM },
        { role: "user", content: `Chủ đề/Yêu cầu bài viết:\n${topic}` },
      ],
      temperature: 0.7,
      max_tokens: 3072,
    });
  }

  public async streamGenerateArticle(
    prompt: string,
    onChunk: (chunk: string) => void,
  ): Promise<string> {
    const model = await this.getArticleAiModel();

    return this.nimService.chatCompletion({
      model,
      messages: [
        { role: "system", content: GENERATE_ARTICLE_SYSTEM },
        {
          role: "user",
          content: `Hãy viết bài viết hoàn chỉnh dựa trên dàn ý/yêu cầu sau:\n\n${prompt}`,
        },
      ],
      temperature: 0.6,
      max_tokens: 8192,
      stream: true,
      onToken: onChunk,
    });
  }

  // ================= Categories =================

  public async getCategories(): Promise<TCategory[]> {
    const rows = await this.database
      .select({
        id: articleCategories.id,
        name: articleCategories.name,
        slug: articleCategories.slug,
        description: articleCategories.description,
        createdAt: articleCategories.createdAt,
        updatedAt: articleCategories.updatedAt,
        articleCount: count(articles.id),
      })
      .from(articleCategories)
      .leftJoin(articles, eq(articles.categoryId, articleCategories.id))
      .groupBy(
        articleCategories.id,
        articleCategories.name,
        articleCategories.slug,
        articleCategories.description,
        articleCategories.createdAt,
        articleCategories.updatedAt,
      )
      .orderBy(desc(articleCategories.createdAt));

    return rows.map((row) => ({
      ...row,
      articleCount: Number(row.articleCount),
    }));
  }

  public async getCategoryById(id: string): Promise<TCategory> {
    const [category] = await this.database
      .select()
      .from(articleCategories)
      .where(eq(articleCategories.id, id))
      .limit(1);

    if (!category) {
      throw new NotFoundError("Chuyên mục không tồn tại.");
    }

    return category;
  }

  public async createCategory(input: TCreateCategoryInput): Promise<TArticleCategory> {
    const baseSlug = input.slug ? slugify(input.slug) : slugify(input.name);
    let finalSlug = baseSlug;

    // Check slug duplication
    const [existing] = await this.database
      .select({ id: articleCategories.id })
      .from(articleCategories)
      .where(eq(articleCategories.slug, finalSlug))
      .limit(1);

    if (existing) {
      finalSlug = `${baseSlug}-${Date.now().toString(36)}`;
    }

    const [created] = await this.database
      .insert(articleCategories)
      .values({
        name: input.name,
        slug: finalSlug,
        description: input.description ?? null,
      })
      .returning();

    return created;
  }

  public async updateCategory(id: string, input: TUpdateCategoryInput): Promise<TArticleCategory> {
    const category = await this.getCategoryById(id);

    let finalSlug = category.slug;
    if (input.slug || input.name) {
      const candidateSlug = input.slug ? slugify(input.slug) : slugify(input.name ?? category.name);
      if (candidateSlug !== category.slug) {
        const [existing] = await this.database
          .select({ id: articleCategories.id })
          .from(articleCategories)
          .where(eq(articleCategories.slug, candidateSlug))
          .limit(1);

        finalSlug = existing ? `${candidateSlug}-${Date.now().toString(36)}` : candidateSlug;
      }
    }

    const [updated] = await this.database
      .update(articleCategories)
      .set({
        name: input.name ?? category.name,
        slug: finalSlug,
        description: input.description !== undefined ? input.description : category.description,
        updatedAt: new Date(),
      })
      .where(eq(articleCategories.id, id))
      .returning();

    return updated;
  }

  public async deleteCategory(id: string): Promise<boolean> {
    await this.getCategoryById(id);

    // Unlink articles associated with this category
    await this.database
      .update(articles)
      .set({ categoryId: null })
      .where(eq(articles.categoryId, id));

    const result = await this.database
      .delete(articleCategories)
      .where(eq(articleCategories.id, id))
      .returning({ id: articleCategories.id });

    return result.length > 0;
  }

  // ================= Articles =================

  public async getArticles(
    query: TArticleQuery,
    isPublicOnly = false,
  ): Promise<TPaginatedArticles> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 10));
    const offset = (page - 1) * limit;

    const conditions = [];

    if (isPublicOnly) {
      conditions.push(eq(articles.status, "published"));
    } else if (query.status) {
      conditions.push(eq(articles.status, query.status));
    }

    if (query.categoryId) {
      conditions.push(eq(articles.categoryId, query.categoryId));
    }

    if (query.search && query.search.trim()) {
      const pattern = `%${query.search.trim()}%`;
      conditions.push(or(ilike(articles.title, pattern), ilike(articles.excerpt, pattern)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [totalRow] = await this.database
      .select({ count: count() })
      .from(articles)
      .where(whereClause);

    const total = Number(totalRow?.count ?? 0);

    const rows = await this.database
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        thumbnailUrl: articles.thumbnailUrl,
        status: articles.status,
        categoryId: articles.categoryId,
        categoryName: articleCategories.name,
        categorySlug: articleCategories.slug,
        authorId: articles.authorId,
        authorName: users.fullName,
        authorAvatar: users.avatarUrl,
        viewCount: articles.viewCount,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
      })
      .from(articles)
      .leftJoin(articleCategories, eq(articles.categoryId, articleCategories.id))
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(whereClause)
      .orderBy(desc(articles.createdAt))
      .limit(limit)
      .offset(offset);

    const items: TArticleItem[] = rows.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      excerpt: r.excerpt,
      thumbnailUrl: r.thumbnailUrl,
      status: r.status,
      categoryId: r.categoryId,
      category: r.categoryId
        ? {
            id: r.categoryId,
            name: r.categoryName ?? "",
            slug: r.categorySlug ?? "",
          }
        : null,
      authorId: r.authorId,
      author: r.authorId
        ? {
            id: r.authorId,
            fullName: r.authorName ?? "Người dùng",
            avatarUrl: r.authorAvatar,
          }
        : null,
      viewCount: r.viewCount,
      publishedAt: r.publishedAt,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    return {
      items,
      total,
      page,
      limit,
    };
  }

  public async getArticleById(id: string): Promise<TArticleDetail> {
    const [row] = await this.database
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        thumbnailUrl: articles.thumbnailUrl,
        content: articles.content,
        status: articles.status,
        categoryId: articles.categoryId,
        categoryName: articleCategories.name,
        categorySlug: articleCategories.slug,
        authorId: articles.authorId,
        authorName: users.fullName,
        authorAvatar: users.avatarUrl,
        viewCount: articles.viewCount,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
      })
      .from(articles)
      .leftJoin(articleCategories, eq(articles.categoryId, articleCategories.id))
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(eq(articles.id, id))
      .limit(1);

    if (!row) {
      throw new NotFoundError("Bài viết không tồn tại.");
    }

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      thumbnailUrl: row.thumbnailUrl,
      content: row.content,
      status: row.status,
      categoryId: row.categoryId,
      category: row.categoryId
        ? {
            id: row.categoryId,
            name: row.categoryName ?? "",
            slug: row.categorySlug ?? "",
          }
        : null,
      authorId: row.authorId,
      author: row.authorId
        ? {
            id: row.authorId,
            fullName: row.authorName ?? "Người dùng",
            avatarUrl: row.authorAvatar,
          }
        : null,
      viewCount: row.viewCount,
      publishedAt: row.publishedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  public async getArticleBySlug(slug: string, isPublicOnly = false): Promise<TArticleDetail> {
    const conditions = [eq(articles.slug, slug)];
    if (isPublicOnly) {
      conditions.push(eq(articles.status, "published"));
    }

    const [row] = await this.database
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        thumbnailUrl: articles.thumbnailUrl,
        content: articles.content,
        status: articles.status,
        categoryId: articles.categoryId,
        categoryName: articleCategories.name,
        categorySlug: articleCategories.slug,
        authorId: articles.authorId,
        authorName: users.fullName,
        authorAvatar: users.avatarUrl,
        viewCount: articles.viewCount,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
      })
      .from(articles)
      .leftJoin(articleCategories, eq(articles.categoryId, articleCategories.id))
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(and(...conditions))
      .limit(1);

    if (!row) {
      throw new NotFoundError("Bài viết không tồn tại hoặc chưa được xuất bản.");
    }

    // Increment view count asynchronously
    void this.database
      .update(articles)
      .set({ viewCount: sql`${articles.viewCount} + 1` })
      .where(eq(articles.id, row.id))
      .execute();

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      thumbnailUrl: row.thumbnailUrl,
      content: row.content,
      status: row.status,
      categoryId: row.categoryId,
      category: row.categoryId
        ? {
            id: row.categoryId,
            name: row.categoryName ?? "",
            slug: row.categorySlug ?? "",
          }
        : null,
      authorId: row.authorId,
      author: row.authorId
        ? {
            id: row.authorId,
            fullName: row.authorName ?? "Người dùng",
            avatarUrl: row.authorAvatar,
          }
        : null,
      viewCount: row.viewCount + 1,
      publishedAt: row.publishedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  public async createArticle(
    input: TCreateArticleInput,
    authorId: string,
  ): Promise<TArticleDetail> {
    const baseSlug = input.slug ? slugify(input.slug) : slugify(input.title);
    let finalSlug = baseSlug;

    const [existing] = await this.database
      .select({ id: articles.id })
      .from(articles)
      .where(eq(articles.slug, finalSlug))
      .limit(1);

    if (existing) {
      finalSlug = `${baseSlug}-${Date.now().toString(36)}`;
    }

    const status = input.status ?? "draft";
    const publishedAt = status === "published" ? new Date() : null;

    const [created] = await this.database
      .insert(articles)
      .values({
        title: input.title,
        slug: finalSlug,
        excerpt: input.excerpt ?? null,
        thumbnailUrl: input.thumbnailUrl ?? null,
        content: input.content,
        status,
        categoryId: input.categoryId ?? null,
        authorId,
        publishedAt,
      })
      .returning();

    return this.getArticleById(created.id);
  }

  public async updateArticle(id: string, input: TUpdateArticleInput): Promise<TArticleDetail> {
    const article = await this.getArticleById(id);

    let finalSlug = article.slug;
    if (input.slug || input.title) {
      const candidateSlug = input.slug
        ? slugify(input.slug)
        : slugify(input.title ?? article.title);
      if (candidateSlug !== article.slug) {
        const [existing] = await this.database
          .select({ id: articles.id })
          .from(articles)
          .where(eq(articles.slug, candidateSlug))
          .limit(1);

        finalSlug = existing ? `${candidateSlug}-${Date.now().toString(36)}` : candidateSlug;
      }
    }

    const nextStatus = input.status ?? article.status;
    let publishedAt: Date | null = article.publishedAt ? new Date(article.publishedAt) : null;
    if (nextStatus === "published" && !publishedAt) {
      publishedAt = new Date();
    }

    await this.database
      .update(articles)
      .set({
        title: input.title ?? article.title,
        slug: finalSlug,
        excerpt: input.excerpt !== undefined ? input.excerpt : article.excerpt,
        thumbnailUrl: input.thumbnailUrl !== undefined ? input.thumbnailUrl : article.thumbnailUrl,
        content: input.content ?? article.content,
        status: nextStatus,
        categoryId: input.categoryId !== undefined ? input.categoryId : article.categoryId,
        publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id));

    return this.getArticleById(id);
  }

  public async deleteArticle(id: string): Promise<boolean> {
    await this.getArticleById(id);

    const result = await this.database
      .delete(articles)
      .where(eq(articles.id, id))
      .returning({ id: articles.id });

    return result.length > 0;
  }
}

export const articlesService = new ArticlesService();
