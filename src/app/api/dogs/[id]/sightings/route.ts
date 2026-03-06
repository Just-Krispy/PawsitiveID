import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getServerSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { geocodeLocation } from "@/lib/geocode";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ sightings: [] });
  }

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("sightings")
      .select("*")
      .eq("dog_profile_id", id)
      .order("spotted_at", { ascending: false });

    if (error) {
      return NextResponse.json({ sightings: [] });
    }

    const sightings = (data || []).map((s) => ({
      id: s.id,
      dogProfileId: s.dog_profile_id,
      locationText: s.location_text,
      latitude: s.latitude,
      longitude: s.longitude,
      spottedAt: s.spotted_at,
      notes: s.notes,
      reporterName: s.reporter_name,
      photoUrl: s.photo_url,
      createdAt: s.created_at,
    }));

    return NextResponse.json({ sightings });
  } catch {
    return NextResponse.json({ sightings: [] });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { locationText, latitude, longitude, notes, reporterName, spottedAt } = body;

    if (!locationText?.trim()) {
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();

    // Verify the dog profile exists
    const { data: profile } = await supabase
      .from("dog_profiles")
      .select("id")
      .eq("id", id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: "Dog profile not found" },
        { status: 404 }
      );
    }

    // Geocode if coordinates not provided
    let lat = latitude;
    let lng = longitude;
    if (!lat || !lng) {
      const coords = await geocodeLocation(locationText);
      if (coords) {
        lat = coords.latitude;
        lng = coords.longitude;
      }
    }

    const sightingId = nanoid(12);
    const { error: insertError } = await supabase
      .from("sightings")
      .insert({
        id: sightingId,
        dog_profile_id: id,
        location_text: locationText.trim(),
        latitude: lat || null,
        longitude: lng || null,
        spotted_at: spottedAt || new Date().toISOString(),
        notes: notes || null,
        reporter_name: reporterName || null,
      });

    if (insertError) {
      console.error("Sighting insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save sighting" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: sightingId, success: true });
  } catch (error) {
    console.error("Sighting error:", error);
    return NextResponse.json(
      { error: "Failed to submit sighting" },
      { status: 500 }
    );
  }
}
