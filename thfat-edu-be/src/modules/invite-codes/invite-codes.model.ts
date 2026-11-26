import { type Static, t } from "elysia";

export const MAX_BATCH_SIZE = 100;
export const DEFAULT_EXPIRES_IN_DAYS = 7;

export const InviteCodeStatusSchema = t.Union([
  t.Literal("active"),
  t.Literal("used"),
  t.Literal("expired"),
  t.Literal("revoked"),
]);
export type TInviteCodeStatus = Static<typeof InviteCodeStatusSchema>;

export const InviteCodeStatusFilterSchema = t.Union([t.Literal("all"), InviteCodeStatusSchema]);
export type TInviteCodeStatusFilter = Static<typeof InviteCodeStatusFilterSchema>;

export const CreateInviteCodesBodySchema = t.Object({
  count: t.Integer({ minimum: 1, maximum: MAX_BATCH_SIZE }),
  note: t.Optional(t.Nullable(t.String({ maxLength: 255 }))),
  expiresInDays: t.Optional(t.Integer({ minimum: 1, maximum: 365 })),
});
export type TCreateInviteCodesBody = Static<typeof CreateInviteCodesBodySchema>;

export const ListInviteCodesQuerySchema = t.Object({
  page: t.Optional(t.Numeric({ default: 1, minimum: 1 })),
  limit: t.Optional(t.Numeric({ default: 20, minimum: 1, maximum: 100 })),
  status: t.Optional(InviteCodeStatusFilterSchema),
});
export type TListInviteCodesQuery = Static<typeof ListInviteCodesQuerySchema>;

export const InviteCodeResponseSchema = t.Object({
  id: t.String(),
  code: t.String(),
  note: t.Nullable(t.String()),
  status: InviteCodeStatusSchema,
  expiresAt: t.String(),
  revokedAt: t.Nullable(t.String()),
  usedAt: t.Nullable(t.String()),
  usedByUserId: t.Nullable(t.String()),
  usedByEmail: t.Nullable(t.String()),
  usedByName: t.Nullable(t.String()),
  createdAt: t.String(),
});
export type TInviteCodeResponse = Static<typeof InviteCodeResponseSchema>;

export const CreateInviteCodesResponseSchema = t.Object({
  items: t.Array(InviteCodeResponseSchema),
});
export type TCreateInviteCodesResponse = Static<typeof CreateInviteCodesResponseSchema>;

export const PaginatedInviteCodesResponseSchema = t.Object({
  items: t.Array(InviteCodeResponseSchema),
  total: t.Number(),
  page: t.Number(),
  limit: t.Number(),
});
export type TPaginatedInviteCodesResponse = Static<typeof PaginatedInviteCodesResponseSchema>;

export const RegisterBodySchema = t.Object({
  code: t.String({ minLength: 1, maxLength: 32 }),
  fullName: t.String({ minLength: 1, maxLength: 255 }),
  email: t.String({ format: "email", maxLength: 255 }),
  password: t.String({ minLength: 6, maxLength: 128 }),
});
export type TRegisterBody = Static<typeof RegisterBodySchema>;

export const CheckInviteCodeResponseSchema = t.Object({
  valid: t.Literal(true),
});

export const RegisterResponseSchema = t.Object({
  user: t.Object({
    id: t.String(),
    email: t.String(),
    fullName: t.String(),
    role: t.Literal("student"),
  }),
  message: t.String(),
});
export type TRegisterResponse = Static<typeof RegisterResponseSchema>;
