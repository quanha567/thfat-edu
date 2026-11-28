import { format, parseISO } from "date-fns";

import { type TAttemptResult } from "../types";

export type TCertificateModel = {
  certCode: string;
  studentCode: string;
  studentName: string;
  examDate: string;
  timeFormatted: string;
};

export function buildCertificateModel(result: TAttemptResult): TCertificateModel {
  const minutes = Math.floor(result.timeSpentSeconds / 60);
  const seconds = result.timeSpentSeconds % 60;
  const timeFormatted = `${minutes} phút ${seconds < 10 ? "0" : ""}${seconds} giây`;

  const rawDate = result.submittedAt || result.startedAt;
  const examDate = rawDate ? format(parseISO(rawDate), "dd/MM/yyyy HH:mm") : "--/--/----";

  const verifyCode = result.attemptId.slice(0, 8).toUpperCase();
  const certCode = `CERT-${verifyCode}`;

  return {
    certCode,
    studentCode: result.studentCode || certCode,
    studentName: result.studentName || "Thí sinh",
    examDate,
    timeFormatted,
  };
}
