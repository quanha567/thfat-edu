import { and, eq, inArray, isNull } from "drizzle-orm";
import { getAuth } from "firebase-admin/auth";

import { env } from "../config/env";
import { initializeFirebaseAdmin } from "../config/firebase";
import { createModuleLogger } from "../config/logger";
import { db, queryClient } from "./index";
import { examAttempts, quizzes, studentProfiles, teacherProfiles, users } from "./schema";
import { SEED_STUDENTS_DATA } from "./seed-students.data";

const seedLogger = createModuleLogger("seed");

export const DEFAULT_SEED_PASSWORD = "Password123@";

type TSyncFirebaseUserOptions = {
  email: string;
  password?: string;
  displayName: string;
};

async function syncFirebaseUser({
  email,
  password = DEFAULT_SEED_PASSWORD,
  displayName,
}: TSyncFirebaseUserOptions): Promise<string | null> {
  try {
    const app = initializeFirebaseAdmin();
    const auth = getAuth(app);

    try {
      const existingFirebaseUser = await auth.getUserByEmail(email);

      return existingFirebaseUser.uid;
    } catch (error: unknown) {
      const authError = error as { code?: string };
      if (authError.code === "auth/user-not-found") {
        const createdUser = await auth.createUser({
          email,
          password,
          displayName,
        });
        seedLogger.info({ email }, "created Firebase account");

        return createdUser.uid;
      }

      return null;
    }
  } catch {
    return null;
  }
}

export async function seedDatabase(): Promise<void> {
  seedLogger.info("seeding database");

  const adminEmail = env.ADMIN_EMAIL || "admin@thfat.edu.vn";
  const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);

  const adminFirebaseUid = await syncFirebaseUser({
    email: adminEmail,
    displayName: "Quản trị viên Hệ thống",
  });

  if (existingAdmin.length === 0) {
    await db.insert(users).values({
      email: adminEmail,
      fullName: "Quản trị viên Hệ thống",
      role: "admin",
      isActive: true,
      firebaseUid: adminFirebaseUid,
    });
    seedLogger.info({ email: adminEmail }, "seeded admin");
  } else {
    if (adminFirebaseUid && !existingAdmin[0]?.firebaseUid) {
      await db
        .update(users)
        .set({ firebaseUid: adminFirebaseUid })
        .where(eq(users.id, existingAdmin[0].id));
    }
    seedLogger.info({ email: adminEmail }, "admin already exists");
  }

  const teacherEmail = "teacher@thfat.edu.vn";
  const existingTeacher = await db
    .select()
    .from(users)
    .where(eq(users.email, teacherEmail))
    .limit(1);

  const teacherFirebaseUid = await syncFirebaseUser({
    email: teacherEmail,
    displayName: "Thầy Nguyễn Hóa Học",
  });

  if (existingTeacher.length === 0) {
    const [insertedTeacher] = await db
      .insert(users)
      .values({
        email: teacherEmail,
        fullName: "Thầy Nguyễn Hóa Học",
        role: "teacher",
        isActive: true,
        firebaseUid: teacherFirebaseUid,
      })
      .returning();

    if (insertedTeacher) {
      await db.insert(teacherProfiles).values({
        userId: insertedTeacher.id,
        teacherCode: "GV-HOA-001",
        department: "Tổ Hóa Học",
        bio: "Giáo viên chuyên bồi dưỡng học sinh giỏi Hóa học.",
      });
    }
    seedLogger.info({ email: teacherEmail }, "seeded teacher");
  } else {
    if (teacherFirebaseUid && !existingTeacher[0]?.firebaseUid) {
      await db
        .update(users)
        .set({ firebaseUid: teacherFirebaseUid })
        .where(eq(users.id, existingTeacher[0].id));
    }
    seedLogger.info({ email: teacherEmail }, "teacher already exists");
  }

  const studentEmail = "student@thfat.edu.vn";
  const existingStudent = await db
    .select()
    .from(users)
    .where(eq(users.email, studentEmail))
    .limit(1);

  const studentFirebaseUid = await syncFirebaseUser({
    email: studentEmail,
    displayName: "Em Học Sinh Chăm Chỉ",
  });

  if (existingStudent.length === 0) {
    const [insertedStudent] = await db
      .insert(users)
      .values({
        email: studentEmail,
        fullName: "Em Học Sinh Chăm Chỉ",
        role: "student",
        isActive: true,
        firebaseUid: studentFirebaseUid,
      })
      .returning();

    if (insertedStudent) {
      await db.insert(studentProfiles).values({
        userId: insertedStudent.id,
        studentCode: "HS-2026-001",
        grade: "Lớp 12",
        schoolName: "THPT Chuyên",
      });
    }
    seedLogger.info({ email: studentEmail }, "seeded student");
  } else {
    if (studentFirebaseUid && !existingStudent[0]?.firebaseUid) {
      await db
        .update(users)
        .set({ firebaseUid: studentFirebaseUid })
        .where(eq(users.id, existingStudent[0].id));
    }
    seedLogger.info({ email: studentEmail }, "student already exists");
  }

  await seedStudentResults();

  seedLogger.info("database seeding completed");
  seedLogger.info(
    "seeded accounts use the default dev password (see DEFAULT_SEED_PASSWORD in seed.ts) when Firebase Admin is connected, or create users in Firebase Console -> Authentication -> Users",
  );
}

export async function seedStudentResults(): Promise<void> {
  seedLogger.info("seeding students and exam results");

  const [publishedQuiz] = await db
    .select()
    .from(quizzes)
    .where(and(eq(quizzes.status, "published"), isNull(quizzes.deletedAt)))
    .limit(1);

  if (!publishedQuiz) {
    seedLogger.warn("no published quiz found to attach student attempts to");

    return;
  }

  seedLogger.info({ quizId: publishedQuiz.id, title: publishedQuiz.title }, "target quiz selected");

  const nonStudentUsers = await db
    .select({ id: users.id })
    .from(users)
    .where(inArray(users.role, ["admin", "teacher"]));

  if (nonStudentUsers.length > 0) {
    const nonStudentIds = nonStudentUsers.map((u) => u.id);
    await db
      .delete(examAttempts)
      .where(
        and(eq(examAttempts.quizId, publishedQuiz.id), inArray(examAttempts.userId, nonStudentIds)),
      );
  }

  const now = new Date();

  for (const item of SEED_STUDENTS_DATA) {
    let email = `hs${String(item.stt).padStart(3, "0")}@thfat.edu.vn`;
    if (item.stt === 1) {
      email = "phat@gmail.com";
    } else if (item.stt === 7) {
      email = "quanhavo005@gmail.com";
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    let userId: string;

    if (existingUser.length === 0) {
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          fullName: item.fullName,
          gender: item.gender,
          role: "student",
          isActive: true,
        })
        .returning();

      if (!newUser) {
        continue;
      }

      userId = newUser.id;
    } else {
      const matchedId = existingUser[0]?.id;
      if (!matchedId) {
        continue;
      }
      userId = matchedId;

      await db
        .update(users)
        .set({
          fullName: item.fullName,
          gender: item.gender,
          isActive: true,
        })
        .where(eq(users.id, userId));
    }

    const existingProfile = await db
      .select()
      .from(studentProfiles)
      .where(eq(studentProfiles.userId, userId))
      .limit(1);

    const studentCode = `HS-2026-${String(item.stt).padStart(3, "0")}`;

    if (existingProfile.length === 0) {
      await db.insert(studentProfiles).values({
        userId,
        studentCode,
        grade: "Lớp 12",
        schoolName: item.schoolName,
      });
    } else {
      await db
        .update(studentProfiles)
        .set({
          studentCode,
          schoolName: existingProfile[0]?.schoolName || item.schoolName,
          grade: existingProfile[0]?.grade || "Lớp 12",
        })
        .where(eq(studentProfiles.userId, userId));
    }

    const durationSeconds = 1200 + item.stt * 10;
    const submittedAt = new Date(now.getTime() - (100 - item.stt) * 45 * 1000);
    const startedAt = new Date(submittedAt.getTime() - durationSeconds * 1000);

    const existingAttempts = await db
      .select()
      .from(examAttempts)
      .where(and(eq(examAttempts.userId, userId), eq(examAttempts.quizId, publishedQuiz.id)));

    if (existingAttempts.length === 0) {
      await db.insert(examAttempts).values({
        quizId: publishedQuiz.id,
        userId,
        score: item.score.toFixed(2),
        status: "submitted",
        totalAnswered: 67,
        startedAt,
        submittedAt,
      });
    } else {
      const [primaryAttempt, ...otherAttempts] = existingAttempts;
      if (otherAttempts.length > 0) {
        const otherIds = otherAttempts.map((a) => a.id);
        await db.delete(examAttempts).where(inArray(examAttempts.id, otherIds));
      }

      if (primaryAttempt) {
        await db
          .update(examAttempts)
          .set({
            score: item.score.toFixed(2),
            status: "submitted",
            totalAnswered: 67,
            startedAt,
            submittedAt,
          })
          .where(eq(examAttempts.id, primaryAttempt.id));
      }
    }
  }

  seedLogger.info({ count: SEED_STUDENTS_DATA.length }, "seeded students and exam results");
}

if ((import.meta as { main?: boolean }).main) {
  seedDatabase()
    .catch((err) => {
      seedLogger.error({ err }, "seeding failed");
      process.exit(1);
    })
    .finally(async () => {
      await queryClient.end();
    });
}
