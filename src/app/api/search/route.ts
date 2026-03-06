import { NextRequest, NextResponse } from "next/server";
import { searchPetfinder } from "@/lib/petfinder";
import { searchRescueGroups } from "@/lib/rescuegroups";

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
    const hasRescueGroupsCreds = !!process.env.RESCUEGROUPS_API_KEY;

    // Run both API searches in parallel
    const [petfinderResult, rescueGroupsResult] = await Promise.allSettled([
      hasPetfinderCreds
        ? (async () => {
            const found = await searchPetfinder({
              breed: breed || undefined,
              size: size || undefined,
              color: color || undefined,
              location,
              distance: 50,
              status: "found",
              limit: 20,
            });
            const adoptable = await searchPetfinder({
              breed: breed || undefined,
              size: size || undefined,
              location,
              distance: 50,
              status: "adoptable",
              limit: 20,
            });
            return [...found, ...adoptable].map((r) => ({
              ...r,
              _source: "petfinder" as const,
            }));
          })()
        : Promise.resolve([]),

      hasRescueGroupsCreds
        ? searchRescueGroups({
            breed: breed || undefined,
            size: size || undefined,
            color: color || undefined,
            postalcode: location,
            distance: 50,
            limit: 20,
          })
        : Promise.resolve([]),
    ]);

    const petfinderResults =
      petfinderResult.status === "fulfilled" ? petfinderResult.value : [];
    const rescueGroupsResults =
      rescueGroupsResult.status === "fulfilled" ? rescueGroupsResult.value : [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let allResults: any[] = [...petfinderResults, ...rescueGroupsResults];

    // If no real results and no API keys configured, show demo data
    if (allResults.length === 0 && !hasPetfinderCreds && !hasRescueGroupsCreds) {
      allResults = generateDemoResults(breed, color, size, location);
    }

    const sources: Record<string, number> = {};
    if (petfinderResults.length > 0) sources.petfinder = petfinderResults.length;
    if (rescueGroupsResults.length > 0) sources.rescuegroups = rescueGroupsResults.length;

    return NextResponse.json({
      results: allResults,
      source: hasPetfinderCreds || hasRescueGroupsCreds
        ? Object.keys(sources).join("+") || "api"
        : "demo",
      sources,
      totalResults: allResults.length,
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
  const shelters = [
    "Hillsborough County Pet Resource Center",
    "SPCA Tampa Bay",
  ];

  return [
    {
      id: 1,
      name: "Unknown - Found Stray",
      breeds: { primary: breed || "Mixed Breed", secondary: null, mixed: true },
      colors: { primary: color || "Tan", secondary: null },
      age: "Adult",
      gender: "Unknown",
      size: size || "Medium",
      description: `Found stray, possible ${breed || "mixed breed"}. ${color || "Tan"} coat. Brought in by good samaritan.`,
      photos: [],
      status: "found",
      distance: 3.2,
      contact: {
        phone: "(813) 555-0100",
        address: { city: "Tampa", state: "FL", postcode: "33619" },
      },
      url: "#demo",
      published_at: new Date().toISOString(),
      _demo: true,
      _shelter: shelters[0],
      _source: "demo" as const,
    },
    {
      id: 2,
      name: "Buddy",
      breeds: { primary: breed || "Labrador Retriever", secondary: "Shepherd", mixed: true },
      colors: { primary: color || "Golden", secondary: "White" },
      age: "Young",
      gender: "Male",
      size: size || "Large",
      description: `Sweet ${breed || "Lab mix"} found wandering near ${location}. Wearing faded collar, no tags.`,
      photos: [],
      status: "adoptable",
      distance: 5.8,
      contact: {
        phone: "(813) 555-0200",
        address: { city: "Riverview", state: "FL", postcode: "33578" },
      },
      url: "#demo",
      published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      _demo: true,
      _shelter: shelters[1],
      _source: "demo" as const,
    },
  ];
}
