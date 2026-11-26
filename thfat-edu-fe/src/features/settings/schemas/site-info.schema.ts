import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .max(500, "Liên kết tối đa 500 ký tự")
  .refine((value) => value === "" || /^https?:\/\/\S+$/.test(value), {
    message: "Liên kết phải bắt đầu bằng http:// hoặc https://",
  });

export const siteInfoSchema = z.object({
  siteName: z.string().trim().min(1, "Vui lòng nhập tên site").max(60, "Tên site tối đa 60 ký tự"),
  slogan: z.string().trim().max(120, "Slogan tối đa 120 ký tự"),
  contactEmail: z
    .string()
    .trim()
    .max(254, "Email tối đa 254 ký tự")
    .refine((value) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: "Email không đúng định dạng",
    }),
  facebookUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  zaloUrl: optionalUrl,
  tiktokUrl: optionalUrl,
  telegramUrl: optionalUrl,
  instagramUrl: optionalUrl,
});

export type TSiteInfoFormValues = z.infer<typeof siteInfoSchema>;
