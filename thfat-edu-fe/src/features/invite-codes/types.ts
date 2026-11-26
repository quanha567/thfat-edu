import { type Nullable } from "@thfat-edu/shared";

export type TInviteCodeStatus = "active" | "used" | "expired" | "revoked";

export type TInviteCodeStatusFilter = "all" | TInviteCodeStatus;

export type TInviteCode = {
  id: string;
  code: string;
  note: Nullable<string>;
  status: TInviteCodeStatus;
  expiresAt: string;
  revokedAt: Nullable<string>;
  usedAt: Nullable<string>;
  usedByUserId: Nullable<string>;
  usedByEmail: Nullable<string>;
  usedByName: Nullable<string>;
  createdAt: string;
};

export type TInviteCodesListParams = {
  page?: number;
  limit?: number;
  status?: TInviteCodeStatusFilter;
};

export type TInviteCodesListResponse = {
  items: TInviteCode[];
  total: number;
  page: number;
  limit: number;
};

export type TCreateInviteCodesInput = {
  count: number;
  note?: Nullable<string>;
  expiresInDays?: number;
};

export type TCreateInviteCodesResponse = {
  items: TInviteCode[];
};

export type TRegisterInput = {
  code: string;
  fullName: string;
  email: string;
  password: string;
};

export type TRegisterResponse = {
  user: { id: string; email: string; fullName: string; role: "student" };
  message: string;
};
