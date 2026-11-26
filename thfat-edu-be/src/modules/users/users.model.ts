import { type Static, t } from "elysia";

export const UserRoleSchema = t.Union([
  t.Literal("student"),
  t.Literal("teacher"),
  t.Literal("admin"),
]);
export type TUserRole = Static<typeof UserRoleSchema>;

/** URL ảnh đại diện: chỉ https, không khoảng trắng, giới hạn độ dài. */
export const AvatarUrlSchema = t.String({ pattern: "^https://[^\\s]+$", maxLength: 2048 });

export const UserGenderSchema = t.Union([
  t.Literal("male"),
  t.Literal("female"),
  t.Literal("other"),
]);
export type TUserGender = Static<typeof UserGenderSchema>;

export const UserRoleFilterSchema = t.Union([
  t.Literal("all"),
  t.Literal("student"),
  t.Literal("teacher"),
  t.Literal("admin"),
]);
export type TUserRoleFilter = Static<typeof UserRoleFilterSchema>;

export const UserStatusFilterSchema = t.Union([
  t.Literal("all"),
  t.Literal("active"),
  t.Literal("inactive"),
  t.Literal("deleted"),
]);
export type TUserStatusFilter = Static<typeof UserStatusFilterSchema>;

export const StudentProfileInputSchema = t.Object({
  studentCode: t.Optional(t.Nullable(t.String())),
  grade: t.Optional(t.Nullable(t.String())),
  schoolName: t.Optional(t.Nullable(t.String())),
  dateOfBirth: t.Optional(t.Nullable(t.String())),
  parentPhone: t.Optional(t.Nullable(t.String())),
});
export type TStudentProfileInput = Static<typeof StudentProfileInputSchema>;

export const TeacherProfileInputSchema = t.Object({
  teacherCode: t.Optional(t.Nullable(t.String())),
  department: t.Optional(t.Nullable(t.String())),
  bio: t.Optional(t.Nullable(t.String())),
});
export type TTeacherProfileInput = Static<typeof TeacherProfileInputSchema>;

export const StudentProfileResponseSchema = t.Object({
  id: t.String(),
  studentCode: t.Nullable(t.String()),
  grade: t.Nullable(t.String()),
  schoolName: t.Nullable(t.String()),
  dateOfBirth: t.Nullable(t.String()),
  parentPhone: t.Nullable(t.String()),
  createdAt: t.String(),
  updatedAt: t.String(),
});
export type TStudentProfileResponse = Static<typeof StudentProfileResponseSchema>;

export const TeacherProfileResponseSchema = t.Object({
  id: t.String(),
  teacherCode: t.Nullable(t.String()),
  department: t.Nullable(t.String()),
  bio: t.Nullable(t.String()),
  createdAt: t.String(),
  updatedAt: t.String(),
});
export type TTeacherProfileResponse = Static<typeof TeacherProfileResponseSchema>;

export const UserDetailResponseSchema = t.Object({
  id: t.String(),
  firebaseUid: t.Nullable(t.String()),
  email: t.String(),
  fullName: t.String(),
  avatarUrl: t.Nullable(t.String()),
  gender: t.Optional(t.Nullable(UserGenderSchema)),
  role: UserRoleSchema,
  isActive: t.Boolean(),
  createdAt: t.String(),
  updatedAt: t.String(),
  deletedAt: t.Nullable(t.String()),
  studentProfile: t.Nullable(StudentProfileResponseSchema),
  teacherProfile: t.Nullable(TeacherProfileResponseSchema),
});
export type TUserDetailResponse = Static<typeof UserDetailResponseSchema>;

export const ListUsersQuerySchema = t.Object({
  page: t.Optional(t.Numeric({ default: 1, minimum: 1 })),
  limit: t.Optional(t.Numeric({ default: 10, minimum: 1, maximum: 100 })),
  search: t.Optional(t.String()),
  role: t.Optional(UserRoleFilterSchema),
  status: t.Optional(UserStatusFilterSchema),
  sortBy: t.Optional(t.Union([t.Literal("createdAt"), t.Literal("fullName"), t.Literal("email")])),
  sortOrder: t.Optional(t.Union([t.Literal("asc"), t.Literal("desc")])),
});
export type TListUsersQuery = Static<typeof ListUsersQuerySchema>;

export const PaginatedUsersResponseSchema = t.Object({
  items: t.Array(UserDetailResponseSchema),
  total: t.Number(),
  page: t.Number(),
  limit: t.Number(),
});
export type TPaginatedUsersResponse = Static<typeof PaginatedUsersResponseSchema>;

export const CreateUserBodySchema = t.Object({
  email: t.String({ format: "email" }),
  fullName: t.String({ minLength: 1 }),
  role: UserRoleSchema,
  password: t.String({ minLength: 6 }),
  sendResetEmail: t.Optional(t.Boolean()),
  avatarUrl: t.Optional(t.Nullable(AvatarUrlSchema)),
  gender: t.Optional(t.Nullable(UserGenderSchema)),
  studentProfile: t.Optional(t.Nullable(StudentProfileInputSchema)),
  teacherProfile: t.Optional(t.Nullable(TeacherProfileInputSchema)),
});
export type TCreateUserBody = Static<typeof CreateUserBodySchema>;

export const UpdateUserBodySchema = t.Object({
  fullName: t.Optional(t.String({ minLength: 1 })),
  role: t.Optional(UserRoleSchema),
  avatarUrl: t.Optional(t.Nullable(AvatarUrlSchema)),
  gender: t.Optional(t.Nullable(UserGenderSchema)),
  isActive: t.Optional(t.Boolean()),
  studentProfile: t.Optional(t.Nullable(StudentProfileInputSchema)),
  teacherProfile: t.Optional(t.Nullable(TeacherProfileInputSchema)),
});
export type TUpdateUserBody = Static<typeof UpdateUserBodySchema>;

export const ToggleActiveBodySchema = t.Object({
  isActive: t.Boolean(),
});
export type TToggleActiveBody = Static<typeof ToggleActiveBodySchema>;

export const ResetPasswordBodySchema = t.Object({
  newPassword: t.Optional(t.String({ minLength: 6 })),
  sendResetEmail: t.Optional(t.Boolean()),
});
export type TResetPasswordBody = Static<typeof ResetPasswordBodySchema>;

export const ActionSuccessResponseSchema = t.Object({
  message: t.String(),
  resetLink: t.Optional(t.String()),
  user: t.Optional(UserDetailResponseSchema),
});
export type TActionSuccessResponse = Static<typeof ActionSuccessResponseSchema>;
