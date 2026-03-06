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
      ? "text-green-400"
      : profile.confidence === "medium"
        ? "text-amber-400"
        : "text-red-400";

  return (
    <div className="glass-card p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold gradient-text mb-4">
        AI Analysis Complete
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Photo */}
        <div className="relative w-full md:w-48 h-48 rounded-xl overflow-hidden shrink-0">
          <img
            src={photoPreview}
            alt="Analyzed dog"
            className="w-full h-full object-cover"
          />
          {profile.confidence && (
            <span
              className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full bg-black/60 ${confidenceColor}`}
            >
              {profile.confidence} confidence
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 space-y-3">
          <p className="text-gray-300 italic">&quot;{profile.description}&quot;</p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Breed</span>
              <p className="font-semibold text-orange-300">{profile.breed}</p>
            </div>
            <div>
              <span className="text-gray-500">Color</span>
              <p className="font-semibold">{profile.color}</p>
            </div>
            <div>
              <span className="text-gray-500">Size</span>
              <p className="font-semibold capitalize">{profile.size}</p>
            </div>
            <div>
              <span className="text-gray-500">Age</span>
              <p className="font-semibold capitalize">{profile.estimatedAge}</p>
            </div>
            <div>
              <span className="text-gray-500">Gender</span>
              <p className="font-semibold capitalize">
                {profile.gender || "Unknown"}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Collar</span>
              <p className="font-semibold">
                {profile.hasCollar
                  ? profile.collarDescription || "Yes"
                  : "None observed"}
              </p>
            </div>
          </div>

          {profile.distinguishingFeatures.length > 0 && (
            <div>
              <span className="text-gray-500 text-sm">
                Distinguishing Features
              </span>
              <div className="flex flex-wrap gap-2 mt-1">
                {profile.distinguishingFeatures.map((feature, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.healthNotes && profile.healthNotes !== "Appears healthy" && (
            <div className="mt-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <span className="text-red-400 text-sm font-semibold">
                Health Note:
              </span>
              <p className="text-red-300 text-sm">{profile.healthNotes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
