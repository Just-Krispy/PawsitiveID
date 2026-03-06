"use client";

import { useRef, useCallback, useState } from "react";
import { renderFlyerToCanvas } from "@/lib/flyer-canvas";
import type { FlyerProfile } from "@/lib/flyer-canvas";

interface FlyerGeneratorProps {
  profile: FlyerProfile;
  photoPreview: string;
  location: string;
  profileId?: string | null;
}

export default function FlyerGenerator({
  profile,
  photoPreview,
  location,
  profileId,
}: FlyerGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [generating, setGenerating] = useState(false);

  const generateFlyer = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setGenerating(true);

    await renderFlyerToCanvas(canvas, {
      profile,
      photoPreview,
      location,
      profileId,
      contactName,
      contactPhone,
      contactEmail,
    });

    const link = document.createElement("a");
    link.download = "PawsitiveID-Found-Dog-Flyer.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    setGenerating(false);
  }, [profile, photoPreview, location, profileId, contactName, contactPhone, contactEmail]);

  return (
    <div className="glass-card p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold gradient-text mb-2">
          Generate Flyer
        </h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Create a printable &quot;Found Dog&quot; flyer with QR code and your contact info.
        </p>
      </div>

      {/* Contact info inputs */}
      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="flyer-name" className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Your Name (optional)
            </label>
            <input
              id="flyer-name"
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full px-3 py-2 rounded-lg text-sm paw-input"
            />
          </div>
          <div>
            <label htmlFor="flyer-phone" className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Phone Number
            </label>
            <input
              id="flyer-phone"
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full px-3 py-2 rounded-lg text-sm paw-input"
            />
          </div>
        </div>
        <div>
          <label htmlFor="flyer-email" className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            Email Address
          </label>
          <input
            id="flyer-email"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="jane@email.com"
            className="w-full px-3 py-2 rounded-lg text-sm paw-input"
          />
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={generateFlyer}
          disabled={generating}
          className="glow-btn py-3 px-8 rounded-xl text-lg"
        >
          {generating ? "Generating..." : "Download Flyer (PNG)"}
        </button>
        {profileId && (
          <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
            Includes a QR code linking to the dog&apos;s online profile
          </p>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
