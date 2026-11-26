"use client";

import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type TUploadResponse = {
  url: string;
  fileId: string;
  name: string;
};

type TUploadAvatarOptions = {
  file: File;
  onSuccess?: (result: TUploadResponse) => void;
};

type TUploadMediaOptions = {
  file: File;
  folder: string;
  fileName?: string;
  onSuccess?: (result: TUploadResponse) => void;
};

async function postUpload(endpoint: string, formData: FormData): Promise<TUploadResponse> {
  const res = await fetch(endpoint, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(extractApiErrorMessage(errorData, "Tải ảnh lên thất bại."));
  }

  return res.json();
}

export function useUploadAvatar({ onSuccess }: Pick<TUploadAvatarOptions, "onSuccess"> = {}) {
  const queryClient = useQueryClient();

  return useMutation<TUploadResponse, Error, File>({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      return postUpload("/api/upload/avatar", formData);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      toast.success("Tải ảnh đại diện lên thành công!");
      onSuccess?.(result);
    },
    onError: (error) => {
      toast.error(error.message || "Không thể tải ảnh lên. Vui lòng thử lại.");
    },
  });
}

export function useUploadMedia({ onSuccess }: Pick<TUploadMediaOptions, "onSuccess"> = {}) {
  return useMutation<TUploadResponse, Error, Omit<TUploadMediaOptions, "onSuccess">>({
    mutationFn: async ({ file, folder, fileName }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      if (fileName) {
        formData.append("fileName", fileName);
      }

      return postUpload("/api/upload/media", formData);
    },
    onSuccess: (result) => {
      onSuccess?.(result);
    },
    onError: (error) => {
      toast.error(error.message || "Không thể tải ảnh lên. Vui lòng thử lại.");
    },
  });
}

/**
 * Scans an HTML string for blob: image URLs, uploads each one to ImageKit via /upload/media, and
 * returns the HTML with all blob: URLs replaced by the returned ImageKit URLs.
 */
export async function uploadBlobImagesInHtml(html: string, folder: string): Promise<string> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const images = Array.from(doc.querySelectorAll<HTMLImageElement>("img[src^='blob:']"));

  if (images.length === 0) {
    return html;
  }

  await Promise.all(
    images.map(async (img) => {
      const blobUrl = img.getAttribute("src");

      if (!blobUrl) {
        return;
      }

      const response = await fetch(blobUrl);
      const blob = await response.blob();
      const file = new File([blob], "image.png", {
        type: blob.type || "image/png",
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload/media", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);

        throw new Error(extractApiErrorMessage(errorData, "Tải ảnh trong nội dung lên thất bại."));
      }

      const result: TUploadResponse = await res.json();
      img.setAttribute("src", result.url);
    }),
  );

  return doc.body.innerHTML;
}
