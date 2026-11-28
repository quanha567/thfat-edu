/** Purely decorative backdrop for the certificate (soft gradient, dot grid, ribbons). */
export function ExamCertificateDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
    >
      <div className="from-primary-50 via-card to-primary-50/60 absolute inset-0 bg-gradient-to-br" />
      <div className="text-primary-200/50 absolute inset-0 [background-image:radial-gradient(currentColor_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] [background-size:22px_22px]" />
      <div className="bg-primary-200/30 absolute top-[42%] left-1/2 h-[40%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

      {/* Top-left ribbon */}
      <svg
        viewBox="0 0 320 160"
        className="absolute top-0 left-0 hidden h-auto w-[22%] @3xl:block"
        fill="none"
      >
        <path d="M0 150 C10 60 120 10 260 0 L0 0 Z" className="fill-primary-600" />
        <path
          d="M0 150 C14 82 110 26 250 4"
          className="stroke-gold-500"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path d="M0 110 C20 50 100 14 190 0 L0 0 Z" className="fill-primary-700/70" />
      </svg>

      {/* Bottom-right ribbon */}
      <svg
        viewBox="0 0 320 160"
        className="absolute right-0 bottom-0 hidden h-auto w-[13%] rotate-180 @3xl:block"
        fill="none"
      >
        <path d="M0 150 C10 60 120 10 260 0 L0 0 Z" className="fill-primary-600" />
        <path
          d="M0 150 C14 82 110 26 250 4"
          className="stroke-gold-500"
          strokeWidth="9"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
