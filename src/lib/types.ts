export interface DogProfileData {
  breed: string;
  color: string;
  size: string;
  distinguishingFeatures: string[];
  hasCollar: boolean;
  collarDescription?: string;
  estimatedAge: string;
  gender?: string;
  description: string;
  confidence?: string;
  healthNotes?: string;
}

export interface DogProfileRecord extends DogProfileData {
  id: string;
  photoUrl: string;
  locationText: string;
  latitude: number | null;
  longitude: number | null;
  reporterName: string | null;
  reporterEmail: string | null;
  shelterResults: unknown[];
  createdAt: string;
}

export interface Sighting {
  id: string;
  dogProfileId: string;
  locationText: string;
  latitude: number | null;
  longitude: number | null;
  spottedAt: string;
  notes: string | null;
  reporterName: string | null;
  reporterEmail: string | null;
  photoUrl: string | null;
  createdAt: string;
}

export interface AlertSubscription {
  id: string;
  email: string;
  breedFilter: string | null;
  sizeFilter: string | null;
  locationText: string;
  latitude: number | null;
  longitude: number | null;
  radiusMiles: number;
  isActive: boolean;
  unsubscribeToken: string;
  createdAt: string;
}

export interface ShelterResult {
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
  _demo?: boolean;
  _shelter?: string;
  _source?: "petfinder" | "rescuegroups" | "demo";
}
