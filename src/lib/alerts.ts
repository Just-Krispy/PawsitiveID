import { Resend } from "resend";
import webpush from "web-push";
import { getServerSupabase, isSupabaseConfigured } from "@/lib/supabase";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function configureWebPush() {
  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  if (vapidPublic && vapidPrivate) {
    webpush.setVapidDetails(
      "mailto:alerts@pawsitiveid.vercel.app",
      vapidPublic,
      vapidPrivate
    );
    return true;
  }
  return false;
}

export interface AlertDogProfile {
  id: string;
  breed: string;
  color: string;
  size: string;
  description: string;
  photoUrl: string;
  locationText: string;
  latitude: number | null;
  longitude: number | null;
}

interface AlertSubscription {
  id: string;
  email: string;
  breedFilter: string | null;
  sizeFilter: string | null;
  locationText: string;
  latitude: number | null;
  longitude: number | null;
  radiusMiles: number;
  unsubscribeToken: string;
}

interface PushSub {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  breedFilter: string | null;
  sizeFilter: string | null;
  latitude: number | null;
  longitude: number | null;
  radiusMiles: number;
}

// Haversine distance in miles
function distanceMiles(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function matchesSubscription(
  profile: AlertDogProfile,
  sub: { breedFilter: string | null; sizeFilter: string | null; latitude: number | null; longitude: number | null; radiusMiles: number }
): boolean {
  if (sub.breedFilter) {
    const breedLower = profile.breed.toLowerCase();
    const filterLower = sub.breedFilter.toLowerCase();
    if (!breedLower.includes(filterLower) && !filterLower.includes(breedLower)) {
      return false;
    }
  }

  if (sub.sizeFilter && sub.sizeFilter !== profile.size) {
    return false;
  }

  if (profile.latitude && profile.longitude && sub.latitude && sub.longitude) {
    const dist = distanceMiles(
      profile.latitude, profile.longitude,
      sub.latitude, sub.longitude
    );
    if (dist > sub.radiusMiles) {
      return false;
    }
  }

  return true;
}

export async function sendAlertEmail(
  sub: AlertSubscription,
  profile: AlertDogProfile,
  baseUrl: string
): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) return false;

  try {
    const profileUrl = `${baseUrl}/dog/${profile.id}`;
    const unsubscribeUrl = `${baseUrl}/api/alerts/unsubscribe?token=${sub.unsubscribeToken}`;

    await getResend().emails.send({
      from: "PawsitiveID <alerts@pawsitiveid.vercel.app>",
      to: sub.email,
      subject: `Found ${profile.breed} near ${profile.locationText}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e2e8f0; padding: 24px; border-radius: 12px;">
          <h1 style="color: #f97316; margin-bottom: 8px;">New Match Found!</h1>
          <p style="color: #94a3b8; margin-bottom: 24px;">A dog matching your alert was just reported near ${profile.locationText}.</p>

          ${profile.photoUrl ? `<img src="${profile.photoUrl}" alt="Found ${profile.breed}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 12px; margin-bottom: 16px;" />` : ""}

          <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            <h2 style="color: #f97316; font-size: 18px; margin: 0 0 8px;">${profile.breed}</h2>
            <p style="margin: 0 0 4px; color: #cbd5e1;">${profile.description}</p>
            <p style="margin: 8px 0 0; color: #94a3b8; font-size: 14px;">
              <strong>Color:</strong> ${profile.color} &bull;
              <strong>Size:</strong> ${profile.size} &bull;
              <strong>Location:</strong> ${profile.locationText}
            </p>
          </div>

          <a href="${profileUrl}" style="display: inline-block; background: linear-gradient(135deg, #f97316, #f59e0b); color: #000; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-bottom: 24px;">
            View Full Profile
          </a>

          <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
            You're receiving this because you subscribed to PawsitiveID alerts for ${sub.breedFilter || "all breeds"} near ${sub.locationText}.
            <br/>
            <a href="${unsubscribeUrl}" style="color: #94a3b8;">Unsubscribe</a>
          </p>
        </div>
      `,
    });

    return true;
  } catch (err) {
    console.error("Failed to send alert email:", err);
    return false;
  }
}

/**
 * Send push notifications to matching push subscribers.
 * Removes stale subscriptions that return 404/410.
 */
async function sendPushNotifications(
  profile: AlertDogProfile,
  baseUrl: string
): Promise<number> {
  if (!configureWebPush()) return 0;
  if (!isSupabaseConfigured()) return 0;

  const supabase = getServerSupabase();
  const { data: pushSubs } = await supabase
    .from("push_subscriptions")
    .select("*");

  if (!pushSubs || pushSubs.length === 0) return 0;

  let sent = 0;
  const staleIds: string[] = [];

  for (const row of pushSubs) {
    const sub: PushSub = {
      id: row.id,
      endpoint: row.endpoint,
      p256dh: row.p256dh,
      auth: row.auth,
      breedFilter: row.breed_filter,
      sizeFilter: row.size_filter,
      latitude: row.latitude,
      longitude: row.longitude,
      radiusMiles: row.radius_miles,
    };

    if (!matchesSubscription(profile, sub)) continue;

    const payload = JSON.stringify({
      title: `Found ${profile.breed}!`,
      body: `${profile.breed} spotted near ${profile.locationText}. ${profile.description.slice(0, 80)}`,
      icon: profile.photoUrl || "/icon-192.png",
      url: `${baseUrl}/dog/${profile.id}`,
    });

    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        payload
      );
      sent++;
    } catch (err: unknown) {
      const statusCode = (err as { statusCode?: number }).statusCode;
      if (statusCode === 404 || statusCode === 410) {
        staleIds.push(sub.id);
      } else {
        console.error("Push notification error:", err);
      }
    }
  }

  // Clean up stale subscriptions
  if (staleIds.length > 0) {
    await supabase
      .from("push_subscriptions")
      .delete()
      .in("id", staleIds);
  }

  return sent;
}

/**
 * Trigger alerts (email + push) for a newly found dog.
 * Called from the analyze route (real-time) and as a safety net from the cron.
 */
export async function triggerAlertsForDog(
  profile: AlertDogProfile,
  baseUrl: string
): Promise<{ emailsSent: number; pushSent: number }> {
  if (!isSupabaseConfigured()) return { emailsSent: 0, pushSent: 0 };

  const supabase = getServerSupabase();

  // Get active email subscriptions
  const { data: subscriptions } = await supabase
    .from("alert_subscriptions")
    .select("*")
    .eq("is_active", true);

  let emailsSent = 0;

  if (subscriptions) {
    for (const subRow of subscriptions) {
      const sub: AlertSubscription = {
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
        if (success) emailsSent++;
      }
    }
  }

  // Send push notifications
  const pushSent = await sendPushNotifications(profile, baseUrl);

  // Mark this dog as alerted so the cron doesn't re-process it
  await supabase
    .from("dog_profiles")
    .update({ last_alerted: new Date().toISOString() })
    .eq("id", profile.id);

  return { emailsSent, pushSent };
}
