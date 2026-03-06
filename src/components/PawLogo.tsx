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
      {/* Main metacarpal pad - wide rounded shape with tri-lobe top */}
      <path
        d="M50 48 C40 48, 30 50, 25 56 C20 62, 20 70, 25 76 C30 82, 38 85, 44 83 C47 82, 49 79, 50 76 C51 79, 53 82, 56 83 C62 85, 70 82, 75 76 C80 70, 80 62, 75 56 C70 50, 60 48, 50 48Z"
        fill="url(#pawGrad)"
      />
      {/* Outer left toe - tilted outward */}
      <ellipse cx="20" cy="32" rx="8" ry="12" transform="rotate(-25 20 32)" fill="url(#pawGrad)" />
      {/* Inner left toe */}
      <ellipse cx="37" cy="22" rx="7.5" ry="11" transform="rotate(-10 37 22)" fill="url(#pawGrad)" />
      {/* Inner right toe */}
      <ellipse cx="63" cy="22" rx="7.5" ry="11" transform="rotate(10 63 22)" fill="url(#pawGrad)" />
      {/* Outer right toe - tilted outward */}
      <ellipse cx="80" cy="32" rx="8" ry="12" transform="rotate(25 80 32)" fill="url(#pawGrad)" />
      {/* Magnifying glass overlay */}
      <circle cx="62" cy="60" r="16" stroke="var(--paw-glass, #1e293b)" strokeWidth="3" fill="none" opacity="0.85" />
      <line x1="74" y1="72" x2="86" y2="84" stroke="var(--paw-glass, #1e293b)" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      {/* AI sparkles */}
      <circle cx="57" cy="55" r="2" fill="var(--paw-glass, #1e293b)" opacity="0.8" />
      <circle cx="66" cy="52" r="1.5" fill="var(--paw-glass, #1e293b)" opacity="0.6" />
      <circle cx="60" cy="65" r="1.5" fill="var(--paw-glass, #1e293b)" opacity="0.6" />
      <defs>
        <linearGradient id="pawGrad" x1="20" y1="20" x2="80" y2="80">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );
}
