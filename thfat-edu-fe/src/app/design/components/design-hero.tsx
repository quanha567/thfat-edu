import { Badge } from "@/components/ui/badge";

export function DesignHero() {
  return (
    <div className="from-primary-50 to-primary-100 border-b border-neutral-200 bg-gradient-to-br via-white px-8 py-12">
      <Badge className="bg-primary-100 text-primary-700 border-primary-200 mb-4">
        Design System
      </Badge>
      <h1 className="text-display text-primary-900">ThFat Edu</h1>
      <p className="text-body-lg mt-2 max-w-xl text-neutral-600">
        Token layer, branded components, và hướng dẫn sử dụng cho nền tảng học tập trực tuyến.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5">
          <span className="bg-primary-700 size-2.5 rounded-full" />
          <span className="text-label text-neutral-700">Be Vietnam Pro</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5">
          <span className="bg-success-500 size-2.5 rounded-full" />
          <span className="text-label text-neutral-700">React 19 & Next.js 16</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5">
          <span className="bg-warning-500 size-2.5 rounded-full" />
          <span className="text-label text-neutral-700">shadcn/ui primitives</span>
        </div>
      </div>
    </div>
  );
}
