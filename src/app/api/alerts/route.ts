import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getServerSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { geocodeLocation } from "@/lib/geocode";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { email, breedFilter, sizeFilter, locationText, radiusMiles } = body;

    if (!email?.trim() || !locationText?.trim()) {
      return NextResponse.json(
        { error: "Email and location are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();

    // Geocode location
    const coords = await geocodeLocation(locationText);

    const { error: insertError } = await supabase
      .from("alert_subscriptions")
      .insert({
        id: nanoid(12),
        email: email.trim().toLowerCase(),
        breed_filter: breedFilter || null,
        size_filter: sizeFilter || null,
        location_text: locationText.trim(),
        latitude: coords?.latitude || null,
        longitude: coords?.longitude || null,
        radius_miles: radiusMiles || 25,
        is_active: true,
        unsubscribe_token: nanoid(24),
      });

    if (insertError) {
      console.error("Alert subscription error:", insertError);
      return NextResponse.json(
        { error: "Failed to create alert" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Alert error:", error);
    return NextResponse.json(
      { error: "Failed to create alert" },
      { status: 500 }
    );
  }
}
