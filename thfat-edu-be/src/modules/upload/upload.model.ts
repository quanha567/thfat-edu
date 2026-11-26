import { t } from "elysia";

export const UploadResponseSchema = t.Object({
  url: t.String({ description: "Public ImageKit URL of the uploaded file" }),
  fileId: t.String({ description: "ImageKit file ID" }),
  name: t.String({ description: "File name on ImageKit" }),
});

export type TUploadResponse = {
  url: string;
  fileId: string;
  name: string;
};
