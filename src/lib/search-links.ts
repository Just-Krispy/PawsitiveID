export interface DogProfile {
  breed: string;
  color: string;
  size: string;
  distinguishingFeatures: string[];
  hasCollar: boolean;
  collarDescription?: string;
  estimatedAge: string;
  gender?: string;
  description: string;
}

export interface SearchLink {
  platform: string;
  url: string;
  icon: string;
  description: string;
}

export function generateSearchLinks(
  profile: DogProfile,
  location: string
): SearchLink[] {
  const keywords = [
    "lost dog",
    profile.breed,
    profile.color,
    location,
  ]
    .filter(Boolean)
    .join(" ");

  const encodedKeywords = encodeURIComponent(keywords);
  const encodedFoundDog = encodeURIComponent(
    `found dog ${profile.breed} ${profile.color} ${location}`
  );

  return [
    {
      platform: "Facebook",
      url: `https://www.facebook.com/search/posts/?q=${encodedKeywords}`,
      icon: "fb",
      description: `Search Facebook for "${keywords}"`,
    },
    {
      platform: "Facebook Groups",
      url: `https://www.facebook.com/search/groups/?q=${encodeURIComponent(
        `lost pets ${location}`
      )}`,
      icon: "fb",
      description: "Find local lost pet Facebook groups",
    },
    {
      platform: "Craigslist",
      url: `https://tampa.craigslist.org/search/laf?query=${encodeURIComponent(
        `dog ${profile.breed} ${profile.color}`
      )}`,
      icon: "cl",
      description: "Search Craigslist Lost & Found",
    },
    {
      platform: "Nextdoor",
      url: `https://nextdoor.com/search/?query=${encodedFoundDog}`,
      icon: "nd",
      description: "Search Nextdoor for lost pet posts",
    },
    {
      platform: "PawBoost",
      url: `https://www.pawboost.com/lost-found-pets?query=${encodeURIComponent(
        `${profile.breed} ${profile.color}`
      )}`,
      icon: "pb",
      description: "Search PawBoost lost pet database",
    },
    {
      platform: "Petco Love Lost",
      url: "https://lost.petcolove.org/",
      icon: "pl",
      description: "Upload photo to Petco Love Lost facial recognition",
    },
    {
      platform: "Petfinder",
      url: `https://www.petfinder.com/search/dogs-for-adoption/?breed%5B0%5D=${encodeURIComponent(
        profile.breed
      )}&location=${encodeURIComponent(location)}&distance=50`,
      icon: "pf",
      description: "Search Petfinder shelter listings",
    },
  ];
}

export function generateFlyerText(profile: DogProfile, location: string): string {
  const features = profile.distinguishingFeatures.join(", ");
  const collar = profile.hasCollar
    ? `Has a collar${profile.collarDescription ? `: ${profile.collarDescription}` : ""}`
    : "No collar observed";

  return [
    "FOUND DOG",
    "",
    `Breed: ${profile.breed}`,
    `Color: ${profile.color}`,
    `Size: ${profile.size}`,
    `Estimated Age: ${profile.estimatedAge}`,
    profile.gender ? `Gender: ${profile.gender}` : "",
    `Distinguishing Features: ${features}`,
    collar,
    "",
    `Found near: ${location}`,
    "",
    "If this is your dog, please contact:",
    "[YOUR CONTACT INFO]",
    "",
    "Scan the QR code to view more photos and details.",
  ]
    .filter((line) => line !== "")
    .join("\n");
}
