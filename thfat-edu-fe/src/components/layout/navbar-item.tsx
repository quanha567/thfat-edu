"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type TNavigationItem } from "@/features/home/constants/home.data";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ResourcesDropdown } from "./resources-dropdown";

type TNavbarItemProps = {
  item: TNavigationItem;
};

export function NavbarItem({ item }: TNavbarItemProps) {
  const pathname = usePathname();
  const isActive = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);

  if (item.href === "/articles" || item.isResourceDropdown) {
    return <ResourcesDropdown label={item.label} href={item.href} />;
  }

  if (item.children && item.children.length > 0) {
    const hasActiveChild = item.children.some((child) => pathname?.startsWith(child.href));

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`flex h-auto cursor-pointer items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              hasActiveChild
                ? "bg-white/15 text-white shadow-xs backdrop-blur-md"
                : "text-white/85 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span>{item.label}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="w-60 border-white/10 bg-[#071d49]/95 p-2 text-white shadow-xl backdrop-blur-xl"
        >
          {item.children.map((subItem) => (
            <DropdownMenuItem
              key={subItem.label}
              asChild
              className="cursor-pointer rounded-md text-white/90 hover:bg-white/10 focus:bg-white/10 focus:text-white"
            >
              <Link href={subItem.href} className="py-2 text-sm font-medium">
                {subItem.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (isActive) {
    return (
      <Link
        href={item.href}
        className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold text-white shadow-xs backdrop-blur-md transition-all hover:bg-white/20"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      className="rounded-full px-3.5 py-1.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
    >
      {item.label}
    </Link>
  );
}
