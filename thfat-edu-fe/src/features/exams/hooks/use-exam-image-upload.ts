"use client";

import { useUploadMedia } from "@/hooks/use-upload";
import { useCallback } from "react";

const EXAM_IMAGE_FOLDER = "/exams/images";

export type TUseExamImageUploadReturn = {
  isUploading: boolean;
  uploadImage: (file: File) => Promise<string | null>;
};

export function useExamImageUpload(): TUseExamImageUploadReturn {
  const { mutateAsync, isPending } = useUploadMedia();

  const uploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        const result = await mutateAsync({
          file,
          folder: EXAM_IMAGE_FOLDER,
          fileName: "exam-image",
        });

        return result.url;
      } catch {
        // useUploadMedia already shows an error toast
        return null;
      }
    },
    [mutateAsync],
  );

  return { isUploading: isPending, uploadImage };
}
