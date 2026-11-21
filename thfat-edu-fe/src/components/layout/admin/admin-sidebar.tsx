"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ADMIN_NAV_GROUPS } from "@/config/admin-nav.config";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminSidebar() {
  const pathname = usePathname();

  function isItemActive(href: string): boolean {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="border-sidebar-border border-b p-2.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group-data-[collapsible=icon]:p-0"
            >
              <Link href="/admin" className="flex items-center gap-3">
                <div className="ring-primary-500/20 dark:ring-primary-400/30 relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-2xs ring-2">
                  <Image
                    src="/brand/logo-icon.png"
                    alt="ThFat Edu"
                    fill
                    sizes="32px"
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col gap-0.5 overflow-hidden text-left group-data-[collapsible=icon]:hidden">
                  <span className="text-sidebar-foreground truncate text-sm font-bold tracking-tight">
                    ThFat Edu
                  </span>
                  <span className="text-caption text-muted-foreground font-medium">
                    Hệ thống quản trị
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        {ADMIN_NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label} className="py-1.5">
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-xxs px-2.5 font-semibold tracking-wider uppercase">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const active = isItemActive(item.href);
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className="data-[active=true]:border-sidebar-accent-foreground/15 h-9 rounded-lg px-2.5 font-medium transition-colors data-[active=true]:border data-[active=true]:font-semibold data-[active=true]:shadow-2xs"
                      >
                        <Link href={item.href} className="flex items-center gap-2.5">
                          <Icon className="size-4 shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.badge && (
                        <SidebarMenuBadge className="bg-muted text-muted-foreground text-xxs rounded-full px-2 py-0.5 font-semibold">
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border border-t p-2.5 pb-8 sm:pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Về trang học tập"
              className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group/footer-btn h-9 rounded-lg px-2.5 transition-colors"
            >
              <Link href="/" className="flex items-center gap-2.5">
                <ArrowLeft className="text-muted-foreground size-4 shrink-0 transition-transform group-hover/footer-btn:-translate-x-0.5" />
                <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">
                  Về trang học tập
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
