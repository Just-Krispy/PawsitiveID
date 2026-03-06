"use client";

import { useRef, useCallback, useState } from "react";
import QRCode from "qrcode";

interface FlyerGeneratorProps {
  profile: {
    breed: string;
    color: string;
    size: string;
    distinguishingFeatures: string[];
    hasCollar: boolean;
    collarDescription?: string;
    estimatedAge: string;
    gender?: string;
  };
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
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setGenerating(true);

    const W = 900;
    const H = 1350;
    canvas.width = W;
    canvas.height = H;

    // --- Background ---
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // --- Top accent stripe ---
    ctx.fillStyle = "#f97316";
    ctx.fillRect(0, 0, W, 8);

    // --- Header ---
    const headerH = 140;
    const grad = ctx.createLinearGradient(0, 8, 0, headerH + 8);
    grad.addColorStop(0, "#f97316");
    grad.addColorStop(1, "#f59e0b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 8, W, headerH);

    // Header text
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "bold 64px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("FOUND DOG", W / 2, 90);
    ctx.font = "22px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("Do you recognize this dog? Please help us find their owner!", W / 2, 130);

    // --- Photo section ---
    const photoY = headerH + 28;
    const photoW = 420;
    const photoH = 420;
    const photoX = (W - photoW) / 2;

    // Photo shadow
    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 6;

    // Photo border
    ctx.fillStyle = "#f97316";
    roundRect(ctx, photoX - 6, photoY - 6, photoW + 12, photoH + 12, 16);
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Draw photo
    const img = new Image();
    img.crossOrigin = "anonymous";

    await new Promise<void>((resolve) => {
      img.onload = () => {
        // Clip rounded rect for photo
        ctx.save();
        roundRect(ctx, photoX, photoY, photoW, photoH, 12);
        ctx.clip();

        const scale = Math.max(photoW / img.width, photoH / img.height);
        const sw = photoW / scale;
        const sh = photoH / scale;
        const sx = (img.width - sw) / 2;
        const sy = (img.height - sh) / 2;
        ctx.drawImage(img, sx, sy, sw, sh, photoX, photoY, photoW, photoH);
        ctx.restore();
        resolve();
      };
      img.onerror = () => resolve();
      img.src = photoPreview;
    });

    // --- Details section ---
    let y = photoY + photoH + 40;
    const leftMargin = 70;
    const rightMargin = W - 70;
    const colWidth = (rightMargin - leftMargin) / 2;

    // Section divider
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(leftMargin, y - 15);
    ctx.lineTo(rightMargin, y - 15);
    ctx.stroke();

    // Draw details in 2-column grid
    const details: [string, string][] = [
      ["Breed", profile.breed],
      ["Color", profile.color],
      ["Size", capitalize(profile.size)],
      ["Age", capitalize(profile.estimatedAge)],
    ];
    if (profile.gender && profile.gender !== "unknown") {
      details.push(["Gender", capitalize(profile.gender)]);
    }
    details.push([
      "Collar",
      profile.hasCollar
        ? profile.collarDescription || "Yes"
        : "None observed",
    ]);

    ctx.textAlign = "left";
    for (let i = 0; i < details.length; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const dx = leftMargin + col * colWidth;
      const dy = y + row * 44;

      ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
      ctx.fillStyle = "#f97316";
      ctx.fillText(details[i][0], dx, dy);

      ctx.font = "20px 'Segoe UI', Arial, sans-serif";
      ctx.fillStyle = "#374151";
      ctx.fillText(details[i][1], dx + 90, dy);
    }

    y += Math.ceil(details.length / 2) * 44 + 10;

    // Features
    if (profile.distinguishingFeatures.length > 0) {
      ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
      ctx.fillStyle = "#f97316";
      ctx.fillText("Features", leftMargin, y);
      y += 28;

      ctx.font = "18px 'Segoe UI', Arial, sans-serif";
      ctx.fillStyle = "#374151";
      for (const f of profile.distinguishingFeatures) {
        // Bullet point
        ctx.fillStyle = "#f97316";
        ctx.beginPath();
        ctx.arc(leftMargin + 8, y - 5, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#374151";
        ctx.fillText(f, leftMargin + 24, y);
        y += 28;
      }
    }

    // --- Location bar ---
    y += 15;
    ctx.fillStyle = "#fef3c7";
    roundRect(ctx, leftMargin, y, rightMargin - leftMargin, 56, 12);
    ctx.fill();
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 1;
    roundRect(ctx, leftMargin, y, rightMargin - leftMargin, 56, 12);
    ctx.stroke();

    // Location pin icon (text)
    ctx.fillStyle = "#92400e";
    ctx.font = "bold 22px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`Found near: ${location}`, W / 2, y + 36);

    // --- Contact section ---
    y += 90;

    // Contact box
    ctx.fillStyle = "#f8fafc";
    roundRect(ctx, leftMargin, y, rightMargin - leftMargin, 160, 12);
    ctx.fill();
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    roundRect(ctx, leftMargin, y, rightMargin - leftMargin, 160, 12);
    ctx.stroke();

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 26px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Is this your dog? Contact:", W / 2, y + 38);

    let contactY = y + 70;
    ctx.font = "22px 'Segoe UI', Arial, sans-serif";

    if (contactName.trim()) {
      ctx.fillStyle = "#374151";
      ctx.fillText(contactName.trim(), W / 2, contactY);
      contactY += 32;
    }
    if (contactPhone.trim()) {
      ctx.fillStyle = "#f97316";
      ctx.font = "bold 26px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(contactPhone.trim(), W / 2, contactY);
      contactY += 32;
      ctx.font = "22px 'Segoe UI', Arial, sans-serif";
    }
    if (contactEmail.trim()) {
      ctx.fillStyle = "#3b82f6";
      ctx.fillText(contactEmail.trim(), W / 2, contactY);
    }
    if (!contactName.trim() && !contactPhone.trim() && !contactEmail.trim()) {
      ctx.fillStyle = "#9ca3af";
      ctx.font = "italic 20px 'Segoe UI', Arial, sans-serif";
      ctx.fillText("(Add your contact info above before downloading)", W / 2, contactY);
    }

    // --- QR code ---
    y += 185;
    if (profileId) {
      const profileUrl = `https://pawsitiveid.vercel.app/dog/${profileId}`;
      try {
        const qrDataUrl = await QRCode.toDataURL(profileUrl, {
          width: 130,
          margin: 1,
          color: { dark: "#1e293b", light: "#ffffff" },
        });
        const qrImg = new Image();
        await new Promise<void>((resolve) => {
          qrImg.onload = () => {
            const qrSize = 130;
            const qrX = W / 2 - qrSize / 2;
            ctx.drawImage(qrImg, qrX, y, qrSize, qrSize);
            resolve();
          };
          qrImg.onerror = () => resolve();
          qrImg.src = qrDataUrl;
        });

        ctx.fillStyle = "#6b7280";
        ctx.font = "14px 'Segoe UI', Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Scan for full profile & updates", W / 2, y + 150);
      } catch {
        // QR generation failed silently
      }
    }

    // --- Footer ---
    const footerY = H - 50;
    const footerGrad = ctx.createLinearGradient(0, footerY, 0, H);
    footerGrad.addColorStop(0, "#f97316");
    footerGrad.addColorStop(1, "#ea580c");
    ctx.fillStyle = footerGrad;
    ctx.fillRect(0, footerY, W, 50);

    ctx.fillStyle = "#ffffff";
    ctx.font = "16px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Generated by PawsitiveID  •  pawsitiveid.vercel.app", W / 2, footerY + 32);

    // --- Tear-off tabs at bottom ---
    // Small dashed line
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, footerY - 1);
    ctx.lineTo(W, footerY - 1);
    ctx.stroke();
    ctx.setLineDash([]);

    // --- Download ---
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

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
