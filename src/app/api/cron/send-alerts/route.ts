import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, getServerSupabase } from "@/lib/supabase";
import { triggerAlertsForDog } from "@/lib/alerts";
import type { AlertDogProfile } from "@/lib/alerts";

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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pawsitiveid.vercel.app";

    // Safety net: get dogs from the last 24 hours that weren't already alerted in real-time
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: newProfiles } = await supabase
      .from("dog_profiles")
      .select("*")
      .gte("created_at", oneDayAgo)
      .is("last_alerted", null);

    if (!newProfiles || newProfiles.length === 0) {
      return NextResponse.json({ message: "No un-alerted profiles", sent: 0 });
    }

    let totalEmails = 0;
    let totalPush = 0;

    for (const row of newProfiles) {
      const profile: AlertDogProfile = {
        id: row.id,
        breed: row.breed,
        color: row.color,
        size: row.size,
        description: row.description,
        photoUrl: row.photo_url,
        locationText: row.location_text,
        latitude: row.latitude,
        longitude: row.longitude,
      };

      const result = await triggerAlertsForDog(profile, baseUrl);
      totalEmails += result.emailsSent;
      totalPush += result.pushSent;
    }

    return NextResponse.json({
      message: `Safety net: processed ${newProfiles.length} un-alerted profiles`,
      emailsSent: totalEmails,
      pushSent: totalPush,
    });
  } catch (error) {
    console.error("Cron send-alerts error:", error);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
