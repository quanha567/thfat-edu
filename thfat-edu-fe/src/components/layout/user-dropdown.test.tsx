import type { TAuthUser } from "@/features/auth/types";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UserDropdown } from "./user-dropdown";

let mockUser: TAuthUser | null = null;

vi.mock("@/features/auth/hooks/use-auth-user", () => ({
  useAuthUser: () => ({ data: mockUser }),
}));

vi.mock("@/features/auth/hooks/use-logout", () => ({
  useLogout: () => ({ mutate: vi.fn<() => void>() }),
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: ReactNode }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: ReactNode }) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuLabel: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />,
}));

describe("UserDropdown", () => {
  beforeEach(() => {
    mockUser = null;
  });

  it("returns null when user is not authenticated", () => {
    mockUser = null;
    const html = renderToStaticMarkup(<UserDropdown />);
    expect(html).toBe("");
  });

  it("renders Quản trị hệ thống link when user is admin", () => {
    mockUser = {
      id: "admin-1",
      email: "admin@thfat.edu.vn",
      fullName: "Super Admin",
      role: "admin",
      isActive: true,
      avatarUrl: null,
    };

    const html = renderToStaticMarkup(<UserDropdown variant="navbar" />);
    expect(html).toContain("Quản trị hệ thống");
    expect(html).toContain("/admin");
    expect(html).toContain("Thông tin cá nhân");
    expect(html).toContain("/profile");
    expect(html).toContain("Đăng xuất");
  });

  it("does not render Quản trị hệ thống link when user is student", () => {
    mockUser = {
      id: "student-1",
      email: "student@thfat.edu.vn",
      fullName: "Học Viên A",
      role: "student",
      isActive: true,
      avatarUrl: null,
    };

    const html = renderToStaticMarkup(<UserDropdown variant="navbar" />);
    expect(html).not.toContain("Quản trị hệ thống");
    expect(html).not.toContain("/admin");
    expect(html).toContain("Thông tin cá nhân");
    expect(html).toContain("Đăng xuất");
  });

  it("renders Về trang học tập link when variant is admin", () => {
    mockUser = {
      id: "admin-1",
      email: "admin@thfat.edu.vn",
      fullName: "Super Admin",
      role: "admin",
      isActive: true,
      avatarUrl: null,
    };

    const html = renderToStaticMarkup(<UserDropdown variant="admin" />);
    expect(html).toContain("Quản trị hệ thống");
    expect(html).toContain("Về trang học tập");
    expect(html).toContain('href="/"');
  });
});
