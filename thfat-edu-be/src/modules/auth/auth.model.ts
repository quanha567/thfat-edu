import { type Static, t } from "elysia";

export const LoginBodySchema = t.Object({
  idToken: t.String({ minLength: 1, description: "Firebase ID Token" }),
});

export type TLoginBody = Static<typeof LoginBodySchema>;

export const StudentProfileResponseSchema = t.Object({
  studentCode: t.Nullable(t.String()),
  grade: t.Nullable(t.String()),
  schoolName: t.Nullable(t.String()),
  dateOfBirth: t.Nullable(t.String()),
  parentPhone: t.Nullable(t.String()),
});

export type TStudentProfileResponse = Static<typeof StudentProfileResponseSchema>;

export const TeacherProfileResponseSchema = t.Object({
  teacherCode: t.Nullable(t.String()),
  department: t.Nullable(t.String()),
  bio: t.Nullable(t.String()),
});

export type TTeacherProfileResponse = Static<typeof TeacherProfileResponseSchema>;

export const UserResponseSchema = t.Object({
  id: t.String(),
  email: t.String(),
  fullName: t.String(),
  avatarUrl: t.Nullable(t.String()),
  role: t.Union([t.Literal("student"), t.Literal("teacher"), t.Literal("admin")]),
  isActive: t.Boolean(),
  studentProfile: t.Optional(t.Nullable(StudentProfileResponseSchema)),
  teacherProfile: t.Optional(t.Nullable(TeacherProfileResponseSchema)),
});

export type TUserResponse = Static<typeof UserResponseSchema>;

export const AuthSuccessResponseSchema = t.Object({
  user: UserResponseSchema,
  message: t.String(),
});

export type TAuthSuccessResponse = Static<typeof AuthSuccessResponseSchema>;

export const LogoutResponseSchema = t.Object({
  message: t.String(),
});

export type TLogoutResponse = Static<typeof LogoutResponseSchema>;
