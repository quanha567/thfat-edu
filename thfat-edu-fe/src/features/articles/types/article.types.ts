export type TArticleStatus = "draft" | "published" | "archived";

export type TArticleAuthor = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
};

export type TArticleCategoryRef = {
  id: string;
  name: string;
  slug: string;
};

export type TArticleItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnailUrl: string | null;
  status: TArticleStatus;
  categoryId: string | null;
  category?: TArticleCategoryRef | null;
  authorId: string | null;
  author?: TArticleAuthor | null;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TArticleDetail = TArticleItem & {
  content: string;
};

export type TCreateArticleInput = {
  title: string;
  slug?: string;
  excerpt?: string;
  thumbnailUrl?: string;
  content: string;
  status?: TArticleStatus;
  categoryId?: string | null;
};

export type TUpdateArticleInput = Partial<TCreateArticleInput>;

export type TArticleQuery = {
  page?: number;
  limit?: number;
  status?: TArticleStatus;
  categoryId?: string;
  search?: string;
};

export type TPaginatedArticles = {
  items: TArticleItem[];
  total: number;
  page: number;
  limit: number;
};
