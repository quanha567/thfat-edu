import Image from "next/image";
import Link from "next/link";

type TBrandLogoProps = {
  className?: string;
  showSlogan?: boolean;
  slogan?: string;
  href?: string;
};

export function BrandLogo({
  className = "",
  showSlogan = true,
  slogan = "Học Hóa – Luyện Thi V-SAT",
  href = "/",
}: TBrandLogoProps) {
  const content = (
    <div className={`group flex items-center gap-3 ${className}`}>
      <div className="ring-primary-400/30 relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 transition-transform group-hover:scale-105">
        <Image
          src="/brand/logo-icon.png"
          alt="ThFat Edu Logo"
          fill
          sizes="40px"
          className="object-contain"
        />
      </div>

      <div className="flex flex-col">
        <span className="text-base leading-tight font-bold tracking-tight text-white">
          ThFat Edu
        </span>
        {showSlogan && (
          <span className="text-caption text-primary-200/80 font-medium">{slogan}</span>
        )}
      </div>
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
