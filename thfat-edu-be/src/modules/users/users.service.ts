import { and, desc, eq, ilike, isNotNull, isNull, or, type SQL, sql } from "drizzle-orm";

import {
  createFirebaseUser,
  generateFirebasePasswordResetLink,
  revokeFirebaseUserSessions,
  updateFirebaseUser,
} from "../../config/firebase";
import { type Database, db } from "../../db";
import {
  sessions,
  studentProfiles,
  teacherProfiles,
  type TStudentProfile,
  type TTeacherProfile,
  type TUser,
  users,
} from "../../db/schema";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../middlewares/error-handler";
import {
  type TActionSuccessResponse,
  type TCreateUserBody,
  type TListUsersQuery,
  type TPaginatedUsersResponse,
  type TResetPasswordBody,
  type TStudentProfileResponse,
  type TTeacherProfileResponse,
  type TUpdateUserBody,
  type TUserDetailResponse,
} from "./users.model";

function formatStudentProfile(profile: TStudentProfile | null): TStudentProfileResponse | null {
  if (!profile) return null;

  return {
    id: profile.id,
    studentCode: profile.studentCode,
    grade: profile.grade,
    schoolName: profile.schoolName,
    dateOfBirth: profile.dateOfBirth ? String(profile.dateOfBirth) : null,
    parentPhone: profile.parentPhone,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}

function formatTeacherProfile(profile: TTeacherProfile | null): TTeacherProfileResponse | null {
  if (!profile) return null;

  return {
    id: profile.id,
    teacherCode: profile.teacherCode,
    department: profile.department,
    bio: profile.bio,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}

function formatUserDetail({
  user,
  studentProfile,
  teacherProfile,
}: {
  user: TUser;
  studentProfile: TStudentProfile | null;
  teacherProfile: TTeacherProfile | null;
}): TUserDetailResponse {
  return {
    id: user.id,
    firebaseUid: user.firebaseUid,
    email: user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    gender: user.gender,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    deletedAt: user.deletedAt ? user.deletedAt.toISOString() : null,
    studentProfile: formatStudentProfile(studentProfile),
    teacherProfile: formatTeacherProfile(teacherProfile),
  };
}

export type TUpdateUserOptions = {
  id: string;
  currentAdminId: string;
  data: TUpdateUserBody;
};

export type TToggleActiveOptions = {
  id: string;
  currentAdminId: string;
  isActive: boolean;
};

export type TSoftDeleteOptions = {
  id: string;
  currentAdminId: string;
};

export class UsersService {
  constructor(private readonly database: Database = db) {}

  public async listUsers(query: TListUsersQuery): Promise<TPaginatedUsersResponse> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];

    // Filter by status
    if (query.status === "deleted") {
      conditions.push(isNotNull(users.deletedAt));
    } else if (query.status === "active") {
      conditions.push(and(eq(users.isActive, true), isNull(users.deletedAt)) as SQL);
    } else if (query.status === "inactive") {
      conditions.push(and(eq(users.isActive, false), isNull(users.deletedAt)) as SQL);
    } else {
      // Default: show active and inactive, exclude soft-deleted
      conditions.push(isNull(users.deletedAt));
    }

    // Filter by role
    if (query.role && query.role !== "all") {
      conditions.push(eq(users.role, query.role));
    }

    // Filter by search keyword
    if (query.search && query.search.trim().length > 0) {
      const searchTerm = `%${query.search.trim()}%`;
      conditions.push(
        or(
          ilike(users.fullName, searchTerm),
          ilike(users.email, searchTerm),
          ilike(studentProfiles.studentCode, searchTerm),
          ilike(teacherProfiles.teacherCode, searchTerm),
        ) as SQL,
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [countResult] = await this.database
      .select({ count: sql<number>`count(distinct ${users.id})` })
      .from(users)
      .leftJoin(studentProfiles, eq(users.id, studentProfiles.userId))
      .leftJoin(teacherProfiles, eq(users.id, teacherProfiles.userId))
      .where(whereClause);

    const total = Number(countResult?.count ?? 0);

    // Get paginated items with profiles
    const rows = await this.database
      .select({
        user: users,
        studentProfile: studentProfiles,
        teacherProfile: teacherProfiles,
      })
      .from(users)
      .leftJoin(studentProfiles, eq(users.id, studentProfiles.userId))
      .leftJoin(teacherProfiles, eq(users.id, teacherProfiles.userId))
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    const items = rows.map((row) =>
      formatUserDetail({
        user: row.user,
        studentProfile: row.studentProfile,
        teacherProfile: row.teacherProfile,
      }),
    );

    return {
      items,
      total,
      page,
      limit,
    };
  }

  public async getUserById(id: string): Promise<TUserDetailResponse> {
    const [row] = await this.database
      .select({
        user: users,
        studentProfile: studentProfiles,
        teacherProfile: teacherProfiles,
      })
      .from(users)
      .leftJoin(studentProfiles, eq(users.id, studentProfiles.userId))
      .leftJoin(teacherProfiles, eq(users.id, teacherProfiles.userId))
      .where(eq(users.id, id))
      .limit(1);

    if (!row) {
      throw new NotFoundError("Không tìm thấy thông tin người dùng.");
    }

    return formatUserDetail({
      user: row.user,
      studentProfile: row.studentProfile,
      teacherProfile: row.teacherProfile,
    });
  }

  public async createUser(data: TCreateUserBody): Promise<TUserDetailResponse> {
    const normalizedEmail = data.email.toLowerCase().trim();

    // Check if email already exists in DB
    const [existingUser] = await this.database
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existingUser) {
      throw new BadRequestError(`Email "${normalizedEmail}" đã được sử dụng trong hệ thống.`);
    }

    // 1. Create user in Firebase Auth
    let firebaseUid: string | null = null;
    try {
      const fbResult = await createFirebaseUser({
        email: normalizedEmail,
        password: data.password,
        displayName: data.fullName,
        photoUrl: data.avatarUrl ?? undefined,
      });
      firebaseUid = fbResult.uid;
    } catch (fbError) {
      throw new BadRequestError(
        `Không thể tạo tài khoản trên Firebase Auth: ${(fbError as Error).message}`,
      );
    }

    // 2. Insert user into DB
    const [newUser] = await this.database
      .insert(users)
      .values({
        email: normalizedEmail,
        fullName: data.fullName,
        role: data.role,
        avatarUrl: data.avatarUrl ?? null,
        gender: data.gender ?? null,
        firebaseUid,
        isActive: true,
      })
      .returning();

    if (!newUser) {
      throw new BadRequestError("Lỗi hệ thống: Không thể khởi tạo người dùng trong cơ sở dữ liệu.");
    }

    // 3. Create profile if applicable
    let studentProfileRecord: TStudentProfile | null = null;
    let teacherProfileRecord: TTeacherProfile | null = null;

    if (data.role === "student") {
      const profileData = data.studentProfile;
      const [createdProfile] = await this.database
        .insert(studentProfiles)
        .values({
          userId: newUser.id,
          studentCode: profileData?.studentCode ?? null,
          grade: profileData?.grade ?? null,
          schoolName: profileData?.schoolName ?? null,
          dateOfBirth: profileData?.dateOfBirth ? profileData.dateOfBirth : null,
          parentPhone: profileData?.parentPhone ?? null,
        })
        .returning();

      studentProfileRecord = createdProfile ?? null;
    } else if (data.role === "teacher") {
      const profileData = data.teacherProfile;
      const [createdProfile] = await this.database
        .insert(teacherProfiles)
        .values({
          userId: newUser.id,
          teacherCode: profileData?.teacherCode ?? null,
          department: profileData?.department ?? null,
          bio: profileData?.bio ?? null,
        })
        .returning();

      teacherProfileRecord = createdProfile ?? null;
    }

    return formatUserDetail({
      user: newUser,
      studentProfile: studentProfileRecord,
      teacherProfile: teacherProfileRecord,
    });
  }

  public async updateUser({
    id,
    currentAdminId,
    data,
  }: TUpdateUserOptions): Promise<TUserDetailResponse> {
    const existing = await this.getUserById(id);

    // Self-protection guard clauses
    if (id === currentAdminId) {
      if (data.role && data.role !== "admin") {
        throw new ForbiddenError("Bạn không thể tự hạ quyền hoặc thay đổi vai trò của chính mình.");
      }
      if (data.isActive === false) {
        throw new ForbiddenError("Bạn không thể tự khóa tài khoản của chính mình.");
      }
    }

    // Sync basic info with Firebase if changed
    if (existing.firebaseUid && (data.fullName || data.avatarUrl !== undefined)) {
      try {
        await updateFirebaseUser({
          uid: existing.firebaseUid,
          displayName: data.fullName ?? existing.fullName,
          photoUrl:
            data.avatarUrl === null ? "" : (data.avatarUrl ?? existing.avatarUrl ?? undefined),
        });
      } catch (error) {
        console.warn(
          `[UsersService] Failed to sync updated profile to Firebase: ${(error as Error).message}`,
        );
      }
    }

    const roleChanged = data.role && data.role !== existing.role;

    // Update users table
    const [updatedUser] = await this.database
      .update(users)
      .set({
        ...(data.fullName ? { fullName: data.fullName } : {}),
        ...(data.role ? { role: data.role } : {}),
        ...(data.avatarUrl !== undefined ? { avatarUrl: data.avatarUrl } : {}),
        ...(data.gender !== undefined ? { gender: data.gender } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser) {
      throw new NotFoundError("Không tìm thấy người dùng để cập nhật.");
    }

    // If role changed, revoke sessions immediately
    if (roleChanged) {
      await this.database.delete(sessions).where(eq(sessions.userId, id));
      if (existing.firebaseUid) {
        try {
          await revokeFirebaseUserSessions(existing.firebaseUid);
        } catch {
          // ignore error if revoked already
        }
      }
    }

    // Update or create profiles
    const effectiveRole = data.role ?? existing.role;
    let studentProfileRecord: TStudentProfile | null = null;
    let teacherProfileRecord: TTeacherProfile | null = null;

    if (effectiveRole === "student") {
      const studentData = data.studentProfile;
      const [existingStudentProfile] = await this.database
        .select()
        .from(studentProfiles)
        .where(eq(studentProfiles.userId, id))
        .limit(1);

      if (existingStudentProfile) {
        if (studentData) {
          const [updatedProfile] = await this.database
            .update(studentProfiles)
            .set({
              ...(studentData.studentCode !== undefined
                ? { studentCode: studentData.studentCode }
                : {}),
              ...(studentData.grade !== undefined ? { grade: studentData.grade } : {}),
              ...(studentData.schoolName !== undefined
                ? { schoolName: studentData.schoolName }
                : {}),
              ...(studentData.dateOfBirth !== undefined
                ? { dateOfBirth: studentData.dateOfBirth }
                : {}),
              ...(studentData.parentPhone !== undefined
                ? { parentPhone: studentData.parentPhone }
                : {}),
              updatedAt: new Date(),
            })
            .where(eq(studentProfiles.userId, id))
            .returning();

          studentProfileRecord = updatedProfile ?? null;
        } else {
          studentProfileRecord = existingStudentProfile;
        }
      } else {
        const [newProfile] = await this.database
          .insert(studentProfiles)
          .values({
            userId: id,
            studentCode: studentData?.studentCode ?? null,
            grade: studentData?.grade ?? null,
            schoolName: studentData?.schoolName ?? null,
            dateOfBirth: studentData?.dateOfBirth ?? null,
            parentPhone: studentData?.parentPhone ?? null,
          })
          .returning();

        studentProfileRecord = newProfile ?? null;
      }
    } else if (effectiveRole === "teacher") {
      const teacherData = data.teacherProfile;
      const [existingTeacherProfile] = await this.database
        .select()
        .from(teacherProfiles)
        .where(eq(teacherProfiles.userId, id))
        .limit(1);

      if (existingTeacherProfile) {
        if (teacherData) {
          const [updatedProfile] = await this.database
            .update(teacherProfiles)
            .set({
              ...(teacherData.teacherCode !== undefined
                ? { teacherCode: teacherData.teacherCode }
                : {}),
              ...(teacherData.department !== undefined
                ? { department: teacherData.department }
                : {}),
              ...(teacherData.bio !== undefined ? { bio: teacherData.bio } : {}),
              updatedAt: new Date(),
            })
            .where(eq(teacherProfiles.userId, id))
            .returning();

          teacherProfileRecord = updatedProfile ?? null;
        } else {
          teacherProfileRecord = existingTeacherProfile;
        }
      } else {
        const [newProfile] = await this.database
          .insert(teacherProfiles)
          .values({
            userId: id,
            teacherCode: teacherData?.teacherCode ?? null,
            department: teacherData?.department ?? null,
            bio: teacherData?.bio ?? null,
          })
          .returning();

        teacherProfileRecord = newProfile ?? null;
      }
    }

    return formatUserDetail({
      user: updatedUser,
      studentProfile: studentProfileRecord,
      teacherProfile: teacherProfileRecord,
    });
  }

  public async toggleActive({
    id,
    currentAdminId,
    isActive,
  }: TToggleActiveOptions): Promise<TUserDetailResponse> {
    if (id === currentAdminId) {
      throw new ForbiddenError("Bạn không thể tự khóa tài khoản của chính mình.");
    }

    const existing = await this.getUserById(id);

    const [updatedUser] = await this.database
      .update(users)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser) {
      throw new NotFoundError("Không tìm thấy người dùng.");
    }

    // Invalidate sessions and update Firebase disabled status
    if (existing.firebaseUid) {
      try {
        await updateFirebaseUser({
          uid: existing.firebaseUid,
          disabled: !isActive,
        });

        if (!isActive) {
          await revokeFirebaseUserSessions(existing.firebaseUid);
        }
      } catch (error) {
        console.warn(
          `[UsersService] Failed to toggle Firebase active status: ${(error as Error).message}`,
        );
      }
    }

    if (!isActive) {
      await this.database.delete(sessions).where(eq(sessions.userId, id));
    }

    return this.getUserById(id);
  }

  public async softDeleteUser({ id, currentAdminId }: TSoftDeleteOptions): Promise<void> {
    if (id === currentAdminId) {
      throw new ForbiddenError("Bạn không thể tự xóa tài khoản của chính mình.");
    }

    const existing = await this.getUserById(id);

    await this.database
      .update(users)
      .set({
        deletedAt: new Date(),
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));

    // Clear sessions & revoke Firebase
    await this.database.delete(sessions).where(eq(sessions.userId, id));

    if (existing.firebaseUid) {
      try {
        await updateFirebaseUser({
          uid: existing.firebaseUid,
          disabled: true,
        });
        await revokeFirebaseUserSessions(existing.firebaseUid);
      } catch (error) {
        console.warn(
          `[UsersService] Failed to disable soft-deleted user in Firebase: ${(error as Error).message}`,
        );
      }
    }
  }

  public async restoreUser(id: string): Promise<TUserDetailResponse> {
    const existing = await this.getUserById(id);

    const [restoredUser] = await this.database
      .update(users)
      .set({
        deletedAt: null,
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    if (!restoredUser) {
      throw new NotFoundError("Không tìm thấy người dùng.");
    }

    if (existing.firebaseUid) {
      try {
        await updateFirebaseUser({
          uid: existing.firebaseUid,
          disabled: false,
        });
      } catch (error) {
        console.warn(
          `[UsersService] Failed to re-enable user in Firebase: ${(error as Error).message}`,
        );
      }
    }

    return this.getUserById(id);
  }

  public async resetPassword({
    id,
    data,
  }: {
    id: string;
    data: TResetPasswordBody;
  }): Promise<TActionSuccessResponse> {
    const existing = await this.getUserById(id);

    if (!existing.firebaseUid) {
      throw new BadRequestError("Tài khoản này chưa được liên kết với Firebase Auth.");
    }

    let resetLink: string | undefined;

    if (data.newPassword) {
      await updateFirebaseUser({
        uid: existing.firebaseUid,
        password: data.newPassword,
      });

      // Revoke current sessions so user logs in with new password
      await this.database.delete(sessions).where(eq(sessions.userId, id));
      await revokeFirebaseUserSessions(existing.firebaseUid);
    }

    if (data.sendResetEmail) {
      resetLink = await generateFirebasePasswordResetLink(existing.email);
    }

    return {
      message: data.newPassword
        ? "Đã đổi mật khẩu thành công và thu hồi các phiên đăng nhập cũ."
        : "Đã tạo liên kết đặt lại mật khẩu thành công.",
      resetLink,
    };
  }
}
