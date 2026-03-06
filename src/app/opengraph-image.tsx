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
            <path d="M32 52 C28 52, 22 58, 22 66 C22 76, 30 84, 42 84 C46 84, 48 82, 50 78 C52 82, 54 84, 58 84 C70 84, 78 76, 78 66 C78 58, 72 52, 68 52 C64 52, 60 56, 56 56 C54 56, 52 54, 50 54 C48 54, 46 56, 44 56 C40 56, 36 52, 32 52Z" fill="url(#g)" />
            <ellipse cx="22" cy="34" rx="9" ry="12" transform="rotate(-20 22 34)" fill="url(#g)" />
            <ellipse cx="39" cy="24" rx="9.5" ry="13" transform="rotate(-8 39 24)" fill="url(#g)" />
            <ellipse cx="61" cy="24" rx="9.5" ry="13" transform="rotate(8 61 24)" fill="url(#g)" />
            <ellipse cx="78" cy="34" rx="9" ry="12" transform="rotate(20 78 34)" fill="url(#g)" />
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
