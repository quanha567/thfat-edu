import { type TUserRole, type TUserRoleFilter, type TUserStatusFilter } from "./types";

export const USER_ROLE_LABELS: Record<TUserRole, string> = {
  student: "Học sinh",
  teacher: "Giáo viên",
  admin: "Quản trị viên",
};

export const USER_ROLE_FILTER_OPTIONS: Array<{ value: TUserRoleFilter; label: string }> = [
  { value: "all", label: "Tất cả vai trò" },
  { value: "student", label: "Học sinh" },
  { value: "teacher", label: "Giáo viên" },
  { value: "admin", label: "Quản trị viên" },
];

export const USER_STATUS_FILTER_OPTIONS: Array<{ value: TUserStatusFilter; label: string }> = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Đã bị khóa" },
  { value: "deleted", label: "Đã xóa mềm" },
];

export const DEFAULT_USER_PAGE_SIZE = 10;
