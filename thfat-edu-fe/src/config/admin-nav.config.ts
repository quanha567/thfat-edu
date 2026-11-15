import { FileQuestion, LayoutDashboard, Settings, Users, type LucideIcon } from "lucide-react";

export type TAdminNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  items?: {
    title: string;
    href: string;
  }[];
};

export type TAdminNavGroup = {
  label: string;
  items: TAdminNavItem[];
};

export const ADMIN_NAV_GROUPS: TAdminNavGroup[] = [
  {
    label: "Tổng quan",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Khảo thí & Đào tạo",
    items: [
      {
        title: "Ngân hàng đề",
        href: "/admin/exams",
        icon: FileQuestion,
      },
    ],
  },
  {
    label: "Quản trị hệ thống",
    items: [
      {
        title: "Quản lý người dùng",
        href: "/admin/users",
        icon: Users,
      },
      {
        title: "Cấu hình chung",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

export const ADMIN_ROUTE_LABELS: Record<string, string> = {
  "/admin": "Tổng quan",
  "/admin/exams": "Ngân hàng đề",
  "/admin/users": "Quản lý người dùng",
  "/admin/settings": "Cấu hình chung",
};
