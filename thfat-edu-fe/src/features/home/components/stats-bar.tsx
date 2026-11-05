import { FadeInView } from "@/components/motion";

import { HOME_STATS } from "../constants/home.data";
import { StatItem } from "./stat-item";

export function StatsBar() {
  return (
    <div className="relative z-20 -mt-20 sm:-mt-24">
      {/* Radiant Glassmorphic Stats Capsule */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <FadeInView
          yOffset={30}
          duration={0.6}
          className="from-primary-800/80 via-primary-700/70 to-primary-800/80 shadow-primary-950/50 relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-r p-6 text-white shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:border-white/30 sm:rounded-3xl sm:p-8"
        >
          {/* Top Edge Specular Reflection (Glass highlight) */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          {/* Background Ambient Radial Glow inside capsule */}
          <div className="bg-highlight/15 pointer-events-none absolute -top-10 left-1/4 h-32 w-80 rounded-full blur-2xl" />
          <div className="bg-primary-400/25 pointer-events-none absolute right-1/4 -bottom-10 h-32 w-80 rounded-full blur-2xl" />

          <div className="relative z-10 grid grid-cols-1 gap-6 divide-y divide-white/20 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-y-0">
            {HOME_STATS.map((stat, idx) => (
              <StatItem key={stat.value} stat={stat} isFirst={idx === 0} />
            ))}
          </div>
        </FadeInView>
      </div>

      {/* Organic Curved Wave Transition (Nét uốn lượn lớn) */}
      <div className="pointer-events-none relative -z-10 -mt-10 w-full overflow-hidden leading-none sm:-mt-14">
        <svg
          viewBox="0 0 1440 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block h-24 w-full sm:h-36 md:h-48"
          preserveAspectRatio="none"
        >
          {/* Top Hero Deep Blue Extension */}
          <path
            d="M0 0H1440V65C1220 140 940 160 720 115C480 65 240 120 0 80V0Z"
            fill="var(--primary-800)"
          />

          {/* Luminous Cyan Wave Glow Contour (Nét uốn lượn viền phát sáng) */}
          <path
            d="M0 80C240 120 480 65 720 115C940 160 1220 140 1440 65"
            stroke="var(--color-highlight)"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Soft Primary 300 Secondary Contour */}
          <path
            d="M0 84C240 124 480 69 720 119C940 164 1220 144 1440 69"
            stroke="var(--color-primary-300)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Background entering the next section */}
          <path
            d="M0 82C240 122 480 67 720 117C940 162 1220 142 1440 67V180H0V82Z"
            fill="var(--background)"
          />
        </svg>
      </div>
    </div>
  );
}
