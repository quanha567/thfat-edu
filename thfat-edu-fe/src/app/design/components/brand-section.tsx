import { Card } from "@/components/ui/card";
import Image from "next/image";

import { Section } from "./section-wrapper";

export function BrandSection() {
  return (
    <Section id="brand" title="Brand & Logo Assets">
      <p className="text-body text-neutral-600">
        Hệ thống nhận diện thương hiệu ThFat Edu bao gồm biểu tượng tròn lồng chữ TF, phiên bản logo
        đầy đủ có đường kẻ vàng kim & tagline, cùng phiên bản đảo màu cho nền tối.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Logo Icon */}
        <Card className="flex flex-col items-center justify-between rounded-2xl border-neutral-200 bg-white p-6 text-center shadow-xs">
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
            <p className="text-caption text-neutral-400">Biểu tượng lồng TF hình tròn & sao vàng</p>
            <p className="text-caption text-primary-700 mt-2 font-mono">/brand/logo-icon.png</p>
          </div>
        </Card>

        {/* Card 2: Logo Navbar Lockup */}
        <Card className="flex flex-col items-center justify-between rounded-2xl border-neutral-200 bg-white p-6 text-center shadow-xs">
          <div className="relative mb-4 flex h-36 w-full max-w-[200px] items-center justify-center overflow-hidden rounded-xl bg-neutral-50 p-3">
            <Image
              src="/brand/logo-nav.png"
              alt="ThFat Edu Navbar Lockup"
              fill
              sizes="200px"
              className="object-contain p-2"
            />
          </div>
          <div className="space-y-1">
            <p className="text-label font-bold text-neutral-900">Logo Navbar (Ngang)</p>
            <p className="text-caption text-neutral-400">TF Crest + ThFat Edu Typography</p>
            <p className="text-caption text-primary-700 mt-2 font-mono">/brand/logo-nav.png</p>
          </div>
        </Card>

        {/* Card 3: Logo Full */}
        <Card className="flex flex-col items-center justify-between rounded-2xl border-neutral-200 bg-white p-6 text-center shadow-xs">
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
            <p className="text-caption text-neutral-400">Emblem + Mũ tốt nghiệp + Banner ribbon</p>
            <p className="text-caption text-primary-700 mt-2 font-mono">/brand/logo-full.png</p>
          </div>
        </Card>

        {/* Card 4: Logo White / Dark Mode */}
        <Card className="border-primary-800 bg-primary-950 flex flex-col items-center justify-between rounded-2xl p-6 text-center shadow-xs">
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
            <p className="text-label font-bold text-white">Logo trên nền tối</p>
            <p className="text-caption text-primary-200">Hiển thị trong suốt trên nền Cobalt</p>
            <p className="text-caption text-primary-300 mt-2 font-mono">/brand/logo-white.png</p>
          </div>
        </Card>
      </div>
    </Section>
  );
}
