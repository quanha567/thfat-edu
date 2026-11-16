"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/features/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { useCreateArticle } from "../hooks/use-create-article";
import { useUpdateArticle } from "../hooks/use-update-article";
import { articleSchema, type TArticleFormValues } from "../schemas/article.schema";
import type { TArticleDetail } from "../types/article.types";
import { AiArticleAssistant } from "./ai-article-assistant";
import { ArticleSidebarSettings } from "./article-sidebar-settings";
import { MarkdownEditor } from "./markdown-editor/markdown-editor";

export type TArticleFormProps = {
  article?: TArticleDetail | null;
};

export function ArticleForm({ article }: TArticleFormProps) {
  const router = useRouter();
  const isEditing = Boolean(article);
  const [isStreaming, setIsStreaming] = useState(false);
  const { data: categories = [] } = useCategories();

  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm<TArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      thumbnailUrl: "",
      content: "",
      status: "draft",
      categoryId: null,
    },
  });

  useEffect(() => {
    if (article) {
      reset({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt ?? "",
        thumbnailUrl: article.thumbnailUrl ?? "",
        content: article.content,
        status: article.status,
        categoryId: article.categoryId,
      });
    }
  }, [article, reset]);

  const onSubmit = async (values: TArticleFormValues) => {
    const payload = {
      title: values.title.trim(),
      slug: values.slug?.trim() || undefined,
      excerpt: values.excerpt?.trim() || undefined,
      thumbnailUrl: values.thumbnailUrl?.trim() || undefined,
      content: values.content,
      status: values.status,
      categoryId: values.categoryId || null,
    };

    if (isEditing && article) {
      await updateMutation.mutateAsync({ id: article.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }

    router.push("/admin/articles");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Main Content Column */}
        <div className="space-y-6 lg:col-span-8">
          <Card className="border-border/80 shadow-2xs">
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-1.5">
                <Label htmlFor="article-title" className="text-sm font-semibold">
                  Tiêu đề bài viết <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="article-title"
                  placeholder="Nhập tiêu đề bài viết..."
                  {...register("title")}
                  disabled={isPending}
                  className="text-sm font-medium sm:text-base"
                />
                {errors.title && (
                  <p className="text-destructive text-xs font-medium">{errors.title.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="article-slug" className="text-xs">
                    Đường dẫn tĩnh (Slug)
                  </Label>
                  <Input
                    id="article-slug"
                    placeholder="tieu-de-bai-viet (tự sinh nếu để trống)"
                    {...register("slug")}
                    disabled={isPending}
                    className="font-mono text-xs"
                  />
                  {errors.slug && (
                    <p className="text-destructive text-xs font-medium">{errors.slug.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Chuyên mục</Label>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? "none"}
                        onValueChange={(val) => field.onChange(val === "none" ? null : val)}
                        disabled={isPending}
                      >
                        <SelectTrigger className="w-full text-xs">
                          <SelectValue placeholder="Chọn chuyên mục" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">-- Không phân loại --</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="article-excerpt" className="text-xs">
                  Tóm tắt ngắn (Excerpt)
                </Label>
                <Textarea
                  id="article-excerpt"
                  placeholder="Mô tả tóm tắt ngắn về bài viết để hiển thị trên thẻ xem trước và kết quả tìm kiếm..."
                  rows={2}
                  {...register("excerpt")}
                  disabled={isPending}
                  className="text-xs sm:text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Assistant Widget */}
          <AiArticleAssistant
            getCurrentContent={() => getValues("content") || ""}
            onUpdateContent={(nextContent) =>
              setValue("content", nextContent, { shouldValidate: true })
            }
            onAutoFillMeta={(aiTitle, aiExcerpt) => {
              if (aiTitle && !getValues("title")?.trim()) {
                setValue("title", aiTitle, { shouldValidate: true });
              }
              if (aiExcerpt && !getValues("excerpt")?.trim()) {
                setValue("excerpt", aiExcerpt, { shouldValidate: true });
              }
            }}
            onStreamingChange={setIsStreaming}
          />

          {/* Editor Card */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              Nội dung bài viết <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <MarkdownEditor
                  value={field.value}
                  onChange={field.onChange}
                  readOnly={isPending}
                  isStreaming={isStreaming}
                />
              )}
            />
            {errors.content && (
              <p className="text-destructive text-xs font-medium">{errors.content.message}</p>
            )}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4">
          <ArticleSidebarSettings
            watch={watch}
            setValue={setValue}
            isPending={isPending}
            isEditing={isEditing}
          />
        </div>
      </div>
    </form>
  );
}
