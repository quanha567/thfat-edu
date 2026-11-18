import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Tên chuyên mục không được để trống")
    .max(128, "Tên chuyên mục tối đa 128 ký tự"),
  slug: z.string().max(128, "Đường dẫn tĩnh tối đa 128 ký tự").optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

export type TCategoryFormValues = z.infer<typeof categorySchema>;
