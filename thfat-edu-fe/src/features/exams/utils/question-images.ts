import { type TQuizQuestion, type TQuizSection } from "../types";

/**
 * Images now live inside the markdown content (`![alt](url)`). `imageUrl` is only kept for
 * questions saved before that change.
 */
export function getLegacyImageUrl(question: TQuizQuestion): string | null {
  const imageUrl = question.imageUrl?.trim();

  if (!imageUrl || question.contextContent.includes(imageUrl)) {
    return null;
  }

  return imageUrl;
}

export function embedLegacyImage(question: TQuizQuestion): TQuizQuestion {
  const legacyUrl = getLegacyImageUrl(question);

  if (!legacyUrl) {
    return question.imageUrl ? { ...question, imageUrl: null } : question;
  }

  const context = question.contextContent.trimEnd();
  const separator = context ? "\n\n" : "";

  return {
    ...question,
    contextContent: `${context}${separator}![hình minh họa](${legacyUrl})`,
    imageUrl: null,
  };
}

export function embedLegacyImages(sections: TQuizSection[]): TQuizSection[] {
  return sections.map((section) => ({
    ...section,
    questions: section.questions.map(embedLegacyImage),
  }));
}
