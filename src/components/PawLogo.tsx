"use client";

export default function PawLogo({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="PawsitiveID logo"
    >
      {/* Dog paw print - Phosphor Icons (MIT license) */}
      <path
        d="M240,108a28,28,0,1,1-28-28A28.1,28.1,0,0,1,240,108ZM72,108a28,28,0,1,0-28,28A28.1,28.1,0,0,0,72,108ZM92,88A28,28,0,1,0,64,60,28.1,28.1,0,0,0,92,88Zm72,0a28,28,0,1,0-28-28A28.1,28.1,0,0,0,164,88Zm23.1,60.8a35.3,35.3,0,0,1-16.9-21.1,43.9,43.9,0,0,0-84.4,0A35.5,35.5,0,0,1,69,148.8,40,40,0,0,0,88,224a40.5,40.5,0,0,0,15.5-3.1,64.2,64.2,0,0,1,48.9-.1A39.6,39.6,0,0,0,168,224a40,40,0,0,0,19.1-75.2Z"
        fill="url(#pawGrad)"
      />
      {/* Magnifying glass overlay */}
      <circle cx="168" cy="164" r="42" stroke="var(--paw-glass, #1e293b)" strokeWidth="8" fill="none" opacity="0.85" />
      <line x1="198" y1="194" x2="226" y2="222" stroke="var(--paw-glass, #1e293b)" strokeWidth="10" strokeLinecap="round" opacity="0.85" />
      {/* AI sparkles */}
      <circle cx="155" cy="152" r="5" fill="var(--paw-glass, #1e293b)" opacity="0.8" />
      <circle cx="178" cy="148" r="4" fill="var(--paw-glass, #1e293b)" opacity="0.6" />
      <circle cx="162" cy="176" r="4" fill="var(--paw-glass, #1e293b)" opacity="0.6" />
      <defs>
        <linearGradient id="pawGrad" x1="30" y1="30" x2="230" y2="230">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );
}
