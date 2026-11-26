"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw } from "lucide-react";

import { INVITE_CODE_STATUS_FILTER_OPTIONS } from "../constants";
import { type TInviteCodeStatusFilter } from "../types";

export type TInviteCodesFilterBarProps = {
  status: TInviteCodeStatusFilter;
  onStatusChange: (value: TInviteCodeStatusFilter) => void;
  onReset: () => void;
};

export function InviteCodesFilterBar({
  status,
  onStatusChange,
  onReset,
}: TInviteCodesFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={status}
        onValueChange={(val) => onStatusChange(val as TInviteCodeStatusFilter)}
      >
        <SelectTrigger className="h-9 w-[180px] text-xs">
          <SelectValue placeholder="Chọn trạng thái" />
        </SelectTrigger>
        <SelectContent>
          {INVITE_CODE_STATUS_FILTER_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {status !== "all" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground h-9 gap-1.5 px-2.5 text-xs"
        >
          <RotateCcw className="size-3.5" />
          <span>Đặt lại</span>
        </Button>
      )}
    </div>
  );
}
