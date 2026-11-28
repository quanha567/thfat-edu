export type TExamStatus = "draft" | "published" | "archived";

export type TExamDifficulty = "easy" | "medium" | "hard";

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
  code: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  totalPoints: string;
  status: TExamStatus;
  pdfUrl: string | null;
  totalQuestions: number;
  totalSubItems: number;
  attemptCount: number;
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
  difficulty?: TExamDifficulty;
  fromDate?: string;
  toDate?: string;
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

export type TSolveQuestionInput = {
  sectionType: TSectionType;
  question: TQuizQuestion;
};

export type TSolvedSubItem = {
  orderIndex: number;
  label: string;
  correctAnswer: string;
  acceptableAnswers?: string[] | null;
  explanation?: string | null;
};

export type TSolveQuestionResponse = {
  subItems: TSolvedSubItem[];
};

// ── Student Exam Taking Types ──────────────────────────────────────────

export type TStudentExamStatus = "not_started" | "in_progress" | "submitted";

export type TStudentExamListItem = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  totalPoints: string;
  totalQuestions: number;
  totalSubItems: number;
  attemptStatus: TStudentExamStatus;
  attemptId: string | null;
  score: string | null;
  submittedAt: string | null;
  maxAttempts?: number | null;
  attemptCount?: number;
  canTakeExam?: boolean;
  cooldownRemainingSeconds?: number;
  displayScore?: string | null;
};

export type TStudentExamListResponse = {
  items: TStudentExamListItem[];
  total: number;
  page: number;
  limit: number;
};

export type TExamRoomSubItem = {
  id: string;
  orderIndex: number;
  label: string;
  content: string;
  options: string[] | null;
  points: string;
};

export type TExamRoomQuestion = {
  id: string;
  orderIndex: number;
  contextContent: string;
  imageUrl: string | null;
  subItems: TExamRoomSubItem[];
};

export type TExamRoomSection = {
  id: string;
  sectionType: TSectionType;
  title: string;
  orderIndex: number;
  questions: TExamRoomQuestion[];
};

export type TExamRoomData = {
  attempt: {
    id: string;
    quizId: string;
    startedAt: string;
    durationMinutes: number;
    remainingSeconds: number;
    status: string;
  };
  quiz: {
    id: string;
    title: string;
    description: string | null;
    durationMinutes: number;
    totalPoints: string;
    sections: TExamRoomSection[];
  };
  savedAnswers: Array<{
    subItemId: string;
    selectedAnswer: string | null;
    isFlagged: boolean;
  }>;
};

export type TSyncAnswerPayload = {
  subItemId: string;
  selectedAnswer: string | null;
  isFlagged?: boolean;
};

export type TSubmitAttemptResponse = {
  attemptId: string;
  score: string;
  totalQuestionsAnswered: number;
  submittedAt: string;
  status: string;
  message: string;
};

export type TAttemptResult = {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  studentName?: string;
  studentCode?: string | null;
  score: string;
  totalPoints: string;
  totalAnswered: number;
  totalSubItems: number;
  startedAt: string;
  submittedAt: string;
  durationMinutes: number;
  timeSpentSeconds: number;
};
