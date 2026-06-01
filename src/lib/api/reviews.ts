import { apiClient } from "./client";

export type ReviewResponse = {
  id: string;
  userId: string;
  userDisplayName: string;
  userAvatarUrl: string | null;
  rating: number;
  comment: string | null;
  createdAt: string;
};

export function fetchVenueReviews(venueSlug: string) {
  return apiClient<ReviewResponse[]>(`/v1/reviews/venue/${venueSlug}`);
}

export function createReview(data: {
  venueId: string;
  bookingId?: string;
  rating: number;
  comment?: string;
}) {
  return apiClient<unknown>("/v1/reviews", {
    method: "POST",
    body: data,
  });
}
