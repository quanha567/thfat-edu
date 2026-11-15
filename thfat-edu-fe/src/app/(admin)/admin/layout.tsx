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
    <SidebarProvider defaultOpen={defaultOpen} className="h-svh overflow-hidden">
      <AdminSidebar />
      <SidebarInset className="bg-background flex h-full min-w-0 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
