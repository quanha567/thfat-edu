import { FadeInView } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Play } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#071d49] via-[#0b2f77] to-[#0f3d99] pt-24 pb-36 text-white sm:pt-28 md:pt-32 md:pb-44">
      {/* Integrated Hero Teacher/Student Visual (Seamless blend with Alpha Masking) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* The Visual Image with CSS Alpha Mask for zero-seam feathering */}
        <div
          className="absolute inset-y-0 right-0 w-full bg-cover bg-[center_top] bg-no-repeat lg:w-[62%] lg:bg-[right_center] xl:w-[58%]"
          style={{
            backgroundImage: "url('/images/home/hero-teacher-banner.jpg')",
            maskImage:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 20%, black 55%), linear-gradient(to bottom, black 70%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 20%, black 55%), linear-gradient(to bottom, black 70%, transparent 100%)",
            maskComposite: "intersect",
            WebkitMaskComposite: "destination-in",
          }}
        />

        {/* Left smooth solid fade ensuring 100% crisp text readability */}
        <div className="absolute inset-y-0 left-0 hidden w-[55%] bg-gradient-to-r from-[#071d49] via-[#071d49]/90 to-transparent lg:block" />

        {/* Mobile dark overlay so text is easy to read on small screens */}
        <div className="absolute inset-0 bg-[#071d49]/80 lg:hidden" />

        {/* Soft Ambient Cyan Chemistry Luminous Bloom */}
        <div className="pointer-events-none absolute top-1/3 right-1/4 h-[420px] w-[420px] rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="bg-primary-500/15 pointer-events-none absolute top-1/4 left-1/4 h-80 w-80 rounded-full blur-3xl" />

        {/* Delicate SVG Hexagonal Chemical Molecular Structures */}
        <svg
          className="absolute top-20 right-[30%] hidden h-48 w-48 text-cyan-300/20 md:block"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <polygon points="50,12 82,30 82,68 50,86 18,68 18,30" />
          <line x1="50" y1="12" x2="50" y2="35" strokeDasharray="3 3" />
          <circle cx="50" cy="12" r="3" fill="currentColor" />
          <circle cx="82" cy="30" r="3" fill="currentColor" />
          <circle cx="82" cy="68" r="3" fill="currentColor" />
          <circle cx="50" cy="86" r="3" fill="currentColor" />
          <circle cx="18" cy="68" r="3" fill="currentColor" />
          <circle cx="18" cy="30" r="3" fill="currentColor" />
        </svg>

        {/* Second floating molecule */}
        <svg
          className="absolute bottom-28 left-[6%] hidden h-28 w-28 text-white/10 md:block"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <circle cx="50" cy="50" r="18" strokeDasharray="3 3" />
          <circle cx="50" cy="22" r="3" fill="currentColor" />
          <circle cx="76" cy="64" r="3" fill="currentColor" />
          <circle cx="24" cy="64" r="3" fill="currentColor" />
        </svg>
      </div>

      {/* Main Content (Z-10 over the integrated background) */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Heading, Badge, and CTAs */}
          <FadeInView duration={0.6} className="flex flex-col items-start space-y-6 lg:col-span-7">
            {/* Main Headline */}
            <h1 className="text-display font-extrabold tracking-tight text-white">
              Ôn luyện có trọng tâm <br />
              <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-cyan-100 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,210,255,0.25)]">
                Vững vàng môn Hóa
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-body sm:text-body-lg text-primary-100/90 max-w-xl leading-relaxed">
              Đề thi bám sát cấu trúc V-SAT kèm lời giải chi tiết từng bước, giúp bạn xác định đúng
              điểm yếu và cải thiện điểm số mỗi ngày.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Eye-catching Animated CTA Button */}
              <div className="group/btn relative inline-flex">
                {/* Luminous Pulsing Aura */}
                <span className="animate-pulse-aura from-primary-400 absolute -inset-1 -z-10 rounded-full bg-gradient-to-r via-cyan-400 to-sky-400 opacity-70 blur-md transition-opacity duration-300 group-hover/btn:opacity-100" />

                <Button
                  asChild
                  size="lg"
                  className="relative overflow-hidden rounded-full bg-gradient-to-r from-[#0052e0] via-[#0070f3] to-[#00c6ff] px-7 py-3.5 text-base font-bold text-white shadow-[0_4px_20px_rgba(0,110,255,0.45)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_6px_28px_rgba(0,190,255,0.65)] active:scale-[0.98]"
                >
                  <Link href="/exams" className="flex items-center gap-2.5">
                    {/* Shimmer Light Reflection Sweep */}
                    <span className="animate-shimmer pointer-events-none absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/35 to-transparent" />

                    {/* Play Badge Icon */}
                    <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/25 shadow-2xs backdrop-blur-xs transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:bg-white">
                      <Play className="group-hover/btn:fill-primary-600 group-hover/btn:text-primary-600 h-3.5 w-3.5 fill-white text-white transition-colors duration-300" />
                    </span>

                    <span className="relative z-10 font-bold tracking-tight">Làm bài thi thử</span>

                    {/* Arrow right sliding on hover */}
                    <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                  </Link>
                </Button>
              </div>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-base font-medium text-white backdrop-blur-md transition-all hover:bg-white/20 hover:text-white"
              >
                <Link href="#features" className="flex items-center gap-2">
                  <span>Tìm hiểu thêm</span>
                  <ChevronDown className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeInView>

          {/* Right Column Spacer for Desktop grid alignment */}
          <div className="hidden h-96 lg:col-span-5 lg:block" />
        </div>
      </div>
    </section>
  );
}
