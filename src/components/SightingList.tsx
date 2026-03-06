"use client";

interface Sighting {
  id: string;
  locationText: string;
  spottedAt: string;
  notes: string | null;
  reporterName: string | null;
  createdAt: string;
}

interface SightingListProps {
  sightings: Sighting[];
}

export default function SightingList({ sightings }: SightingListProps) {
  if (sightings.length === 0) {
    return (
      <div className="text-center py-6" style={{ color: "var(--text-muted)" }}>
        <p className="text-sm">No sightings reported yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3" role="list" aria-label="Reported sightings">
      {sightings.map((sighting) => (
        <div
          key={sighting.id}
          role="listitem"
          className="glass-card p-4 flex gap-3"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: "var(--bg-secondary)" }}
            aria-hidden="true"
          >
            <svg className="w-4 h-4" style={{ color: "var(--paw-orange)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {sighting.locationText}
              </p>
              <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
                {formatDate(sighting.spottedAt)}
              </span>
            </div>
            {sighting.notes && (
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                {sighting.notes}
              </p>
            )}
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Reported by {sighting.reporterName || "Anonymous"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
