import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw, Search } from "lucide-react";
import { type ChangeEvent } from "react";

import { USER_ROLE_FILTER_OPTIONS, USER_STATUS_FILTER_OPTIONS } from "../constants";
import { type TUserRoleFilter, type TUserStatusFilter } from "../types";

export type TUsersFilterBarProps = {
  search: string;
  role: TUserRoleFilter;
  status: TUserStatusFilter;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: TUserRoleFilter) => void;
  onStatusChange: (value: TUserStatusFilter) => void;
  onResetFilters: () => void;
};

export function UsersFilterBar({
  search,
  role,
  status,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onResetFilters,
}: TUsersFilterBarProps) {
  const hasActiveFilters = Boolean(search.trim() || role !== "all" || status !== "all");

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        <div className="relative min-w-[240px] flex-1 sm:max-w-sm">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Tìm theo tên, email, mã số..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        <Select value={role} onValueChange={(val) => onRoleChange(val as TUserRoleFilter)}>
          <SelectTrigger className="w-[160px] text-sm">
            <SelectValue placeholder="Chọn vai trò" />
          </SelectTrigger>
          <SelectContent>
            {USER_ROLE_FILTER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={(val) => onStatusChange(val as TUserStatusFilter)}>
          <SelectTrigger className="w-[170px] text-sm">
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {USER_STATUS_FILTER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="text-muted-foreground hover:text-foreground h-9 px-2.5 text-xs"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Đặt lại bộ lọc
          </Button>
        )}
      </div>
    </div>
  );
}
