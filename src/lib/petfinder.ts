export interface PetfinderAnimal {
  id: number;
  name: string;
  species: string;
  breeds: {
    primary: string | null;
    secondary: string | null;
    mixed: boolean;
  };
  colors: {
    primary: string | null;
    secondary: string | null;
    tertiary: string | null;
  };
  age: string;
  gender: string;
  size: string;
  description: string | null;
  photos: { small: string; medium: string; large: string; full: string }[];
  status: string;
  distance: number | null;
  contact: {
    email: string | null;
    phone: string | null;
    address: {
      city: string;
      state: string;
      postcode: string;
    };
  };
  organization_id: string;
  url: string;
  published_at: string;
}

export interface PetfinderSearchParams {
  breed?: string;
  size?: string;
  color?: string;
  location: string;
  distance?: number;
  type?: string;
  status?: string;
  limit?: number;
}

let cachedToken: { token: string; expires: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires) {
    return cachedToken.token;
  }

  const clientId = process.env.PETFINDER_API_KEY;
  const clientSecret = process.env.PETFINDER_API_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Petfinder API credentials not configured");
  }

  const res = await fetch("https://api.petfinder.com/v2/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    throw new Error(`Petfinder auth failed: ${res.status}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expires: Date.now() + data.expires_in * 1000 - 60000,
  };

  return cachedToken.token;
}

export async function searchPetfinder(
  params: PetfinderSearchParams
): Promise<PetfinderAnimal[]> {
  const token = await getAccessToken();

  const query = new URLSearchParams({
    type: params.type || "dog",
    location: params.location,
    distance: String(params.distance || 50),
    status: params.status || "found",
    limit: String(params.limit || 20),
    sort: "recent",
  });

  if (params.breed) query.set("breed", params.breed);
  if (params.size) query.set("size", params.size);
  if (params.color) query.set("color", params.color);

  const res = await fetch(
    `https://api.petfinder.com/v2/animals?${query.toString()}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    // Try adoptable status if found yields no results
    if (params.status === "found") {
      return searchPetfinder({ ...params, status: "adoptable" });
    }
    throw new Error(`Petfinder search failed: ${res.status}`);
  }

  const data = await res.json();
  return data.animals || [];
}

export async function searchShelters(
  location: string,
  distance: number = 50
): Promise<
  { id: string; name: string; city: string; state: string; url: string }[]
> {
  const token = await getAccessToken();

  const query = new URLSearchParams({
    location,
    distance: String(distance),
    limit: "20",
    sort: "distance",
  });

  const res = await fetch(
    `https://api.petfinder.com/v2/organizations?${query.toString()}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  return (data.organizations || []).map(
    (org: {
      id: string;
      name: string;
      address: { city: string; state: string };
      url: string;
    }) => ({
      id: org.id,
      name: org.name,
      city: org.address?.city,
      state: org.address?.state,
      url: org.url,
    })
  );
}
