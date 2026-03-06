"use client";

export default function PawLogo({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main pad */}
      <ellipse cx="50" cy="62" rx="22" ry="20" fill="url(#pawGrad)" />
      {/* Top left toe */}
      <ellipse cx="28" cy="35" rx="10" ry="12" transform="rotate(-15 28 35)" fill="url(#pawGrad)" />
      {/* Top right toe */}
      <ellipse cx="72" cy="35" rx="10" ry="12" transform="rotate(15 72 35)" fill="url(#pawGrad)" />
      {/* Middle left toe */}
      <ellipse cx="36" cy="25" rx="9" ry="11" transform="rotate(-5 36 25)" fill="url(#pawGrad)" />
      {/* Middle right toe */}
      <ellipse cx="64" cy="25" rx="9" ry="11" transform="rotate(5 64 25)" fill="url(#pawGrad)" />
      {/* Magnifying glass overlay */}
      <circle cx="58" cy="55" r="16" stroke="#fff" strokeWidth="3" fill="none" opacity="0.8" />
      <line x1="70" y1="67" x2="82" y2="79" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      {/* AI sparkle */}
      <circle cx="52" cy="50" r="2" fill="#fff" opacity="0.9" />
      <circle cx="62" cy="45" r="1.5" fill="#fff" opacity="0.7" />
      <circle cx="56" cy="60" r="1.5" fill="#fff" opacity="0.7" />
      <defs>
        <linearGradient id="pawGrad" x1="20" y1="20" x2="80" y2="80">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );
}
