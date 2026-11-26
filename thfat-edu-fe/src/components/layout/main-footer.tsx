import { BrandLogo } from "@/components/brand";
import { SocialIcon } from "@/components/icons/social-icon";
import { Separator } from "@/components/ui/separator";
import { HOME_FOOTER_LINKS } from "@/features/home/constants/home.data";
import { SOCIAL_FIELDS } from "@/features/settings/constants/site-info.constants";
import { getSiteInfo } from "@/features/settings/server/get-site-info";
import { cacheLife } from "next/cache";
import Link from "next/link";

async function getCurrentYear(): Promise<number> {
  "use cache";

  cacheLife("days");

  return new Date().getFullYear();
}

export async function MainFooter() {
  const [siteInfo, year] = await Promise.all([getSiteInfo(), getCurrentYear()]);

  const socialLinks = SOCIAL_FIELDS.map((field) => ({
    name: field.name,
    label: field.label,
    href: siteInfo[field.name],
  })).filter((link) => link.href !== "");

  return (
    <footer className="relative border-t border-neutral-200/80 bg-white text-neutral-900 dark:border-white/10 dark:bg-neutral-950 dark:text-white">
      {/* Decorative subtle molecular background watermarks */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-30">
        <svg
          className="text-primary-300 absolute -bottom-8 left-4 h-48 w-48"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" />
          <circle cx="50" cy="15" r="3" fill="currentColor" />
          <circle cx="80" cy="32" r="3" fill="currentColor" />
          <circle cx="80" cy="68" r="3" fill="currentColor" />
          <circle cx="50" cy="85" r="3" fill="currentColor" />
          <circle cx="20" cy="68" r="3" fill="currentColor" />
          <circle cx="20" cy="32" r="3" fill="currentColor" />
        </svg>

        <svg
          className="text-primary-200 absolute right-8 -bottom-10 h-56 w-56"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <circle cx="50" cy="50" r="28" strokeDasharray="3 3" />
          <circle cx="50" cy="22" r="3.5" fill="currentColor" />
          <circle cx="75" cy="65" r="3.5" fill="currentColor" />
          <circle cx="25" cy="65" r="3.5" fill="currentColor" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-10 pb-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand with Light Theme */}
          <BrandLogo theme="light" showSlogan={siteInfo.slogan !== ""} slogan={siteInfo.slogan} />

          {/* Navigation Links */}
          <nav className="text-body-sm flex flex-wrap items-center justify-center gap-4 text-neutral-600 sm:gap-6 dark:text-neutral-300">
            {HOME_FOOTER_LINKS.map((link, idx) => (
              <div key={link.label} className="flex items-center gap-4 sm:gap-6">
                <Link
                  href={link.href}
                  className="hover:text-primary-600 font-medium transition-colors dark:hover:text-cyan-400"
                >
                  {link.label}
                </Link>
                {idx < HOME_FOOTER_LINKS.length - 1 && (
                  <span className="text-neutral-300 select-none dark:text-neutral-700">|</span>
                )}
              </div>
            ))}
          </nav>

          {/* Contact & Social Links */}
          {(socialLinks.length > 0 || siteInfo.contactEmail !== "") && (
            <div className="text-body-sm flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-neutral-600 dark:text-neutral-300">
              {siteInfo.contactEmail !== "" && (
                <a
                  href={`mailto:${siteInfo.contactEmail}`}
                  className="hover:text-primary-600 font-medium transition-colors dark:hover:text-cyan-400"
                >
                  {siteInfo.contactEmail}
                </a>
              )}
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-1">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      title={link.label}
                      className="hover:bg-primary-50 hover:text-primary-700 focus-visible:ring-ring flex size-9 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none dark:hover:bg-white/10 dark:hover:text-cyan-400"
                    >
                      <SocialIcon name={link.name} className="size-5" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider & Copyright */}
        <Separator className="mt-8 bg-neutral-200 dark:bg-white/10" />
        <div className="pt-6 text-center">
          <p className="text-caption text-neutral-500 dark:text-neutral-400">
            © {year} {siteInfo.siteName}. Mọi quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
