import { uploadService } from "../upload/upload.service";
import type { TQuizSectionInput } from "./quizzes.model";

const DATA_URI_PATTERN = /^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i;

export function dataUriToFile(dataUri: string, fileName: string): File | null {
  const match = dataUri.match(DATA_URI_PATTERN);

  if (!match?.[1] || !match[2]) {
    return null;
  }

  const bytes = Buffer.from(match[2], "base64");

  return new File([bytes], fileName, { type: match[1].toLowerCase() });
}

/**
 * Moves a question-level image into its markdown `contextContent` so images live in the content
 * (where the editor can place them) instead of a separate field.
 */
export function embedImageInContext<
  TQuestion extends { contextContent: string; imageUrl?: string | null },
>(question: TQuestion): TQuestion {
  const imageUrl = question.imageUrl?.trim();

  if (!imageUrl) {
    return { ...question, imageUrl: null };
  }

  const context = question.contextContent.trimEnd();
  const separator = context ? "\n\n" : "";

  return {
    ...question,
    contextContent: `${context}${separator}![hình minh họa](${imageUrl})`,
    imageUrl: null,
  };
}

export type TUploadImportImagesOptions = {
  sections: TQuizSectionInput[];
  folder: string;
};

export type TUploadImportImagesResult = {
  sections: TQuizSectionInput[];
  uploaded: number;
  failed: number;
};

/**
 * Replaces every base64 `data:image/...` question image with a hosted ImageKit URL so the database
 * stores a short URL instead of megabytes of base64. Identical images are uploaded once. An image
 * that fails to upload is dropped (set to null) rather than failing the whole import.
 */
export async function uploadImportImages({
  sections,
  folder,
}: TUploadImportImagesOptions): Promise<TUploadImportImagesResult> {
  const uploads = new Map<string, Promise<string | null>>();

  const uploadOnce = (dataUri: string): Promise<string | null> => {
    const existing = uploads.get(dataUri);

    if (existing) {
      return existing;
    }

    const file = dataUriToFile(dataUri, `question-${uploads.size + 1}`);
    const pending = file
      ? uploadService
          .uploadFile({ file, folder, fileName: file.name })
          .then((result) => result.url)
          .catch(() => null)
      : Promise.resolve(null);

    uploads.set(dataUri, pending);

    return pending;
  };

  const resolved = await Promise.all(
    sections.map(async (section) => ({
      ...section,
      questions: await Promise.all(
        section.questions.map(async (question) => {
          const imageUrl = question.imageUrl;

          if (!imageUrl) {
            return question;
          }

          const hostedUrl = imageUrl.startsWith("data:") ? await uploadOnce(imageUrl) : imageUrl;

          return embedImageInContext({ ...question, imageUrl: hostedUrl });
        }),
      ),
    })),
  );

  const results = await Promise.all(uploads.values());
  const uploaded = results.filter((url) => url !== null).length;

  return { sections: resolved, uploaded, failed: results.length - uploaded };
}
