import { formatExamCode, getExamDifficulty } from "../constants/exam.constants";
import { type TQuizListItem } from "../types";

type TFilterExamsOptions = {
  items: TQuizListItem[] | undefined;
  difficulty: string;
  search: string;
  fromDate: string;
  toDate: string;
};

export function filterExams({
  items,
  difficulty,
  search,
  fromDate,
  toDate,
}: TFilterExamsOptions): TQuizListItem[] {
  if (!items) return [];

  return items.filter((exam, index) => {
    if (difficulty !== "all" && getExamDifficulty(exam, index) !== difficulty) {
      return false;
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      const code = formatExamCode(exam.id, index).toLowerCase();
      const matchesCode = code.includes(query);
      const matchesTitle = exam.title.toLowerCase().includes(query);
      if (!matchesCode && !matchesTitle) return false;
    }

    if (fromDate) {
      const examDate = new Date(exam.createdAt).setHours(0, 0, 0, 0);
      const start = new Date(fromDate).setHours(0, 0, 0, 0);
      if (examDate < start) return false;
    }

    if (toDate) {
      const examDate = new Date(exam.createdAt).setHours(23, 59, 59, 999);
      const end = new Date(toDate).setHours(23, 59, 59, 999);
      if (examDate > end) return false;
    }

    return true;
  });
}
