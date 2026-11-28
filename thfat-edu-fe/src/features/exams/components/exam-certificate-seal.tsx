import { useId } from "react";

/** Circular "dấu mộc" seal: double ring, curved text and a centre star. */
export function ExamCertificateSeal() {
  const pathId = `seal-text-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox="0 0 120 120"
      className="text-primary-700 h-24 w-24 shrink-0 -rotate-12 opacity-90 @3xl:h-28 @3xl:w-28"
      fill="none"
      stroke="currentColor"
    >
      <title>Dấu mộc xác nhận ThFat Edu</title>
      <circle cx="60" cy="60" r="57" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="52" strokeWidth="1" />
      <circle cx="60" cy="60" r="29" strokeWidth="1.5" />
      <defs>
        <path id={pathId} d="M60 60 m-40 0 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0" />
      </defs>
      <text fill="currentColor" stroke="none" fontSize="11" fontWeight="700" letterSpacing="2.2">
        <textPath href={`#${pathId}`} startOffset="0">
          THFAT EDU • XÁC NHẬN KẾT QUẢ •
        </textPath>
      </text>
      <polygon
        points="60,38 65.3,53.2 81.4,53.6 68.6,63.3 73.2,78.7 60,69.6 46.8,78.7 51.4,63.3 38.6,53.6 54.7,53.2"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
