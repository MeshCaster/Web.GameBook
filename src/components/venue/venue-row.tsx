"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GB } from "@/theme/tokens";
import { CutBox } from "@/components/ui/cut-box";
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
    <Link href={`/venue/${venue.slug}`}>
      <CutBox cut={6} variant="trapezoid" backgroundColor={GB.surface} borderColor={GB.border}>
        <div className="flex gap-3 p-2.5">
          {/* Thumbnail */}
          <div className="relative w-[84px] h-[84px] overflow-hidden flex-shrink-0" style={{ backgroundColor: GB.raised }}>
            {venue.imageUrl && (
              <Image src={venue.imageUrl} alt={venue.name} fill className="object-cover" sizes="84px" />
            )}
            <div className="absolute bottom-1 left-1">
              <MonoTag color={totalCapacity > 0 ? GB.success : GB.danger}>
                ● {totalCapacity}
              </MonoTag>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <p className="font-head font-bold text-[13px] truncate" style={{ color: GB.fg, letterSpacing: "0.26px" }}>
                {venue.name}
              </p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <Icon name="mapPin" size={10} color={GB.fg3} />
                <span className="font-mono text-[10px] truncate flex-1" style={{ color: GB.fg3 }}>{venue.address}</span>
                {venue.distanceKm != null && (
                  <span className="font-mono text-[10px]" style={{ color: GB.accent }}>{venue.distanceKm.toFixed(1)} KM</span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <Icon name="star" size={10} color={GB.accent} />
                <span className="font-head font-bold text-[11px]" style={{ color: GB.fg2 }}>{venue.rating.toFixed(1)}</span>
                <span className="font-mono text-[9px]" style={{ color: GB.fg3 }}>({venue.reviewCount})</span>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div className="flex gap-0.5">
                {kinds.slice(0, 3).map((t) => (
                  <span key={t} className="font-mono text-[8px] border px-1.5 py-px" style={{ borderColor: GB.border, color: GB.fg3, letterSpacing: "0.48px" }}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="font-disp text-[16px]" style={{ color: GB.accent, letterSpacing: "0.64px" }}>{minPrice}</span>
                <span className="font-mono text-[9px]" style={{ color: GB.fg3 }}>GEL/HR</span>
              </div>
            </div>
          </div>
        </div>
      </CutBox>
    </Link>
  );
});
