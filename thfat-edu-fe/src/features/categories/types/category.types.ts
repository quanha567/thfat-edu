export type TCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  articleCount?: number;
  createdAt: string;
  updatedAt: string;
};

export type TCreateCategoryInput = {
  name: string;
  slug?: string;
  description?: string;
};

export type TUpdateCategoryInput = {
  name?: string;
  slug?: string;
  description?: string;
};
