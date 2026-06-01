"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { GB } from "@/theme/tokens";
import { fetchMyBookings, type BookingResponse } from "@/lib/api/bookings";
import { Icon } from "@/components/ui/icon";
import { MonoTag } from "@/components/ui/mono-tag";
import { CutBox } from "@/components/ui/cut-box";
import { SectionHeader } from "@/components/ui/section-header";

/* ─── Helpers ─── */

function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
  ];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

function computeDuration(startsAt: string, endsAt: string): string {
  const ms = new Date(endsAt).getTime() - new Date(startsAt).getTime();
  const mins = Math.round(ms / 60_000);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function getCountdown(startsAt: string): string | null {
  const diff = new Date(startsAt).getTime() - Date.now();
  if (diff <= 0) return null;
  const hrs = Math.floor(diff / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  if (hrs > 24) return `IN ${Math.floor(hrs / 24)}d`;
  if (hrs > 0) return `IN ${hrs}h ${mins}m`;
  return `IN ${mins}m`;
}

/* ─── Booking Card ─── */

function BookingCard({ booking }: { booking: BookingResponse }) {
  const st = booking.status.toLowerCase();
  const isUpcoming =
    st !== "cancelled" &&
    st !== "completed" &&
    new Date(booking.endsAt).getTime() > Date.now();
  const countdown = isUpcoming ? getCountdown(booking.startsAt) : null;

  return (
    <Link href={`/booking/ticket/${booking.id}`}>
      <CutBox
        cut={10}
        backgroundColor={GB.surface}
        borderColor={isUpcoming ? GB.borderHi : GB.border}
        style={
          isUpcoming
            ? { boxShadow: `0 0 16px rgba(123,53,255,0.12)` }
            : undefined
        }
      >
        <div className="p-3.5">
          {/* Top row */}
          <div className="flex justify-between items-center mb-2">
            <MonoTag
              color={
                st === "cancelled"
                  ? GB.danger
                  : isUpcoming
                    ? GB.success
                    : GB.fg3
              }
            >
              {st === "cancelled"
                ? "CANCELLED"
                : isUpcoming
                  ? booking.status.toUpperCase()
                  : "COMPLETED"}
            </MonoTag>
            {countdown && (
              <span
                className="font-head font-bold text-[11px]"
                style={{ color: GB.accent, letterSpacing: "0.88px" }}
              >
                {countdown}
              </span>
            )}
          </div>

          {/* Venue name */}
          <p
            className="font-disp text-[22px]"
            style={{ color: GB.fg, letterSpacing: "0.88px", lineHeight: "24px" }}
          >
            {booking.venueName}
          </p>

          {/* Details */}
          <div className="flex items-center mt-2 gap-3">
            <div className="flex items-center gap-1">
              <Icon name="calendar" size={12} color={GB.fg3} />
              <span
                className="font-mono text-[10px]"
                style={{ color: GB.fg2, letterSpacing: "0.6px" }}
              >
                {formatDateLabel(booking.startsAt)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="clock" size={12} color={GB.fg3} />
              <span
                className="font-mono text-[10px]"
                style={{ color: GB.fg2, letterSpacing: "0.6px" }}
              >
                {formatTime(booking.startsAt)} · {computeDuration(booking.startsAt, booking.endsAt)}
              </span>
            </div>
          </div>

          {/* Bottom */}
          <div
            className="flex justify-between items-baseline mt-2.5 pt-2.5 border-t"
            style={{ borderColor: GB.border }}
          >
            <div className="flex items-center gap-1.5">
              <Icon name="monitor" size={12} color={GB.bright} />
              <span
                className="font-mono text-[10px]"
                style={{ color: GB.fg2, letterSpacing: "0.8px" }}
              >
                {booking.stationLabel}
              </span>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span
                className="font-disp text-[18px]"
                style={{ color: GB.accent, letterSpacing: "0.72px" }}
              >
                {booking.totalPrice}
              </span>
              <span className="font-mono text-[9px]" style={{ color: GB.fg3 }}>
                {booking.currency}
              </span>
            </div>
          </div>
        </div>
      </CutBox>
    </Link>
  );
}

/* ─── Main ─── */

export default function BookingsPage() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["myBookings"],
    queryFn: fetchMyBookings,
  });

  const { upcoming, past } = useMemo(() => {
    if (!bookings) return { upcoming: [], past: [] };
    const now = Date.now();
    const up: BookingResponse[] = [];
    const pa: BookingResponse[] = [];
    for (const b of bookings) {
      const st = b.status.toLowerCase();
      if (st === "cancelled" || st === "completed" || new Date(b.endsAt).getTime() <= now) {
        pa.push(b);
      } else {
        up.push(b);
      }
    }
    up.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
    pa.sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());
    return { upcoming: up, past: pa };
  }, [bookings]);

  const isEmpty = !bookings || bookings.length === 0;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-4 pt-8 pb-1.5">
        <h1
          className="font-disp text-[28px]"
          style={{ color: GB.fg, letterSpacing: "1.12px" }}
        >
          MY TICKETS
        </h1>
        <p
          className="font-mono text-[10px] mt-1"
          style={{ color: GB.fg3, letterSpacing: "1.2px" }}
        >
          {upcoming.length} UPCOMING · {past.length} PAST
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <span className="font-mono text-[11px]" style={{ color: GB.fg3, letterSpacing: "1.32px" }}>
            LOADING...
          </span>
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 px-8">
          <div className="relative w-16 h-16 flex items-center justify-center mb-4">
            <div
              className="absolute inset-0 rounded-full opacity-[0.08]"
              style={{ backgroundColor: GB.primary }}
            />
            <Icon name="calendar" size={28} color={GB.fg3} />
          </div>
          <p
            className="font-head font-bold text-[14px] text-center"
            style={{ color: GB.fg2, letterSpacing: "1.12px" }}
          >
            NO BOOKINGS YET
          </p>
          <p
            className="font-body text-[13px] text-center mt-1.5"
            style={{ color: GB.fg3, lineHeight: "18px" }}
          >
            Find a venue and book your first session.
          </p>
        </div>
      ) : (
        <div className="pb-8">
          {upcoming.length > 0 && (
            <>
              <SectionHeader sub={`${upcoming.length}`} className="mt-3">
                UPCOMING
              </SectionHeader>
              <div className="space-y-2.5 px-4 mb-6">
                {upcoming.map((b) => (
                  <BookingCard key={b.id} booking={b} />
                ))}
              </div>
            </>
          )}

          {past.length > 0 && (
            <>
              <SectionHeader sub={`${past.length}`} className={upcoming.length > 0 ? "" : "mt-3"}>
                PAST
              </SectionHeader>
              <div className="space-y-2.5 px-4">
                {past.map((b) => (
                  <BookingCard key={b.id} booking={b} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
