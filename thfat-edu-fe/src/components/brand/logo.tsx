import { cn } from "cn";
import * as React from "react";

export interface LogoProps extends React.SVGProps<SVGSVGElement> {
  variant?: "icon" | "horizontal" | "vertical" | "full";
  theme?: "navy" | "white" | "gold";
  size?: number | string;
  className?: string;
  showTagline?: boolean;
}

/**
 * Biểu tượng lồng chữ TF nguyên bản trong hình tròn của ThFat Edu
 */
export function LogoIcon({
  className,
  color = "currentColor",
  size = 40,
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number | string; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-label="ThFat Edu Icon"
      {...props}
    >
      {/* Vành tròn ngoài */}
      <circle cx="100" cy="100" r="88" stroke={color} strokeWidth="16" fill="none" />

      {/* Chữ T & F lồng nhau */}
      <g fill={color}>
        {/* Thanh ngang trên cùng của T và F */}
        <path
          d="M 40 70 
             C 40 50, 60 40, 100 40 
             C 140 40, 160 50, 160 70 
             L 138 70 
             C 138 58, 122 55, 100 55 
             C 78 55, 62 58, 62 70 
             Z"
        />

        {/* Cấu trúc nét TF đặc trưng */}
        {/* Nét đứng chữ T */}
        <rect x="74" y="66" width="17" height="88" rx="3" />

        {/* Thanh ngang chữ T */}
        <rect x="42" y="66" width="60" height="16" rx="3" />

        {/* Thanh đứng chữ F */}
        <rect x="108" y="66" width="17" height="88" rx="3" />

        {/* Thanh ngang trên chữ F */}
        <rect x="108" y="66" width="48" height="16" rx="3" />

        {/* Thanh ngang giữa chữ F */}
        <rect x="108" y="98" width="40" height="15" rx="3" />

        {/* Nét bo cong đối xứng ôm lấy khung tròn */}
        <path
          d="M 52 100 
             A 60 60 0 0 0 94 156 
             L 94 140 
             A 45 45 0 0 1 66 100 
             Z"
        />
        <path
          d="M 148 100 
             A 60 60 0 0 1 106 156 
             L 106 140 
             A 45 45 0 0 0 134 100 
             Z"
        />
      </g>
    </svg>
  );
}

/**
 * Component Logo toàn diện của ThFat Edu
 * Hỗ trợ các biến thể: icon, horizontal (cho Navbar), vertical/full (cho Poster, Login, Hero)
 */
export function Logo({
  variant = "horizontal",
  theme = "navy",
  size,
  className,
  showTagline = true,
}: LogoProps) {
  const isWhite = theme === "white";
  const primaryColor = isWhite ? "#FFFFFF" : "#1C3480";
  const taglineColor = isWhite ? "#CBD5E1" : "#1C3480";
  const goldColor = "#C9A448";

  // Biến thể chỉ có biểu tượng tròn (dùng cho avatar, favicon, app icon nhỏ)
  if (variant === "icon") {
    return <LogoIcon size={size ?? 40} color={primaryColor} className={className} />;
  }

  // Biến thể ngang (Navbar, Header, Footer)
  if (variant === "horizontal") {
    return (
      <div className={cn("inline-flex items-center gap-3 select-none", className)}>
        <LogoIcon size={size ?? 40} color={primaryColor} />
        <div className="flex flex-col justify-center">
          <span
            className="text-h3 leading-none font-extrabold tracking-tight"
            style={{ color: primaryColor }}
          >
            ThFat Edu
          </span>
          {showTagline && (
            <span
              className="mt-1 text-[10px] leading-none font-bold tracking-wider uppercase"
              style={{ color: taglineColor }}
            >
              Học Hóa Trực Tuyến
            </span>
          )}
        </div>
      </div>
    );
  }

  // Biến thể đứng / Full (chuẩn theo ấn phẩm gốc: Logo tròn + ThFat Edu + Gold line + Tagline)
  return (
    <div className={cn("inline-flex flex-col items-center text-center select-none", className)}>
      <LogoIcon size={size ?? 80} color={primaryColor} />

      <span
        className="text-h1 mt-3 leading-none font-black tracking-tight"
        style={{ color: primaryColor }}
      >
        ThFat Edu
      </span>

      {/* Đường kẻ ngang màu vàng gold đặc trưng */}
      <div
        className="my-2.5 h-[3px] w-full max-w-[260px] rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${goldColor}, transparent)`,
        }}
      />

      {/* Tagline chuẩn theo logo gốc */}
      {showTagline && (
        <span
          className="text-caption max-w-xs leading-snug font-bold tracking-widest uppercase"
          style={{ color: taglineColor }}
        >
          Nắm vững kiến thức - Chinh phục mọi kỳ thi
        </span>
      )}
    </div>
  );
}
