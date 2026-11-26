import { and, desc, eq, gt, isNotNull, isNull, lte, type SQL, sql } from "drizzle-orm";

import { createFirebaseUser, deleteFirebaseUser } from "../../config/firebase";
import { createModuleLogger, setRequestUserId } from "../../config/logger";
import { type Database, db } from "../../db";
import {
  inviteCodes,
  sessions,
  studentProfiles,
  type TInviteCode,
  type TUser,
  users,
} from "../../db/schema";
import { AppError, BadRequestError, NotFoundError } from "../../middlewares/error-handler";
import { SESSION_COOKIE_MAX_AGE } from "../auth/auth.cookie";
import { generateSessionToken } from "../auth/auth.service";
import {
  DEFAULT_EXPIRES_IN_DAYS,
  type TCreateInviteCodesBody,
  type TInviteCodeResponse,
  type TInviteCodeStatus,
  type TListInviteCodesQuery,
  type TPaginatedInviteCodesResponse,
  type TRegisterBody,
} from "./invite-codes.model";

const inviteLogger = createModuleLogger("invite-codes");

const INVALID_CODE_MESSAGE = "Mã mời không hợp lệ.";
const CODE_LENGTH = 10;
// 32 ký tự (256 chia hết cho 32 nên không lệch xác suất), bỏ các ký tự dễ nhầm: 0/O, 1/I/L.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const DAY_MS = 24 * 60 * 60 * 1000;

export type TClientInfo = {
  userAgent?: string;
  ipAddress?: string;
};

export type TRegisterOptions = {
  data: TRegisterBody;
  clientInfo: TClientInfo;
};

export type TCreateInviteCodesOptions = {
  data: TCreateInviteCodesBody;
  createdById: string;
};

export type TInviteCodeRow = {
  inviteCode: TInviteCode;
  usedByEmail: string | null;
  usedByName: string | null;
};

export function generateInviteCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(CODE_LENGTH));

  return Array.from(bytes, (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");
}

export function normalizeInviteCode(code: string): string {
  return code.trim().toUpperCase();
}

export function resolveInviteCodeStatus(
  inviteCode: Pick<TInviteCode, "usedAt" | "revokedAt" | "expiresAt">,
  now: Date = new Date(),
): TInviteCodeStatus {
  if (inviteCode.usedAt) return "used";
  if (inviteCode.revokedAt) return "revoked";
  if (inviteCode.expiresAt <= now) return "expired";

  return "active";
}

function formatInviteCode({
  inviteCode,
  usedByEmail,
  usedByName,
}: TInviteCodeRow): TInviteCodeResponse {
  return {
    id: inviteCode.id,
    code: inviteCode.code,
    note: inviteCode.note,
    status: resolveInviteCodeStatus(inviteCode),
    expiresAt: inviteCode.expiresAt.toISOString(),
    revokedAt: inviteCode.revokedAt?.toISOString() ?? null,
    usedAt: inviteCode.usedAt?.toISOString() ?? null,
    usedByUserId: inviteCode.usedByUserId,
    usedByEmail,
    usedByName,
    createdAt: inviteCode.createdAt.toISOString(),
  };
}

function buildStatusCondition(status: TListInviteCodesQuery["status"]): SQL | undefined {
  const now = new Date();

  switch (status) {
    case "used":
      return isNotNull(inviteCodes.usedAt);
    case "revoked":
      return and(isNull(inviteCodes.usedAt), isNotNull(inviteCodes.revokedAt));
    case "expired":
      return and(
        isNull(inviteCodes.usedAt),
        isNull(inviteCodes.revokedAt),
        lte(inviteCodes.expiresAt, now),
      );
    case "active":
      return and(
        isNull(inviteCodes.usedAt),
        isNull(inviteCodes.revokedAt),
        gt(inviteCodes.expiresAt, now),
      );
    default:
      return undefined;
  }
}

export class InviteCodesService {
  constructor(private readonly database: Database = db) {}

  public async createBatch({
    data,
    createdById,
  }: TCreateInviteCodesOptions): Promise<TInviteCodeResponse[]> {
    const expiresAt = new Date(
      Date.now() + (data.expiresInDays ?? DEFAULT_EXPIRES_IN_DAYS) * DAY_MS,
    );
    const codes = new Set<string>();

    while (codes.size < data.count) {
      codes.add(generateInviteCode());
    }

    const created = await this.database
      .insert(inviteCodes)
      .values(
        [...codes].map((code) => ({
          code,
          note: data.note?.trim() || null,
          expiresAt,
          createdById,
        })),
      )
      .returning();

    inviteLogger.info({ count: created.length, createdById }, "invite codes created");

    return created.map((inviteCode) =>
      formatInviteCode({ inviteCode, usedByEmail: null, usedByName: null }),
    );
  }

  public async list({
    page = 1,
    limit = 20,
    status = "all",
  }: TListInviteCodesQuery): Promise<TPaginatedInviteCodesResponse> {
    const where = buildStatusCondition(status);

    const rows = await this.database
      .select({
        inviteCode: inviteCodes,
        usedByEmail: users.email,
        usedByName: users.fullName,
      })
      .from(inviteCodes)
      .leftJoin(users, eq(users.id, inviteCodes.usedByUserId))
      .where(where)
      .orderBy(desc(inviteCodes.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    const [countRow] = await this.database
      .select({ total: sql<number>`count(*)::int` })
      .from(inviteCodes)
      .where(where);

    return {
      items: rows.map(formatInviteCode),
      total: countRow?.total ?? 0,
      page,
      limit,
    };
  }

  public async revoke(id: string): Promise<TInviteCodeResponse> {
    const [existing] = await this.database
      .select()
      .from(inviteCodes)
      .where(eq(inviteCodes.id, id))
      .limit(1);

    if (!existing) {
      throw new NotFoundError("Không tìm thấy mã mời.");
    }

    if (existing.usedAt) {
      throw new BadRequestError("Mã mời đã được sử dụng nên không thể thu hồi.");
    }

    if (existing.revokedAt) {
      return formatInviteCode({ inviteCode: existing, usedByEmail: null, usedByName: null });
    }

    const [revoked] = await this.database
      .update(inviteCodes)
      .set({ revokedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(inviteCodes.id, id), isNull(inviteCodes.usedAt)))
      .returning();

    if (!revoked) {
      throw new BadRequestError("Mã mời đã được sử dụng nên không thể thu hồi.");
    }

    inviteLogger.info({ inviteCodeId: id }, "invite code revoked");

    return formatInviteCode({ inviteCode: revoked, usedByEmail: null, usedByName: null });
  }

  /** Kiểm tra mã còn dùng được. Mọi lý do không hợp lệ đều trả cùng một lỗi để không lộ thông tin. */
  public async assertUsable(rawCode: string): Promise<TInviteCode> {
    const code = normalizeInviteCode(rawCode);

    const [inviteCode] = await this.database
      .select()
      .from(inviteCodes)
      .where(eq(inviteCodes.code, code))
      .limit(1);

    if (!inviteCode || resolveInviteCodeStatus(inviteCode) !== "active") {
      inviteLogger.warn({ reason: "invalid_invite_code" }, "invite code rejected");

      throw new BadRequestError(INVALID_CODE_MESSAGE);
    }

    return inviteCode;
  }

  public async register({
    data,
    clientInfo,
  }: TRegisterOptions): Promise<{ user: TUser; sessionToken: string }> {
    const inviteCode = await this.assertUsable(data.code);
    const email = data.email.toLowerCase().trim();

    const [existingUser] = await this.database
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      throw new BadRequestError("Email này đã được sử dụng trong hệ thống.");
    }

    const firebaseUid = await this.createFirebaseAccount({
      email,
      password: data.password,
      fullName: data.fullName.trim(),
    });

    try {
      const result = await this.database.transaction(async (tx) => {
        const [claimed] = await tx
          .update(inviteCodes)
          .set({ usedAt: new Date(), updatedAt: new Date() })
          .where(
            and(
              eq(inviteCodes.id, inviteCode.id),
              isNull(inviteCodes.usedAt),
              isNull(inviteCodes.revokedAt),
              gt(inviteCodes.expiresAt, new Date()),
            ),
          )
          .returning({ id: inviteCodes.id });

        if (!claimed) {
          throw new BadRequestError(INVALID_CODE_MESSAGE);
        }

        const [newUser] = await tx
          .insert(users)
          .values({
            email,
            fullName: data.fullName.trim(),
            role: "student",
            firebaseUid,
            isActive: true,
          })
          .returning();

        if (!newUser) {
          throw new AppError("Không thể khởi tạo người dùng.", 500, "INTERNAL_ERROR");
        }

        await tx.insert(studentProfiles).values({ userId: newUser.id });
        await tx
          .update(inviteCodes)
          .set({ usedByUserId: newUser.id })
          .where(eq(inviteCodes.id, inviteCode.id));

        const sessionToken = generateSessionToken();

        await tx.insert(sessions).values({
          userId: newUser.id,
          sessionToken,
          userAgent: clientInfo.userAgent || null,
          ipAddress: clientInfo.ipAddress || null,
          expiresAt: new Date(Date.now() + SESSION_COOKIE_MAX_AGE * 1000),
        });

        return { user: newUser, sessionToken };
      });

      setRequestUserId(result.user.id);
      inviteLogger.info({ inviteCodeId: inviteCode.id, userId: result.user.id }, "user registered");

      return result;
    } catch (error) {
      await this.cleanupFirebaseAccount(firebaseUid);

      throw error;
    }
  }

  private async createFirebaseAccount({
    email,
    password,
    fullName,
  }: {
    email: string;
    password: string;
    fullName: string;
  }): Promise<string> {
    try {
      const { uid } = await createFirebaseUser({ email, password, displayName: fullName });

      return uid;
    } catch (error) {
      inviteLogger.warn(
        { err: error, service: "firebase", operation: "createFirebaseUser", outcome: "failure" },
        "failed to create Firebase user",
      );

      throw new BadRequestError("Không thể tạo tài khoản. Email có thể đã được sử dụng.");
    }
  }

  private async cleanupFirebaseAccount(uid: string): Promise<void> {
    try {
      await deleteFirebaseUser(uid);
    } catch (error) {
      inviteLogger.error(
        { err: error, service: "firebase", operation: "deleteFirebaseUser", outcome: "failure" },
        "failed to roll back Firebase user",
      );
    }
  }
}
