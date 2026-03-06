"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import PawLogo from "@/components/PawLogo";
import ThemeToggle from "@/components/ThemeToggle";

const SightingMap = dynamic(() => import("@/components/SightingMap"), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center rounded-xl"
      style={{ height: "500px", background: "var(--bg-secondary)" }}
    >
      <p style={{ color: "var(--text-muted)" }}>Loading map...</p>
    </div>
  ),
});

interface MapPin {
  id: string;
  latitude: number;
  longitude: number;
  breed?: string;
  locationText: string;
  photoUrl?: string;
  type: "profile" | "sighting";
  date: string;
  dogProfileId?: string;
}

export default function MapPage() {
  const [pins, setPins] = useState<MapPin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPins() {
      try {
        const res = await fetch("/api/sightings");
        if (res.ok) {
          const data = await res.json();
          const allPins: MapPin[] = [
            ...(data.profiles || []),
            ...(data.sightings || []),
          ];
          setPins(allPins);
        }
      } catch {
        // Map will show empty
      } finally {
        setLoading(false);
      }
    }
    fetchPins();
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <main id="main-content" className="min-h-screen pb-20" role="main">
        <header className="app-header sticky top-0 z-50" role="banner">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3" aria-label="Go to PawsitiveID home">
              <PawLogo size={40} />
              <div>
                <h1 className="text-xl font-bold gradient-text">PawsitiveID</h1>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  AI-Powered Pet Matching
                </p>
              </div>
            </a>
            <div className="flex items-center gap-3">
              <a
                href="/"
                className="text-sm font-medium px-3 py-2 rounded-lg transition-colors"
                style={{ color: "var(--paw-orange)" }}
              >
                + Report Dog
              </a>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <section className="max-w-5xl mx-auto px-4 py-8" aria-label="Sighting map">
          <div className="mb-6">
            <h2 className="text-3xl font-bold gradient-text mb-2">
              Sighting Map
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Real-time view of found dogs and community sightings in your area.
            </p>
          </div>

          {/* Legend */}
          <div className="flex gap-4 mb-4 text-sm" style={{ color: "var(--text-secondary)" }}>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ background: "#f97316" }} aria-hidden="true" />
              Found dogs
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ background: "#3b82f6" }} aria-hidden="true" />
              Community sightings
            </span>
          </div>

          {loading ? (
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ height: "500px", background: "var(--bg-secondary)" }}
            >
              <div className="text-center">
                <div className="flex justify-center gap-2 mb-3" aria-hidden="true">
                  <span className="w-3 h-3 rounded-full bg-orange-500 dot-1" />
                  <span className="w-3 h-3 rounded-full bg-orange-500 dot-2" />
                  <span className="w-3 h-3 rounded-full bg-orange-500 dot-3" />
                </div>
                <p style={{ color: "var(--text-muted)" }}>Loading sighting data...</p>
              </div>
            </div>
          ) : (
            <SightingMap pins={pins} height="500px" />
          )}

          {!loading && pins.length === 0 && (
            <div className="glass-card p-8 text-center mt-4">
              <PawLogo size={60} />
              <h3 className="text-xl font-bold mt-4 mb-2" style={{ color: "var(--text-primary)" }}>
                No sightings yet
              </h3>
              <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
                Be the first to report a found dog and help build the community map!
              </p>
              <a
                href="/"
                className="glow-btn inline-block px-6 py-3 rounded-xl text-sm font-semibold"
              >
                Report a Found Dog
              </a>
            </div>
          )}
        </section>

        <footer className="text-center py-8 text-sm" style={{ color: "var(--text-muted)" }} role="contentinfo">
          <p>PawsitiveID - Built with love for every lost paw.</p>
        </footer>
      </main>
    </>
  );
}
