"use client";

import { BrandLogo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { HOME_NAV_LINKS } from "@/features/home/constants/home.data";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { MobileNavSheet, type TMobileNavHandle } from "./mobile-nav-sheet";
import { NavbarAuthAction } from "./navbar-auth-action";
import { NavbarItem } from "./navbar-item";

export function MainNavbar() {
  const pathname = usePathname();
  const mobileNavRef = useRef<TMobileNavHandle>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Transparent floating navbar only on landing homepage when at top of hero.
  // On all other routes (exams, articles, leaderboard, 404, etc.), use the solid brand navy header.
  const isLandingHome = pathname === "/";
  const isTransparent = isLandingHome && !isScrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 ${
        isTransparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-white/10 bg-[#061845]/95 shadow-md backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <BrandLogo theme="dark" showSlogan={true} size="md" />

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
