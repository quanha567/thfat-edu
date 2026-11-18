"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageIcon, Loader2, Save, Send } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";

import type { TArticleFormValues } from "../schemas/article.schema";
import type { TArticleStatus } from "../types/article.types";

export type TArticleSidebarSettingsProps = {
  watch: UseFormWatch<TArticleFormValues>;
  setValue: UseFormSetValue<TArticleFormValues>;
  isPending: boolean;
  isEditing: boolean;
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
}: TArticleSidebarSettingsProps) {
  const status = watch("status");
  const thumbnailUrl = watch("thumbnailUrl");
  const [imageError, setImageError] = useState(false);

  const handleStatusChange = (val: string) => {
    setValue("status", val as TArticleStatus, { shouldDirty: true });
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(false);
    setValue("thumbnailUrl", e.target.value, { shouldDirty: true });
  };

  let submitButtonLabel = "Lưu bản nháp";
  if (isEditing) {
    submitButtonLabel = "Lưu thay đổi";
  } else if (status === "published") {
    submitButtonLabel = "Xuất bản bài viết";
  }

  return (
    <div className="space-y-6">
      {/* Publishing Card */}
      <Card className="border-border/80 shadow-2xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Xuất bản</CardTitle>
            <Badge
              variant={getStatusBadgeVariant(status)}
              className="text-[11px] font-semibold capitalize"
            >
              {getStatusBadgeLabel(status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Trạng thái bài viết</Label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full text-xs">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Bản nháp (Draft)</SelectItem>
                <SelectItem value="published">Xuất bản công khai (Published)</SelectItem>
                <SelectItem value="archived">Lưu trữ (Archived)</SelectItem>
              </SelectContent>
            </Select>
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
          <div className="space-y-1.5">
            <Label htmlFor="article-thumbnail" className="text-xs">
              Đường dẫn ảnh (URL)
            </Label>
            <Input
              id="article-thumbnail"
              placeholder="https://images.unsplash.com/..."
              value={thumbnailUrl || ""}
              onChange={handleThumbnailChange}
              disabled={isPending}
              className="text-xs"
            />
          </div>

          {thumbnailUrl && !imageError ? (
            <div className="border-border bg-muted relative aspect-video w-full overflow-hidden rounded-lg border">
              <Image
                src={thumbnailUrl}
                alt="Ảnh bìa bài viết"
                fill
                sizes="(max-width: 768px) 100vw, 350px"
                className="object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="border-border/80 bg-muted/40 flex aspect-video w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed p-4 text-center">
              <ImageIcon className="text-muted-foreground/60 size-8" />
              <span className="text-muted-foreground text-xs">
                {imageError ? "Không thể tải ảnh từ URL này" : "Chưa có ảnh bìa"}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
