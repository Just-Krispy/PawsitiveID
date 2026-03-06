import { Metadata } from "next";
import { getServerSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { notFound } from "next/navigation";
import DogProfilePage from "@/components/DogProfilePage";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getDogProfile(id: string) {
  if (!isSupabaseConfigured()) return null;

  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("dog_profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
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
    createdAt: data.created_at,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = await getDogProfile(id);

  if (!profile) {
    return { title: "Dog Not Found - PawsitiveID" };
  }

  const title = `Found ${profile.breed} near ${profile.locationText} - PawsitiveID`;
  const description = profile.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: profile.photoUrl ? [{ url: profile.photoUrl, width: 800, height: 600 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: profile.photoUrl ? [profile.photoUrl] : undefined,
    },
  };
}

export default async function DogPage({ params }: PageProps) {
  const { id } = await params;
  const profile = await getDogProfile(id);

  if (!profile) {
    notFound();
  }

  return <DogProfilePage profile={profile} />;
}
