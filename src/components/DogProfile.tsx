"use client";

interface DogProfileData {
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
}

interface DogProfileProps {
  profile: DogProfileData;
  photoPreview: string;
}

export default function DogProfile({ profile, photoPreview }: DogProfileProps) {
  const confidenceColor =
    profile.confidence === "high"
      ? "text-green-600"
      : profile.confidence === "medium"
        ? "text-amber-500"
        : "text-red-500";

  return (
    <div className="glass-card p-6 max-w-2xl mx-auto" role="region" aria-label="Dog analysis results">
      <h2 className="text-2xl font-bold gradient-text mb-4">
        AI Analysis Complete
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative w-full md:w-48 h-48 rounded-xl overflow-hidden shrink-0">
          <img
            src={photoPreview}
            alt={`Analyzed dog: ${profile.breed}, ${profile.color}`}
            className="w-full h-full object-cover"
          />
          {profile.confidence && (
            <span
              className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full bg-black/60 text-white ${confidenceColor}`}
            >
              {profile.confidence} confidence
            </span>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <p className="italic" style={{ color: "var(--text-secondary)" }}>&quot;{profile.description}&quot;</p>

          <dl className="grid grid-cols-2 gap-3 text-sm">
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
            <div>
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
            <div className="mt-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30" role="alert">
              <span className="text-red-600 text-sm font-semibold">Health Note: </span>
              <span className="text-red-500 text-sm">{profile.healthNotes}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
