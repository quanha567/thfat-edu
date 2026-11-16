import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống").max(255, "Tiêu đề tối đa 255 ký tự"),
  slug: z.string().max(255, "Đường dẫn tĩnh tối đa 255 ký tự").optional().or(z.literal("")),
  excerpt: z.string().optional().or(z.literal("")),
  thumbnailUrl: z.string().url("Đường dẫn ảnh bìa không hợp lệ").optional().or(z.literal("")),
  content: z.string().min(1, "Nội dung bài viết không được để trống"),
  status: z.enum(["draft", "published", "archived"]),
  categoryId: z.string().optional().nullable().or(z.literal("")),
});

export type TArticleFormValues = z.infer<typeof articleSchema>;
