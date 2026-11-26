import { Elysia, t } from "elysia";

import { ForbiddenError } from "../../middlewares/error-handler";
import { requireAuth } from "../auth/auth.guard";
import { AuthService } from "../auth/auth.service";
import { UploadResponseSchema } from "./upload.model";
import { uploadService } from "./upload.service";

export const uploadRoutes = new Elysia({ prefix: "/upload" })
  .decorate("authService", new AuthService())
  .decorate("uploadService", uploadService)
  .use(requireAuth())
  .post(
    "/avatar",
    async ({ authService, uploadService: svc, currentUser, body }) => {
      const result = await svc.uploadFile({
        file: body.file,
        folder: `/avatars/${currentUser.id}`,
        fileName: "avatar",
      });

      await authService.updateMe({
        userId: currentUser.id,
        data: { avatarUrl: result.url },
      });

      return result;
    },
    {
      body: t.Object({
        file: t.File({ description: "Avatar image file (jpg, jpeg, png, webp, max 5MB)" }),
      }),
      response: UploadResponseSchema,
      detail: {
        tags: ["Upload"],
        summary: "Upload ảnh avatar cho user đang đăng nhập",
      },
    },
  )
  .post(
    "/media",
    async ({ uploadService: svc, currentUser, body }) => {
      if (currentUser.role !== "teacher" && currentUser.role !== "admin") {
        throw new ForbiddenError("Chỉ giáo viên và quản trị viên mới có thể tải lên media.");
      }

      const result = await svc.uploadFile({
        file: body.file,
        folder: body.folder,
        fileName: body.fileName ?? "image",
      });

      return result;
    },
    {
      body: t.Object({
        file: t.File({ description: "Image file (jpg, jpeg, png, webp, max 5MB)" }),
        folder: t.String({
          description: "Target ImageKit folder path, e.g. /articles/thumbnails/uuid",
        }),
        fileName: t.Optional(t.String({ description: "Base file name without extension" })),
      }),
      response: UploadResponseSchema,
      detail: {
        tags: ["Upload"],
        summary: "Upload ảnh media (thumbnail, nội dung bài viết) — chỉ Teacher/Admin",
      },
    },
  );
