import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, FileQuestion, Layers } from "lucide-react";

import { type TQuizListItem } from "../types";

export type TExamMetricsBarProps = {
  items: TQuizListItem[];
  total: number;
};

export function ExamMetricsBar({ items, total }: TExamMetricsBarProps) {
  const publishedCount = items.filter((i) => i.status === "published").length;
  const draftCount = items.filter((i) => i.status === "draft").length;
  const totalSubItemsCount = items.reduce((acc, curr) => acc + curr.totalSubItems, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Tổng số đề thi
          </CardTitle>
          <FileQuestion className="text-primary size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-muted-foreground mt-1 text-xs">Đề thi trong ngân hàng</p>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">Đã xuất bản</CardTitle>
          <CheckCircle2 className="size-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">{publishedCount}</div>
          <p className="text-muted-foreground mt-1 text-xs">Sẵn sàng cho học sinh thi</p>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">Bản nháp</CardTitle>
          <Clock className="size-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-500">{draftCount}</div>
          <p className="text-muted-foreground mt-1 text-xs">Đang biên soạn hoặc rà soát</p>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Tiểu mục câu hỏi
          </CardTitle>
          <Layers className="size-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSubItemsCount}</div>
          <p className="text-muted-foreground mt-1 text-xs">Chuẩn hóa 85 tiểu mục/đề</p>
        </CardContent>
      </Card>
    </div>
  );
}
