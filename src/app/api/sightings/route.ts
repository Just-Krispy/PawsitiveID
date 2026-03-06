import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ sightings: [], profiles: [] });
  }

  const { searchParams } = new URL(request.url);
  const minLat = searchParams.get("minLat");
  const maxLat = searchParams.get("maxLat");
  const minLng = searchParams.get("minLng");
  const maxLng = searchParams.get("maxLng");

  try {
    const supabase = getServerSupabase();

    // Fetch dog profiles with coordinates
    let profilesQuery = supabase
      .from("dog_profiles")
      .select("id, breed, color, photo_url, location_text, latitude, longitude, created_at")
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .order("created_at", { ascending: false })
      .limit(200);

    if (minLat && maxLat && minLng && maxLng) {
      profilesQuery = profilesQuery
        .gte("latitude", parseFloat(minLat))
        .lte("latitude", parseFloat(maxLat))
        .gte("longitude", parseFloat(minLng))
        .lte("longitude", parseFloat(maxLng));
    }

    // Fetch sightings with coordinates
    let sightingsQuery = supabase
      .from("sightings")
      .select("id, dog_profile_id, location_text, latitude, longitude, spotted_at, notes")
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .order("spotted_at", { ascending: false })
      .limit(500);

    if (minLat && maxLat && minLng && maxLng) {
      sightingsQuery = sightingsQuery
        .gte("latitude", parseFloat(minLat))
        .lte("latitude", parseFloat(maxLat))
        .gte("longitude", parseFloat(minLng))
        .lte("longitude", parseFloat(maxLng));
    }

    const [profilesRes, sightingsRes] = await Promise.all([
      profilesQuery,
      sightingsQuery,
    ]);

    const profiles = (profilesRes.data || []).map((p) => ({
      id: p.id,
      breed: p.breed,
      photoUrl: p.photo_url,
      locationText: p.location_text,
      latitude: p.latitude,
      longitude: p.longitude,
      type: "profile" as const,
      date: p.created_at,
      dogProfileId: p.id,
    }));

    const sightings = (sightingsRes.data || []).map((s) => ({
      id: s.id,
      locationText: s.location_text,
      latitude: s.latitude,
      longitude: s.longitude,
      type: "sighting" as const,
      date: s.spotted_at,
      dogProfileId: s.dog_profile_id,
      notes: s.notes,
    }));

    return NextResponse.json({ profiles, sightings });
  } catch {
    return NextResponse.json({ profiles: [], sightings: [] });
  }
}
