import { createHash, randomBytes } from "node:crypto";

import { and, eq, gt, isNull, lt } from "drizzle-orm";

import { updateFirebaseUser, verifyFirebaseIdToken } from "../../config/firebase";
import { createModuleLogger, setRequestUserId } from "../../config/logger";
import { type Database, db } from "../../db";
import { sessions, studentProfiles, teacherProfiles, users } from "../../db/schema";
import { ForbiddenError, UnauthorizedError } from "../../middlewares/error-handler";
import { SESSION_COOKIE_MAX_AGE } from "./auth.cookie";
import { type TUpdateMeBody, type TUserResponse } from "./auth.model";

const authLogger = createModuleLogger("auth");

/** Token phiên ngẫu nhiên 256 bit. Chỉ giá trị băm (SHA-256) được lưu trong DB. */
export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
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
      authLogger.warn({ err: error, reason: "invalid_firebase_token" }, "login failed");

      throw new UnauthorizedError("Firebase token không hợp lệ hoặc đã hết hạn.");
    }

    const email = decodedToken.email.toLowerCase().trim();

    const [existingUser] = await this.database
      .select()
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deletedAt)))
      .limit(1);

    if (!existingUser) {
      authLogger.warn({ reason: "user_not_provisioned" }, "login failed");

      throw new ForbiddenError(
        "Tài khoản chưa được cấp phép trong hệ thống. Vui lòng liên hệ quản trị viên.",
      );
    }

    setRequestUserId(existingUser.id);

    if (!existingUser.isActive) {
      authLogger.warn({ reason: "user_inactive" }, "login failed");

      throw new ForbiddenError(
        "Tài khoản của bạn đang bị tạm khóa. Vui lòng liên hệ quản trị viên.",
      );
    }

    if (!existingUser.firebaseUid || existingUser.firebaseUid !== decodedToken.uid) {
      // Chỉ liên kết/đổi liên kết Firebase khi Firebase xác nhận chủ sở hữu email, tránh việc
      // đăng ký Firebase bằng email chưa xác minh để chiếm tài khoản đã được cấp phép.
      if (!decodedToken.emailVerified) {
        authLogger.warn({ reason: "email_not_verified" }, "login failed");

        throw new ForbiddenError("Email chưa được xác minh. Vui lòng xác minh email rồi thử lại.");
      }

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

    // Dọn phiên đã hết hạn (rẻ nhờ index expires_at) để bảng không phình mãi.
    await this.database.delete(sessions).where(lt(sessions.expiresAt, new Date()));

    await this.database.insert(sessions).values({
      userId: existingUser.id,
      sessionToken: hashSessionToken(sessionToken),
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
      expiresAt,
    });

    const userWithProfile = await this.getUserWithProfile(existingUser.id);

    authLogger.info({ role: existingUser.role }, "login succeeded");

    return {
      user: userWithProfile,
      sessionToken,
    };
  }

  public async getCurrentUser(sessionToken: string): Promise<TUserResponse> {
    if (!sessionToken) {
      throw new UnauthorizedError("Không tìm thấy phiên đăng nhập.");
    }

    // Một truy vấn join thay cho 3 truy vấn tuần tự (session → user → user lần nữa).
    const [row] = await this.database
      .select({ user: users })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(
        and(
          eq(sessions.sessionToken, hashSessionToken(sessionToken)),
          gt(sessions.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (!row) {
      throw new UnauthorizedError("Phiên đăng nhập đã hết hạn hoặc không tồn tại.");
    }

    const { user } = row;

    if (user.deletedAt || !user.isActive) {
      throw new UnauthorizedError("Tài khoản không hợp lệ hoặc đã bị vô hiệu hóa.");
    }

    setRequestUserId(user.id);

    return this.buildUserResponse(user);
  }

  public async logout(sessionToken: string): Promise<void> {
    if (!sessionToken) {
      return;
    }

    await this.database
      .delete(sessions)
      .where(eq(sessions.sessionToken, hashSessionToken(sessionToken)));
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

    return this.buildUserResponse(user);
  }

  private async buildUserResponse(user: typeof users.$inferSelect): Promise<TUserResponse> {
    let studentProfile = null;
    let teacherProfile = null;

    if (user.role === "student") {
      const [profile] = await this.database
        .select()
        .from(studentProfiles)
        .where(eq(studentProfiles.userId, user.id))
        .limit(1);

      studentProfile = profile
        ? {
            studentCode: profile.studentCode,
            grade: profile.grade,
            schoolName: profile.schoolName,
            dateOfBirth: profile.dateOfBirth ? String(profile.dateOfBirth).slice(0, 10) : null,
            parentPhone: profile.parentPhone,
          }
        : null;
    } else if (user.role === "teacher") {
      const [profile] = await this.database
        .select()
        .from(teacherProfiles)
        .where(eq(teacherProfiles.userId, user.id))
        .limit(1);

      teacherProfile = profile
        ? {
            teacherCode: profile.teacherCode,
            department: profile.department,
            bio: profile.bio,
          }
        : null;
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      gender: user.gender,
      role: user.role,
      isActive: user.isActive,
      studentProfile,
      teacherProfile,
    };
  }

  public async updateMe({
    userId,
    data,
  }: {
    userId: string;
    data: TUpdateMeBody;
  }): Promise<TUserResponse> {
    const [dbUser] = await this.database
      .select()
      .from(users)
      .where(and(eq(users.id, userId), isNull(users.deletedAt)))
      .limit(1);

    if (!dbUser) {
      throw new UnauthorizedError("Không tìm thấy thông tin người dùng.");
    }

    if (dbUser.firebaseUid && (data.fullName || data.avatarUrl !== undefined)) {
      try {
        await updateFirebaseUser({
          uid: dbUser.firebaseUid,
          displayName: data.fullName ?? dbUser.fullName,
          photoUrl:
            data.avatarUrl === null ? "" : (data.avatarUrl ?? dbUser.avatarUrl ?? undefined),
        });
      } catch (error) {
        authLogger.warn(
          { err: error, operation: "updateFirebaseUser" },
          "failed to sync profile update to Firebase",
        );
      }
    }

    await this.database
      .update(users)
      .set({
        ...(data.fullName ? { fullName: data.fullName } : {}),
        ...(data.avatarUrl !== undefined ? { avatarUrl: data.avatarUrl } : {}),
        ...(data.gender !== undefined ? { gender: data.gender } : {}),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    if (dbUser.role === "student" && data.studentProfile) {
      const sp = data.studentProfile;

      const [existingStudentProfile] = await this.database
        .select()
        .from(studentProfiles)
        .where(eq(studentProfiles.userId, userId))
        .limit(1);

      if (existingStudentProfile) {
        await this.database
          .update(studentProfiles)
          .set({
            ...(sp.studentCode !== undefined ? { studentCode: sp.studentCode } : {}),
            ...(sp.grade !== undefined ? { grade: sp.grade } : {}),
            ...(sp.schoolName !== undefined ? { schoolName: sp.schoolName } : {}),
            ...(sp.dateOfBirth !== undefined ? { dateOfBirth: sp.dateOfBirth } : {}),
            ...(sp.parentPhone !== undefined ? { parentPhone: sp.parentPhone } : {}),
            updatedAt: new Date(),
          })
          .where(eq(studentProfiles.userId, userId));
      } else {
        await this.database.insert(studentProfiles).values({
          userId,
          studentCode: sp.studentCode ?? null,
          grade: sp.grade ?? null,
          schoolName: sp.schoolName ?? null,
          dateOfBirth: sp.dateOfBirth ?? null,
          parentPhone: sp.parentPhone ?? null,
        });
      }
    } else if (dbUser.role === "teacher" && data.teacherProfile) {
      const tp = data.teacherProfile;

      const [existingTeacherProfile] = await this.database
        .select()
        .from(teacherProfiles)
        .where(eq(teacherProfiles.userId, userId))
        .limit(1);

      if (existingTeacherProfile) {
        await this.database
          .update(teacherProfiles)
          .set({
            ...(tp.teacherCode !== undefined ? { teacherCode: tp.teacherCode } : {}),
            ...(tp.department !== undefined ? { department: tp.department } : {}),
            ...(tp.bio !== undefined ? { bio: tp.bio } : {}),
            updatedAt: new Date(),
          })
          .where(eq(teacherProfiles.userId, userId));
      } else {
        await this.database.insert(teacherProfiles).values({
          userId,
          teacherCode: tp.teacherCode ?? null,
          department: tp.department ?? null,
          bio: tp.bio ?? null,
        });
      }
    }

    return this.getUserWithProfile(userId);
  }
}

export const authService = new AuthService();
