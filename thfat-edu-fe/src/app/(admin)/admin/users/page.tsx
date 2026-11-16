import { UsersPageContainer } from "@/features/users/components/users-page-container";

export const metadata = {
  title: "Người dùng | ThFat Edu Admin",
  description: "Danh sách và phân quyền tài khoản người dùng",
};

export default function AdminUsersPage() {
  return <UsersPageContainer />;
}
