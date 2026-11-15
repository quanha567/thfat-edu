import { BrandSection } from "./components/brand-section";
import { ButtonSection } from "./components/button-section";
import { ChemistrySection } from "./components/chemistry-section";
import { ColorSection } from "./components/color-section";
import { DataSection } from "./components/data-section";
import { DesignHero } from "./components/design-hero";
import { DesignSidebar } from "./components/design-sidebar";
import { FeedbackSection } from "./components/feedback-section";
import { FormSection } from "./components/form-section";
import { NavigationSection } from "./components/navigation-section";
import { OverlaySection } from "./components/overlay-section";
import { SurfaceSection } from "./components/surface-section";
import { TypographySection } from "./components/typography-section";

export default function DesignPage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* ── Sidebar ── */}
      <DesignSidebar />

      {/* ── Main Content ── */}
      <main className="min-w-0 flex-1">
        <DesignHero />

        <div className="max-w-4xl space-y-16 px-8 py-10">
          <BrandSection />
          <ColorSection />
          <TypographySection />
          <ChemistrySection />
          <ButtonSection />
          <FormSection />
          <FeedbackSection />
          <SurfaceSection />
          <OverlaySection />
          <NavigationSection />
          <DataSection />
        </div>
      </main>
    </div>
  );
}
