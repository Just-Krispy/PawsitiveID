"use client";

import { useState, useCallback } from "react";
import PawLogo from "@/components/PawLogo";
import PhotoUpload from "@/components/PhotoUpload";
import DogProfile from "@/components/DogProfile";
import SearchResults from "@/components/SearchResults";
import SearchLinks from "@/components/SearchLinks";
import FlyerGenerator from "@/components/FlyerGenerator";
import NavBar from "@/components/NavBar";
import ShareButtons from "@/components/ShareButtons";
import MicrochipLookup from "@/components/MicrochipLookup";
import PushNotificationBanner from "@/components/PushNotificationBanner";
import RecentDogs from "@/components/RecentDogs";
import SimilarDogs from "@/components/SimilarDogs";
import { generateSearchLinks } from "@/lib/search-links";

type Step = "upload" | "analyzing" | "results";

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

export default function Home() {
  const [step, setStep] = useState<Step>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [location, setLocation] = useState("Riverview, FL");
  const [profile, setProfile] = useState<DogProfileData | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [shelterResults, setShelterResults] = useState<unknown[]>([]);
  const [shelterSource, setShelterSource] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState("");

  const handlePhotoSelected = useCallback((file: File, preview: string) => {
    setSelectedFile(file);
    setPhotoPreview(preview);
    setError(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;

    setStep("analyzing");
    setError(null);

    try {
      setAnalysisStatus("Analyzing photo with AI vision...");
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("location", location);

      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!analyzeRes.ok) {
        const err = await analyzeRes.json();
        throw new Error(err.error || "Analysis failed");
      }

      const analyzeData = await analyzeRes.json();
      setProfile(analyzeData.profile);
      setProfileId(analyzeData.profileId || null);

      setAnalysisStatus("Searching nearby shelters and rescues...");
      const searchRes = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          breed: analyzeData.profile.breed,
          color: analyzeData.profile.color,
          size: analyzeData.profile.size,
          location,
        }),
      });

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        setShelterResults(searchData.results);
        setShelterSource(searchData.source);
      }

      setStep("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("upload");
    }
  }, [selectedFile, location]);

  const handleReset = useCallback(() => {
    setStep("upload");
    setSelectedFile(null);
    setPhotoPreview("");
    setProfile(null);
    setProfileId(null);
    setShelterResults([]);
    setError(null);
  }, []);

  return (
    <>
      {/* Skip to content - accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <main id="main-content" className="min-h-screen pb-20" role="main">
        <NavBar
          currentPage="home"
          actions={
            step === "results" ? (
              <button
                onClick={handleReset}
                className="text-sm font-medium px-3 py-2 rounded-lg transition-colors"
                style={{ color: "var(--paw-orange)" }}
                aria-label="Start a new search"
              >
                + New Search
              </button>
            ) : undefined
          }
        />

        {/* Hero */}
        {step === "upload" && (
          <section className="max-w-3xl mx-auto px-4 pt-12 pb-8 text-center page-enter" aria-label="Welcome">
            <div className="mb-6 flex justify-center">
              <PawLogo size={80} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Found a stray?</span>
              <br />
              <span style={{ color: "var(--text-primary)" }}>Help them find home.</span>
            </h2>
            <p className="text-lg max-w-xl mx-auto mb-6" style={{ color: "var(--text-secondary)" }}>
              Upload a photo and our AI will identify the breed, features, and
              search shelters, rescues, and lost pet databases across your area.
            </p>
            <a
              href="/lost"
              className="inline-block text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
              style={{
                border: "1px solid var(--paw-orange)",
                color: "var(--paw-orange)",
              }}
            >
              Lost your dog? File a report instead
            </a>
          </section>
        )}

        {/* Push notification banner */}
        {step === "upload" && (
          <div className="max-w-3xl mx-auto px-4 mt-6">
            <PushNotificationBanner />
          </div>
        )}

        {/* Recent Dogs Feed */}
        {step === "upload" && <RecentDogs />}

        {/* Quick Microchip Lookup */}
        {step === "upload" && (
          <div className="max-w-3xl mx-auto px-4 mt-6">
            <MicrochipLookup />
          </div>
        )}

        {/* Upload Section */}
        {step === "upload" && (
          <section className="max-w-3xl mx-auto px-4 py-8" aria-label="Photo upload">
            <PhotoUpload onPhotoSelected={handlePhotoSelected} />

            {selectedFile && (
              <div className="mt-6 space-y-4 max-w-lg mx-auto">
                <div>
                  <label
                    htmlFor="location-input"
                    className="block text-sm mb-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Where did you find this dog?
                  </label>
                  <input
                    id="location-input"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State or Zip Code"
                    className="w-full px-4 py-3 rounded-xl paw-input"
                    autoComplete="address-level2"
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={!location.trim()}
                  className="glow-btn w-full py-4 rounded-xl text-lg"
                  aria-label="Analyze photo and search for matching pets"
                >
                  Identify This Dog
                </button>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center max-w-lg mx-auto"
                style={{ color: "#fca5a5" }}
              >
                {error}
              </div>
            )}
          </section>
        )}

        {/* Analyzing Animation */}
        {step === "analyzing" && (
          <section
            className="max-w-lg mx-auto px-4 py-20 text-center"
            aria-label="Analyzing photo"
            aria-live="polite"
          >
            <div className="relative w-48 h-48 mx-auto mb-8">
              <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-orange-500/50 relative">
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Photo being analyzed"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="scan-line" aria-hidden="true" />
              </div>
              <div className="absolute inset-0 rounded-2xl border-2 border-orange-500/30 pulse-ring" aria-hidden="true" />
            </div>

            <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              {analysisStatus}
            </h3>
            <div className="flex justify-center gap-2 mt-4" aria-hidden="true">
              <span className="w-3 h-3 rounded-full bg-orange-500 dot-1" />
              <span className="w-3 h-3 rounded-full bg-orange-500 dot-2" />
              <span className="w-3 h-3 rounded-full bg-orange-500 dot-3" />
            </div>
            <p className="sr-only">Please wait while we analyze the photo and search nearby shelters.</p>
          </section>
        )}

        {/* Results */}
        {step === "results" && profile && (
          <section className="max-w-5xl mx-auto px-4 py-8 space-y-10 page-enter" aria-label="Search results">
            <DogProfile profile={profile} photoPreview={photoPreview} />

            {/* Share profile link */}
            {profileId && (
              <ShareButtons
                profileId={profileId}
                breed={profile.breed}
                location={location}
                description={profile.description}
                distinguishingFeatures={profile.distinguishingFeatures}
                photoPreview={photoPreview}
                profile={profile}
              />
            )}

            {/* Microchip lookup */}
            <div className="max-w-2xl mx-auto">
              <MicrochipLookup />
            </div>

            {/* Similar dogs in database */}
            <SimilarDogs
              breed={profile.breed}
              color={profile.color}
              size={profile.size}
              excludeId={profileId}
            />

            <SearchResults
              results={shelterResults as never[]}
              source={shelterSource}
              dogBreed={profile.breed}
            />

            <SearchLinks
              links={generateSearchLinks(profile, location)}
            />

            <FlyerGenerator
              profile={profile}
              photoPreview={photoPreview}
              location={location}
              profileId={profileId}
            />

            {/* Tips */}
            <div className="glass-card p-6 max-w-2xl mx-auto" role="complementary" aria-label="Rescue tips">
              <h2 className="text-xl font-bold gradient-text mb-4">
                Rescue Tips
              </h2>
              <ol className="space-y-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                <li className="flex gap-3">
                  <span className="font-bold shrink-0" style={{ color: "var(--paw-orange)" }} aria-hidden="true">01</span>
                  <p>
                    <strong>Don&apos;t chase.</strong> Sit nearby with food and let the dog
                    come to you. Scared dogs run from pursuit.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold shrink-0" style={{ color: "var(--paw-orange)" }} aria-hidden="true">02</span>
                  <p>
                    <strong>Set up a feeding station.</strong> Same spot, same
                    time daily. The dog will learn to trust the routine.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold shrink-0" style={{ color: "var(--paw-orange)" }} aria-hidden="true">03</span>
                  <p>
                    <strong>Contact local rescues.</strong> Many have humane traps
                    they can lend you and experience catching scared strays.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold shrink-0" style={{ color: "var(--paw-orange)" }} aria-hidden="true">04</span>
                  <p>
                    <strong>Check for a microchip.</strong> Any vet or shelter
                    will scan for free. This is the fastest way to find an owner.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold shrink-0" style={{ color: "var(--paw-orange)" }} aria-hidden="true">05</span>
                  <p>
                    <strong>Post the flyer.</strong> Use the flyer generator above
                    and post within a 2-mile radius of where you found the dog.
                  </p>
                </li>
              </ol>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center py-10 text-sm" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border-card)" }} role="contentinfo">
          <div className="flex justify-center gap-6 mb-4">
            <a href="/lost" className="hover:underline" style={{ color: "var(--text-secondary)" }}>Report Lost</a>
            <a href="/lost-dogs" className="hover:underline" style={{ color: "var(--text-secondary)" }}>Lost Dogs</a>
            <a href="/map" className="hover:underline" style={{ color: "var(--text-secondary)" }}>Map</a>
            <a href="/alerts" className="hover:underline" style={{ color: "var(--text-secondary)" }}>Alerts</a>
          </div>
          <p>PawsitiveID - Built with love for every lost paw.</p>
          <p className="mt-1">Every animal deserves to be found.</p>
        </footer>
      </main>
    </>
  );
}
