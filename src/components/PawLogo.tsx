"use client";

export default function PawLogo({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="PawsitiveID logo"
    >
      {/* Main metacarpal pad - wide blob, two humps on top, rounded bottom */}
      <path
        d="M32 52 C28 52, 22 58, 22 66 C22 76, 30 84, 42 84 C46 84, 48 82, 50 78 C52 82, 54 84, 58 84 C70 84, 78 76, 78 66 C78 58, 72 52, 68 52 C64 52, 60 56, 56 56 C54 56, 52 54, 50 54 C48 54, 46 56, 44 56 C40 56, 36 52, 32 52Z"
        fill="url(#pawGrad)"
      />
      {/* Outer left toe */}
      <ellipse cx="22" cy="34" rx="9" ry="12" transform="rotate(-20 22 34)" fill="url(#pawGrad)" />
      {/* Inner left toe - larger, higher */}
      <ellipse cx="39" cy="24" rx="9.5" ry="13" transform="rotate(-8 39 24)" fill="url(#pawGrad)" />
      {/* Inner right toe - larger, higher */}
      <ellipse cx="61" cy="24" rx="9.5" ry="13" transform="rotate(8 61 24)" fill="url(#pawGrad)" />
      {/* Outer right toe */}
      <ellipse cx="78" cy="34" rx="9" ry="12" transform="rotate(20 78 34)" fill="url(#pawGrad)" />
      {/* Magnifying glass overlay */}
      <circle cx="63" cy="62" r="16" stroke="var(--paw-glass, #1e293b)" strokeWidth="3" fill="none" opacity="0.85" />
      <line x1="75" y1="74" x2="87" y2="86" stroke="var(--paw-glass, #1e293b)" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      {/* AI sparkles */}
      <circle cx="58" cy="57" r="2" fill="var(--paw-glass, #1e293b)" opacity="0.8" />
      <circle cx="67" cy="54" r="1.5" fill="var(--paw-glass, #1e293b)" opacity="0.6" />
      <circle cx="61" cy="67" r="1.5" fill="var(--paw-glass, #1e293b)" opacity="0.6" />
      <defs>
        <linearGradient id="pawGrad" x1="20" y1="20" x2="80" y2="80">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );
}
