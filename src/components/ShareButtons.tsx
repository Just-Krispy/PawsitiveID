"use client";

import { useState, useEffect, useCallback } from "react";
import { generateFlyerBlob } from "@/lib/flyer-canvas";
import type { FlyerProfile, FlyerRenderOptions } from "@/lib/flyer-canvas";

interface ShareButtonsProps {
  profileId: string;
  breed: string;
  location: string;
  description?: string;
  distinguishingFeatures?: string[];
  photoPreview?: string;
  profile?: FlyerProfile;
}

function buildShareText(
  breed: string,
  location: string,
  description?: string,
  features?: string[]
): string {
  let text = `Found dog: ${breed} near ${location}.`;

  if (description) {
    const truncated =
      description.length > 120
        ? description.slice(0, 117) + "..."
        : description;
    text += ` ${truncated}`;
  }

  if (features && features.length > 0) {
    const top = features.slice(0, 3).join(", ");
    text += ` Notable: ${top}.`;
  }

  text += " Help them find home!";
  return text;
}

export default function ShareButtons({
  profileId,
  breed,
  location,
  description,
  distinguishingFeatures,
  photoPreview,
  profile,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [canWebShare, setCanWebShare] = useState(false);
  const [flyerDownloading, setFlyerDownloading] = useState(false);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/dog/${profileId}`
      : `https://pawsitiveid.vercel.app/dog/${profileId}`;

  const text = buildShareText(breed, location, description, distinguishingFeatures);

  useEffect(() => {
    setCanWebShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWebShare = async () => {
    try {
      await navigator.share({ title: `Found Dog: ${breed}`, text, url });
    } catch {
      // User cancelled or not supported
    }
  };

  const handleShareFlyer = useCallback(
    async (target: "facebook" | "nextdoor") => {
      if (!profile || !photoPreview) return;
      setFlyerDownloading(true);

      try {
        const options: FlyerRenderOptions = {
          profile,
          photoPreview,
          location,
          profileId,
        };
        const blob = await generateFlyerBlob(options);
        if (blob) {
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = "PawsitiveID-Found-Dog-Flyer.png";
          link.href = blobUrl;
          link.click();
          URL.revokeObjectURL(blobUrl);
        }

        // Copy share text to clipboard
        try {
          await navigator.clipboard.writeText(`${text}\n${url}`);
        } catch {
          // Clipboard unavailable
        }

        // Open share target
        if (target === "facebook") {
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
            "_blank",
            "noopener,noreferrer"
          );
        } else {
          window.open(
            `https://nextdoor.com/sharekit/?body=${encodeURIComponent(text + " " + url)}`,
            "_blank",
            "noopener,noreferrer"
          );
        }
      } finally {
        setFlyerDownloading(false);
      }
    },
    [profile, photoPreview, location, profileId, text, url]
  );

  // Extract city from location for FB group search
  const locationCity = location.split(",")[0].trim();

  return (
    <div
      className="glass-card p-4 max-w-2xl mx-auto"
      role="region"
      aria-label="Share this dog profile"
    >
      <h3 className="text-lg font-bold gradient-text mb-3">
        Share This Profile
      </h3>
      <p
        className="text-sm mb-3"
        style={{ color: "var(--text-secondary)" }}
      >
        The more people who see this, the better chance of finding the owner.
      </p>

      <div className="flex flex-wrap gap-2">
        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: copied
              ? "var(--confidence-high)"
              : "var(--bg-secondary)",
            color: copied ? "#000" : "var(--text-primary)",
            border: "1px solid var(--border-card)",
          }}
          aria-label={copied ? "Link copied!" : "Copy shareable link"}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            {copied ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            )}
          </svg>
          {copied ? "Copied!" : "Copy Link"}
        </button>

        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(text + "\n" + url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: "#25D366", color: "#fff" }}
          aria-label="Share on WhatsApp"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: "#1877F2", color: "#fff" }}
          aria-label="Share on Facebook"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </a>

        {/* X / Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: "#000", color: "#fff" }}
          aria-label="Share on X (Twitter)"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Post
        </a>

        {/* FB Groups Search */}
        <a
          href={`https://www.facebook.com/search/groups/?q=lost%20pets%20${encodeURIComponent(locationCity)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: "#4267B2", color: "#fff" }}
          aria-label="Find local lost pet Facebook groups"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9v-2h2v2zm0-4H9V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          FB Groups
        </a>

        {/* Nextdoor */}
        <a
          href={`https://nextdoor.com/sharekit/?body=${encodeURIComponent(text + " " + url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: "#8ed500", color: "#000" }}
          aria-label="Share on Nextdoor"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9v-6h2v6zm4 0h-2v-6h2v6zm0-8H9V7h6v2z" />
          </svg>
          Nextdoor
        </a>

        {/* Share Flyer (Facebook) — only when profile + photo available */}
        {profile && photoPreview && (
          <button
            onClick={() => handleShareFlyer("facebook")}
            disabled={flyerDownloading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: "var(--paw-orange)",
              color: "#fff",
              opacity: flyerDownloading ? 0.6 : 1,
            }}
            aria-label="Download flyer and share on Facebook"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {flyerDownloading ? "Preparing..." : "Share Flyer"}
          </button>
        )}

        {/* Nextdoor + Flyer */}
        {profile && photoPreview && (
          <button
            onClick={() => handleShareFlyer("nextdoor")}
            disabled={flyerDownloading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: "#6bc400",
              color: "#000",
              opacity: flyerDownloading ? 0.6 : 1,
            }}
            aria-label="Download flyer and share on Nextdoor"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {flyerDownloading ? "Preparing..." : "Nextdoor + Flyer"}
          </button>
        )}

        {/* Web Share API (mobile) */}
        {canWebShare && (
          <button
            onClick={handleWebShare}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-card)",
            }}
            aria-label="Share via device share menu"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            More...
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={url}
          className="flex-1 px-3 py-2 rounded-lg text-xs paw-input"
          aria-label="Shareable profile URL"
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
      </div>
    </div>
  );
}
