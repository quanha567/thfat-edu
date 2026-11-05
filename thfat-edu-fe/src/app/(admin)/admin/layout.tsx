import { AdminHeader, AdminSidebar } from "@/components/layout/admin";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import type { ReactNode } from "react";

export type TAdminLayoutProps = {
  children: ReactNode;
};

export const instant = false;

export default async function AdminLayout({ children }: TAdminLayoutProps) {
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar_state")?.value;
  const defaultOpen = sidebarState === undefined ? true : sidebarState === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AdminSidebar />
      <SidebarInset className="min-w-0 bg-neutral-50/50 dark:bg-neutral-950">
        <AdminHeader />
        <main className="flex flex-1 flex-col p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
