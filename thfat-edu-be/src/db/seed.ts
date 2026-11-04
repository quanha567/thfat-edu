import { eq } from "drizzle-orm";
import { getAuth } from "firebase-admin/auth";

import { env } from "../config/env";
import { initializeFirebaseAdmin } from "../config/firebase";
import { db, queryClient } from "./index";
import { studentProfiles, teacherProfiles, users } from "./schema";

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
        console.info(`   🔑 Created Firebase account: ${email} | Password: ${password}`);

        return createdUser.uid;
      }

      return null;
    }
  } catch {
    return null;
  }
}

export async function seedDatabase(): Promise<void> {
  console.info("🌱 Seeding database...");

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
    console.info(`✅ Seeded Admin: ${adminEmail}`);
  } else {
    if (adminFirebaseUid && !existingAdmin[0]?.firebaseUid) {
      await db
        .update(users)
        .set({ firebaseUid: adminFirebaseUid })
        .where(eq(users.id, existingAdmin[0].id));
    }
    console.info(`ℹ️ Admin ${adminEmail} already exists`);
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
    console.info(`✅ Seeded Teacher: ${teacherEmail}`);
  } else {
    if (teacherFirebaseUid && !existingTeacher[0]?.firebaseUid) {
      await db
        .update(users)
        .set({ firebaseUid: teacherFirebaseUid })
        .where(eq(users.id, existingTeacher[0].id));
    }
    console.info(`ℹ️ Teacher ${teacherEmail} already exists`);
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
    console.info(`✅ Seeded Student: ${studentEmail}`);
  } else {
    if (studentFirebaseUid && !existingStudent[0]?.firebaseUid) {
      await db
        .update(users)
        .set({ firebaseUid: studentFirebaseUid })
        .where(eq(users.id, existingStudent[0].id));
    }
    console.info(`ℹ️ Student ${studentEmail} already exists`);
  }

  console.info("🎉 Database seeding completed successfully!");
  console.info(
    `👉 Default dev password for all seeded accounts (if Firebase Admin is connected): ${DEFAULT_SEED_PASSWORD}`,
  );
  console.info(
    "👉 Or you can create users directly in Firebase Console -> Authentication -> Users with any password you like.",
  );
}

if ((import.meta as { main?: boolean }).main) {
  seedDatabase()
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    })
    .finally(async () => {
      await queryClient.end();
    });
}
