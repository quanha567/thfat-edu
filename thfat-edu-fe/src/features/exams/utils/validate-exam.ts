import { type TQuizSection } from "../types";

export function validateExamSections(sections: TQuizSection[]): Set<string> {
  const errs = new Set<string>();

  sections.forEach((sec, sIdx) => {
    sec.questions.forEach((q, qIdx) => {
      const key = `${sIdx}-${qIdx}`;
      if (!q.contextContent && sec.sectionType !== "matching") {
        errs.add(key);
      }
      if (sec.sectionType === "short_answer") {
        const sub = q.subItems[0];
        if (!sub?.correctAnswer) {
          errs.add(key);
        }
      }
    });
  });

  return errs;
}
