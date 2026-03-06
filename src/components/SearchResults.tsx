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
      <div className="glass-card p-8 text-center max-w-2xl mx-auto">
        <div className="text-4xl mb-3">
          <svg className="mx-auto w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          No shelter matches found
        </h3>
        <p className="text-gray-500">
          No {dogBreed}s were found in nearby shelters. Try the social media
          search links below - many lost pets are posted on Facebook and
          Nextdoor.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold gradient-text">
          Shelter Matches ({results.length})
        </h2>
        {source === "demo" && (
          <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Demo Data - Connect Petfinder API for real results
          </span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {results.map((animal) => (
          <div key={animal.id} className="match-card p-4">
            <div className="flex gap-4">
              {/* Photo or placeholder */}
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-700 shrink-0 flex items-center justify-center">
                {animal.photos && animal.photos.length > 0 ? (
                  <img
                    src={animal.photos[0].medium}
                    alt={animal.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-orange-300 truncate">
                    {animal.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                      animal.status === "found"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-blue-500/20 text-blue-300"
                    }`}
                  >
                    {animal.status}
                  </span>
                </div>

                <p className="text-sm text-gray-400 mt-1">
                  {[
                    animal.breeds?.primary,
                    animal.breeds?.secondary
                      ? `/ ${animal.breeds.secondary}`
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </p>

                <div className="flex gap-3 text-xs text-gray-500 mt-1">
                  <span>{animal.age}</span>
                  <span>{animal.gender}</span>
                  <span className="capitalize">{animal.size}</span>
                  {animal.distance && <span>{animal.distance} mi</span>}
                </div>

                {animal.description && (
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                    {animal.description}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="text-gray-500">
                    {animal._shelter ||
                      `${animal.contact?.address?.city}, ${animal.contact?.address?.state}`}
                  </span>
                  {animal.contact?.phone && (
                    <a
                      href={`tel:${animal.contact.phone}`}
                      className="text-orange-400 hover:text-orange-300"
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
                    className="inline-block mt-2 text-xs text-orange-400 hover:text-orange-300 underline"
                  >
                    View on Petfinder
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
