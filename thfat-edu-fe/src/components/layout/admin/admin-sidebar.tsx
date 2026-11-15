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
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ADMIN_NAV_GROUPS } from "@/config/admin-nav.config";
import { ArrowLeft, ExternalLink } from "lucide-react";
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
      <SidebarHeader className="border-sidebar-border border-b p-3">
        <Link href="/admin" className="flex items-center gap-3 transition-opacity hover:opacity-90">
          <div className="ring-primary-500/20 dark:ring-primary-400/30 relative h-9 w-9 shrink-0 overflow-hidden rounded-full shadow-xs ring-2">
            <Image
              src="/brand/logo-icon.png"
              alt="ThFat Edu"
              fill
              sizes="36px"
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              ThFat Edu
            </span>
            <span className="text-caption text-primary-700 dark:text-primary-300 font-semibold tracking-wide">
              Quản trị hệ thống
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-1 py-2">
        {ADMIN_NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label} className="py-1">
            <SidebarGroupLabel className="text-caption px-3 font-semibold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isItemActive(item.href);
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className={
                          active
                            ? "bg-primary-50 text-primary-700 border-primary-200/80 dark:bg-primary-900/40 dark:text-primary-200 dark:border-primary-800 border font-semibold shadow-2xs"
                            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900/60 dark:hover:text-neutral-100"
                        }
                      >
                        <Link href={item.href} className="flex items-center gap-2.5">
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.title}</span>
                          {item.badge && (
                            <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Về trang học tập"
              className="hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-900/40 dark:hover:text-primary-200 text-neutral-600 dark:text-neutral-400"
            >
              <Link href="/" className="flex items-center gap-2.5">
                <ArrowLeft className="text-primary-700 dark:text-primary-400 h-4 w-4 shrink-0" />
                <span className="text-label font-medium group-data-[collapsible=icon]:hidden">
                  Về trang học tập
                </span>
                <ExternalLink className="ml-auto h-3.5 w-3.5 text-neutral-400 group-data-[collapsible=icon]:hidden" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
