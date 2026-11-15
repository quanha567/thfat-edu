import { BrandLogo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HOME_FOOTER_LINKS } from "@/features/home/constants/home.data";
import Link from "next/link";

export function MainFooter() {
  return (
    <footer className="bg-primary-950 relative text-white">
      {/* Top Wave Transition Curve (Nét uốn lượn chân trang) */}
      <div className="pointer-events-none relative -mt-1 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block h-14 w-full sm:h-20 md:h-24"
          preserveAspectRatio="none"
        >
          {/* Wave body in footer navy fill */}
          <path d="M0 0C360 70 1080 70 1440 0V90H0V0Z" fill="var(--primary-950)" />
          {/* Subtle primary glow line along the wave crest */}
          <path
            d="M0 0C360 70 1080 70 1440 0"
            stroke="var(--color-primary-400)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Decorative molecular background lines */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--primary-400)_1px,transparent_1px)] [background-size:24px_24px] opacity-10"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-6 pb-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Brand with Official Asset */}
          <BrandLogo />

          {/* Navigation Links */}
          <nav className="text-body-sm text-primary-100/75 flex flex-wrap items-center justify-center gap-6">
            {HOME_FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full border-white/10 bg-white/5 text-white/80 transition-all hover:scale-105 hover:bg-white/15 hover:text-white"
            >
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full border-white/10 bg-white/5 text-white/80 transition-all hover:scale-105 hover:bg-white/15 hover:text-white"
            >
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </Button>
          </div>
        </div>

        {/* Divider & Copyright */}
        <Separator className="mt-8 bg-white/10" />
        <div className="pt-8 text-center">
          <p className="text-caption text-primary-200/60">
            © 2026 ThFat Edu. Mọi quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
