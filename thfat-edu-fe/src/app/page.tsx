import { MainFooter, MainNavbar } from "@/components/layout";
import {
  AboutPreviewSection,
  CtaSection,
  ExamInfoSection,
  FeaturesSection,
  HeroSection,
  LeaderboardPreviewSection,
  StatsBar,
} from "@/features/home/components";

export default function HomePage() {
  return (
    <div className="bg-background text-foreground selection:bg-primary-600 flex min-h-screen flex-col selection:text-white">
      {/* Shared Navigation Header */}
      <MainNavbar />

      <main className="flex-1">
        {/* Hero Banner with Teacher Visual & Molecular Effects */}
        <HeroSection />

        {/* Floating Metrics Bar with Giant Organic Wave Transition */}
        <StatsBar />

        {/* 4 Feature Highlights */}
        <FeaturesSection />

        {/* Detailed Sections Grid */}
        <section className="bg-background pb-20 md:pb-24">
          <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
            {/* Row 1: About ThFat Edu & Leaderboard Preview */}
            <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
              <div className="flex flex-col lg:col-span-7">
                <AboutPreviewSection />
              </div>
              <div className="flex flex-col lg:col-span-5">
                <LeaderboardPreviewSection />
              </div>
            </div>

            {/* Row 2: Exam Structure & Ready CTA Banner */}
            <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
              <div className="flex flex-col lg:col-span-7">
                <ExamInfoSection />
              </div>
              <div className="flex flex-col lg:col-span-5">
                <CtaSection />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Shared Footer with Bottom Wave Transition */}
      <MainFooter />
    </div>
  );
}
