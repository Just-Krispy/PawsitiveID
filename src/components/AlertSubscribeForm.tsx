"use client";

import { useState, FormEvent } from "react";
import LocationPicker from "@/components/LocationPicker";

export default function AlertSubscribeForm() {
  const [email, setEmail] = useState("");
  const [breedFilter, setBreedFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [locationText, setLocationText] = useState("Riverview, FL");
  const [radiusMiles, setRadiusMiles] = useState(25);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !locationText.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          breedFilter: breedFilter.trim() || null,
          sizeFilter: sizeFilter || null,
          locationText: locationText.trim(),
          radiusMiles,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to subscribe");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="glass-card p-8 max-w-lg mx-auto text-center" role="status">
        <div className="mb-4">
          <svg className="mx-auto w-16 h-16" style={{ color: "#22c55e" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Alert Set!
        </h3>
        <p style={{ color: "var(--text-secondary)" }}>
          We&apos;ll email you at <strong>{email}</strong> when a matching dog is found near {locationText}.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setEmail("");
            setBreedFilter("");
            setSizeFilter("");
          }}
          className="mt-4 text-sm underline"
          style={{ color: "var(--paw-orange)" }}
        >
          Set up another alert
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 max-w-lg mx-auto" role="region" aria-label="Subscribe to alerts">
      <h3 className="text-lg font-bold gradient-text mb-2">Get Notified</h3>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        Receive an email when a matching dog is found near you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="alert-email" className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            Email address *
          </label>
          <input
            id="alert-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl paw-input"
          />
        </div>

        <div>
          <label htmlFor="alert-breed" className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            Breed (leave blank for any)
          </label>
          <input
            id="alert-breed"
            type="text"
            value={breedFilter}
            onChange={(e) => setBreedFilter(e.target.value)}
            placeholder="e.g., Golden Retriever, Lab Mix"
            className="w-full px-4 py-3 rounded-xl paw-input"
          />
        </div>

        <div>
          <label htmlFor="alert-size" className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            Size
          </label>
          <select
            id="alert-size"
            value={sizeFilter}
            onChange={(e) => setSizeFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl paw-input"
          >
            <option value="">Any size</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="xlarge">Extra Large</option>
          </select>
        </div>

        <div>
          <label htmlFor="alert-location" className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            Your area *
          </label>
          <LocationPicker
            id="alert-location"
            value={locationText}
            onChange={setLocationText}
            placeholder="City, State"
          />
        </div>

        <div>
          <label htmlFor="alert-radius" className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            Search radius: {radiusMiles} miles
          </label>
          <input
            id="alert-radius"
            type="range"
            min={5}
            max={100}
            step={5}
            value={radiusMiles}
            onChange={(e) => setRadiusMiles(parseInt(e.target.value))}
            className="w-full"
            style={{ accentColor: "var(--paw-orange)" }}
          />
          <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
            <span>5 mi</span>
            <span>100 mi</span>
          </div>
        </div>

        {error && (
          <div role="alert" className="p-3 rounded-lg text-sm" style={{ background: "var(--error-bg)", color: "var(--error-text)" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !email.trim() || !locationText.trim()}
          className="glow-btn w-full py-3 rounded-xl text-sm font-semibold"
        >
          {submitting ? "Setting up alert..." : "Create Alert"}
        </button>

        <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
          You can unsubscribe anytime from the email we send.
        </p>
      </form>
    </div>
  );
}
