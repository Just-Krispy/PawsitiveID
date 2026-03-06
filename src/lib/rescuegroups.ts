interface RescueGroupsSearchParams {
  breed?: string;
  size?: string;
  color?: string;
  postalcode: string;
  distance?: number;
  limit?: number;
}

interface NormalizedAnimal {
  id: number;
  name: string;
  breeds: { primary: string | null; secondary: string | null; mixed: boolean };
  colors: { primary: string | null; secondary: string | null };
  age: string;
  gender: string;
  size: string;
  description: string | null;
  photos: { medium: string; large: string }[];
  status: string;
  distance: number | null;
  contact: {
    phone: string | null;
    address: { city: string; state: string; postcode: string };
  };
  url: string;
  published_at: string;
  _source: "rescuegroups";
}

export async function searchRescueGroups(
  params: RescueGroupsSearchParams
): Promise<NormalizedAnimal[]> {
  const apiKey = process.env.RESCUEGROUPS_API_KEY;
  if (!apiKey) return [];

  try {
    // RescueGroups v5 public API uses JSON:API format
    const body: Record<string, unknown> = {
      data: {
        filterRadius: {
          miles: params.distance || 50,
          postalcode: params.postalcode,
        },
        filters: [
          {
            fieldName: "animals.species",
            operation: "equal",
            criteria: "dogs",
          },
        ],
      },
    };

    // Add breed filter
    if (params.breed) {
      (body.data as Record<string, unknown[]>).filters = [
        ...((body.data as Record<string, unknown[]>).filters || []),
        {
          fieldName: "animals.breedPrimary",
          operation: "contains",
          criteria: params.breed,
        },
      ];
    }

    const res = await fetch(
      "https://api.rescuegroups.org/v5/public/animals/search/available",
      {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/vnd.api+json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    return normalizeResults(data, params.limit || 20);
  } catch (err) {
    console.error("RescueGroups search error:", err);
    return [];
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizeResults(data: any, limit: number): NormalizedAnimal[] {
  if (!data?.data || !Array.isArray(data.data)) return [];

  const included = data.included || [];
  const orgMap = new Map<string, any>();
  const pictureMap = new Map<string, string[]>();

  for (const item of included) {
    if (item.type === "orgs") {
      orgMap.set(item.id, item.attributes);
    }
    if (item.type === "pictures") {
      const animalId = item.relationships?.animals?.data?.[0]?.id;
      if (animalId) {
        const existing = pictureMap.get(animalId) || [];
        existing.push(item.attributes?.large?.url || item.attributes?.small?.url || "");
        pictureMap.set(animalId, existing);
      }
    }
  }

  return data.data.slice(0, limit).map((animal: any): NormalizedAnimal => {
    const attrs = animal.attributes || {};
    const orgId = animal.relationships?.orgs?.data?.[0]?.id;
    const org = orgId ? orgMap.get(orgId) : null;
    const photos = pictureMap.get(animal.id) || [];

    return {
      id: parseInt(animal.id) || Math.random() * 100000,
      name: attrs.name || "Unknown",
      breeds: {
        primary: attrs.breedPrimary || null,
        secondary: attrs.breedSecondary || null,
        mixed: !!attrs.breedSecondary,
      },
      colors: {
        primary: attrs.colorDetails || null,
        secondary: null,
      },
      age: attrs.ageGroup || "Unknown",
      gender: attrs.sex || "Unknown",
      size: (attrs.sizeGroup || "medium").toLowerCase(),
      description: attrs.descriptionText || null,
      photos: photos.map((url) => ({ medium: url, large: url })),
      status: "adoptable",
      distance: attrs.distance ? parseFloat(attrs.distance) : null,
      contact: {
        phone: org?.phone || null,
        address: {
          city: org?.city || "",
          state: org?.state || "",
          postcode: org?.postalcode || "",
        },
      },
      url: attrs.url || `https://www.rescuegroups.org/animals/${animal.id}`,
      published_at: attrs.createdDate || new Date().toISOString(),
      _source: "rescuegroups",
    };
  });
}
/* eslint-enable @typescript-eslint/no-explicit-any */
