"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { GB } from "@/theme/tokens";
import {
  fetchVenueBySlug,
  fetchVenueById,
  fetchVenueAvailability,
  type StationResponse,
  type AvailableWindow,
} from "@/lib/api/venues";
import { createBooking, type CreateBookingRequest } from "@/lib/api/bookings";
import { Icon, type IconName } from "@/components/ui/icon";
import { MonoTag } from "@/components/ui/mono-tag";
import { CutBox } from "@/components/ui/cut-box";
import { CTAButton } from "@/components/ui/cta-button";
import { SectionHeader } from "@/components/ui/section-header";
import { StepBar } from "@/components/booking/step-bar";
import { CounterRow } from "@/components/booking/counter-row";

const KIND_ICON: Record<string, IconName> = {
  Pc: "monitor", Ps5: "gamepad", Xbox: "gamepad", Vr: "headset", RacingSim: "car",
};

const MIN_DURATION_MIN = 30;
const MAX_DURATION_MIN = 480;
const MS_PER_MIN = 60_000;

const DAY_ABBR = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_ABBR = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function formatDate(d: Date) {
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
}

function formatTime24(d: Date): string {
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

function windowMinutes(w: AvailableWindow): number {
  return Math.floor((new Date(w.endsAt).getTime() - new Date(w.startsAt).getTime()) / MS_PER_MIN);
}

function formatDurationMins(m: number): string {
  if (m <= 0) return "0m";
  const h = Math.floor(m / 60);
  const min = m % 60;
  if (h === 0) return `${min}m`;
  if (min === 0) return `${h}h`;
  return `${h}h ${min}m`;
}

function buildDateStrip(): Date[] {
  const dates: Date[] = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    d.setHours(0, 0, 0, 0);
    dates.push(d);
  }
  return dates;
}

export default function BookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const venueId = params.venueId as string;
  const slug = searchParams.get("slug") ?? undefined;

  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selectedWindowIdx, setSelectedWindowIdx] = useState<number | null>(null);
  const [arrivalOffset, setArrivalOffset] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(MIN_DURATION_MIN);

  const dates = useMemo(() => buildDateStrip(), []);

  const { data: venue, isLoading: venueLoading } = useQuery({
    queryKey: ["venue-booking", slug, venueId],
    queryFn: () => (slug ? fetchVenueBySlug(slug) : fetchVenueById(venueId)),
    enabled: !!(slug || venueId),
  });

  const dateStr = formatDate(selectedDate);
  const venueSlug = venue?.slug ?? slug;

  const { data: availability, isLoading: availLoading } = useQuery({
    queryKey: ["venue-availability", venueSlug, dateStr],
    queryFn: () => fetchVenueAvailability(venueSlug!, dateStr),
    enabled: !!venueSlug,
  });

  const stationWindows = useMemo(() => {
    if (!availability?.stations || !selectedStationId) return [];
    const station = availability.stations.find((s) => s.stationId === selectedStationId);
    return station?.availableWindows ?? [];
  }, [availability, selectedStationId]);

  const selectedWindow = selectedWindowIdx !== null ? stationWindows[selectedWindowIdx] ?? null : null;
  const windowSpanMins = selectedWindow ? windowMinutes(selectedWindow) : 0;
  const maxArrivalOffset = Math.max(windowSpanMins - MIN_DURATION_MIN, 0);
  const maxDuration = Math.max(Math.min(windowSpanMins - arrivalOffset, MAX_DURATION_MIN), 0);
  const safeDuration = Math.min(durationMinutes, Math.max(maxDuration, MIN_DURATION_MIN));

  const selectedStation = useMemo(
    () => venue?.stations.find((s) => s.id === selectedStationId) ?? null,
    [venue, selectedStationId],
  );

  const stationAvailHours = useMemo(() => {
    const hours = new Map<string, number>();
    if (!availability?.stations) return hours;
    for (const station of availability.stations) {
      let totalMs = 0;
      for (const w of station.availableWindows) {
        totalMs += new Date(w.endsAt).getTime() - new Date(w.startsAt).getTime();
      }
      hours.set(station.stationId, Math.round((totalMs / (60 * MS_PER_MIN)) * 10) / 10);
    }
    return hours;
  }, [availability]);

  const step = !selectedStationId ? 0 : selectedWindowIdx === null ? 1 : 2;
  const total = selectedStation && selectedWindow
    ? Math.round(selectedStation.pricePerHour * (safeDuration / 60) * 100) / 100
    : 0;

  const arrivalDate = useMemo(() => {
    if (!selectedWindow) return null;
    return new Date(new Date(selectedWindow.startsAt).getTime() + arrivalOffset * MS_PER_MIN);
  }, [selectedWindow, arrivalOffset]);

  const formatArrival = useCallback((offset: number) => {
    if (!selectedWindow) return "--:--";
    const d = new Date(new Date(selectedWindow.startsAt).getTime() + offset * MS_PER_MIN);
    return formatTime24(d);
  }, [selectedWindow]);

  const arrivalPickerOptions = useMemo(() => {
    if (!selectedWindow) return [];
    const opts: number[] = [];
    for (let off = 0; off <= maxArrivalOffset; off += 5) opts.push(off);
    if (opts.length > 0 && opts[opts.length - 1] < maxArrivalOffset) opts.push(maxArrivalOffset);
    return opts;
  }, [selectedWindow, maxArrivalOffset]);

  const bookMutation = useMutation({
    mutationFn: (data: CreateBookingRequest) => createBooking(data),
    onSuccess: (booking) => router.replace(`/booking/ticket/${booking.id}`),
    onError: (err: Error) => window.alert(`Booking Failed: ${err.message}`),
  });

  const handleBook = useCallback(() => {
    if (!venue || !selectedStationId || !arrivalDate) return;
    if (safeDuration < MIN_DURATION_MIN) {
      window.alert("Booking must be at least 30 minutes.");
      return;
    }
    const endDate = new Date(arrivalDate.getTime() + safeDuration * MS_PER_MIN);
    bookMutation.mutate({
      venueId: venue.id,
      stationId: selectedStationId,
      startsAt: arrivalDate.toISOString(),
      endsAt: endDate.toISOString(),
      guestCount: 1,
    });
  }, [venue, selectedStationId, arrivalDate, safeDuration, bookMutation]);

  const canBook = !!(selectedStationId && selectedWindow && safeDuration >= MIN_DURATION_MIN && total > 0);

  const handleStationSelect = useCallback((id: string) => {
    setSelectedStationId(id);
    setSelectedWindowIdx(null);
    setArrivalOffset(0);
    setDurationMinutes(MIN_DURATION_MIN);
  }, []);

  const handleDateSelect = useCallback((d: Date) => {
    setSelectedDate(d);
    setSelectedWindowIdx(null);
    setArrivalOffset(0);
    setDurationMinutes(MIN_DURATION_MIN);
  }, []);

  const handleWindowSelect = useCallback((idx: number) => {
    setSelectedWindowIdx(idx);
    setArrivalOffset(0);
    setDurationMinutes(MIN_DURATION_MIN);
  }, []);

  if (venueLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: GB.bg }}>
        <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: GB.primary, borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: GB.bg }}>
        <p className="font-body text-[14px]" style={{ color: GB.fg3 }}>Venue not found</p>
      </div>
    );
  }

  const summaryParts: string[] = [];
  if (arrivalDate) {
    summaryParts.push(formatTime24(arrivalDate));
    summaryParts.push(formatDurationMins(safeDuration));
  }
  summaryParts.push(`${selectedDate.getDate()} ${MONTH_ABBR[selectedDate.getMonth()]}`);
  const summaryText = summaryParts.join("  \u00B7  ");

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: GB.bg }}>
      <div className="max-w-2xl mx-auto pb-48">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-4 pt-6 pb-2.5">
          <CutBox cut={6} variant="trapezoid" backgroundColor={GB.surface} borderColor={GB.border} onClick={() => router.back()} style={{ width: 36, height: 36 }}>
            <div className="flex items-center justify-center w-full h-full">
              <Icon name="arrowLeft" size={16} color={GB.fg2} />
            </div>
          </CutBox>
          <span className="flex-1 font-head font-bold text-[15px] uppercase" style={{ color: GB.fg, letterSpacing: "1.8px" }}>
            BOOK A BAY
          </span>
          <MonoTag color={GB.cyan}>{venue.slug.toUpperCase().slice(0, 7)}</MonoTag>
        </div>

        {/* Venue label */}
        <div className="px-4 mb-1">
          <span className="font-mono text-[10px]" style={{ color: GB.fg3, letterSpacing: "1.2px" }}>{"// AT"}</span>
          <p className="font-disp text-[28px]" style={{ color: GB.fg, letterSpacing: "1.12px", lineHeight: "30px" }}>
            {venue.name}
          </p>
        </div>

        <StepBar current={step} />

        {/* PICK STATION */}
        <SectionHeader sub={`${venue.stations.length} BAYS`}>PICK STATION</SectionHeader>
        <div className="space-y-1.5 px-4 mb-5">
          {venue.stations.map((station) => {
            const availHours = stationAvailHours.get(station.id) ?? 0;
            const isSelected = selectedStationId === station.id;
            const icon = KIND_ICON[station.kind] ?? "monitor";
            return (
              <BookingStationRow
                key={station.id}
                station={station}
                icon={icon}
                availableHours={availHours}
                selected={isSelected}
                onClick={() => handleStationSelect(station.id)}
              />
            );
          })}
        </div>

        {/* PICK DATE */}
        <SectionHeader sub={dateStr}>PICK DATE</SectionHeader>
        <div className="flex gap-2 overflow-x-auto px-4 mb-5 scrollbar-hide">
          {dates.map((d) => {
            const isActive = formatDate(d) === formatDate(selectedDate);
            return (
              <button
                key={formatDate(d)}
                onClick={() => handleDateSelect(d)}
                className="w-[54px] h-[64px] flex flex-col items-center justify-center flex-shrink-0 border"
                style={{
                  backgroundColor: isActive ? GB.accent : GB.surface,
                  borderColor: isActive ? GB.accent : GB.border,
                }}
              >
                <span className="font-mono text-[9px] font-semibold" style={{ color: isActive ? GB.fgInv : GB.fg3, letterSpacing: "0.72px" }}>
                  {DAY_ABBR[d.getDay()]}
                </span>
                <span className="font-disp text-[22px]" style={{ color: isActive ? GB.fgInv : GB.fg, lineHeight: "24px" }}>
                  {d.getDate()}
                </span>
                <span className="font-mono text-[8px]" style={{ color: isActive ? GB.fgInv : GB.fg3 }}>
                  {MONTH_ABBR[d.getMonth()]}
                </span>
              </button>
            );
          })}
        </div>

        {/* FREE WINDOWS */}
        {selectedStationId && (
          <>
            <SectionHeader sub={availLoading ? "LOADING..." : `${stationWindows.length} ${stationWindows.length === 1 ? "WINDOW" : "WINDOWS"}`}>
              FREE WINDOWS
            </SectionHeader>
            {availLoading ? (
              <div className="flex justify-center py-5">
                <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: GB.primary, borderTopColor: "transparent" }} />
              </div>
            ) : (
              <div className="space-y-1.5 px-4 mb-5">
                {stationWindows.map((w, i) => {
                  const startLabel = formatTime24(new Date(w.startsAt));
                  const endLabel = formatTime24(new Date(w.endsAt));
                  const spanMin = windowMinutes(w);
                  const isSelected = selectedWindowIdx === i;
                  return (
                    <CutBox
                      key={w.startsAt}
                      cut={6}
                      variant="trapezoid"
                      backgroundColor={isSelected ? "rgba(123,53,255,0.08)" : GB.surface}
                      borderColor={isSelected ? GB.primary : GB.border}
                      onClick={() => handleWindowSelect(i)}
                      style={isSelected ? { boxShadow: `0 0 8px ${GB.primGlow}` } : undefined}
                    >
                      <div className="flex items-center px-3.5 py-3 gap-2.5">
                        <div className="w-8 h-8 flex items-center justify-center border" style={{ backgroundColor: GB.raised, borderColor: isSelected ? GB.primary : GB.border }}>
                          <Icon name="clock" size={14} color={isSelected ? GB.primary : GB.fg3} />
                        </div>
                        <span className="flex-1 font-mono text-[14px] font-semibold" style={{ color: isSelected ? GB.fg : GB.fg2, letterSpacing: "0.84px" }}>
                          {startLabel} – {endLabel}
                        </span>
                        <MonoTag color={isSelected ? GB.primary : GB.fg3}>{formatDurationMins(spanMin)}</MonoTag>
                      </div>
                    </CutBox>
                  );
                })}
                {stationWindows.length === 0 && (
                  <p className="font-mono text-[11px] py-3" style={{ color: GB.fg3 }}>
                    No availability for this station on this date.
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* PICK TIME */}
        {selectedWindow && (
          <>
            <SectionHeader sub={`${formatTime24(new Date(selectedWindow.startsAt))} – ${formatTime24(new Date(selectedWindow.endsAt))}`}>
              PICK TIME
            </SectionHeader>

            {/* Arrival selector */}
            <div className="px-4 mb-3">
              <CutBox cut={6} variant="trapezoid" backgroundColor={GB.surface} borderColor={GB.border}>
                <div className="flex items-center justify-between px-3.5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 flex items-center justify-center border" style={{ backgroundColor: GB.raised, borderColor: GB.border }}>
                      <Icon name="clock" size={16} color={GB.bright} />
                    </div>
                    <div>
                      <span className="font-head font-bold text-[12px] uppercase block" style={{ color: GB.fg, letterSpacing: "0.72px" }}>ARRIVAL</span>
                      <span className="font-mono text-[9px] mt-0.5 block" style={{ color: GB.fg3 }}>SELECT TIME</span>
                    </div>
                  </div>
                  <select
                    value={arrivalOffset}
                    onChange={(e) => setArrivalOffset(Number(e.target.value))}
                    className="font-disp text-[28px] bg-transparent border-none outline-none cursor-pointer text-right"
                    style={{ color: GB.accent, letterSpacing: "1.12px" }}
                  >
                    {arrivalPickerOptions.map((off) => (
                      <option key={off} value={off} style={{ backgroundColor: GB.surface, color: GB.fg }}>
                        {formatArrival(off)}
                      </option>
                    ))}
                  </select>
                </div>
              </CutBox>
            </div>

            <div className="px-4 mb-5">
              <CounterRow
                icon="clock"
                label="DURATION"
                sub={`Min 30m · Max ${formatDurationMins(maxDuration)}`}
                value={safeDuration}
                min={MIN_DURATION_MIN}
                max={Math.min(maxDuration, MAX_DURATION_MIN)}
                step={30}
                formatValue={formatDurationMins}
                onChange={setDurationMinutes}
              />
            </div>
          </>
        )}
      </div>

      {/* Sticky bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 lg:left-[240px] z-30"
        style={{
          background: "linear-gradient(to top, rgba(8,8,16,0.97) 60%, transparent)",
          padding: "24px 16px 18px",
        }}
      >
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="font-mono text-[10px] flex-1" style={{ color: GB.fg3, letterSpacing: "0.8px" }}>
              {summaryText}
            </span>
            {total > 0 && (
              <div className="flex items-baseline gap-1">
                <span className="font-disp text-[26px]" style={{ color: GB.accent, letterSpacing: "1.04px" }}>{total}</span>
                <span className="font-mono text-[11px]" style={{ color: GB.fg3 }}>GEL</span>
              </div>
            )}
          </div>
          <CTAButton
            label="CONTINUE TO PAY"
            onClick={handleBook}
            disabled={!canBook}
            loading={bookMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}

function BookingStationRow({
  station,
  icon,
  availableHours,
  selected,
  onClick,
}: {
  station: StationResponse;
  icon: IconName;
  availableHours: number;
  selected: boolean;
  onClick: () => void;
}) {
  const hasAvail = availableHours > 0;

  return (
    <CutBox
      cut={6}
      variant="trapezoid"
      backgroundColor={selected ? "rgba(204,255,0,0.06)" : GB.surface}
      borderColor={selected ? GB.accent : GB.border}
      onClick={onClick}
      style={selected ? { boxShadow: `0 0 8px ${GB.cyanGlow}` } : undefined}
    >
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <div
          className="w-[38px] h-[38px] flex items-center justify-center border"
          style={{ backgroundColor: GB.raised, borderColor: selected ? GB.accent : GB.border }}
        >
          <Icon name={icon} size={18} color={selected ? GB.accent : GB.bright} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-head font-bold text-[13px]" style={{ color: GB.fg, letterSpacing: "0.52px" }}>
              {station.label}
            </span>
            <MonoTag color={hasAvail ? GB.success : GB.danger}>
              {hasAvail ? `${availableHours}h FREE` : "FULL"}
            </MonoTag>
          </div>
          {station.specs.length > 0 && (
            <span className="font-mono text-[9px] mt-0.5 block truncate" style={{ color: GB.fg3, letterSpacing: "0.72px" }}>
              {station.specs.join(" · ")}
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="font-disp text-[20px]" style={{ color: GB.accent, letterSpacing: "0.8px", lineHeight: "20px" }}>
            {station.pricePerHour}
          </span>
          <span className="font-mono text-[8px] block mt-0.5" style={{ color: GB.fg3 }}>GEL / HR</span>
        </div>
      </div>
    </CutBox>
  );
}
