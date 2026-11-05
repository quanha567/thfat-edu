import { FadeInView } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Play } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="from-primary-950 via-primary-900 to-primary-800 relative overflow-hidden bg-gradient-to-b pt-12 pb-36 text-white md:pt-20 md:pb-44">
      {/* Integrated Hero Teacher Visual (Seamless blend with Alpha Masking) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* The Teacher Image with CSS Alpha Mask for zero-seam feathering */}
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
        <div className="from-primary-950 via-primary-950/95 absolute inset-y-0 left-0 hidden w-[55%] bg-gradient-to-r to-transparent lg:block" />

        {/* Mobile dark overlay so text is easy to read on small screens */}
        <div className="bg-primary-950/80 absolute inset-0 lg:hidden" />

        {/* Ambient glow orbs */}
        <div className="bg-highlight/15 absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-primary-500/20 absolute top-1/3 right-1/4 h-[420px] w-[420px] rounded-full blur-3xl" />

        {/* Chemical formula watermark: H2SO4 with subscript */}
        <div className="text-primary-200/20 absolute top-10 right-[38%] hidden items-baseline font-black tracking-widest select-none md:flex">
          <span className="text-6xl font-bold">H</span>
          <span className="text-3xl font-bold">2</span>
          <span className="text-6xl font-bold">SO</span>
          <span className="text-3xl font-bold">4</span>
        </div>

        {/* SVG Hexagonal Chemical Molecular Structures */}
        <svg
          className="text-primary-300/20 absolute top-20 right-[30%] hidden h-48 w-48 md:block"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" />
          <circle cx="50" cy="10" r="3.5" fill="currentColor" />
          <circle cx="85" cy="30" r="3.5" fill="currentColor" />
          <circle cx="85" cy="70" r="3.5" fill="currentColor" />
          <circle cx="50" cy="90" r="3.5" fill="currentColor" />
          <circle cx="15" cy="70" r="3.5" fill="currentColor" />
          <circle cx="15" cy="30" r="3.5" fill="currentColor" />
        </svg>
      </div>

      {/* Main Content (Z-10 over the integrated background) */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Heading, Curved Underline, and CTAs */}
          <FadeInView duration={0.6} className="flex flex-col items-start space-y-6 lg:col-span-7">
            {/* Main Headline */}
            <h1 className="text-h1 lg:text-display font-extrabold tracking-tight">
              Bứt phá điểm số <br />
              Chinh phục{" "}
              <span className="text-highlight relative inline-block">
                môn Hóa
                {/* Hand-drawn curved underline swoosh wave */}
                <svg
                  className="absolute -bottom-2 left-0 w-full overflow-visible"
                  height="14"
                  viewBox="0 0 160 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 10C45 2 115 1 157 9"
                    stroke="var(--color-highlight)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M25 12C68 5 120 5 150 11"
                    stroke="var(--color-primary-300)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-body sm:text-body-lg text-primary-100/90 max-w-xl leading-relaxed">
              Nền tảng luyện thi V-SAT môn Hóa học hiện đại, giúp bạn làm quen đề thi, rèn luyện kỹ
              năng và đạt kết quả cao nhất.
            </p>

            {/* Action Buttons: Pill shapes per design */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary-800 shadow-primary-950/40 rounded-full px-7 py-3 text-base font-semibold shadow-lg transition-all hover:scale-105"
              >
                <Link href="/exams" className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <Play className="h-3 w-3 fill-white text-white" />
                  </span>
                  <span>Thi thử ngay</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-white/25 bg-white/5 px-6 text-white backdrop-blur-sm transition-all hover:bg-white/15 hover:text-white"
              >
                <Link href="#about" className="flex items-center gap-2">
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
