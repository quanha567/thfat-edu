import Image from "next/image";
import Link from "next/link";

type TBrandLogoProps = {
  className?: string;
  showSlogan?: boolean;
  showText?: boolean;
  slogan?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark";
};

const EMBLEM_SIZE_MAP = {
  sm: "h-8 w-8",
  md: "h-10 w-10 sm:h-11 sm:w-11",
  lg: "h-12 w-12 sm:h-14 sm:w-14",
} as const;

export function BrandLogo({
  className = "",
  showSlogan = true,
  showText = true,
  slogan = "Học chắc bản chất, vững vàng phòng thi",
  href = "/",
  size = "md",
  theme = "light",
}: TBrandLogoProps) {
  const emblemSizeClass = EMBLEM_SIZE_MAP[size];

  const titleColorClass = theme === "light" ? "text-neutral-900 dark:text-white" : "text-white";

  const sloganColorClass =
    theme === "light"
      ? "text-primary-700 dark:text-cyan-300 font-semibold"
      : "text-cyan-200/90 font-medium";

  const content = (
    <div className={`group flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* Circular TF Crest */}
      <div
        className={`relative shrink-0 transition-transform group-hover:scale-105 ${emblemSizeClass}`}
      >
        <Image
          src="/brand/logo-icon.png"
          alt="ThFat Edu Crest"
          fill
          sizes="64px"
          className="object-contain"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <span
            className={`text-base leading-none font-extrabold tracking-tight sm:text-lg ${titleColorClass}`}
          >
            ThFat Edu
          </span>
          {showSlogan && (
            <span
              className={`mt-1 line-clamp-1 text-[11px] tracking-normal sm:text-xs ${sloganColorClass}`}
            >
              {slogan}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}
