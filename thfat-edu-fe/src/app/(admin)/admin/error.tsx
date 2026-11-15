"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";

export type TAdminErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminError({ error, reset }: TAdminErrorProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
      <div className="bg-destructive/10 text-destructive mb-4 flex h-14 w-14 items-center justify-center rounded-full">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h2 className="mb-2 text-xl font-bold">Đã có lỗi xảy ra</h2>
      <p className="text-muted-foreground mb-6 max-w-md text-sm">
        {error.message || "Không thể tải trang quản trị. Vui lòng thử lại hoặc liên hệ hỗ trợ."}
      </p>
      <Button onClick={() => reset()} className="flex items-center gap-2">
        <RotateCcw className="h-4 w-4" />
        <span>Thử lại</span>
      </Button>
    </div>
  );
}
