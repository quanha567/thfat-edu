export type TUserRole = "student" | "teacher" | "admin";

export type TUserRoleFilter = "all" | "student" | "teacher" | "admin";

export type TUserStatusFilter = "all" | "active" | "inactive" | "deleted";

export type TStudentProfile = {
  id: string;
  studentCode: string | null;
  grade: string | null;
  schoolName: string | null;
  dateOfBirth: string | null;
  parentPhone: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TTeacherProfile = {
  id: string;
  teacherCode: string | null;
  department: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TUser = {
  id: string;
  firebaseUid: string | null;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: TUserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  studentProfile: TStudentProfile | null;
  teacherProfile: TTeacherProfile | null;
};

export type TUsersListResponse = {
  items: TUser[];
  total: number;
  page: number;
  limit: number;
};

export type TUserFilterParams = {
  page?: number;
  limit?: number;
  search?: string;
  role?: TUserRoleFilter;
  status?: TUserStatusFilter;
  sortBy?: "createdAt" | "fullName" | "email";
  sortOrder?: "asc" | "desc";
};

export type TStudentProfileInput = {
  studentCode?: string | null;
  grade?: string | null;
  schoolName?: string | null;
  dateOfBirth?: string | null;
  parentPhone?: string | null;
};

export type TTeacherProfileInput = {
  teacherCode?: string | null;
  department?: string | null;
  bio?: string | null;
};

export type TCreateUserInput = {
  email: string;
  fullName: string;
  role: TUserRole;
  password: string;
  sendResetEmail?: boolean;
  avatarUrl?: string | null;
  studentProfile?: TStudentProfileInput | null;
  teacherProfile?: TTeacherProfileInput | null;
};

export type TUpdateUserInput = {
  fullName?: string;
  role?: TUserRole;
  avatarUrl?: string | null;
  isActive?: boolean;
  studentProfile?: TStudentProfileInput | null;
  teacherProfile?: TTeacherProfileInput | null;
};

export type TResetPasswordInput = {
  newPassword?: string;
  sendResetEmail?: boolean;
};

export type TActionResponse = {
  message: string;
  resetLink?: string;
  user?: TUser;
};
