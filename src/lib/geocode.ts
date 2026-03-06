interface GeocodingResult {
  latitude: number;
  longitude: number;
}

export async function geocodeLocation(locationText: string): Promise<GeocodingResult | null> {
  try {
    const encoded = encodeURIComponent(locationText);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "PawsitiveID/1.0 (pet-matching-app)",
        },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    if (!data || data.length === 0) return null;

    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  } catch {
    console.error("Geocoding failed for:", locationText);
    return null;
  }
}
