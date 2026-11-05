"use client";

import { BrandLogo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { HOME_NAV_LINKS } from "@/features/home/constants/home.data";
import { Menu } from "lucide-react";
import { useRef } from "react";

import { MobileNavSheet, type TMobileNavHandle } from "./mobile-nav-sheet";
import { NavbarAuthAction } from "./navbar-auth-action";
import { NavbarItem } from "./navbar-item";

export function MainNavbar() {
  const mobileNavRef = useRef<TMobileNavHandle>(null);

  return (
    <header className="bg-primary-950/90 sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <BrandLogo />

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex lg:gap-2">
          {HOME_NAV_LINKS.map((item) => (
            <NavbarItem key={item.label} item={item} />
          ))}
        </nav>

        {/* Desktop Right Action */}
        <div className="hidden items-center gap-3 md:flex">
          <NavbarAuthAction />
        </div>

        {/* Mobile Hamburger Trigger */}
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => mobileNavRef.current?.toggle()}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Mở menu</span>
          </Button>

          {/* Imperatively Controlled Mobile Drawer */}
          <MobileNavSheet ref={mobileNavRef} />
        </div>
      </div>
    </header>
  );
}
