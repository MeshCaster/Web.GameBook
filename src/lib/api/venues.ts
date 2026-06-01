import { apiClient } from "./client";

export type StationResponse = {
  id: string;
  label: string;
  kind: string;
  pricePerHour: number;
  capacity: number;
  specs: string[];
};

export type VenueResponse = {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  imageUrl: string | null;
  coverUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number;
  reviewCount: number;
  opensAt: string;
  closesAt: string;
  phone: string | null;
  website: string | null;
  amenities: string[];
  stations: StationResponse[];
  distanceKm: number | null;
  isFeatured: boolean;
};

export type VenueListResponse = {
  venues: VenueResponse[];
  total: number;
};

export type FetchVenuesParams = {
  search?: string;
  lat?: number;
  lng?: number;
};

export function fetchVenues(params?: FetchVenuesParams) {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.lat != null) query.set("lat", String(params.lat));
  if (params?.lng != null) query.set("lng", String(params.lng));
  const qs = query.toString();
  return apiClient<VenueListResponse>(`/v1/venues${qs ? `?${qs}` : ""}`);
}

export function fetchVenueBySlug(slug: string) {
  return apiClient<VenueResponse>(`/v1/venues/${slug}`);
}

export function fetchVenueById(id: string) {
  return apiClient<VenueResponse>(`/v1/venues/by-id/${id}`);
}

export type AvailableWindow = {
  startsAt: string;
  endsAt: string;
};

export type StationAvailability = {
  stationId: string;
  label: string;
  kind: string;
  pricePerHour: number;
  availableWindows: AvailableWindow[];
};

export type VenueAvailabilityResponse = {
  venueId: string;
  date: string;
  stations: StationAvailability[];
};

export function fetchVenueAvailability(slug: string, date?: string) {
  const params = date ? `?date=${date}` : "";
  return apiClient<VenueAvailabilityResponse>(
    `/v1/venues/${slug}/availability${params}`,
  );
}
