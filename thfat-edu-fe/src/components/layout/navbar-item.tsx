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

type TNavbarItemProps = {
  item: TNavigationItem;
};

export function NavbarItem({ item }: TNavbarItemProps) {
  if (item.children && item.children.length > 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-auto cursor-pointer items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-white/85 hover:bg-white/10 hover:text-white"
          >
            <span>{item.label}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="bg-primary-950 w-64 border-white/15 p-2 text-white"
        >
          {item.children.map((subItem) => (
            <DropdownMenuItem
              key={subItem.label}
              asChild
              className="cursor-pointer rounded-md hover:bg-white/10"
            >
              <Link href={subItem.href} className="py-2 text-sm">
                {subItem.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (item.active) {
    return (
      <Link
        href={item.href}
        className="border-primary-400/40 rounded-full border bg-white/15 px-4 py-1.5 text-sm font-semibold text-white shadow-inner"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      className="rounded-full px-3 py-1.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
    >
      {item.label}
    </Link>
  );
}
