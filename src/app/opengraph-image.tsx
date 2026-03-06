import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PawsitiveID - AI-Powered Lost Pet Matching";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Paw icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 100 100"
            fill="none"
          >
            <path d="M50 48 C40 48, 30 50, 25 56 C20 62, 20 70, 25 76 C30 82, 38 85, 44 83 C47 82, 49 79, 50 76 C51 79, 53 82, 56 83 C62 85, 70 82, 75 76 C80 70, 80 62, 75 56 C70 50, 60 48, 50 48Z" fill="url(#g)" />
            <ellipse cx="20" cy="32" rx="8" ry="12" transform="rotate(-25 20 32)" fill="url(#g)" />
            <ellipse cx="37" cy="22" rx="7.5" ry="11" transform="rotate(-10 37 22)" fill="url(#g)" />
            <ellipse cx="63" cy="22" rx="7.5" ry="11" transform="rotate(10 63 22)" fill="url(#g)" />
            <ellipse cx="80" cy="32" rx="8" ry="12" transform="rotate(25 80 32)" fill="url(#g)" />
            <circle cx="62" cy="60" r="16" stroke="#fff" strokeWidth="3" fill="none" opacity="0.8" />
            <line x1="74" y1="72" x2="86" y2="84" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
            <defs>
              <linearGradient id="g" x1="20" y1="20" x2="80" y2="80">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <h1
            style={{
              fontSize: "72px",
              fontWeight: 800,
              background: "linear-gradient(135deg, #f97316, #f59e0b)",
              backgroundClip: "text",
              color: "transparent",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            PawsitiveID
          </h1>
          <p
            style={{
              fontSize: "32px",
              color: "#e2e8f0",
              margin: 0,
              fontWeight: 500,
            }}
          >
            Found a stray? Help them find home.
          </p>
          <p
            style={{
              fontSize: "20px",
              color: "#94a3b8",
              margin: "8px 0 0 0",
            }}
          >
            AI-Powered Photo Analysis &bull; Shelter Search &bull; Lost Pet Matching
          </p>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #f97316, #f59e0b, #f97316)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
