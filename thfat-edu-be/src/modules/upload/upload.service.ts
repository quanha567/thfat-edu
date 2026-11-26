import { env } from "../../config/env";
import { IMAGEKIT_ALLOWED_MIME_TYPES, IMAGEKIT_MAX_FILE_SIZE } from "../../config/imagekit";
import { createModuleLogger } from "../../config/logger";
import { BadRequestError } from "../../middlewares/error-handler";
import type { TUploadResponse } from "./upload.model";

const uploadLogger = createModuleLogger("upload");

const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";
const IMAGEKIT_UPLOAD_TIMEOUT_MS = 30_000;

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

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

    // The `imagekit` SDK hangs under Bun (axios + form-data), so call the REST API directly.
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "fileName",
      /\.\w+$/.test(fileName) ? fileName : `${fileName}.${MIME_EXTENSIONS[file.type] ?? "jpg"}`,
    );
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
