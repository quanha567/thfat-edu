/// <reference types="bun-types" />
import { generateCodeVerifier, generateState, Google } from "arctic";
import { and, eq } from "drizzle-orm";

import { env } from "../../config/env";
import { db } from "../../db";
import { accounts, refreshTokens, users } from "../../db/schema";
import { AppError, UnauthorizedError } from "../../middlewares/error-handler";

const REFRESH_TOKEN_EXPIRY_DAYS = 30;

export class AuthService {
  static getGoogleClient(customRedirectUri?: string): Google | null {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
      return null;
    }

    const redirectUri =
      customRedirectUri ||
      env.GOOGLE_REDIRECT_URI ||
      `${env.FRONTEND_URL}/api/auth/google/callback`;

    return new Google(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, redirectUri);
  }

  static createGoogleAuthUrl(client: Google): {
    url: URL;
    state: string;
    codeVerifier: string;
  } {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const scopes = ["openid", "profile", "email"];
    const url = client.createAuthorizationURL(state, codeVerifier, scopes);

    return { url, state, codeVerifier };
  }

  static async hashPassword(password: string): Promise<string> {
    return await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 10,
    });
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await Bun.password.verify(password, hash);
  }

  static hashToken(token: string): string {
    const hasher = new Bun.CryptoHasher("sha256");
    hasher.update(token);

    return hasher.digest("hex");
  }

  static async createRefreshToken(
    userId: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<{ rawToken: string; expiresAt: Date }> {
    const rawToken = `${crypto.randomUUID()}.${crypto.randomUUID()}`;
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    await db.insert(refreshTokens).values({
      userId,
      tokenHash,
      expiresAt,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
    });

    return { rawToken, expiresAt };
  }

  static async verifyAndRotateRefreshToken(
    rawToken: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<{ userId: string; newRawToken: string; newExpiresAt: Date }> {
    const tokenHash = this.hashToken(rawToken);
    const [tokenRecord] = await db
      .select()
      .from(refreshTokens)
      .where(and(eq(refreshTokens.tokenHash, tokenHash)))
      .limit(1);

    if (!tokenRecord) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    if (tokenRecord.revokedAt || new Date() > tokenRecord.expiresAt) {
      throw new UnauthorizedError("Refresh token has expired or been revoked");
    }

    // Revoke old token
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.id, tokenRecord.id));

    // Issue new refreshed token (token rotation)
    const { rawToken: newRawToken, expiresAt: newExpiresAt } = await this.createRefreshToken(
      tokenRecord.userId,
      userAgent,
      ipAddress,
    );

    return {
      userId: tokenRecord.userId,
      newRawToken,
      newExpiresAt,
    };
  }

  static async revokeRefreshToken(rawToken: string): Promise<void> {
    const tokenHash = this.hashToken(rawToken);
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.tokenHash, tokenHash));
  }

  static async registerWithCredentials(email: string, password: string, name: string) {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);

    if (existingUser.length > 0) {
      throw new AppError("Email is already registered", 409, "EMAIL_EXISTS");
    }

    const passwordHash = await this.hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({
        email: email.toLowerCase().trim(),
        name: name.trim(),
        role: "student",
      })
      .returning();

    await db.insert(accounts).values({
      userId: newUser.id,
      provider: "credentials",
      providerAccountId: newUser.id,
      passwordHash,
    });

    return newUser;
  }

  static async loginWithCredentials(email: string, password: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const [account] = await db
      .select()
      .from(accounts)
      .where(and(eq(accounts.userId, user.id), eq(accounts.provider, "credentials")))
      .limit(1);

    if (!account || !account.passwordHash) {
      throw new UnauthorizedError("This account uses a different login provider (e.g. Google)");
    }

    const isValid = await this.verifyPassword(password, account.passwordHash);

    if (!isValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    return user;
  }

  static async findOrCreateGoogleUser(profile: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  }) {
    // 1. Check if Google account link exists
    const [existingAccount] = await db
      .select()
      .from(accounts)
      .where(and(eq(accounts.provider, "google"), eq(accounts.providerAccountId, profile.id)))
      .limit(1);

    if (existingAccount) {
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, existingAccount.userId))
        .limit(1);
      if (existingUser) return existingUser;
    }

    // 2. Check if user with same email exists
    const [existingUserByEmail] = await db
      .select()
      .from(users)
      .where(eq(users.email, profile.email.toLowerCase().trim()))
      .limit(1);

    if (existingUserByEmail) {
      // Link Google account to existing user
      await db.insert(accounts).values({
        userId: existingUserByEmail.id,
        provider: "google",
        providerAccountId: profile.id,
      });

      // Update avatar if not present
      if (!existingUserByEmail.avatarUrl && profile.picture) {
        await db
          .update(users)
          .set({ avatarUrl: profile.picture })
          .where(eq(users.id, existingUserByEmail.id));
      }

      return existingUserByEmail;
    }

    // 3. Create new user + account link
    const [newUser] = await db
      .insert(users)
      .values({
        email: profile.email.toLowerCase().trim(),
        name: profile.name || "Student",
        avatarUrl: profile.picture || null,
        role: "student",
      })
      .returning();

    await db.insert(accounts).values({
      userId: newUser.id,
      provider: "google",
      providerAccountId: profile.id,
    });

    return newUser;
  }

  static async getUserProfile(userId: string) {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    return user;
  }
}
