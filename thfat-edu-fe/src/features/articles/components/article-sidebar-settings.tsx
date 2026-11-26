"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUploadMedia } from "@/hooks/use-upload";
import { ImageIcon, Loader2, Save, Send, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";

import type { TArticleFormValues } from "../schemas/article.schema";
import type { TArticleStatus } from "../types/article.types";

export type TArticleSidebarSettingsProps = {
  watch: UseFormWatch<TArticleFormValues>;
  setValue: UseFormSetValue<TArticleFormValues>;
  isPending: boolean;
  isEditing: boolean;
  articleId: string;
};

function getStatusBadgeVariant(status: TArticleStatus): "default" | "secondary" | "outline" {
  if (status === "published") return "default";
  if (status === "archived") return "secondary";

  return "outline";
}

function getStatusBadgeLabel(status: TArticleStatus): string {
  if (status === "published") return "Đã xuất bản";
  if (status === "archived") return "Lưu trữ";

  return "Bản nháp";
}

export function ArticleSidebarSettings({
  watch,
  setValue,
  isPending,
  isEditing,
  articleId,
}: TArticleSidebarSettingsProps) {
  const status = watch("status");
  const thumbnailUrl = watch("thumbnailUrl");
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMedia = useUploadMedia({
    onSuccess: (result) => {
      setValue("thumbnailUrl", result.url, { shouldDirty: true });
      setImageError(false);
    },
  });

  const handleStatusChange = (val: string) => {
    setValue("status", val as TArticleStatus, { shouldDirty: true });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const folder = `/articles/thumbnails/${articleId}`;

    uploadMedia.mutate({ file, folder, fileName: "thumbnail" });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveThumbnail = () => {
    setValue("thumbnailUrl", "", { shouldDirty: true });
    setImageError(false);
  };

  let submitButtonLabel = "Lưu bản nháp";
  if (isEditing) {
    submitButtonLabel = "Lưu thay đổi";
  } else if (status === "published") {
    submitButtonLabel = "Xuất bản bài viết";
  }

  const isUploadingThumbnail = uploadMedia.isPending;

  return (
    <div className="space-y-6">
      {/* Publishing Card */}
      <Card className="border-border/80 shadow-2xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Xuất bản</CardTitle>
            <Badge
              variant={getStatusBadgeVariant(status)}
              className="text-xxs font-semibold capitalize"
            >
              {getStatusBadgeLabel(status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <span className="text-muted-foreground text-xs">Trạng thái bài viết</span>
            <div className="flex flex-col gap-1">
              {(["draft", "published", "archived"] as TArticleStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleStatusChange(s)}
                  disabled={isPending}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                    status === s
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {getStatusBadgeLabel(s)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full gap-1.5 text-xs font-semibold shadow-2xs"
            >
              {isPending && <Loader2 className="size-3.5 animate-spin" />}
              {!isPending && status === "published" && <Send className="size-3.5" />}
              {!isPending && status !== "published" && <Save className="size-3.5" />}
              {submitButtonLabel}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Thumbnail Card */}
      <Card className="border-border/80 shadow-2xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Ảnh bìa đại diện</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Preview */}
          {thumbnailUrl && !imageError ? (
            <div className="border-border/60 relative aspect-video w-full overflow-hidden rounded-lg border">
              <Image
                src={thumbnailUrl}
                alt="Thumbnail preview"
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
              <button
                type="button"
                onClick={handleRemoveThumbnail}
                className="bg-background/80 text-destructive hover:bg-destructive hover:text-destructive-foreground absolute top-2 right-2 rounded-md p-1 transition-colors"
                title="Xóa ảnh bìa"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ) : (
            <div className="border-border/60 bg-muted/20 text-muted-foreground flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed">
              <ImageIcon className="size-8 opacity-40" />
              <span className="text-xs">Chưa có ảnh bìa</span>
            </div>
          )}

          {/* Upload button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full gap-1.5 text-xs"
            disabled={isPending || isUploadingThumbnail}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploadingThumbnail ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Upload className="size-3.5" />
            )}
            {isUploadingThumbnail ? "Đang tải lên..." : "Tải ảnh lên"}
          </Button>

          <p className="text-muted-foreground text-xxs">Định dạng: JPG, PNG, WebP · Tối đa 5MB</p>
        </CardContent>
      </Card>
    </div>
  );
}
