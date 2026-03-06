"use client";

import { useState } from "react";

interface LocationPickerProps {
  value: string;
  onChange: (value: string) => void;
  onCoordsChange?: (lat: number, lng: number) => void;
  placeholder?: string;
  id?: string;
}

export default function LocationPicker({
  value,
  onChange,
  onCoordsChange,
  placeholder = "City, State or address",
  id = "location-picker",
}: LocationPickerProps) {
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        onCoordsChange?.(latitude, longitude);

        // Reverse geocode to get readable location name
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "User-Agent": "PawsitiveID/1.0" } }
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || "";
          const state = data.address?.state || "";
          if (city && state) {
            onChange(`${city}, ${state}`);
          } else {
            onChange(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch {
          onChange(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
        setGettingLocation(false);
      },
      () => {
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="flex gap-2">
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-3 rounded-xl paw-input"
        autoComplete="address-level2"
      />
      <button
        type="button"
        onClick={handleUseMyLocation}
        disabled={gettingLocation}
        className="px-3 py-2 rounded-xl text-sm font-medium transition-colors shrink-0"
        style={{
          background: "var(--bg-secondary)",
          color: "var(--paw-orange)",
          border: "1px solid var(--border-card)",
        }}
        aria-label="Use my current GPS location"
        title="Use my location"
      >
        {gettingLocation ? (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </button>
    </div>
  );
}
