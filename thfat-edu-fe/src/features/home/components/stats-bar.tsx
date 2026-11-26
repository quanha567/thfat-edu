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
          className="from-primary-600/85 via-primary-500/80 to-primary-500/85 relative overflow-hidden rounded-2xl border border-white/30 bg-gradient-to-r p-6 text-white shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-white/40 sm:rounded-3xl sm:p-7"
        >
          {/* Top Edge Specular Reflection */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          {/* Ambient inner soft cyan glow */}
          <div className="pointer-events-none absolute -top-10 left-1/4 h-32 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 gap-6 divide-y divide-white/20 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-y-0">
            {HOME_STATS.map((stat, idx) => (
              <StatItem key={stat.value} stat={stat} isFirst={idx === 0} />
            ))}
          </div>
        </FadeInView>
      </div>

      {/* Organic Curved Wave Transition */}
      <div className="pointer-events-none relative -z-10 -mt-10 w-full overflow-hidden leading-none sm:-mt-14">
        <svg
          viewBox="0 0 1440 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block h-24 w-full sm:h-36 md:h-48"
          preserveAspectRatio="none"
        >
          {/* Top Hero Blue Extension (Seamlessly matches Hero bottom) */}
          <path
            d="M0 0H1440V65C1220 140 940 160 720 115C480 65 240 120 0 80V0Z"
            className="fill-primary-700"
          />

          {/* Delicate single curve contour */}
          <path
            d="M0 80C240 120 480 65 720 115C940 160 1220 140 1440 65"
            stroke="currentColor"
            className="text-white/25"
            strokeWidth="1.5"
            strokeLinecap="round"
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
