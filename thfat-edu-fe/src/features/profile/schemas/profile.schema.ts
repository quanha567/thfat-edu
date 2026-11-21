import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(1, "Họ tên không được để trống"),
  avatarUrl: z
    .string()
    .url("URL ảnh không hợp lệ")
    .nullable()
    .or(z.literal(""))
    .transform((v) => v || null),
  gender: z.enum(["male", "female", "other"]).nullable().optional(),
  // Student profile fields
  studentCode: z.string().nullable().optional(),
  grade: z.string().nullable().optional(),
  schoolName: z.string().nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  parentPhone: z.string().nullable().optional(),
  // Teacher profile fields
  teacherCode: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
});

export type TProfileFormValues = z.infer<typeof profileSchema>;
