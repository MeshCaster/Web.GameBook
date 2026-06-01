"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { GB } from "@/theme/tokens";
import { fetchBookingById } from "@/lib/api/bookings";
import { Icon } from "@/components/ui/icon";
import { MonoTag } from "@/components/ui/mono-tag";
import { CutBox } from "@/components/ui/cut-box";
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
    <div>
      <p className="font-mono text-[9px]" style={{ color: GB.fg3, letterSpacing: "1.26px" }}>{label}</p>
      <p className="font-head font-bold text-[14px] mt-0.5" style={{ color, letterSpacing: "0.56px" }}>{value}</p>
    </div>
  );
}

function CornerTicks() {
  const tick = 10;
  const sw = 1.5;
  const color = GB.accent;
  const lineStyle = (x1: number, y1: number, x2: number, y2: number) => ({
    position: "absolute" as const,
    left: x1,
    top: y1,
    width: Math.abs(x2 - x1) || sw,
    height: Math.abs(y2 - y1) || sw,
    backgroundColor: color,
  });

  return (
    <>
      {/* TL */}
      <div style={{ ...lineStyle(0, 0, tick, 0) }} />
      <div style={{ ...lineStyle(0, 0, 0, tick) }} />
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
  const timeLabel = `${formatTime(booking.startsAt)} · ${computeHours(booking.startsAt, booking.endsAt)}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          text: `GameBook Pass: ${booking.venueName}\n${formatDateLabel(booking.startsAt)} at ${formatTime(booking.startsAt)}\nRef: ${qrRef}`,
        });
      } catch {
        /* cancelled */
      }
    }
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: GB.bg }}>
      {/* Cyan glow */}
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full opacity-40"
        style={{ backgroundColor: GB.cyanGlow }}
      />

      <div className="relative z-10 max-w-md mx-auto px-4 pt-12 pb-10">
        {/* Success header */}
        <div className="flex flex-col items-center pb-5.5">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute w-[72px] h-[72px] rounded-full border opacity-35" style={{ borderColor: GB.success }} />
            <div className="absolute w-14 h-14 rounded-full opacity-15" style={{ backgroundColor: GB.success }} />
            <Icon name="check" size={28} color={GB.success} />
          </div>

          <div className="mt-3.5">
            <MonoTag color={GB.success}>STATUS · CONFIRMED</MonoTag>
          </div>

          <div className="mt-2">
            <GlitchText text="YOU'RE LOCKED IN." className="text-[36px] leading-none" />
          </div>

          <p className="font-body text-[13px] mt-1.5" style={{ color: GB.fg2 }}>
            Flash this ticket at the front desk.
          </p>
        </div>

        {/* Ticket card */}
        <div className="mb-4.5">
          <CutBox
            cut={14}
            backgroundColor={GB.surface}
            borderColor={GB.accent}
            style={{ boxShadow: `0 0 28px rgba(204,255,0,0.15)` }}
          >
            {/* Top - Venue */}
            <div className="p-4 pb-3.5">
              <div className="flex justify-between items-center mb-1.5">
                <MonoTag color={GB.accent}>{'// GAMEBOOK PASS'}</MonoTag>
                <span className="font-mono text-[10px]" style={{ color: GB.cyan, letterSpacing: "1.2px" }}>
                  {booking.venueSlug?.toUpperCase().slice(0, 7) ?? "---"}
                </span>
              </div>
              <p className="font-disp text-[26px]" style={{ color: GB.fg, letterSpacing: "1.04px", lineHeight: "28px" }}>
                {booking.venueName}
              </p>
              <p className="font-mono text-[10px] mt-1" style={{ color: GB.fg3 }}>
                {booking.venueSlug?.toUpperCase() ?? ""}
              </p>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center p-4">
              <div className="relative p-4" style={{ backgroundColor: GB.bg }}>
                <CornerTicks />
                <div className="p-1.5">
                  <QRCodeSVG
                    value={qrRef}
                    size={120}
                    bgColor={GB.bg}
                    fgColor={GB.cyan}
                  />
                </div>
              </div>
              <div className="mt-2.5 text-center">
                <p className="font-mono text-[9px]" style={{ color: GB.fg3, letterSpacing: "1.44px" }}>REF</p>
                <p className="font-mono text-[11px] mt-0.5" style={{ color: GB.fg, letterSpacing: "0.88px" }}>
                  {qrRef}
                </p>
              </div>
            </div>

            {/* Perforation */}
            <div
              className="h-3.5 border-t border-b border-dashed flex items-center justify-between"
              style={{ borderColor: GB.border, backgroundColor: GB.bg }}
            >
              <div className="w-4 h-4 rounded-full border -ml-2" style={{ backgroundColor: GB.bg, borderColor: GB.accent }} />
              <div className="w-4 h-4 rounded-full border -mr-2" style={{ backgroundColor: GB.bg, borderColor: GB.accent }} />
            </div>

            {/* Details Grid */}
            <div className="p-4 pt-3.5 grid grid-cols-2 gap-3.5">
              <Stat label="STATION" value={booking.stationLabel} />
              <Stat label="TYPE" value={booking.stationKind} />
              <Stat label="DATE" value={formatDateLabel(booking.startsAt)} />
              <Stat label="TIME" value={timeLabel} />
              <Stat label="PLAYERS" value={`× ${booking.guestCount}`} />
              <Stat label="TOTAL" value={`${booking.totalPrice} ${booking.currency}`} color={GB.accent} />
            </div>
          </CutBox>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <CutBox cut={6} variant="trapezoid" backgroundColor="transparent" borderColor={GB.border} onClick={handleShare}>
              <div className="flex items-center justify-center py-3.5 gap-2">
                <Icon name="share" size={14} color={GB.fg2} />
                <span className="font-head font-bold text-[11px]" style={{ color: GB.fg2, letterSpacing: "1.54px" }}>
                  SHARE
                </span>
              </div>
            </CutBox>
          </div>
          <div className="flex-1">
            <CutBox cut={6} variant="trapezoid" backgroundColor={GB.accent} borderColor={GB.accent}>
              <div className="flex items-center justify-center py-3.5 gap-2">
                <Icon name="download" size={14} color={GB.fgInv} />
                <span className="font-head font-bold text-[11px]" style={{ color: GB.fgInv, letterSpacing: "1.54px" }}>
                  ADD TO WALLET
                </span>
              </div>
            </CutBox>
          </div>
        </div>

        <p className="text-center font-mono text-[10px] mb-4 px-8" style={{ color: GB.fg3, letterSpacing: "0.6px" }}>
          Show this code at the front desk. Your station unlocks automatically.
        </p>

        <CutBox cut={8} variant="trapezoid" backgroundColor="transparent" borderColor={GB.border} onClick={() => router.replace("/home")}>
          <div className="py-3.5 text-center">
            <span className="font-head font-bold text-[12px]" style={{ color: GB.fg2, letterSpacing: "1.68px" }}>
              ← BACK TO HOME
            </span>
          </div>
        </CutBox>
      </div>
    </div>
  );
}
