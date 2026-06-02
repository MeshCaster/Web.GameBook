"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GB } from "@/theme/tokens";
import { Icon } from "@/components/ui/icon";
import { MonoTag } from "@/components/ui/mono-tag";
import type { VenueResponse } from "@/lib/api/venues";

const KIND_LABELS: Record<string, string> = {
  Pc: "PC", Ps5: "PS5", Xbox: "XBOX", Vr: "VR", RacingSim: "SIM",
};

export const VenueRow = React.memo(function VenueRow({ venue }: { venue: VenueResponse }) {
  const totalCapacity = venue.stations.reduce((sum, s) => sum + s.capacity, 0);
  const minPrice = venue.stations.length > 0 ? Math.min(...venue.stations.map((s) => s.pricePerHour)) : 0;

  const kinds = venue.stations.reduce<string[]>((acc, s) => {
    const label = KIND_LABELS[s.kind] ?? s.kind;
    if (!acc.includes(label)) acc.push(label);
    return acc;
  }, []);

  return (
    <Link href={`/venue/${venue.slug}`} className="block">
      <div
        className="border overflow-hidden transition-colors"
        style={{
          backgroundColor: GB.surface,
          borderColor: GB.border,
          borderRadius: 10,
        }}
      >
        {/* Thumbnail */}
        <div className="relative h-[130px]" style={{ backgroundColor: GB.raised }}>
          {venue.imageUrl && (
            <Image src={venue.imageUrl} alt={venue.name} fill className="object-cover" sizes="50vw" />
          )}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(30,20,64,0.9) 100%)" }}
          />
          <div className="absolute top-2.5 left-2.5">
            <MonoTag color={totalCapacity > 0 ? GB.success : GB.danger}>
              ● {totalCapacity} BAYS
            </MonoTag>
          </div>
          {venue.distanceKm != null && (
            <div className="absolute top-2.5 right-2.5">
              <MonoTag color={GB.cyan}>{venue.distanceKm.toFixed(1)} KM</MonoTag>
            </div>
          )}
          {/* Venue name overlaid on image */}
          <div className="absolute bottom-2.5 left-3 right-3">
            <p className="font-head font-bold text-[14px] truncate" style={{ color: GB.fg, letterSpacing: "0.28px" }}>
              {venue.name}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="px-3 py-2.5">
          <div className="flex items-center gap-1.5 mb-2">
            <Icon name="mapPin" size={10} color={GB.fg3} />
            <span className="font-mono text-[9px] truncate flex-1" style={{ color: GB.fg3 }}>
              {venue.address}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Icon name="star" size={10} color={GB.accent} />
              <span className="font-head font-bold text-[12px]" style={{ color: GB.fg2 }}>{venue.rating.toFixed(1)}</span>
              <span className="font-mono text-[8px]" style={{ color: GB.fg3 }}>({venue.reviewCount})</span>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="font-disp text-[18px]" style={{ color: GB.accent, letterSpacing: "0.72px" }}>{minPrice}</span>
              <span className="font-mono text-[8px]" style={{ color: GB.fg3 }}>GEL/HR</span>
            </div>
          </div>

          {kinds.length > 0 && (
            <div className="flex gap-1 mt-2">
              {kinds.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="font-mono text-[7px] border px-1.5 py-px"
                  style={{ borderColor: GB.border, color: GB.fg3, letterSpacing: "0.48px", borderRadius: 2 }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
});
