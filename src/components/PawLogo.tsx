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
      {/* Main pad - tri-lobe heart shape */}
      <path
        d="M50 45 C38 45, 24 52, 24 64 C24 74, 32 82, 40 82 C44 82, 47 80, 50 76 C53 80, 56 82, 60 82 C68 82, 76 74, 76 64 C76 52, 62 45, 50 45Z"
        fill="url(#pawGrad)"
      />
      {/* Outer left toe */}
      <ellipse cx="24" cy="34" rx="9" ry="12" transform="rotate(-15 24 34)" fill="url(#pawGrad)" />
      {/* Inner left toe */}
      <ellipse cx="40" cy="24" rx="8" ry="11" transform="rotate(-5 40 24)" fill="url(#pawGrad)" />
      {/* Inner right toe */}
      <ellipse cx="60" cy="24" rx="8" ry="11" transform="rotate(5 60 24)" fill="url(#pawGrad)" />
      {/* Outer right toe */}
      <ellipse cx="76" cy="34" rx="9" ry="12" transform="rotate(15 76 34)" fill="url(#pawGrad)" />
      {/* Magnifying glass overlay */}
      <circle cx="62" cy="60" r="16" stroke="#fff" strokeWidth="3" fill="none" opacity="0.8" />
      <line x1="74" y1="72" x2="86" y2="84" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      {/* AI sparkles */}
      <circle cx="57" cy="55" r="2" fill="#fff" opacity="0.9" />
      <circle cx="66" cy="52" r="1.5" fill="#fff" opacity="0.7" />
      <circle cx="60" cy="65" r="1.5" fill="#fff" opacity="0.7" />
      <defs>
        <linearGradient id="pawGrad" x1="20" y1="20" x2="80" y2="80">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );
}
