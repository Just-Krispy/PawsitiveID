import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
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
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("dog_profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Dog profile not found" },
        { status: 404 }
      );
    }

    // Transform snake_case DB columns to camelCase for frontend
    const profile = {
      id: data.id,
      breed: data.breed,
      color: data.color,
      size: data.size,
      distinguishingFeatures: data.distinguishing_features || [],
      hasCollar: data.has_collar,
      collarDescription: data.collar_description,
      estimatedAge: data.estimated_age,
      gender: data.gender,
      description: data.description,
      confidence: data.confidence,
      healthNotes: data.health_notes,
      photoUrl: data.photo_url,
      locationText: data.location_text,
      latitude: data.latitude,
      longitude: data.longitude,
      reporterName: data.reporter_name,
      reporterEmail: data.reporter_email,
      shelterResults: data.shelter_results || [],
      createdAt: data.created_at,
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Fetch profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
