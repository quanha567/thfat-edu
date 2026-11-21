"use client";

import { AdminPageHeader } from "@/components/layout/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import { useState } from "react";

import { useCategories } from "../hooks/use-categories";
import { CategoryListTable } from "./category-list-table";

export function CategoriesPageContainer() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: categories = [] } = useCategories();

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4 md:p-6 lg:px-8 lg:py-6">
      <AdminPageHeader
        title="Quản lý chuyên mục"
        description="Tạo và quản lý các chuyên mục phân loại bài viết, tin tức khảo thí và cẩm nang học tập"
        badge={
          <Badge variant="secondary" className="text-xs font-normal">
            {categories.length} chuyên mục
          </Badge>
        }
        actions={
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="gap-1.5 text-xs font-semibold"
          >
            <FolderPlus className="size-3.5" />
            <span>Thêm chuyên mục</span>
          </Button>
        }
      />
      <div className="flex min-h-0 flex-1 flex-col">
        <CategoryListTable
          isCreateOpen={isCreateOpen}
          onCloseCreate={() => setIsCreateOpen(false)}
        />
      </div>
    </div>
  );
}
