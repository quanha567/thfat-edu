import { type Static, t } from "elysia";

import {
  AvatarUrlSchema,
  StudentProfileInputSchema,
  TeacherProfileInputSchema,
  UserGenderSchema,
} from "../users/users.model";

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
  gender: t.Optional(t.Nullable(UserGenderSchema)),
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

export const UpdateMeBodySchema = t.Object({
  fullName: t.Optional(t.String({ minLength: 1 })),
  avatarUrl: t.Optional(t.Nullable(AvatarUrlSchema)),
  gender: t.Optional(t.Nullable(UserGenderSchema)),
  studentProfile: t.Optional(t.Nullable(StudentProfileInputSchema)),
  teacherProfile: t.Optional(t.Nullable(TeacherProfileInputSchema)),
});

export type TUpdateMeBody = Static<typeof UpdateMeBodySchema>;
