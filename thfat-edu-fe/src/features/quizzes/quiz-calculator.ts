import type { QuizQuestion, QuizResult } from "./types";

/** Calculates quiz results based on questions and student's submitted answers. */
export function calculateQuizResult(
  questions: QuizQuestion[],
  answers: Record<string, string>,
): QuizResult {
  if (questions.length === 0) {
    return {
      totalQuestions: 0,
      correctAnswers: 0,
      totalPoints: 0,
      earnedPoints: 0,
      scorePercentage: 0,
    };
  }

  let correctCount = 0;
  let totalPoints = 0;
  let earnedPoints = 0;

  for (const q of questions) {
    totalPoints += q.points;

    if (answers[q.id] === q.correctOptionId) {
      correctCount += 1;
      earnedPoints += q.points;
    }
  }

  const scorePercentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  return {
    totalQuestions: questions.length,
    correctAnswers: correctCount,
    totalPoints,
    earnedPoints,
    scorePercentage,
  };
}

/** Standard atomic masses (g/mol) for common chemical elements. */
export const ATOMIC_MASSES: Record<string, number> = {
  H: 1.008,
  He: 4.003,
  C: 12.011,
  N: 14.007,
  O: 15.999,
  Na: 22.99,
  Mg: 24.305,
  Al: 26.982,
  P: 30.974,
  S: 32.06,
  Cl: 35.45,
  K: 39.098,
  Ca: 40.078,
  Fe: 55.845,
  Cu: 63.546,
  Zn: 65.38,
  Ag: 107.87,
  Ba: 137.33,
};

/** Computes molar mass given element count map, e.g. { H: 2, O: 1 } -> 18.015 g/mol */
export function calculateMolarMass(elements: Record<string, number>): number {
  let mass = 0;

  for (const [symbol, count] of Object.entries(elements)) {
    const atomicMass = ATOMIC_MASSES[symbol];

    if (atomicMass !== undefined) {
      mass += atomicMass * count;
    }
  }

  return Math.round(mass * 1000) / 1000;
}
