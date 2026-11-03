export interface QuizOption {
  id: string;
  /** Option text supporting KaTeX mhchem formula, e.g. "$\\ce{FeCl2}$" */
  text: string;
}

export interface QuizQuestion {
  id: string;
  /** Question prompt supporting Markdown and KaTeX mhchem */
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  points: number;
}

export interface QuizSubmission {
  quizId: string;
  answers: Record<string, string>; // questionId -> selectedOptionId
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  totalPoints: number;
  earnedPoints: number;
  scorePercentage: number;
}
