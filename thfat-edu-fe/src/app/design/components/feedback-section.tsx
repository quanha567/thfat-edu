import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Kbd } from "@/components/ui/kbd";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, Info } from "lucide-react";

import { Demo, Section } from "./section-wrapper";

export function FeedbackSection() {
  return (
    <Section id="feedback" title="Feedback">
      <Demo label="Alert">
        <div className="space-y-3">
          <Alert>
            <Info className="size-4" />
            <AlertTitle>Thông tin</AlertTitle>
            <AlertDescription>Hệ thống sẽ bảo trì lúc 2:00 sáng ngày 5/11.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>
              Không thể kết nối đến máy chủ. Vui lòng thử lại sau.
            </AlertDescription>
          </Alert>
        </div>
      </Demo>

      <Demo label="Progress">
        <div className="max-w-sm space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-label text-neutral-700">Tiến độ học</span>
              <span className="text-label text-primary-700">72%</span>
            </div>
            <Progress value={72} />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-label text-neutral-700">Bài tập hoàn thành</span>
              <span className="text-label text-success-600">48%</span>
            </div>
            <Progress value={48} className="[&>div]:bg-success-500" />
          </div>
        </div>
      </Demo>

      <Demo label="Skeleton">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </Demo>

      <Demo label="Spinner">
        <div className="flex items-center gap-6">
          <Spinner />
          <span className="text-body text-neutral-500">Đang tải dữ liệu...</span>
        </div>
      </Demo>

      <Demo label="Kbd">
        <div className="text-body flex flex-wrap items-center gap-2 text-neutral-700">
          <span>Lưu bài làm:</span>
          <Kbd>Ctrl</Kbd>
          <span>+</span>
          <Kbd>S</Kbd>
        </div>
      </Demo>
    </Section>
  );
}
