import {
  FileQuestion,
  FolderTree,
  LayoutDashboard,
  Newspaper,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

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
        title: "Tổng quan",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Khảo thí",
    items: [
      {
        title: "Đề thi",
        href: "/admin/exams",
        icon: FileQuestion,
      },
    ],
  },
  {
    label: "Quản lý nội dung",
    items: [
      {
        title: "Bài viết",
        href: "/admin/articles",
        icon: Newspaper,
      },
      {
        title: "Chuyên mục",
        href: "/admin/categories",
        icon: FolderTree,
      },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      {
        title: "Người dùng",
        href: "/admin/users",
        icon: Users,
      },
      {
        title: "Cấu hình",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

export const ADMIN_ROUTE_LABELS: Record<string, string> = {
  "/admin": "Tổng quan",
  "/admin/exams": "Đề thi",
  "/admin/exams/create": "Tạo đề thi mới",
  "/admin/articles": "Bài viết",
  "/admin/articles/create": "Tạo bài viết mới",
  "/admin/categories": "Chuyên mục",
  "/admin/users": "Người dùng",
  "/admin/settings": "Cấu hình",
};
