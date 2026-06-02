"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { GB } from "@/theme/tokens";
import {
  fetchVenueBySlug,
  fetchVenueAvailability,
  type VenueResponse,
  type StationAvailability,
} from "@/lib/api/venues";
import { StationRow, type StationGroup } from "@/components/venue/station-row";
import { Icon, type IconName } from "@/components/ui/icon";
import { MonoTag } from "@/components/ui/mono-tag";
import { CTAButton } from "@/components/ui/cta-button";

const KIND_CONFIG: Record<string, { name: string; icon: IconName }> = {
  Pc: { name: "PC RIG", icon: "monitor" },
  Ps5: { name: "PS5 PRO", icon: "gamepad" },
  Xbox: { name: "XBOX", icon: "gamepad" },
  Vr: { name: "VR POD", icon: "headset" },
  RacingSim: { name: "RACING SIM", icon: "car" },
};

function groupStations(
  venue: VenueResponse,
  stations?: StationAvailability[],
): StationGroup[] {
  const groups = new Map<
    string,
    { kind: string; labels: string[]; price: number; stationIds: Set<string> }
  >();

  for (const s of venue.stations) {
    const existing = groups.get(s.kind);
    if (existing) {
      existing.labels.push(s.label);
      existing.stationIds.add(s.id);
      existing.price = Math.min(existing.price, s.pricePerHour);
    } else {
      groups.set(s.kind, {
        kind: s.kind,
        labels: [s.label],
        price: s.pricePerHour,
        stationIds: new Set([s.id]),
      });
    }
  }

  const now = new Date();
  const availableStationIds = new Set<string>();
  if (stations) {
    for (const station of stations) {
      for (const w of station.availableWindows) {
        if (new Date(w.endsAt) > now) {
          availableStationIds.add(station.stationId);
          break;
        }
      }
    }
  }

  return Array.from(groups.values()).map((g) => {
    const available = stations
      ? Array.from(g.stationIds).filter((id) => availableStationIds.has(id)).length
      : g.labels.length;

    const cfg = KIND_CONFIG[g.kind] ?? { name: g.kind, icon: "monitor" as IconName };

    return {
      kind: g.kind,
      name: cfg.name,
      icon: cfg.icon,
      bays: g.labels.sort().join(" / "),
      pricePerHour: g.price,
      available,
      total: g.labels.length,
    };
  });
}

const TABS = ["STATIONS", "ABOUT", "HOURS"] as const;
type Tab = (typeof TABS)[number];

export default function VenueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [tab, setTab] = useState<Tab>("STATIONS");

  const { data: venue, isLoading } = useQuery({
    queryKey: ["venue", slug],
    queryFn: () => fetchVenueBySlug(slug),
    enabled: !!slug,
  });

  const todayStr = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
  }, []);

  const { data: availability } = useQuery({
    queryKey: ["venue-availability", slug, todayStr],
    queryFn: () => fetchVenueAvailability(slug, todayStr),
    enabled: !!slug,
  });

  const stationGroups = useMemo(() => {
    if (!venue) return [];
    return groupStations(venue, availability?.stations);
  }, [venue, availability]);

  if (isLoading) {
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

  const minPrice = Math.min(...venue.stations.map((s) => s.pricePerHour));
  const totalBays = venue.stations.length;
  const isOpen24 = venue.opensAt === "00:00" && venue.closesAt === "23:59";
  const hoursLabel = isOpen24 ? "24H" : `${venue.opensAt}-${venue.closesAt}`;
  const availableNow = stationGroups.reduce((sum, g) => sum + g.available, 0);

  return (
    <div className="flex flex-col h-[100dvh]" style={{ backgroundColor: GB.bg }}>
      <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto pb-6">
        {/* Back button — above hero */}
        <div className="px-4 pt-4 pb-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 border px-3 py-2"
            style={{ backgroundColor: GB.surface, borderColor: GB.border, borderRadius: 6 }}
          >
            <Icon name="arrowLeft" size={16} color={GB.accent} />
            <span className="font-head font-bold text-[11px] uppercase" style={{ color: GB.accent, letterSpacing: "1.2px" }}>
              BACK
            </span>
          </button>
        </div>

        {/* Hero */}
        <div className="relative h-[280px] mx-4 overflow-hidden" style={{ backgroundColor: GB.raised, borderRadius: 8 }}>
          {(venue.coverUrl || venue.imageUrl) && (
            <Image
              src={venue.coverUrl ?? venue.imageUrl ?? ""}
              alt={venue.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          )}
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, transparent 30%, rgba(8,8,16,0.95) 100%)",
            }}
          />

          {/* Tags */}
          <div className="absolute bottom-24 left-4 flex gap-1.5">
            <MonoTag color={GB.success}>● OPEN · {hoursLabel}</MonoTag>
            <MonoTag color={GB.cyan}>{venue.slug.toUpperCase().slice(0, 7)}</MonoTag>
          </div>

          {/* Title */}
          <div className="absolute bottom-4 left-4 right-4">
            <p
              className="font-disp text-[32px] truncate"
              style={{ color: GB.fg, letterSpacing: "1.28px", lineHeight: "32px" }}
            >
              {venue.name}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <Icon name="mapPin" size={12} color={GB.fg3} />
              <span className="font-mono text-[11px]" style={{ color: GB.fg2 }}>
                {venue.address}
              </span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="mx-4 mb-4 flex border" style={{ borderColor: GB.border }}>
          {(
            [
              ["RATING", venue.rating.toFixed(1), "star", GB.accent],
              ["BAYS", `${availableNow}/${totalBays}`, "monitor", GB.success],
              ["HOURS", hoursLabel, "clock", GB.cyan],
              ["FROM", `${minPrice}G`, "coin", GB.bright],
            ] as const
          ).map(([label, val, icon, color], i) => (
            <div
              key={label}
              className="flex-1 py-2.5 px-1.5 flex flex-col items-center"
              style={{
                backgroundColor: GB.surface,
                borderLeft: i > 0 ? `1px solid ${GB.border}` : undefined,
              }}
            >
              <Icon name={icon} size={14} color={color} />
              <span className="font-head font-bold text-[13px] mt-1" style={{ color: GB.fg }}>
                {val}
              </span>
              <span className="font-mono text-[8px] mt-0.5" style={{ color: GB.fg3, letterSpacing: "0.96px" }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b mx-4 mb-3.5" style={{ borderColor: GB.border }}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2.5 text-center border-b-2 -mb-px transition-colors"
              style={{
                borderBottomColor: tab === t ? GB.accent : "transparent",
                color: tab === t ? GB.accent : GB.fg3,
              }}
            >
              <span className="font-head font-bold text-[10px]" style={{ letterSpacing: "1.4px" }}>
                {t}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "STATIONS" && (
          <div className="space-y-2 px-4">
            {stationGroups.map((g) => (
              <StationRow key={g.kind} station={g} />
            ))}
          </div>
        )}

        {tab === "ABOUT" && (
          <div className="px-4">
            <p className="font-body text-[13px]" style={{ color: GB.fg2, lineHeight: "20.8px" }}>
              {venue.description}
            </p>
            {venue.amenities.length > 0 && (
              <div className="mt-3.5 space-y-2">
                {venue.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2.5">
                    <Icon name="check" size={14} color={GB.success} />
                    <span className="font-body text-[13px]" style={{ color: GB.fg2 }}>{a}</span>
                  </div>
                ))}
              </div>
            )}
            {venue.phone && (
              <div className="mt-3.5 flex items-center gap-2.5">
                <Icon name="wifi" size={14} color={GB.cyan} />
                <span className="font-mono text-[12px]" style={{ color: GB.fg2 }}>
                  {venue.phone}
                </span>
              </div>
            )}
          </div>
        )}

        {tab === "HOURS" && (
          <div className="px-4">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d, i) => {
              const today = new Date().getDay();
              const dayIdx = today === 0 ? 6 : today - 1;
              const isToday = i === dayIdx;
              return (
                <div
                  key={d}
                  className="flex justify-between py-2 border-b"
                  style={{ borderColor: GB.border }}
                >
                  <span
                    className="font-mono text-[12px]"
                    style={{ color: isToday ? GB.accent : GB.fg3, letterSpacing: "1.44px" }}
                  >
                    {d}{isToday ? " · TODAY" : ""}
                  </span>
                  <span
                    className="font-mono text-[12px]"
                    style={{ color: isToday ? GB.fg : GB.fg2 }}
                  >
                    {hoursLabel}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      </div>

      {/* Bottom bar — always pinned */}
      <div
        className="shrink-0 border-t"
        style={{ backgroundColor: GB.bg, borderColor: GB.border }}
      >
        <div className="max-w-3xl mx-auto px-4 pt-3 pb-4">
          <CTAButton
            label="BOOK A BAY"
            onClick={() => router.push(`/booking/${venue.id}?slug=${venue.slug}`)}
          />
        </div>
      </div>
    </div>
  );
}
