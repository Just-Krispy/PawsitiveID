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
      {/* Main pad */}
      <ellipse cx="50" cy="68" rx="18" ry="16" fill="url(#pawGrad)" />
      {/* Outer left toe */}
      <ellipse cx="22" cy="38" rx="9" ry="11" transform="rotate(-20 22 38)" fill="url(#pawGrad)" />
      {/* Outer right toe */}
      <ellipse cx="78" cy="38" rx="9" ry="11" transform="rotate(20 78 38)" fill="url(#pawGrad)" />
      {/* Inner left toe */}
      <ellipse cx="38" cy="26" rx="8" ry="10" transform="rotate(-8 38 26)" fill="url(#pawGrad)" />
      {/* Inner right toe */}
      <ellipse cx="62" cy="26" rx="8" ry="10" transform="rotate(8 62 26)" fill="url(#pawGrad)" />
      {/* Magnifying glass overlay */}
      <circle cx="60" cy="60" r="16" stroke="#fff" strokeWidth="3" fill="none" opacity="0.8" />
      <line x1="72" y1="72" x2="84" y2="84" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      {/* AI sparkle */}
      <circle cx="55" cy="55" r="2" fill="#fff" opacity="0.9" />
      <circle cx="64" cy="52" r="1.5" fill="#fff" opacity="0.7" />
      <circle cx="58" cy="65" r="1.5" fill="#fff" opacity="0.7" />
      <defs>
        <linearGradient id="pawGrad" x1="20" y1="20" x2="80" y2="80">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );
}
