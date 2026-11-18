"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useCreateCategory } from "../hooks/use-create-category";
import { useUpdateCategory } from "../hooks/use-update-category";
import { categorySchema, type TCategoryFormValues } from "../schemas/category.schema";
import type { TCategory } from "../types/category.types";

export type TCategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: TCategory | null;
};

export function CategoryDialog({ open, onOpenChange, category }: TCategoryDialogProps) {
  const isEditing = Boolean(category);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description ?? "",
      });
    } else {
      reset({
        name: "",
        slug: "",
        description: "",
      });
    }
  }, [category, reset]);

  const onSubmit = async (values: TCategoryFormValues) => {
    const payload = {
      name: values.name.trim(),
      slug: values.slug?.trim() || undefined,
      description: values.description?.trim() || undefined,
    };

    if (isEditing && category) {
      await updateMutation.mutateAsync({ id: category.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Chỉnh sửa chuyên mục" : "Tạo chuyên mục mới"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cập nhật thông tin chi tiết của chuyên mục bài viết."
              : "Thêm chuyên mục mới để phân loại và tổ chức các bài viết."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="category-name">
              Tên chuyên mục <span className="text-destructive">*</span>
            </Label>
            <Input
              id="category-name"
              placeholder="VD: Cẩm nang ôn thi"
              {...register("name")}
              disabled={isPending}
            />
            {errors.name && (
              <p className="text-destructive text-xs font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category-slug">
              Đường dẫn tĩnh (Slug)
              <span className="text-muted-foreground ml-1 text-xs font-normal">
                (Để trống sẽ tự sinh)
              </span>
            </Label>
            <Input
              id="category-slug"
              placeholder="VD: cam-nang-on-thi"
              {...register("slug")}
              disabled={isPending}
            />
            {errors.slug && (
              <p className="text-destructive text-xs font-medium">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category-description">Mô tả ngắn</Label>
            <Textarea
              id="category-description"
              placeholder="Mô tả nội dung hoặc định hướng của chuyên mục này..."
              rows={3}
              {...register("description")}
              disabled={isPending}
            />
            {errors.description && (
              <p className="text-destructive text-xs font-medium">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              {isEditing ? "Lưu thay đổi" : "Tạo chuyên mục"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
