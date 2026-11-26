import { type TInviteCodeStatus, type TInviteCodeStatusFilter } from "./types";

export const DEFAULT_INVITE_CODE_PAGE_SIZE = 20;
export const MAX_INVITE_CODE_BATCH_SIZE = 100;
export const DEFAULT_INVITE_CODE_EXPIRES_IN_DAYS = 7;

export const INVITE_CODE_STATUS_LABELS: Record<TInviteCodeStatus, string> = {
  active: "Còn hiệu lực",
  used: "Đã dùng",
  expired: "Hết hạn",
  revoked: "Đã thu hồi",
};

export const INVITE_CODE_STATUS_FILTER_OPTIONS: {
  value: TInviteCodeStatusFilter;
  label: string;
}[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: INVITE_CODE_STATUS_LABELS.active },
  { value: "used", label: INVITE_CODE_STATUS_LABELS.used },
  { value: "expired", label: INVITE_CODE_STATUS_LABELS.expired },
  { value: "revoked", label: INVITE_CODE_STATUS_LABELS.revoked },
];
