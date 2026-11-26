import { env } from "../../config/env";
import { IMAGEKIT_ALLOWED_MIME_TYPES, IMAGEKIT_MAX_FILE_SIZE } from "../../config/imagekit";
import { createModuleLogger } from "../../config/logger";
import { BadRequestError } from "../../middlewares/error-handler";
import type { TUploadResponse } from "./upload.model";

const uploadLogger = createModuleLogger("upload");

const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";
const IMAGEKIT_UPLOAD_TIMEOUT_MS = 30_000;

const SAFE_FOLDER_PATTERN = /^\/[A-Za-z0-9_\-/]{1,200}$/;

type TDetectedImage = { extension: "jpg" | "png" | "webp" };

function startsWith(bytes: Uint8Array, signature: number[], offset = 0): boolean {
  return signature.every((value, index) => bytes[offset + index] === value);
}

export function detectImageType(bytes: Uint8Array): TDetectedImage | null {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return { extension: "jpg" };
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { extension: "png" };
  }

  // RIFF....WEBP
  if (
    startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)
  ) {
    return { extension: "webp" };
  }

  return null;
}

export function sanitizeFileName(fileName: string): string {
  const withoutExtension = fileName.replace(/\.\w{1,5}$/, "");
  const cleaned = withoutExtension.replace(/[^A-Za-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");

  return cleaned.slice(0, 80) || "image";
}

type TUploadOptions = {
  file: File;
  folder: string;
  fileName: string;
};

export class UploadService {
  async uploadFile({ file, folder, fileName }: TUploadOptions): Promise<TUploadResponse> {
    if (!IMAGEKIT_ALLOWED_MIME_TYPES.has(file.type)) {
      throw new BadRequestError(
        `Định dạng file không được hỗ trợ. Chỉ chấp nhận: jpg, jpeg, png, webp.`,
      );
    }

    if (file.size > IMAGEKIT_MAX_FILE_SIZE) {
      throw new BadRequestError(`File quá lớn. Kích thước tối đa là 5MB.`);
    }

    // Không tin MIME do client gửi: kiểm tra chữ ký (magic bytes) thực của file.
    const detectedType = detectImageType(new Uint8Array(await file.slice(0, 12).arrayBuffer()));

    if (!detectedType) {
      throw new BadRequestError("Nội dung file không phải ảnh jpg, png hoặc webp hợp lệ.");
    }

    if (!SAFE_FOLDER_PATTERN.test(folder) || folder.includes("..") || folder.includes("//")) {
      throw new BadRequestError("Thư mục tải lên không hợp lệ.");
    }

    const baseName = sanitizeFileName(fileName);

    // The `imagekit` SDK hangs under Bun (axios + form-data), so call the REST API directly.
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", `${baseName}.${detectedType.extension}`);
    formData.append("folder", folder);
    formData.append("useUniqueFileName", "true");

    const startedAt = performance.now();
    const fields = { service: "imagekit", operation: "upload", sizeBytes: file.size };

    let response: Response;
    try {
      response = await fetch(IMAGEKIT_UPLOAD_URL, {
        method: "POST",
        headers: { Authorization: `Basic ${btoa(`${env.IMAGEKIT_PRIVATE_KEY}:`)}` },
        body: formData,
        signal: AbortSignal.timeout(IMAGEKIT_UPLOAD_TIMEOUT_MS),
      });
    } catch (error) {
      uploadLogger.error(
        {
          ...fields,
          outcome: "failure",
          durationMs: Math.round(performance.now() - startedAt),
          err: error,
        },
        "external call failed",
      );

      throw error;
    }

    const durationMs = Math.round(performance.now() - startedAt);

    if (!response.ok) {
      const detail = await response.text().catch(() => "");

      uploadLogger.error(
        { ...fields, outcome: "failure", status: response.status, durationMs },
        "external call failed",
      );

      throw new Error(`ImageKit upload failed (${response.status}): ${detail}`);
    }

    uploadLogger.info({ ...fields, outcome: "success", durationMs }, "external call completed");

    const result = (await response.json()) as { url: string; fileId: string; name: string };

    return {
      url: result.url,
      fileId: result.fileId,
      name: result.name,
    };
  }
}

export const uploadService = new UploadService();
