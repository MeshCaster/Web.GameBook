"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { GB } from "@/theme/tokens";
import { fetchBookingById } from "@/lib/api/bookings";
import { Icon } from "@/components/ui/icon";
import { MonoTag } from "@/components/ui/mono-tag";
import { GlitchText } from "@/components/ui/glitch-text";

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

function computeHours(startsAt: string, endsAt: string): string {
  const ms = new Date(endsAt).getTime() - new Date(startsAt).getTime();
  const mins = Math.round(ms / 60_000);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function Stat({ label, value, color = GB.fg }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex flex-col">
      <p className="font-mono text-[8px]" style={{ color: GB.fg3, letterSpacing: "1.4px" }}>{label}</p>
      <p className="font-head font-bold text-[14px] mt-0.5" style={{ color, letterSpacing: "0.56px" }}>{value}</p>
    </div>
  );
}

function CornerTicks() {
  const tick = 12;
  const sw = 1.5;
  const color = GB.accent;

  return (
    <>
      {/* TL */}
      <div className="absolute left-0 top-0" style={{ width: tick, height: sw, backgroundColor: color }} />
      <div className="absolute left-0 top-0" style={{ width: sw, height: tick, backgroundColor: color }} />
      {/* TR */}
      <div className="absolute right-0 top-0" style={{ width: tick, height: sw, backgroundColor: color }} />
      <div className="absolute right-0 top-0" style={{ width: sw, height: tick, backgroundColor: color }} />
      {/* BL */}
      <div className="absolute left-0 bottom-0" style={{ width: tick, height: sw, backgroundColor: color }} />
      <div className="absolute left-0 bottom-0" style={{ width: sw, height: tick, backgroundColor: color }} />
      {/* BR */}
      <div className="absolute right-0 bottom-0" style={{ width: tick, height: sw, backgroundColor: color }} />
      <div className="absolute right-0 bottom-0" style={{ width: sw, height: tick, backgroundColor: color }} />
    </>
  );
}

export default function TicketPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => fetchBookingById(id),
    enabled: !!id,
  });

  if (isLoading || !booking) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: GB.bg }}>
        <span className="font-mono text-[11px]" style={{ color: GB.fg3 }}>
          {isLoading ? "Loading ticket..." : "Ticket not found"}
        </span>
      </div>
    );
  }

  const qrRef = booking.qrCode || `GB-${booking.id.slice(0, 8).toUpperCase()}`;
  const timeLabel = `${formatTime(booking.startsAt)} – ${formatTime(booking.endsAt)}`;
  const durationLabel = computeHours(booking.startsAt, booking.endsAt);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: GB.bg }}>
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${GB.cyan} 0%, transparent 70%)` }}
      />

      <div className="relative z-10 max-w-md mx-auto px-5 pt-10 pb-10">

        {/* Success header */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-12 h-12 flex items-center justify-center mb-3">
            <div
              className="absolute inset-0 rounded-full opacity-15"
              style={{ backgroundColor: GB.success }}
            />
            <div
              className="absolute -inset-2 rounded-full border opacity-20"
              style={{ borderColor: GB.success }}
            />
            <Icon name="check" size={24} color={GB.success} />
          </div>

          <GlitchText text="YOU'RE LOCKED IN." className="text-[34px] leading-none" />

          <p className="font-body text-[13px] mt-2 text-center" style={{ color: GB.fg3 }}>
            Flash this ticket at the front desk
          </p>
        </div>

        {/* ─── TICKET CARD ─── */}
        <div
          className="border overflow-hidden mb-5"
          style={{
            backgroundColor: GB.surface,
            borderColor: GB.border,
            borderRadius: 12,
            boxShadow: `0 4px 40px rgba(0,0,0,0.4), 0 0 24px ${GB.primGlow}`,
          }}
        >

          {/* Card header */}
          <div
            className="px-5 py-4 border-b"
            style={{ borderColor: GB.border }}
          >
            <div className="flex items-center justify-between mb-2">
              <MonoTag color={GB.accent}>{"// GAMEBOOK PASS"}</MonoTag>
              <MonoTag color={GB.success}>CONFIRMED</MonoTag>
            </div>
            <p
              className="font-disp text-[28px]"
              style={{ color: GB.fg, letterSpacing: "1.12px", lineHeight: "30px" }}
            >
              {booking.venueName}
            </p>
          </div>

          {/* QR section */}
          <div className="flex flex-col items-center px-5 py-5">
            <div
              className="relative p-5"
              style={{ backgroundColor: GB.bg, borderRadius: 8 }}
            >
              <CornerTicks />
              <QRCodeSVG
                value={qrRef}
                size={140}
                bgColor={GB.bg}
                fgColor={GB.cyan}
              />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="font-mono text-[8px]" style={{ color: GB.fg3, letterSpacing: "1.6px" }}>REF</span>
              <span className="font-mono text-[12px] font-semibold" style={{ color: GB.fg, letterSpacing: "1.2px" }}>{qrRef}</span>
            </div>
          </div>

          {/* Perforation line */}
          <div className="relative px-5">
            <div
              className="border-t border-dashed"
              style={{ borderColor: GB.borderHi }}
            />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full"
              style={{ backgroundColor: GB.bg }}
            />
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 rounded-full"
              style={{ backgroundColor: GB.bg }}
            />
          </div>

          {/* Details section */}
          <div className="px-5 py-4">
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-y-4">
              <Stat label="STATION" value={booking.stationLabel} />
              <Stat label="TYPE" value={booking.stationKind} />
              <Stat label="DATE" value={formatDateLabel(booking.startsAt)} />
              <Stat label="TIME" value={timeLabel} />
              <Stat label="DURATION" value={durationLabel} />
              <Stat label="PLAYERS" value={`${booking.guestCount}`} />
            </div>

            {/* Total */}
            <div
              className="mt-4 pt-3 border-t flex items-baseline justify-between"
              style={{ borderColor: GB.border }}
            >
              <span className="font-mono text-[9px]" style={{ color: GB.fg3, letterSpacing: "1.4px" }}>TOTAL</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-disp text-[28px]" style={{ color: GB.accent, letterSpacing: "1px" }}>
                  {booking.totalPrice}
                </span>
                <span className="font-mono text-[11px]" style={{ color: GB.fg3 }}>{booking.currency}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to home */}
        <button
          onClick={() => router.replace("/home")}
          className="w-full py-3 text-center transition-opacity hover:opacity-70"
        >
          <span className="font-mono text-[11px]" style={{ color: GB.fg3, letterSpacing: "1.2px" }}>
            BACK TO HOME
          </span>
        </button>
      </div>
    </div>
  );
}
