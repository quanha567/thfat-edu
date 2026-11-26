import { UnauthorizedError } from "../../middlewares/error-handler";
import { type TUserResponse } from "./auth.model";
import { type AuthService } from "./auth.service";

export type TTestRole = TUserResponse["role"];

export const TEST_TOKENS: Record<TTestRole, string> = {
  admin: "admin-token",
  teacher: "teacher-token",
  student: "student-token",
};

function buildUser(role: TTestRole): TUserResponse {
  return {
    id: `${role}-uuid`,
    email: `${role}@thfat.edu.vn`,
    fullName: `Test ${role}`,
    avatarUrl: null,
    role,
    isActive: true,
    studentProfile: null,
    teacherProfile: null,
  };
}

export function createMockAuthService(): AuthService {
  return {
    getCurrentUser: async (token: string) => {
      const role = (Object.keys(TEST_TOKENS) as TTestRole[]).find(
        (candidate) => TEST_TOKENS[candidate] === token,
      );

      if (!role) {
        throw new UnauthorizedError("Phiên đăng nhập không hợp lệ.");
      }

      return buildUser(role);
    },
  } as unknown as AuthService;
}

export function bearer(role: TTestRole): { authorization: string } {
  return { authorization: `Bearer ${TEST_TOKENS[role]}` };
}
