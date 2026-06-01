import { apiClient } from "./client";

export type BookingResponse = {
  id: string;
  venueId: string;
  venueName: string;
  venueSlug: string;
  stationId: string;
  stationLabel: string;
  stationKind: string;
  startsAt: string;
  endsAt: string;
  guestCount: number;
  totalPrice: number;
  currency: string;
  status: string;
  qrCode: string;
  createdAt: string;
};

export type CreateBookingRequest = {
  venueId: string;
  stationId: string;
  startsAt: string;
  endsAt: string;
  guestCount: number;
};

export function fetchMyBookings() {
  return apiClient<BookingResponse[]>("/v1/bookings");
}

export function fetchBookingById(id: string) {
  return apiClient<BookingResponse>(`/v1/bookings/${id}`);
}

export function createBooking(data: CreateBookingRequest) {
  return apiClient<BookingResponse>("/v1/bookings", {
    method: "POST",
    body: data,
  });
}

export function cancelBooking(id: string) {
  return apiClient<void>(`/v1/bookings/${id}/cancel`, { method: "POST" });
}
