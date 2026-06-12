type ListingType = "rent" | "buy" | "vacation";
type PropertyType = "apartment" | "house" | "condo" | "land";

export interface SeedListing {
  title: string;
  price: number;
  address: string;
  city: string;
  bedroom: number;
  bathroom: number;
  type: ListingType;
  property: PropertyType;
  latitude: number;
  longitude: number;
  images: string[];
  desc: string;
  size: number;
  utilities: "included" | "excluded" | "shared";
  pet: "allowed" | "not_allowed" | "case_by_case";
  income: "no" | "yes";
  school: number;
  bus: number;
  restaurant: number;
}

import { pickSeedImage } from "./cloudinaryImagePool";

const CITIES = [
  { city: "Bangalore", lat: 12.9716, lng: 77.5946, areas: ["Indiranagar", "Whitefield", "Jayanagar", "HSR Layout", "Marathahalli"] },
  { city: "Mumbai", lat: 19.076, lng: 72.8777, areas: ["Andheri", "Bandra", "Powai", "Juhu", "Worli"] },
  { city: "Delhi", lat: 28.6139, lng: 77.209, areas: ["Dwarka", "Saket", "Vasant Kunj", "Rohini", "Karol Bagh"] },
  { city: "Hyderabad", lat: 17.385, lng: 78.4867, areas: ["Banjara Hills", "Gachibowli", "Hitech City", "Madhapur", "Kondapur"] },
  { city: "Chennai", lat: 13.0827, lng: 80.2707, areas: ["Adyar", "T Nagar", "Velachery", "OMR", "Anna Nagar"] },
  { city: "Pune", lat: 18.5204, lng: 73.8567, areas: ["Koregaon Park", "Hinjewadi", "Kothrud", "Baner", "Wakad"] },
  { city: "Kolkata", lat: 22.5726, lng: 88.3639, areas: ["Salt Lake", "Park Street", "New Town", "Ballygunge", "Howrah"] },
  { city: "Gurugram", lat: 28.4595, lng: 77.0266, areas: ["DLF Phase 1", "Sohna Road", "Sector 56", "Cyber City", "Golf Course Road"] },
  { city: "Noida", lat: 28.5355, lng: 77.391, areas: ["Sector 62", "Sector 18", "Greater Noida", "Sector 137", "Expressway"] },
  { city: "Jaipur", lat: 26.9124, lng: 75.7873, areas: ["Malviya Nagar", "C-Scheme", "Vaishali Nagar", "Mansarovar", "Raja Park"] },
  { city: "Ahmedabad", lat: 23.0225, lng: 72.5714, areas: ["Satellite", "Bodakdev", "SG Highway", "Vastrapur", "Navrangpura"] },
  { city: "Kochi", lat: 9.9312, lng: 76.2673, areas: ["Marine Drive", "Kakkanad", "Fort Kochi", "Edapally", "Vyttila"] },
  { city: "Chandigarh", lat: 30.7333, lng: 76.7794, areas: ["Sector 17", "Sector 22", "Sector 35", "Mohali", "Panchkula"] },
  { city: "Goa", lat: 15.2993, lng: 74.124, areas: ["Panaji", "Calangute", "Anjuna", "Candolim", "Margao"] },
  { city: "New York", lat: 40.7128, lng: -74.006, areas: ["Manhattan", "Brooklyn", "Queens", "Upper East Side", "Williamsburg"] },
  { city: "Los Angeles", lat: 34.0522, lng: -118.2437, areas: ["Hollywood", "Santa Monica", "Downtown", "Beverly Hills", "Silver Lake"] },
  { city: "Chicago", lat: 41.8781, lng: -87.6298, areas: ["Lincoln Park", "Wicker Park", "River North", "Hyde Park", "Gold Coast"] },
  { city: "Austin", lat: 30.2672, lng: -97.7431, areas: ["Downtown", "South Congress", "East Austin", "Domain", "Mueller"] },
  { city: "Seattle", lat: 47.6062, lng: -122.3321, areas: ["Capitol Hill", "Ballard", "Fremont", "Queen Anne", "Belltown"] },
  { city: "Miami", lat: 25.7617, lng: -80.1918, areas: ["Brickell", "South Beach", "Coral Gables", "Wynwood", "Coconut Grove"] },
];

const ADJECTIVES = [
  "Modern", "Spacious", "Luxury", "Cozy", "Premium", "Bright", "Elegant",
  "Stylish", "Renovated", "Sunlit", "Charming", "Contemporary", "Grand",
  "Serene", "Urban", "Classic", "Designer", "Panoramic", "Garden", "Lakeview",
];

const UTILITIES = ["included", "excluded", "shared"] as const;
const PETS = ["allowed", "not_allowed", "case_by_case"] as const;

function pick<T>(arr: readonly T[], index: number): T {
  return arr[index % arr.length];
}

function priceFor(type: ListingType, index: number, bedrooms: number): number {
  if (type === "rent") return 700 + (index % 20) * 175 + bedrooms * 120;
  if (type === "vacation") return 90 + (index % 15) * 25 + bedrooms * 30;
  return 180000 + (index % 25) * 85000 + bedrooms * 45000;
}

export function generateBulkListings(count: number, batchOffset = 0): SeedListing[] {
  const listings: SeedListing[] = [];

  for (let i = 0; i < count; i++) {
    const n = batchOffset + i;
    const cityData = pick(CITIES, n);
    const area = pick(cityData.areas, n * 3);
    const type = pick(["rent", "buy", "vacation"] as ListingType[], n * 7);
    const isLand = type === "buy" && n % 14 === 0;
    const property: PropertyType = isLand
      ? "land"
      : pick(["apartment", "house", "condo"] as PropertyType[], n * 5);

    const bedrooms = isLand ? 0 : 1 + (n % 4);
    const bathrooms = isLand ? 0 : Math.max(1, bedrooms - (n % 2));
    const adjective = pick(ADJECTIVES, n);
    const title = isLand
      ? `${adjective} Residential Plot - ${area} #${n + 1}`
      : `${adjective} ${bedrooms}BHK ${property} - ${area} #${n + 1}`;

    const imgA = pickSeedImage(n);
    const imgB = pickSeedImage(n + 3);

    listings.push({
      title,
      price: priceFor(type, n, bedrooms),
      address: `${100 + (n % 900)} ${area} Main Road`,
      city: cityData.city,
      bedroom: bedrooms,
      bathroom: bathrooms,
      type,
      property,
      latitude: Number((cityData.lat + ((n % 11) - 5) * 0.012).toFixed(6)),
      longitude: Number((cityData.lng + ((n % 9) - 4) * 0.012).toFixed(6)),
      images: property === "land" ? [pickSeedImage(n + 9)] : [imgA, imgB],
      desc: `<p>${adjective} ${property} in ${area}, ${cityData.city}. Move-in ready with great connectivity and neighborhood amenities.</p>`,
      size: isLand ? 3000 + (n % 10) * 400 : 650 + bedrooms * 320 + (n % 5) * 80,
      utilities: pick(UTILITIES, n),
      pet: pick(PETS, n * 2),
      income: n % 3 === 0 ? "no" : "yes",
      school: Number(((n % 8) * 0.4 + 0.3).toFixed(1)),
      bus: Number(((n % 6) * 0.3 + 0.2).toFixed(1)),
      restaurant: Number(((n % 5) * 0.2 + 0.1).toFixed(1)),
    });
  }

  return listings;
}
