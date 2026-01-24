export interface GeocodingResult {
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    road?: string;
    house_number?: string;
    postcode?: string;
    country?: string;
    state?: string;
  };
}

export async function reverseGeocode(lat: number, lng: number): Promise<GeocodingResult | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        headers: {
          'User-Agent': 'property-app',
          "Accept-Language": "en",
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}

export function formatAddress(geocodingResult: GeocodingResult | null): string {
  if (!geocodingResult) return 'Location not available';

  const { address } = geocodingResult;
  
  const parts = [
    address.road && address.house_number ? `${address.house_number} ${address.road}` : address.road,
    address.city || address.town || address.village,
    address.state,
    address.postcode,
    address.country,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : geocodingResult.display_name;
}
