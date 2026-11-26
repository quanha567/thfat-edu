import Image from "next/image";

import { Section } from "./section-wrapper";

type TLogoSurface = {
  label: string;
  token: string;
  logo: "/brand/logo-icon.png" | "/brand/logo-white.png";
  safe: boolean;
  note: string;
  surfaceClass: string;
};

const LOGO_SURFACES: TLogoSurface[] = [
  {
    label: "Card (white)",
    token: "--card",
    logo: "/brand/logo-icon.png",
    safe: true,
    note: "Colour logo on light surfaces",
    surfaceClass: "bg-card border border-border",
  },
  {
    label: "Background",
    token: "--background",
    logo: "/brand/logo-icon.png",
    safe: true,
    note: "Colour logo on tinted page background",
    surfaceClass: "bg-background border border-border",
  },
  {
    label: "Surface dark",
    token: "--surface-dark",
    logo: "/brand/logo-icon.png",
    safe: true,
    note: "Navbar, auth hero — darkest, logo-safe",
    surfaceClass: "bg-surface-dark",
  },
  {
    label: "Surface dark mid",
    token: "--surface-dark-mid",
    logo: "/brand/logo-icon.png",
    safe: true,
    note: "Top of hero gradient — logo-safe",
    surfaceClass: "bg-surface-dark-mid",
  },
  {
    label: "Primary 700",
    token: "--primary-700",
    logo: "/brand/logo-icon.png",
    safe: false,
    note: "Do not use: logo blends into mid-blue",
    surfaceClass: "bg-primary-700",
  },
  {
    label: "Primary 700 + logo-white",
    token: "--primary-700",
    logo: "/brand/logo-white.png",
    safe: true,
    note: "Mid-blue banners use the white-outlined logo",
    surfaceClass: "bg-primary-700",
  },
];

export function LogoSurfaceSection() {
  return (
    <Section id="logo-surfaces" title="Logo × Surface">
      <p className="text-body text-neutral-600">
        Bản logo màu chỉ đặt trên nền sáng hoặc nền rất tối (<code>surface-dark</code>,{" "}
        <code>surface-dark-mid</code>). Trên mảng xanh trung bình (<code>primary-600…800</code>)
        dùng <code>logo-white</code>. Glow cyan chỉ là điểm nhấn, không phải cách sửa độ tương phản.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LOGO_SURFACES.map(({ label, token, logo, safe, note, surfaceClass }) => (
          <div key={label} className="space-y-2">
            <div
              className={`relative flex h-32 items-center justify-center rounded-xl ${surfaceClass}`}
            >
              <div className="relative size-20">
                <Image
                  src={logo}
                  alt={`Logo trên ${label}`}
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <p className="text-label text-neutral-900">
                {label}{" "}
                <span className={safe ? "text-success-700" : "text-error-600"}>
                  {safe ? "✓ safe" : "✗ avoid"}
                </span>
              </p>
              <p className="text-caption font-mono text-neutral-500">{token}</p>
              <p className="text-caption text-neutral-500">{note}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
