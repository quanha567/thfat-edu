import { z } from "zod";

export const examSettingsSchema = z.object({
  maxAttempts: z.number().int().min(0, "Số lần thi không được âm (0 là không giới hạn)"),
  scorePolicy: z.enum(["highest", "latest"]),
  cooldownMinutes: z.number().int().min(0, "Thời gian chờ không được âm"),
  showScoreImmediately: z.boolean(),
  showExplanationPolicy: z.enum(["immediately", "exam_closed", "never"]),
});

export type TExamSettingsFormValues = z.infer<typeof examSettingsSchema>;
