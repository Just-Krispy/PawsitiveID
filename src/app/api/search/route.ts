import { NextRequest, NextResponse } from "next/server";
import { searchPetfinder } from "@/lib/petfinder";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { breed, color, size, location } = body;

    if (!location) {
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      );
    }

    const hasPetfinderCreds =
      process.env.PETFINDER_API_KEY && process.env.PETFINDER_API_SECRET;

    let shelterResults: unknown[] = [];

    if (hasPetfinderCreds) {
      try {
        // Search for found dogs first
        const found = await searchPetfinder({
          breed: breed || undefined,
          size: size || undefined,
          color: color || undefined,
          location,
          distance: 50,
          status: "found",
          limit: 20,
        });

        // Also search adoptable (recently intake'd strays often go straight to adoptable)
        const adoptable = await searchPetfinder({
          breed: breed || undefined,
          size: size || undefined,
          location,
          distance: 50,
          status: "adoptable",
          limit: 20,
        });

        shelterResults = [...found, ...adoptable];
      } catch (err) {
        console.error("Petfinder search error:", err);
      }
    }

    // Generate mock results if no API keys configured (for demo/development)
    if (shelterResults.length === 0 && !hasPetfinderCreds) {
      shelterResults = generateDemoResults(breed, color, size, location);
    }

    return NextResponse.json({
      results: shelterResults,
      source: hasPetfinderCreds ? "petfinder" : "demo",
      totalResults: shelterResults.length,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed. Please try again." },
      { status: 500 }
    );
  }
}

function generateDemoResults(
  breed: string,
  color: string,
  size: string,
  location: string
) {
  // Generate realistic demo results for development/testing
  const shelters = [
    "Hillsborough County Pet Resource Center",
    "SPCA Tampa Bay",
    "Humane Society of Tampa Bay",
    "Pet Pal Animal Shelter",
    "Big Cat Rescue (Small Animal Division)",
  ];

  return [
    {
      id: 1,
      name: "Unknown - Found Stray",
      species: "Dog",
      breeds: { primary: breed || "Mixed Breed", secondary: null, mixed: true },
      colors: { primary: color || "Tan", secondary: null, tertiary: null },
      age: "Adult",
      gender: "Unknown",
      size: size || "Medium",
      description: `Found stray, possible ${breed || "mixed breed"}. ${color || "Tan"} coat. Brought in by good samaritan.`,
      photos: [],
      status: "found",
      distance: 3.2,
      contact: {
        email: "info@example.com",
        phone: "(813) 555-0100",
        address: { city: "Tampa", state: "FL", postcode: "33619" },
      },
      organization_id: "FL001",
      url: "#demo",
      published_at: new Date().toISOString(),
      _demo: true,
      _shelter: shelters[0],
    },
    {
      id: 2,
      name: "Buddy",
      species: "Dog",
      breeds: {
        primary: breed || "Labrador Retriever",
        secondary: "Shepherd",
        mixed: true,
      },
      colors: {
        primary: color || "Golden",
        secondary: "White",
        tertiary: null,
      },
      age: "Young",
      gender: "Male",
      size: size || "Large",
      description: `Sweet ${breed || "Lab mix"} found wandering near ${location}. Wearing faded collar, no tags.`,
      photos: [],
      status: "adoptable",
      distance: 5.8,
      contact: {
        email: "adopt@example.com",
        phone: "(813) 555-0200",
        address: { city: "Riverview", state: "FL", postcode: "33578" },
      },
      organization_id: "FL002",
      url: "#demo",
      published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      _demo: true,
      _shelter: shelters[1],
    },
  ];
}
