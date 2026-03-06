"use client";

import { useState, useCallback } from "react";
import PawLogo from "@/components/PawLogo";
import PhotoUpload from "@/components/PhotoUpload";
import DogProfile from "@/components/DogProfile";
import SearchResults from "@/components/SearchResults";
import SearchLinks from "@/components/SearchLinks";
import FlyerGenerator from "@/components/FlyerGenerator";
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
      // Step 1: AI Analysis
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

      // Step 2: Search shelters
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
    setShelterResults([]);
    setError(null);
  }, []);

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f0f1a]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PawLogo size={40} />
            <div>
              <h1 className="text-xl font-bold gradient-text">PawsitiveID</h1>
              <p className="text-xs text-gray-500">
                AI-Powered Pet Matching
              </p>
            </div>
          </div>
          {step === "results" && (
            <button
              onClick={handleReset}
              className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
            >
              + New Search
            </button>
          )}
        </div>
      </header>

      {/* Hero - only on upload step */}
      {step === "upload" && (
        <section className="max-w-3xl mx-auto px-4 pt-16 pb-8 text-center">
          <div className="mb-6">
            <PawLogo size={80} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Found a stray?</span>
            <br />
            <span className="text-white">Help them find home.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Upload a photo and our AI will identify the breed, features, and
            search shelters, rescues, and lost pet databases across your area.
          </p>
        </section>
      )}

      {/* Upload Section */}
      {step === "upload" && (
        <section className="max-w-3xl mx-auto px-4 py-8">
          <PhotoUpload onPhotoSelected={handlePhotoSelected} />

          {selectedFile && (
            <div className="mt-6 space-y-4 max-w-lg mx-auto">
              {/* Location input */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Where did you find this dog?
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State or Zip Code"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                />
              </div>

              {/* Analyze button */}
              <button
                onClick={handleAnalyze}
                disabled={!location.trim()}
                className="glow-btn w-full text-white font-bold py-4 rounded-xl text-lg"
              >
                Identify This Dog
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-center max-w-lg mx-auto">
              {error}
            </div>
          )}
        </section>
      )}

      {/* Analyzing Animation */}
      {step === "analyzing" && (
        <section className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="relative w-48 h-48 mx-auto mb-8">
            {/* Photo being scanned */}
            <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-orange-500/50 relative">
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Scanning"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="scan-line" />
            </div>
            {/* Pulse rings */}
            <div className="absolute inset-0 rounded-2xl border-2 border-orange-500/30 pulse-ring" />
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">
            {analysisStatus}
          </h3>
          <div className="flex justify-center gap-2 mt-4">
            <span className="w-3 h-3 rounded-full bg-orange-500 dot-1" />
            <span className="w-3 h-3 rounded-full bg-orange-500 dot-2" />
            <span className="w-3 h-3 rounded-full bg-orange-500 dot-3" />
          </div>
        </section>
      )}

      {/* Results */}
      {step === "results" && profile && (
        <section className="max-w-5xl mx-auto px-4 py-8 space-y-10">
          {/* Dog Profile */}
          <DogProfile profile={profile} photoPreview={photoPreview} />

          {/* Shelter Results */}
          <SearchResults
            results={shelterResults as never[]}
            source={shelterSource}
            dogBreed={profile.breed}
          />

          {/* Social Media Search Links */}
          <SearchLinks
            links={generateSearchLinks(profile, location)}
          />

          {/* Flyer Generator */}
          <FlyerGenerator
            profile={profile}
            photoPreview={photoPreview}
            location={location}
          />

          {/* Tips */}
          <div className="glass-card p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold gradient-text mb-4">
              Rescue Tips
            </h2>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex gap-3">
                <span className="text-orange-400 font-bold shrink-0">01</span>
                <p>
                  <strong>Don&apos;t chase.</strong> Sit nearby with food and let the dog
                  come to you. Scared dogs run from pursuit.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-orange-400 font-bold shrink-0">02</span>
                <p>
                  <strong>Set up a feeding station.</strong> Same spot, same
                  time daily. The dog will learn to trust the routine.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-orange-400 font-bold shrink-0">03</span>
                <p>
                  <strong>Contact local rescues.</strong> Many have humane traps
                  they can lend you and experience catching scared strays.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-orange-400 font-bold shrink-0">04</span>
                <p>
                  <strong>Check for a microchip.</strong> Any vet or shelter
                  will scan for free. This is the fastest way to find an owner.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-orange-400 font-bold shrink-0">05</span>
                <p>
                  <strong>Post the flyer.</strong> Use the flyer generator above
                  and post within a 2-mile radius of where you found the dog.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 text-sm">
        <p>
          PawsitiveID - Built with love for every lost paw.
        </p>
        <p className="mt-1">
          Every animal deserves to be found.
        </p>
      </footer>
    </main>
  );
}
