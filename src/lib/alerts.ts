import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

interface DogProfile {
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

// Haversine distance in miles
function distanceMiles(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 3959; // Earth's radius in miles
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
  profile: DogProfile,
  sub: AlertSubscription
): boolean {
  // Check breed filter
  if (sub.breedFilter) {
    const breedLower = profile.breed.toLowerCase();
    const filterLower = sub.breedFilter.toLowerCase();
    if (!breedLower.includes(filterLower) && !filterLower.includes(breedLower)) {
      return false;
    }
  }

  // Check size filter
  if (sub.sizeFilter && sub.sizeFilter !== profile.size) {
    return false;
  }

  // Check distance
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
  profile: DogProfile,
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
