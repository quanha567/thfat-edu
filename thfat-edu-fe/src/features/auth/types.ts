import type { Nullable, ProblemDetails } from "@thfat-edu/shared";

export type TUserRole = "student" | "teacher" | "admin";

export type TStudentProfile = {
  studentCode: Nullable<string>;
  grade: Nullable<string>;
  schoolName: Nullable<string>;
  dateOfBirth: Nullable<string>;
  parentPhone: Nullable<string>;
};

export type TTeacherProfile = {
  teacherCode: Nullable<string>;
  department: Nullable<string>;
  bio: Nullable<string>;
};

export type TAuthUser = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: Nullable<string>;
  role: TUserRole;
  isActive: boolean;
  studentProfile?: Nullable<TStudentProfile>;
  teacherProfile?: Nullable<TTeacherProfile>;
};

export type TProblemDetails = ProblemDetails;
