"use client";

import { useEffect, useState } from "react";

interface RecentDog {
  id: string;
  breed: string;
  color: string;
  size: string;
  photo_url: string | null;
  location_text: string | null;
  created_at: string;
}

export default function RecentDogs() {
  const [dogs, setDogs] = useState<RecentDog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dogs")
      .then((res) => (res.ok ? res.json() : { dogs: [] }))
      .then((data) => setDogs(data.dogs || []))
      .catch(() => setDogs([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold gradient-text text-center mb-6">Recently Found Dogs</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-3 animate-pulse">
              <div className="w-full aspect-square rounded-lg mb-2" style={{ background: "var(--bg-card-hover)" }} />
              <div className="h-4 rounded w-3/4 mb-1" style={{ background: "var(--bg-card-hover)" }} />
              <div className="h-3 rounded w-1/2" style={{ background: "var(--bg-card-hover)" }} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (dogs.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold gradient-text mb-1">Recently Found Dogs</h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Dogs recently spotted and reported through PawsitiveID
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dogs.slice(0, 8).map((dog) => (
          <a
            key={dog.id}
            href={`/dog/${dog.id}`}
            className="match-card overflow-hidden group"
          >
            <div className="aspect-square overflow-hidden">
              {dog.photo_url ? (
                <img
                  src={dog.photo_url}
                  alt={`${dog.breed} found near ${dog.location_text || "unknown location"}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: "var(--bg-card-hover)" }}
                >
                  <svg className="w-12 h-12" style={{ color: "var(--text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>
                {dog.breed}
              </p>
              <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                {dog.location_text || "Location unknown"}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                {timeAgo(dog.created_at)}
              </p>
            </div>
          </a>
        ))}
      </div>

      <div className="text-center mt-6">
        <a
          href="/map"
          className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          style={{ color: "var(--paw-orange)", background: "rgba(249, 115, 22, 0.1)" }}
        >
          View all on map
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}
