import { UsersPageContainer } from "@/features/users/components/users-page-container";

export const metadata = {
  title: "Quản lý người dùng | ThFat Edu Admin",
  description: "Cấp phát, phân quyền và quản lý tài khoản người dùng hệ thống",
};

export default function AdminUsersPage() {
  return <UsersPageContainer />;
}
