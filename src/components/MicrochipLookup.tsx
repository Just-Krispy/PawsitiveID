"use client";

import { useState } from "react";

interface MicrochipResult {
  chipNumber: string;
  format: string;
  possibleRegistries: string[];
  lookupUrls: { name: string; url: string; description: string }[];
}

export default function MicrochipLookup() {
  const [expanded, setExpanded] = useState(false);
  const [chipInput, setChipInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MicrochipResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async () => {
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/microchip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chipNumber: chipInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(249, 115, 22, 0.1)" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--paw-orange)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01" />
              <path d="M6 9v6M18 9v6" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
              Microchip Lookup
            </h3>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Search registries to find the owner instantly
            </p>
          </div>
        </div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-secondary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Check the dog&apos;s left shoulder area with a scanner, or ask any vet to
            scan for free. Enter the microchip number below to search registries.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={chipInput}
              onChange={(e) => setChipInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && chipInput.trim()) handleLookup();
              }}
              placeholder="e.g. 985112345678901"
              className="flex-1 px-3 py-2 rounded-lg text-sm paw-input"
              maxLength={15}
              aria-label="Microchip number"
            />
            <button
              onClick={handleLookup}
              disabled={loading || !chipInput.trim()}
              className="glow-btn px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
              style={{ opacity: loading || !chipInput.trim() ? 0.5 : 1 }}
            >
              {loading ? "Searching..." : "Look Up"}
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="p-3 rounded-lg text-sm"
              style={{
                background: "var(--error-bg)",
                border: "1px solid var(--error-border)",
                color: "var(--error-text)",
              }}
            >
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-3">
              <div
                className="p-3 rounded-lg"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-card)",
                }}
              >
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span style={{ color: "var(--text-secondary)" }}>Number: </span>
                    <span
                      className="font-mono font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {result.chipNumber}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-secondary)" }}>Format: </span>
                    <span style={{ color: "var(--text-primary)" }}>
                      {result.format}
                    </span>
                  </div>
                </div>
                {result.possibleRegistries.length > 0 && (
                  <p className="text-sm mt-2">
                    <span style={{ color: "var(--text-secondary)" }}>
                      Possible registry:{" "}
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: "var(--paw-orange)" }}
                    >
                      {result.possibleRegistries.join(", ")}
                    </span>
                  </p>
                )}
              </div>

              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Search these registries to find the owner:
              </p>
              <div className="space-y-2">
                {result.lookupUrls.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg transition-all"
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-card)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "var(--paw-orange)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "var(--border-card)";
                    }}
                  >
                    <div>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "var(--paw-orange)" }}
                      >
                        {link.name}
                      </span>
                      <span
                        className="block text-xs mt-0.5"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {link.description}
                      </span>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--text-muted)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                ))}
              </div>

              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Tip: Any vet or animal shelter will scan for microchips for free.
                The chip is usually implanted between the shoulder blades.
              </p>
            </div>
          )}

          {!result && !error && (
            <div className="space-y-2">
              <p
                className="text-xs font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Or search manually:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    name: "AAHA Lookup",
                    url: "https://www.aaha.org/your-pet/pet-microchip-lookup/",
                  },
                  {
                    name: "Peeva",
                    url: "https://peeva.co/register-microchip/",
                  },
                  {
                    name: "Found Animals",
                    url: "https://microchipregistry.foundanimals.org/",
                  },
                ].map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                    style={{
                      background: "rgba(249, 115, 22, 0.1)",
                      color: "var(--paw-orange)",
                      border: "1px solid rgba(249, 115, 22, 0.2)",
                    }}
                  >
                    {link.name} &rarr;
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
