import { create } from "zustand";

type BookingDraft = {
  venueId: string | null;
  venueSlug: string | null;
  venueName: string | null;
  stationId: string | null;
  stationLabel: string | null;
  stationKind: string | null;
  date: string | null;
  startsAt: string | null;
  endsAt: string | null;
  guestCount: number;
  totalPrice: number;
  setVenue: (id: string, slug: string, name: string) => void;
  setStation: (id: string, label: string, kind: string) => void;
  setDate: (date: string) => void;
  setTimeSlot: (startsAt: string, endsAt: string) => void;
  setGuestCount: (count: number) => void;
  setTotalPrice: (price: number) => void;
  reset: () => void;
};

const initialState = {
  venueId: null,
  venueSlug: null,
  venueName: null,
  stationId: null,
  stationLabel: null,
  stationKind: null,
  date: null,
  startsAt: null,
  endsAt: null,
  guestCount: 1,
  totalPrice: 0,
};

export const useBookingDraft = create<BookingDraft>((set) => ({
  ...initialState,
  setVenue: (id, slug, name) =>
    set({ venueId: id, venueSlug: slug, venueName: name }),
  setStation: (id, label, kind) =>
    set({ stationId: id, stationLabel: label, stationKind: kind }),
  setDate: (date) => set({ date }),
  setTimeSlot: (startsAt, endsAt) => set({ startsAt, endsAt }),
  setGuestCount: (count) => set({ guestCount: count }),
  setTotalPrice: (price) => set({ totalPrice: price }),
  reset: () => set(initialState),
}));
