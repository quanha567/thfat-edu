import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { type TSettingsMeta } from "../types/settings.types";

type TFormActionBarProps = {
  meta: TSettingsMeta | undefined;
  isDirty: boolean;
  isPending: boolean;
  onReset: () => void;
};

function formatLastUpdated(meta: TSettingsMeta | undefined): string {
  if (!meta?.updatedAt) {
    return "Chưa từng được cập nhật";
  }

  const time = new Date(meta.updatedAt).toLocaleString("vi-VN");

  return meta.updatedByName
    ? `Cập nhật lần cuối bởi ${meta.updatedByName} lúc ${time}`
    : `Cập nhật lần cuối lúc ${time}`;
}

export function FormActionBar({ meta, isDirty, isPending, onReset }: TFormActionBarProps) {
  return (
    <div className="border-border/80 bg-card flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
      <div className="space-y-0.5">
        <p className="text-muted-foreground text-xs">{formatLastUpdated(meta)}</p>
        {isDirty && (
          <p className="text-warning-600 dark:text-warning-400 text-xs">Có thay đổi chưa lưu</p>
        )}
      </div>
      <div className="flex items-center gap-2.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!isDirty || isPending}
          onClick={onReset}
        >
          Hủy thay đổi
        </Button>
        <Button type="submit" size="sm" disabled={!isDirty || isPending} className="min-w-28">
          {isPending ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Đang lưu...
            </>
          ) : (
            "Lưu cấu hình"
          )}
        </Button>
      </div>
    </div>
  );
}
