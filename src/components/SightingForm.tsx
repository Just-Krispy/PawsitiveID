"use client";

import { useState, FormEvent } from "react";
import LocationPicker from "@/components/LocationPicker";

interface SightingFormProps {
  dogProfileId: string;
  onSightingAdded: () => void;
}

export default function SightingForm({ dogProfileId, onSightingAdded }: SightingFormProps) {
  const [locationText, setLocationText] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [spottedAt, setSpottedAt] = useState(
    new Date().toISOString().slice(0, 16) // YYYY-MM-DDTHH:MM
  );
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!locationText.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/dogs/${dogProfileId}/sightings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationText: locationText.trim(),
          latitude,
          longitude,
          notes: notes.trim() || null,
          reporterName: reporterName.trim() || null,
          spottedAt: new Date(spottedAt).toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit sighting");
      }

      setSuccess(true);
      setLocationText("");
      setNotes("");
      setReporterName("");
      setLatitude(null);
      setLongitude(null);
      onSightingAdded();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-6" role="region" aria-label="Report a sighting">
      <h3 className="text-lg font-bold gradient-text mb-3">
        Report a Sighting
      </h3>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        Seen this dog? Help track their location so we can bring them home.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="sighting-location" className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            Where did you see this dog? *
          </label>
          <LocationPicker
            id="sighting-location"
            value={locationText}
            onChange={setLocationText}
            onCoordsChange={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
            }}
            placeholder="Address, intersection, or landmark"
          />
        </div>

        <div>
          <label htmlFor="sighting-time" className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            When did you see them?
          </label>
          <input
            id="sighting-time"
            type="datetime-local"
            value={spottedAt}
            onChange={(e) => setSpottedAt(e.target.value)}
            className="w-full px-4 py-3 rounded-xl paw-input"
          />
        </div>

        <div>
          <label htmlFor="sighting-notes" className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            Notes (direction heading, behavior, etc.)
          </label>
          <textarea
            id="sighting-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Heading north on Main St, seemed scared"
            rows={3}
            className="w-full px-4 py-3 rounded-xl paw-input resize-none"
          />
        </div>

        <div>
          <label htmlFor="sighting-name" className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            Your name (optional)
          </label>
          <input
            id="sighting-name"
            type="text"
            value={reporterName}
            onChange={(e) => setReporterName(e.target.value)}
            placeholder="Anonymous if blank"
            className="w-full px-4 py-3 rounded-xl paw-input"
          />
        </div>

        {/* Honeypot field for spam prevention */}
        <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        {error && (
          <div role="alert" className="p-3 rounded-lg text-sm" style={{ background: "var(--error-bg)", color: "var(--error-text)" }}>
            {error}
          </div>
        )}

        {success && (
          <div role="status" className="p-3 rounded-lg text-sm" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>
            Sighting reported! Thank you for helping.
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !locationText.trim()}
          className="glow-btn w-full py-3 rounded-xl text-sm font-semibold"
        >
          {submitting ? "Submitting..." : "Report Sighting"}
        </button>
      </form>
    </div>
  );
}
