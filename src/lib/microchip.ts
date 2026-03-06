export interface MicrochipInfo {
  chipNumber: string;
  format: "15-digit" | "10-digit" | "9-digit-avid" | "unknown";
  possibleRegistries: string[];
  lookupUrls: { name: string; url: string; description: string }[];
}

const CHIP_PATTERNS = {
  iso15: /^\d{15}$/,
  tenDigit: /^\d{10}$/,
  avid9: /^\d{9}$/,
  hexChip: /^[0-9A-Fa-f]{10}$/,
};

export function validateChipNumber(raw: string): {
  valid: boolean;
  cleaned: string;
  error?: string;
} {
  const cleaned = raw.replace(/[\s\-\.]/g, "");
  if (cleaned.length === 0) {
    return { valid: false, cleaned, error: "Please enter a microchip number" };
  }
  if (cleaned.length < 9 || cleaned.length > 15) {
    return {
      valid: false,
      cleaned,
      error: "Microchip numbers are typically 9, 10, or 15 digits",
    };
  }
  if (!/^[0-9A-Fa-f]+$/.test(cleaned)) {
    return {
      valid: false,
      cleaned,
      error: "Microchip numbers contain only digits (and sometimes A-F)",
    };
  }
  return { valid: true, cleaned };
}

export function getChipInfo(chipNumber: string): MicrochipInfo {
  const cleaned = chipNumber.replace(/[\s\-\.]/g, "");
  let format: MicrochipInfo["format"] = "unknown";

  if (CHIP_PATTERNS.iso15.test(cleaned)) format = "15-digit";
  else if (
    CHIP_PATTERNS.tenDigit.test(cleaned) ||
    CHIP_PATTERNS.hexChip.test(cleaned)
  )
    format = "10-digit";
  else if (CHIP_PATTERNS.avid9.test(cleaned)) format = "9-digit-avid";

  const possibleRegistries: string[] = [];
  if (format === "15-digit") {
    if (cleaned.startsWith("900")) possibleRegistries.push("24PetWatch/Allflex");
    else if (cleaned.startsWith("981"))
      possibleRegistries.push("Datamars/PetLink");
    else if (cleaned.startsWith("985"))
      possibleRegistries.push("HomeAgain/Merck");
    else if (cleaned.startsWith("956"))
      possibleRegistries.push("AKC Reunite");
    possibleRegistries.push("ISO Standard (FDX-B)");
  } else if (format === "10-digit" || format === "9-digit-avid") {
    possibleRegistries.push("AVID (PETtrac)");
  }

  // Universal lookup URLs — these services search across all major US registries
  const lookupUrls = [
    {
      name: "AAHA Universal Pet Microchip Lookup",
      url: `https://www.aaha.org/your-pet/pet-microchip-lookup/microchip-search/?microchipId=${cleaned}`,
      description: "Searches all major US registries simultaneously",
    },
    {
      name: "PetMicrochipLookup.org",
      url: `https://www.petmicrochiplookup.org/`,
      description: "AAHA-affiliated universal search tool",
    },
    {
      name: "Peeva",
      url: `https://peeva.co/register-microchip/`,
      description: "Cross-registry chip search and registration",
    },
    {
      name: "Found Animals Registry",
      url: `https://microchipregistry.foundanimals.org/`,
      description: "Free universal microchip registry",
    },
  ];

  return { chipNumber: cleaned, format, possibleRegistries, lookupUrls };
}
