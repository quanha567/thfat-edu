import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileQuestion, Plus } from "lucide-react";
import Link from "next/link";

export function DashboardEmptyState() {
  return (
    <Card className="border-border/80 bg-card/50 border-2 border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-primary/10 text-primary mb-4 flex size-14 items-center justify-center rounded-full">
          <FileQuestion className="size-7" />
        </div>
        <h3 className="text-foreground text-base font-bold">Chưa có dữ liệu khảo thí</h3>
        <p className="text-muted-foreground mt-1.5 max-w-sm text-xs">
          Hệ thống chưa ghi nhận lượt làm bài nào trong khoảng thời gian đã chọn. Hãy tạo và xuất
          bản đề thi mới để bắt đầu thu thập số liệu!
        </p>
        <div className="mt-5 flex items-center gap-3">
          <Button asChild size="sm" className="gap-1.5 text-xs font-semibold">
            <Link href="/admin/exams/create">
              <Plus className="size-3.5" />
              <span>Tạo đề thi mới</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link href="/admin/exams">Xem ngân hàng đề</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
