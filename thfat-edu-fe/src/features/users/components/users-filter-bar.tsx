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

import { USER_ROLE_FILTER_OPTIONS, USER_STATUS_FILTER_OPTIONS } from "../constants";
import { type TUserRoleFilter, type TUserStatusFilter } from "../types";

export type TUsersFilterBarProps = {
  role: TUserRoleFilter;
  status: TUserStatusFilter;
  onRoleChange: (value: TUserRoleFilter) => void;
  onStatusChange: (value: TUserStatusFilter) => void;
  onReset?: () => void;
};

export function UsersFilterBar({
  role,
  status,
  onRoleChange,
  onStatusChange,
  onReset,
}: TUsersFilterBarProps) {
  const hasActiveFilters = role !== "all" || status !== "all";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={role} onValueChange={(val) => onRoleChange(val as TUserRoleFilter)}>
        <SelectTrigger className="h-9 w-[150px] text-xs">
          <SelectValue placeholder="Chọn vai trò" />
        </SelectTrigger>
        <SelectContent>
          {USER_ROLE_FILTER_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={(val) => onStatusChange(val as TUserStatusFilter)}>
        <SelectTrigger className="h-9 w-[160px] text-xs">
          <SelectValue placeholder="Chọn trạng thái" />
        </SelectTrigger>
        <SelectContent>
          {USER_STATUS_FILTER_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && onReset && (
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
