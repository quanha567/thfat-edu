import { jwt } from "@elysiajs/jwt";
import { Elysia, t } from "elysia";

import { env } from "../../config/env";
import { UnauthorizedError } from "../../middlewares/error-handler";
import {
  AuthSuccessResponseSchema,
  LoginBodySchema,
  MessageResponseSchema,
  RegisterBodySchema,
  UserResponseSchema,
} from "./auth.model";
import { AuthService } from "./auth.service";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: env.JWT_SECRET,
      exp: "15m",
    }),
  )
  .post(
    "/register",
    async ({ body, jwt, cookie, headers }) => {
      const user = await AuthService.registerWithCredentials(body.email, body.password, body.name);

      const accessToken = await jwt.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      const { rawToken, expiresAt } = await AuthService.createRefreshToken(
        user.id,
        headers["user-agent"],
      );

      cookie.refreshToken.set({
        value: rawToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: expiresAt,
      });

      return {
        success: true as const,
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
        },
      };
    },
    {
      body: RegisterBodySchema,
      response: AuthSuccessResponseSchema,
      detail: {
        tags: ["Auth"],
        summary: "Register new account with email and password",
      },
    },
  )
  .post(
    "/login",
    async ({ body, jwt, cookie, headers }) => {
      const user = await AuthService.loginWithCredentials(body.email, body.password);

      const accessToken = await jwt.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      const { rawToken, expiresAt } = await AuthService.createRefreshToken(
        user.id,
        headers["user-agent"],
      );

      cookie.refreshToken.set({
        value: rawToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: expiresAt,
      });

      return {
        success: true as const,
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
        },
      };
    },
    {
      body: LoginBodySchema,
      response: AuthSuccessResponseSchema,
      detail: {
        tags: ["Auth"],
        summary: "Sign in with email and password",
      },
    },
  )
  .post(
    "/refresh",
    async ({ jwt, cookie, headers }) => {
      const token = cookie.refreshToken?.value;

      if (!token || typeof token !== "string") {
        throw new UnauthorizedError("Refresh token missing");
      }

      const { userId, newRawToken, newExpiresAt } = await AuthService.verifyAndRotateRefreshToken(
        token,
        headers["user-agent"],
      );

      const user = await AuthService.getUserProfile(userId);
      const accessToken = await jwt.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      cookie.refreshToken.set({
        value: newRawToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: newExpiresAt,
      });

      return {
        success: true as const,
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
        },
      };
    },
    {
      response: AuthSuccessResponseSchema,
      detail: {
        tags: ["Auth"],
        summary: "Rotate refresh token and issue new access token",
      },
    },
  )
  .post(
    "/logout",
    async ({ cookie }) => {
      const token = cookie.refreshToken?.value;

      if (token && typeof token === "string") {
        await AuthService.revokeRefreshToken(token);
      }

      cookie.refreshToken.remove();

      return {
        success: true,
        message: "Logged out successfully",
      };
    },
    {
      response: MessageResponseSchema,
      detail: {
        tags: ["Auth"],
        summary: "Revoke session and clear refresh token cookie",
      },
    },
  )
  .get(
    "/me",
    async ({ headers, jwt }) => {
      const authHeader = headers["authorization"];

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("Bearer token missing");
      }

      const token = authHeader.slice(7);
      const payload = await jwt.verify(token);

      if (!payload || !payload.sub || typeof payload.sub !== "string") {
        throw new UnauthorizedError("Invalid or expired access token");
      }

      const user = await AuthService.getUserProfile(payload.sub);

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      };
    },
    {
      response: UserResponseSchema,
      detail: {
        tags: ["Auth"],
        summary: "Get current authenticated user profile",
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .get(
    "/google",
    async ({ cookie, redirect, request }) => {
      // Dynamic redirect URI support for Vercel preview / custom domain
      const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
      const proto = request.headers.get("x-forwarded-proto") || "http";
      const dynamicRedirectUri = host ? `${proto}://${host}/api/auth/google/callback` : undefined;

      const client = AuthService.getGoogleClient(dynamicRedirectUri);

      if (!client) {
        throw new UnauthorizedError(
          "Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
        );
      }

      const { url, state, codeVerifier } = AuthService.createGoogleAuthUrl(client);

      cookie.google_oauth_state.set({
        value: state,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 10, // 10 minutes
      });

      cookie.google_code_verifier.set({
        value: codeVerifier,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 10,
      });

      return redirect(url.toString(), 302);
    },
    {
      detail: {
        tags: ["Auth"],
        summary: "Initiate Google OAuth 2.0 PKCE flow",
      },
    },
  )
  .get(
    "/google/callback",
    async ({ query, cookie, redirect, request, headers }) => {
      const code = typeof query.code === "string" ? query.code : "";
      const state = typeof query.state === "string" ? query.state : "";
      const storedState =
        typeof cookie.google_oauth_state?.value === "string" ? cookie.google_oauth_state.value : "";
      const storedVerifier =
        typeof cookie.google_code_verifier?.value === "string"
          ? cookie.google_code_verifier.value
          : "";

      if (!code || !state || !storedState || !storedVerifier || state !== storedState) {
        throw new UnauthorizedError("Google OAuth verification failed: Invalid state or verifier");
      }

      const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
      const proto = request.headers.get("x-forwarded-proto") || "http";
      const dynamicRedirectUri = host ? `${proto}://${host}/api/auth/google/callback` : undefined;

      const client = AuthService.getGoogleClient(dynamicRedirectUri);

      if (!client) {
        throw new UnauthorizedError("Google OAuth is not configured");
      }

      const tokens = await client.validateAuthorizationCode(code, storedVerifier);
      const googleAccessToken = tokens.accessToken();

      const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      });

      if (!profileResponse.ok) {
        throw new UnauthorizedError("Failed to fetch user profile from Google");
      }

      const googleProfile = (await profileResponse.json()) as {
        sub: string;
        email: string;
        name: string;
        picture?: string;
      };

      const user = await AuthService.findOrCreateGoogleUser({
        id: googleProfile.sub,
        email: googleProfile.email,
        name: googleProfile.name,
        picture: googleProfile.picture,
      });

      const { rawToken, expiresAt } = await AuthService.createRefreshToken(
        user.id,
        headers["user-agent"],
      );

      // Clear OAuth temp cookies
      cookie.google_oauth_state.remove();
      cookie.google_code_verifier.remove();

      // Set session refresh cookie
      cookie.refreshToken.set({
        value: rawToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: expiresAt,
      });

      // Redirect back to frontend
      return redirect(`${env.FRONTEND_URL}/dashboard`, 302);
    },
    {
      query: t.Object({
        code: t.String(),
        state: t.String(),
      }),
      detail: {
        tags: ["Auth"],
        summary: "Handle Google OAuth 2.0 callback",
      },
    },
  );
