import { and, eq, gt, isNull } from "drizzle-orm";

import { verifyFirebaseIdToken } from "../../config/firebase";
import { type Database, db } from "../../db";
import { sessions, studentProfiles, teacherProfiles, users } from "../../db/schema";
import { ForbiddenError, UnauthorizedError } from "../../middlewares/error-handler";
import { SESSION_COOKIE_MAX_AGE } from "./auth.cookie";
import { type TUserResponse } from "./auth.model";

declare const Bun:
  | {
      randomUUIDv7?: (format?: string) => string;
    }
  | undefined;

function generateSessionToken(): string {
  if (typeof Bun !== "undefined" && typeof Bun?.randomUUIDv7 === "function") {
    return Bun.randomUUIDv7();
  }

  return crypto.randomUUID();
}

export type TLoginOptions = {
  idToken: string;
  userAgent?: string;
  ipAddress?: string;
};

export class AuthService {
  constructor(private readonly database: Database = db) {}

  public async login({
    idToken,
    userAgent,
    ipAddress,
  }: TLoginOptions): Promise<{ user: TUserResponse; sessionToken: string }> {
    let decodedToken;
    try {
      decodedToken = await verifyFirebaseIdToken(idToken);
    } catch (error) {
      throw new UnauthorizedError(
        `Firebase token không hợp lệ hoặc đã hết hạn: ${(error as Error).message}`,
      );
    }

    const email = decodedToken.email.toLowerCase().trim();

    const [existingUser] = await this.database
      .select()
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deletedAt)))
      .limit(1);

    if (!existingUser) {
      throw new ForbiddenError(
        "Tài khoản chưa được cấp phép trong hệ thống. Vui lòng liên hệ quản trị viên.",
      );
    }

    if (!existingUser.isActive) {
      throw new ForbiddenError(
        "Tài khoản của bạn đang bị tạm khóa. Vui lòng liên hệ quản trị viên.",
      );
    }

    if (!existingUser.firebaseUid || existingUser.firebaseUid !== decodedToken.uid) {
      await this.database
        .update(users)
        .set({
          firebaseUid: decodedToken.uid,
          avatarUrl: existingUser.avatarUrl || decodedToken.picture || null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id));
    }

    const sessionToken = generateSessionToken();

    const expiresAt = new Date(Date.now() + SESSION_COOKIE_MAX_AGE * 1000);

    await this.database.insert(sessions).values({
      userId: existingUser.id,
      sessionToken,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
      expiresAt,
    });

    const userWithProfile = await this.getUserWithProfile(existingUser.id);

    return {
      user: userWithProfile,
      sessionToken,
    };
  }

  public async getCurrentUser(sessionToken: string): Promise<TUserResponse> {
    if (!sessionToken) {
      throw new UnauthorizedError("Không tìm thấy phiên đăng nhập.");
    }

    const [activeSession] = await this.database
      .select()
      .from(sessions)
      .where(and(eq(sessions.sessionToken, sessionToken), gt(sessions.expiresAt, new Date())))
      .limit(1);

    if (!activeSession) {
      throw new UnauthorizedError("Phiên đăng nhập đã hết hạn hoặc không tồn tại.");
    }

    const [user] = await this.database
      .select()
      .from(users)
      .where(and(eq(users.id, activeSession.userId), isNull(users.deletedAt)))
      .limit(1);

    if (!user || !user.isActive) {
      throw new UnauthorizedError("Tài khoản không hợp lệ hoặc đã bị vô hiệu hóa.");
    }

    return this.getUserWithProfile(user.id);
  }

  public async logout(sessionToken: string): Promise<void> {
    if (!sessionToken) {
      return;
    }

    await this.database.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
  }

  private async getUserWithProfile(userId: string): Promise<TUserResponse> {
    const [user] = await this.database
      .select()
      .from(users)
      .where(and(eq(users.id, userId), isNull(users.deletedAt)))
      .limit(1);

    if (!user) {
      throw new UnauthorizedError("Không tìm thấy thông tin người dùng.");
    }

    let studentProfile = null;
    let teacherProfile = null;

    if (user.role === "student") {
      const [profile] = await this.database
        .select()
        .from(studentProfiles)
        .where(eq(studentProfiles.userId, user.id))
        .limit(1);

      studentProfile = profile ?? null;
    } else if (user.role === "teacher") {
      const [profile] = await this.database
        .select()
        .from(teacherProfiles)
        .where(eq(teacherProfiles.userId, user.id))
        .limit(1);

      teacherProfile = profile ?? null;
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      isActive: user.isActive,
      studentProfile,
      teacherProfile,
    };
  }
}

export const authService = new AuthService();
