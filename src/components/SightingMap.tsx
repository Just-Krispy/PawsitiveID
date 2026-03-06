"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPin {
  id: string;
  latitude: number;
  longitude: number;
  breed?: string;
  locationText: string;
  photoUrl?: string;
  type: "profile" | "sighting";
  date: string;
  dogProfileId?: string;
}

interface SightingMapProps {
  pins: MapPin[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export default function SightingMap({
  pins,
  center = [27.87, -82.33], // Riverview, FL default
  zoom = 11,
  height = "500px",
}: SightingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(center, zoom);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    if (pins.length === 0) return;

    const bounds: L.LatLngExpression[] = [];

    pins.forEach((pin) => {
      if (!pin.latitude || !pin.longitude) return;

      const latLng: L.LatLngExpression = [pin.latitude, pin.longitude];
      bounds.push(latLng);

      const icon = L.divIcon({
        className: "custom-map-pin",
        html: `<div style="
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          background: ${pin.type === "profile" ? "#f97316" : "#3b82f6"};
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          <span style="transform: rotate(45deg); font-size: 14px;">
            ${pin.type === "profile" ? "🐕" : "👁"}
          </span>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker(latLng, { icon }).addTo(map);

      const popupContent = `
        <div style="min-width: 150px; font-family: system-ui, sans-serif;">
          ${pin.photoUrl ? `<img src="${pin.photoUrl}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" alt="Dog photo" />` : ""}
          <strong style="color: #f97316;">${pin.breed || "Unknown breed"}</strong>
          <br/>
          <span style="font-size: 12px; color: #666;">${pin.locationText}</span>
          <br/>
          <span style="font-size: 11px; color: #999;">${pin.type === "profile" ? "Found" : "Sighting"} - ${new Date(pin.date).toLocaleDateString()}</span>
          ${pin.dogProfileId ? `<br/><a href="/dog/${pin.dogProfileId}" style="font-size: 12px; color: #f97316;">View Profile →</a>` : ""}
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    if (bounds.length > 0) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40], maxZoom: 14 });
    }
  }, [pins]);

  return (
    <div
      ref={mapRef}
      style={{ height, width: "100%", borderRadius: "12px", overflow: "hidden" }}
      role="application"
      aria-label="Sighting map showing locations of found dogs and community sightings"
    />
  );
}
