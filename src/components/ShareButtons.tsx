"use client";

import { useState } from "react";

interface ShareButtonsProps {
  profileId: string;
  breed: string;
  location: string;
}

export default function ShareButtons({ profileId, breed, location }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/dog/${profileId}`;
  const text = `Found dog: ${breed} near ${location}. Help them find home!`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
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

  return (
    <div className="glass-card p-4 max-w-2xl mx-auto" role="region" aria-label="Share this dog profile">
      <h3 className="text-lg font-bold gradient-text mb-3">Share This Profile</h3>
      <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
        The more people who see this, the better chance of finding the owner.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: copied ? "var(--confidence-high)" : "var(--bg-secondary)",
            color: copied ? "#000" : "var(--text-primary)",
            border: "1px solid var(--border-card)",
          }}
          aria-label={copied ? "Link copied!" : "Copy shareable link"}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            {copied ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            )}
          </svg>
          {copied ? "Copied!" : "Copy Link"}
        </button>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: "#1877F2", color: "#fff" }}
          aria-label="Share on Facebook"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </a>

        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: "#000", color: "#fff" }}
          aria-label="Share on X (Twitter)"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Post
        </a>

        <a
          href={`https://nextdoor.com/sharekit/?body=${encodeURIComponent(text + " " + url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: "#8ed500", color: "#000" }}
          aria-label="Share on Nextdoor"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9v-6h2v6zm4 0h-2v-6h2v6zm0-8H9V7h6v2z" />
          </svg>
          Nextdoor
        </a>
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
