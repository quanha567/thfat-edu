// color-exception: brand logo SVG artwork; colours are the logo itself, not UI tokens.
export type TBrandLogoEmblemProps = {
  className?: string;
  size?: number;
};

export function BrandLogoEmblem({ className = "", size = 44 }: TBrandLogoEmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 overflow-visible ${className}`}
      aria-label="ThFat Edu Logo"
    >
      <defs>
        {/* Main 3D Metallic Blue Gradient */}
        <linearGradient
          id="tf-blue-primary"
          x1="20"
          y1="20"
          x2="170"
          y2="180"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#00c6ff" />
          <stop offset="30%" stopColor="#0072ff" />
          <stop offset="70%" stopColor="#0052d4" />
          <stop offset="100%" stopColor="#002b80" />
        </linearGradient>

        {/* Specular Highlight along Top Edges */}
        <linearGradient
          id="tf-blue-highlight"
          x1="40"
          y1="20"
          x2="160"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#80d0ff" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#0099ff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0044cc" stopOpacity="0" />
        </linearGradient>

        {/* Shading Depth Gradient */}
        <linearGradient
          id="tf-blue-dark"
          x1="50"
          y1="100"
          x2="150"
          y2="190"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#003d99" />
          <stop offset="100%" stopColor="#00184d" />
        </linearGradient>

        {/* Golden Swoosh & Star Gradient */}
        <linearGradient
          id="tf-gold-grad"
          x1="80"
          y1="180"
          x2="180"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="40%" stopColor="#fbbf24" />
          <stop offset="75%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        {/* Star Center Glow */}
        <radialGradient id="tf-star-glow" cx="172" cy="38" r="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="35%" stopColor="#fef08a" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>

        {/* Drop shadow filter for 3D depth */}
        <filter
          id="tf-emboss"
          x="-10%"
          y="-10%"
          width="125%"
          height="125%"
          filterUnits="userSpaceOnUse"
        >
          <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodColor="#001433" floodOpacity="0.35" />
        </filter>
      </defs>

      <g filter="url(#tf-emboss)">
        {/* Outer Circular Crest Shell (Segmented Ring) */}
        {/* Top Arc (Letter T top bar curve) */}
        <path
          d="M 38 88 C 42 54, 68 32, 100 30 C 132 32, 158 54, 162 88 L 138 88 C 135 66, 119 50, 100 48 C 81 50, 65 66, 62 88 Z"
          fill="url(#tf-blue-primary)"
        />
        {/* Top Arc Highlight Stroke */}
        <path
          d="M 40 85 C 44 56, 69 34, 100 32 C 131 34, 156 56, 160 85"
          stroke="url(#tf-blue-highlight)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Letter 'T' Body */}
        {/* Horizontal T-Bar Under Top Arc */}
        <path
          d="M 44 88 L 108 88 L 108 108 L 88 108 L 88 162 C 78 159, 68 153, 60 144 L 60 108 L 44 108 Z"
          fill="url(#tf-blue-primary)"
        />
        {/* T Stem Inner Shading */}
        <path
          d="M 72 108 L 88 108 L 88 162 C 82 160, 77 158, 72 155 Z"
          fill="url(#tf-blue-dark)"
          opacity="0.6"
        />

        {/* Letter 'F' Body */}
        {/* F Vertical Stem */}
        <path
          d="M 116 88 L 136 88 L 136 156 C 129 160, 122 162, 116 163 Z"
          fill="url(#tf-blue-primary)"
        />
        {/* F Top Bar */}
        <path
          d="M 136 88 L 166 88 C 163 94, 160 100, 156 106 L 136 106 Z"
          fill="url(#tf-blue-primary)"
        />
        {/* F Middle Bar */}
        <path
          d="M 136 118 L 158 118 C 156 123, 153 128, 150 133 L 136 133 Z"
          fill="url(#tf-blue-primary)"
        />
        {/* F Bevel Highlight */}
        <path
          d="M 116 88 L 164 88"
          stroke="url(#tf-blue-highlight)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 136 118 L 156 118"
          stroke="url(#tf-blue-highlight)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Bottom Arc Left (Curving under T) */}
        <path
          d="M 40 98 C 36 116, 42 138, 56 154 L 72 142 C 62 130, 58 114, 60 98 Z"
          fill="url(#tf-blue-primary)"
        />

        {/* Bottom Arc Right (Curving under F) */}
        <path
          d="M 160 100 C 164 116, 160 134, 150 148 L 134 136 C 140 126, 142 113, 140 100 Z"
          fill="url(#tf-blue-primary)"
        />

        {/* Golden Swoosh Ribbon (Sweeps upwards along the right) */}
        <path
          d="M 68 174 C 98 184, 138 180, 162 152 C 176 135, 184 108, 182 78 C 181 62, 178 48, 172 38 C 174 52, 172 72, 164 92 C 154 118, 134 142, 106 156 C 92 163, 78 168, 68 174 Z"
          fill="url(#tf-gold-grad)"
        />

        {/* Golden Star Glow */}
        <circle cx="172" cy="38" r="16" fill="url(#tf-star-glow)" />

        {/* 4-Pointed Golden Star */}
        <path
          d="M 172 20 Q 172 38 154 38 Q 172 38 172 56 Q 172 38 190 38 Q 172 38 172 20 Z"
          fill="#fff"
        />
        <path
          d="M 172 22 Q 172 38 156 38 Q 172 38 172 54 Q 172 38 188 38 Q 172 38 172 22 Z"
          fill="url(#tf-gold-grad)"
        />
        {/* Star Center Bright Sparkle */}
        <circle cx="172" cy="38" r="3" fill="#ffffff" />
      </g>
    </svg>
  );
}
