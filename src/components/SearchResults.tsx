"use client";

interface ShelterResult {
  id: number;
  name: string;
  breeds: { primary: string | null; secondary: string | null; mixed: boolean };
  colors: { primary: string | null; secondary: string | null };
  age: string;
  gender: string;
  size: string;
  description: string | null;
  photos: { medium: string; large: string }[];
  status: string;
  distance: number | null;
  contact: {
    phone: string | null;
    address: { city: string; state: string; postcode: string };
  };
  url: string;
  published_at: string;
  _demo?: boolean;
  _shelter?: string;
  _source?: "petfinder" | "rescuegroups" | "demo";
}

interface SearchResultsProps {
  results: ShelterResult[];
  source: string;
  dogBreed: string;
}

export default function SearchResults({
  results,
  source,
  dogBreed,
}: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="glass-card p-8 text-center max-w-2xl mx-auto" role="status">
        <div className="mb-3">
          <svg className="mx-auto w-12 h-12" style={{ color: "var(--text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
          No shelter matches found
        </h3>
        <p style={{ color: "var(--text-secondary)" }}>
          No {dogBreed}s were found in nearby shelters. Try the social media
          search links below - many lost pets are posted on Facebook and
          Nextdoor.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto" role="region" aria-label="Shelter search results">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold gradient-text">
          Shelter Matches ({results.length})
        </h2>
        {source === "demo" && (
          <span className="paw-tag text-xs px-3 py-1 rounded-full">
            Demo Data - Connect Petfinder API for real results
          </span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2" role="list">
        {results.map((animal) => (
          <article key={animal.id} className="match-card p-4" role="listitem">
            <div className="flex gap-4">
              <div
                className="w-24 h-24 rounded-lg overflow-hidden shrink-0 flex items-center justify-center"
                style={{ background: "var(--bg-secondary)" }}
              >
                {animal.photos && animal.photos.length > 0 ? (
                  <img
                    src={animal.photos[0].medium}
                    alt={`Photo of ${animal.name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-10 h-10" style={{ color: "var(--text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold truncate" style={{ color: "var(--paw-orange)" }}>
                    {animal.name}
                  </h3>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full shrink-0 ml-2 font-semibold"
                    style={{
                      background: animal.status === "found" ? "var(--status-found-bg)" : "var(--status-adoptable-bg)",
                      color: animal.status === "found" ? "var(--status-found-text)" : "var(--status-adoptable-text)",
                    }}
                  >
                    {animal.status}
                  </span>
                  {animal._source && animal._source !== "demo" && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full shrink-0 ml-1"
                      style={{
                        background: "var(--bg-secondary)",
                        color: "var(--text-muted)",
                        border: "1px solid var(--border-card)",
                      }}
                    >
                      {animal._source === "rescuegroups" ? "RescueGroups" : "Petfinder"}
                    </span>
                  )}
                </div>

                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                  {[
                    animal.breeds?.primary,
                    animal.breeds?.secondary
                      ? `/ ${animal.breeds.secondary}`
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </p>

                <div className="flex gap-3 text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  <span>{animal.age}</span>
                  <span>{animal.gender}</span>
                  <span className="capitalize">{animal.size}</span>
                  {animal.distance && <span>{animal.distance} mi</span>}
                </div>

                {animal.description && (
                  <p className="text-xs mt-2 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                    {animal.description}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span style={{ color: "var(--text-muted)" }}>
                    {animal._shelter ||
                      `${animal.contact?.address?.city}, ${animal.contact?.address?.state}`}
                  </span>
                  {animal.contact?.phone && (
                    <a
                      href={`tel:${animal.contact.phone}`}
                      style={{ color: "var(--paw-orange)" }}
                      aria-label={`Call ${animal._shelter || "shelter"} at ${animal.contact.phone}`}
                    >
                      {animal.contact.phone}
                    </a>
                  )}
                </div>

                {animal.url && animal.url !== "#demo" && (
                  <a
                    href={animal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs underline"
                    style={{ color: "var(--paw-orange)" }}
                  >
                    View on Petfinder
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
