import Image from "next/image";

import { Section } from "./section-wrapper";

export function BrandSection() {
  return (
    <Section id="brand" title="Brand & Logo Assets">
      <p className="text-body text-neutral-600">
        Hệ thống nhận diện thương hiệu ThFat Edu bao gồm biểu tượng tròn lồng chữ TF, phiên bản logo
        đầy đủ có đường kẻ vàng kim & tagline, cùng phiên bản đảo màu cho nền tối.
      </p>

      <div className="grid gap-6 sm:grid-cols-3">
        {/* Card 1: Logo Icon */}
        <div className="flex flex-col items-center justify-between rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-xs">
          <div className="relative mb-4 flex size-36 items-center justify-center overflow-hidden rounded-xl bg-neutral-50 p-3">
            <Image
              src="/brand/logo-icon.png"
              alt="ThFat Edu Icon"
              fill
              sizes="144px"
              className="object-contain p-2"
            />
          </div>
          <div className="space-y-1">
            <p className="text-label font-bold text-neutral-900">Logo Icon / Favicon</p>
            <p className="text-caption text-neutral-400">Biểu tượng lồng TF hình tròn</p>
            <p className="text-caption text-primary-700 mt-2 font-mono">/brand/logo-icon.png</p>
          </div>
        </div>

        {/* Card 2: Logo Full */}
        <div className="flex flex-col items-center justify-between rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-xs">
          <div className="relative mb-4 flex size-36 items-center justify-center overflow-hidden rounded-xl bg-neutral-50 p-3">
            <Image
              src="/brand/logo-full.png"
              alt="ThFat Edu Full Logo"
              fill
              sizes="144px"
              className="object-contain p-2"
            />
          </div>
          <div className="space-y-1">
            <p className="text-label font-bold text-neutral-900">Logo Full (Bản chính)</p>
            <p className="text-caption text-neutral-400">Emblem + Tên + Vạch vàng + Tagline</p>
            <p className="text-caption text-primary-700 mt-2 font-mono">/brand/logo-full.png</p>
          </div>
        </div>

        {/* Card 3: Logo White (Dark Mode) */}
        <div className="border-primary-800 bg-primary-950 flex flex-col items-center justify-between rounded-2xl border p-6 text-center shadow-xs">
          <div className="bg-primary-900/50 relative mb-4 flex size-36 items-center justify-center overflow-hidden rounded-xl p-3">
            <Image
              src="/brand/logo-white.png"
              alt="ThFat Edu Dark Mode Logo"
              fill
              sizes="144px"
              className="object-contain p-2"
            />
          </div>
          <div className="space-y-1">
            <p className="text-label font-bold text-white">Logo Inverted (Nền tối)</p>
            <p className="text-caption text-primary-200">Trắng & Vàng kim trên nền Navy</p>
            <p className="text-caption text-primary-300 mt-2 font-mono">/brand/logo-white.png</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
