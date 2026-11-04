import { t } from "elysia";

export const RegisterBodySchema = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 6 }),
  name: t.String({ minLength: 2 }),
});

export const LoginBodySchema = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 1 }),
});

export const UserResponseSchema = t.Object({
  id: t.String(),
  email: t.String(),
  name: t.String(),
  avatarUrl: t.Nullable(t.String()),
  role: t.String(),
  createdAt: t.String(),
});

export const AuthSuccessResponseSchema = t.Object({
  success: t.Literal(true),
  accessToken: t.String(),
  user: UserResponseSchema,
});

export const MessageResponseSchema = t.Object({
  success: t.Boolean(),
  message: t.String(),
});
