export type TExamStatus = "draft" | "published" | "archived";

export type TSectionType = "true_false" | "group_mcq" | "matching" | "short_answer";

export type TQuizSubItem = {
  id?: string;
  orderIndex: number;
  label: string;
  content: string;
  options?: string[] | null;
  correctAnswer?: string | null;
  acceptableAnswers?: string[] | null;
  points: string;
  explanation?: string | null;
  createdAt?: string;
};

export type TQuizQuestion = {
  id?: string;
  orderIndex: number;
  contextContent: string;
  imageUrl?: string | null;
  subItems: TQuizSubItem[];
  createdAt?: string;
};

export type TQuizSection = {
  id?: string;
  sectionType: TSectionType;
  title: string;
  orderIndex: number;
  questions: TQuizQuestion[];
  createdAt?: string;
};

export type TQuizDetail = {
  id: string;
  title: string;
  description?: string | null;
  durationMinutes: number;
  totalPoints: string;
  status: TExamStatus;
  pdfUrl?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  sections: TQuizSection[];
};

export type TQuizListItem = {
  id: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  totalPoints: string;
  status: TExamStatus;
  pdfUrl: string | null;
  totalQuestions: number;
  totalSubItems: number;
  createdAt: string;
  updatedAt: string;
};

export type TQuizListResponse = {
  items: TQuizListItem[];
  total: number;
  page: number;
  limit: number;
};

export type TExamFilterParams = {
  page?: number;
  limit?: number;
  status?: TExamStatus;
  search?: string;
};

export type TCreateQuizInput = {
  title: string;
  description?: string;
  durationMinutes?: number;
  totalPoints?: string;
  status?: TExamStatus;
  pdfUrl?: string;
  sections?: TQuizSection[];
};

export type TUpdateQuizInput = Partial<TCreateQuizInput>;

export type TImportPdfInput = {
  title?: string;
  pdfBase64: string;
  pdfUrl?: string;
};
