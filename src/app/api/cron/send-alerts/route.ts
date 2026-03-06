import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { matchesSubscription, sendAlertEmail } from "@/lib/alerts";

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized triggers
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const supabase = getServerSupabase();

    // Get dog profiles created in the last 24 hours (daily cron on Hobby plan)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const fifteenMinAgo = oneDayAgo;
    const { data: newProfiles } = await supabase
      .from("dog_profiles")
      .select("*")
      .gte("created_at", fifteenMinAgo);

    if (!newProfiles || newProfiles.length === 0) {
      return NextResponse.json({ message: "No new profiles", sent: 0 });
    }

    // Get active subscriptions
    const { data: subscriptions } = await supabase
      .from("alert_subscriptions")
      .select("*")
      .eq("is_active", true);

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: "No active subscriptions", sent: 0 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pawsitiveid.vercel.app";
    let sent = 0;

    for (const profileRow of newProfiles) {
      const profile = {
        id: profileRow.id,
        breed: profileRow.breed,
        color: profileRow.color,
        size: profileRow.size,
        description: profileRow.description,
        photoUrl: profileRow.photo_url,
        locationText: profileRow.location_text,
        latitude: profileRow.latitude,
        longitude: profileRow.longitude,
      };

      for (const subRow of subscriptions) {
        const sub = {
          id: subRow.id,
          email: subRow.email,
          breedFilter: subRow.breed_filter,
          sizeFilter: subRow.size_filter,
          locationText: subRow.location_text,
          latitude: subRow.latitude,
          longitude: subRow.longitude,
          radiusMiles: subRow.radius_miles,
          unsubscribeToken: subRow.unsubscribe_token,
        };

        if (matchesSubscription(profile, sub)) {
          const success = await sendAlertEmail(sub, profile, baseUrl);
          if (success) sent++;
        }
      }
    }

    return NextResponse.json({
      message: `Processed ${newProfiles.length} profiles, ${subscriptions.length} subscriptions`,
      sent,
    });
  } catch (error) {
    console.error("Cron send-alerts error:", error);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
