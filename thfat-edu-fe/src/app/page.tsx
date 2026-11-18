import { MainFooter, MainNavbar } from "@/components/layout";
import {
  AboutPreviewSection,
  ArticlesPreviewSection,
  CtaSection,
  FeaturesSection,
  HeroSection,
  LeaderboardPreviewSection,
  StatsBar,
} from "@/features/home/components";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary-600 selection:text-white">
      {/* Shared Navigation Header */}
      <MainNavbar />

      <main className="flex-1">
        {/* Hero Banner with Teacher Visual & Molecular Effects */}
        <HeroSection />

        {/* Floating Metrics Bar with Giant Organic Wave Transition */}
        <StatsBar />

        {/* 4 Feature Highlights */}
        <FeaturesSection />

        {/* Core Spotlight: About ThFat Edu & Leaderboard Preview */}
        <section className="bg-background pb-12 md:pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
              <div className="flex flex-col lg:col-span-7">
                <AboutPreviewSection />
              </div>
              <div className="flex flex-col lg:col-span-5">
                <LeaderboardPreviewSection />
              </div>
            </div>
          </div>
        </section>

        {/* Latest Articles & News */}
        <ArticlesPreviewSection />

        {/* Rocket CTA Banner */}
        <section className="bg-background pb-20 md:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <CtaSection />
          </div>
        </section>
      </main>

      {/* Shared Footer */}
      <MainFooter />
    </div>
  );
}
