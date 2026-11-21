export function LeaderboardRibbons() {
  return (
    <div className="pointer-events-none absolute inset-x-0 -top-4 bottom-0 z-0 overflow-hidden">
      {/* Upper-left floating ribbon (above #2) */}
      <div className="animate-ribbon-drift absolute top-3 left-[8%] sm:left-[12%]">
        <svg
          viewBox="0 0 36 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-8 opacity-85 drop-shadow-sm sm:h-7 sm:w-10"
        >
          <defs>
            <linearGradient id="ribbon-gold-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="ribbon-gold-back-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>
          </defs>
          <path
            d="M8 20 C12 24 18 25 24 22 C28 20 28 15 24 12 L19 14 C22 17 21 19 18 20 C14 21 10 20 8 20 Z"
            fill="url(#ribbon-gold-back-1)"
          />
          <path
            d="M3 10 C8 5 18 6 22 11 C26 15 25 19 20 22 L22 26 C29 22 30 15 25 9 C19 3 7 2 2 6 L3 10 Z"
            fill="url(#ribbon-gold-1)"
          />
        </svg>
      </div>

      {/* Center-left ribbon streamer (between #2 and #1) */}
      <div className="animate-ribbon-drift-reverse absolute top-8 left-[30%] sm:left-[33%]">
        <svg
          viewBox="0 0 42 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-9 opacity-90 drop-shadow-md sm:h-9 sm:w-11"
        >
          <defs>
            <linearGradient id="ribbon-gold-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
            <linearGradient id="ribbon-gold-back-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9A3412" />
              <stop offset="100%" stopColor="#7C2D12" />
            </linearGradient>
          </defs>
          <path
            d="M10 24 C14 28 22 30 27 26 C31 23 31 17 26 13 L21 15 C24 18 23 21 20 23 C16 25 11 23 10 24 Z"
            fill="url(#ribbon-gold-back-2)"
          />
          <path
            d="M4 11 C10 5 20 7 25 12 C29 16 28 21 22 25 L24 30 C32 25 34 16 28 10 C21 3 8 2 2 7 L4 11 Z"
            fill="url(#ribbon-gold-2)"
          />
        </svg>
      </div>

      {/* Center-right ribbon streamer (between #1 and #3) */}
      <div className="animate-ribbon-drift absolute top-10 right-[28%] sm:right-[32%]">
        <svg
          viewBox="0 0 38 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-8 opacity-90 drop-shadow-md sm:h-8 sm:w-10"
        >
          <defs>
            <linearGradient id="ribbon-gold-3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="60%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>
          </defs>
          <path
            d="M4 8 C10 14 18 16 25 12 C30 9 32 15 28 20 C24 24 15 23 10 20 L8 24 C15 28 27 29 33 22 C38 15 34 6 27 9 C22 12 15 10 8 4 L4 8 Z"
            fill="url(#ribbon-gold-3)"
          />
        </svg>
      </div>

      {/* Far-right floating ribbon (above #3) */}
      <div className="animate-ribbon-drift-reverse absolute top-4 right-[8%] sm:right-[12%]">
        <svg
          viewBox="0 0 32 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-7 opacity-80 drop-shadow-sm sm:h-6 sm:w-8"
        >
          <path
            d="M3 6 C7 2 15 3 19 8 C23 12 22 16 17 19 L19 22 C25 18 26 12 21 7 C16 2 6 1 2 4 L3 6 Z"
            fill="url(#ribbon-gold-1)"
          />
        </svg>
      </div>
    </div>
  );
}
