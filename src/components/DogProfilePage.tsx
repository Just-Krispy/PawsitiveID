"use client";

import { useState, useEffect, useCallback } from "react";
import PawLogo from "@/components/PawLogo";
import ShareButtons from "@/components/ShareButtons";
import ThemeToggle from "@/components/ThemeToggle";
import SightingForm from "@/components/SightingForm";
import SightingList from "@/components/SightingList";

interface DogProfileRecord {
  id: string;
  breed: string;
  color: string;
  size: string;
  distinguishingFeatures: string[];
  hasCollar: boolean;
  collarDescription?: string;
  estimatedAge: string;
  gender?: string;
  description: string;
  confidence?: string;
  healthNotes?: string;
  photoUrl: string;
  locationText: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
}

interface Sighting {
  id: string;
  locationText: string;
  spottedAt: string;
  notes: string | null;
  reporterName: string | null;
  createdAt: string;
}

export default function DogProfilePage({ profile }: { profile: DogProfileRecord }) {
  const [sightings, setSightings] = useState<Sighting[]>([]);

  const fetchSightings = useCallback(async () => {
    try {
      const res = await fetch(`/api/dogs/${profile.id}/sightings`);
      if (res.ok) {
        const data = await res.json();
        setSightings(data.sightings || []);
      }
    } catch {
      // Silently fail - sightings are supplementary
    }
  }, [profile.id]);

  useEffect(() => {
    fetchSightings();
  }, [fetchSightings]);

  const confidenceVar =
    profile.confidence === "high"
      ? "var(--confidence-high)"
      : profile.confidence === "medium"
        ? "var(--confidence-medium)"
        : "var(--confidence-low)";

  const timeAgo = getTimeAgo(profile.createdAt);

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
                href="/map"
                className="text-sm font-medium px-3 py-2 rounded-lg transition-colors"
                style={{ color: "var(--paw-orange)" }}
              >
                Map
              </a>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <section className="max-w-3xl mx-auto px-4 py-8 space-y-6" aria-label="Dog profile">
          {/* Photo */}
          <div className="relative rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border-card)" }}>
            {profile.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={`Found ${profile.breed}: ${profile.color}`}
                className="w-full max-h-[500px] object-cover"
              />
            ) : (
              <div
                className="w-full h-64 flex items-center justify-center"
                style={{ background: "var(--bg-secondary)" }}
              >
                <PawLogo size={80} />
              </div>
            )}
            {profile.confidence && (
              <span
                className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full bg-black/60"
                style={{ color: confidenceVar }}
              >
                {profile.confidence} confidence
              </span>
            )}
          </div>

          {/* Profile Card */}
          <div className="glass-card p-6" role="region" aria-label="Dog details">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold gradient-text">
                  Found {profile.breed}
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                  Spotted near {profile.locationText} &bull; {timeAgo}
                </p>
              </div>
            </div>

            <p className="italic mb-4" style={{ color: "var(--text-secondary)" }}>
              &quot;{profile.description}&quot;
            </p>

            <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <dt style={{ color: "var(--text-muted)" }}>Breed</dt>
                <dd className="font-semibold" style={{ color: "var(--paw-orange)" }}>{profile.breed}</dd>
              </div>
              <div>
                <dt style={{ color: "var(--text-muted)" }}>Color</dt>
                <dd className="font-semibold">{profile.color}</dd>
              </div>
              <div>
                <dt style={{ color: "var(--text-muted)" }}>Size</dt>
                <dd className="font-semibold capitalize">{profile.size}</dd>
              </div>
              <div>
                <dt style={{ color: "var(--text-muted)" }}>Age</dt>
                <dd className="font-semibold capitalize">{profile.estimatedAge}</dd>
              </div>
              <div>
                <dt style={{ color: "var(--text-muted)" }}>Gender</dt>
                <dd className="font-semibold capitalize">{profile.gender || "Unknown"}</dd>
              </div>
              <div>
                <dt style={{ color: "var(--text-muted)" }}>Collar</dt>
                <dd className="font-semibold">
                  {profile.hasCollar ? profile.collarDescription || "Yes" : "None observed"}
                </dd>
              </div>
            </dl>

            {profile.distinguishingFeatures.length > 0 && (
              <div className="mt-4">
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Distinguishing Features
                </span>
                <div className="flex flex-wrap gap-2 mt-1" role="list">
                  {profile.distinguishingFeatures.map((feature, i) => (
                    <span key={i} role="listitem" className="paw-tag text-xs px-3 py-1 rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile.healthNotes && profile.healthNotes !== "Appears healthy" && (
              <div
                className="mt-4 p-3 rounded-lg"
                style={{ background: "var(--health-bg)", border: "1px solid var(--health-border)" }}
                role="alert"
              >
                <span className="text-sm font-semibold" style={{ color: "var(--health-text)" }}>Health Note: </span>
                <span className="text-sm" style={{ color: "var(--health-text)" }}>{profile.healthNotes}</span>
              </div>
            )}
          </div>

          {/* Share */}
          <ShareButtons
            profileId={profile.id}
            breed={profile.breed}
            location={profile.locationText}
          />

          {/* Sightings */}
          <div className="glass-card p-6" role="region" aria-label="Community sightings">
            <h3 className="text-lg font-bold gradient-text mb-4">
              Community Sightings ({sightings.length})
            </h3>
            <SightingList sightings={sightings} />
          </div>

          {/* Report Sighting Form */}
          <SightingForm
            dogProfileId={profile.id}
            onSightingAdded={fetchSightings}
          />

          {/* CTA */}
          <div className="glass-card p-6 text-center" role="region" aria-label="Actions">
            <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              Is this your dog?
            </h3>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              If you recognize this dog, please contact your local animal control or visit the shelter nearest to {profile.locationText}.
            </p>
            <a
              href="/"
              className="glow-btn inline-block px-6 py-3 rounded-xl text-sm font-semibold"
            >
              Report Another Found Dog
            </a>
          </div>
        </section>

        <footer className="text-center py-8 text-sm" style={{ color: "var(--text-muted)" }} role="contentinfo">
          <p>PawsitiveID - Built with love for every lost paw.</p>
          <p className="mt-1">Every animal deserves to be found.</p>
        </footer>
      </main>
    </>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
