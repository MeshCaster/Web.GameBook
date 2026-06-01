"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { GB } from "@/theme/tokens";
import { fetchVenues, type VenueResponse } from "@/lib/api/venues";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useDebounce } from "@/hooks/use-debounce";
import { VenueRow } from "@/components/venue/venue-row";
import { Icon } from "@/components/ui/icon";
import { IconBtn } from "@/components/ui/icon-btn";
import { Pill } from "@/components/ui/pill";
import { MonoTag } from "@/components/ui/mono-tag";
import { SectionHeader } from "@/components/ui/section-header";
import { CutBox } from "@/components/ui/cut-box";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [cat, setCat] = useState("NEARBY");
  const { coords } = useGeolocation();

  const { data, isLoading } = useQuery({
    queryKey: ["venues", debouncedSearch, coords?.lat, coords?.lng],
    queryFn: () =>
      fetchVenues({
        search: debouncedSearch || undefined,
        lat: coords?.lat,
        lng: coords?.lng,
      }),
  });

  const venues = data?.venues ?? [];
  const total = data?.total ?? 0;
  const featured = venues
    .filter((v) => v.isFeatured)
    .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
  const nearby = venues.filter((v) => !v.isFeatured);

  const cats = ["NEARBY", "OPEN NOW"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="w-6 h-6 border-2 rounded-full animate-spin"
          style={{ borderColor: GB.primary, borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Greeting */}
      <div className="flex items-center justify-between px-4 pt-6 pb-3.5">
        <div>
          <p
            className="font-mono text-[10px]"
            style={{ color: GB.cyan, letterSpacing: "1.6px" }}
          >
            {'// GG, PLAYER'}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <Icon name="mapPin" size={14} color={GB.accent} />
            <span
              className="font-head font-bold text-[16px]"
              style={{ color: GB.fg }}
            >
              TBILISI
            </span>
            <Icon name="chevDown" size={14} color={GB.fg3} />
          </div>
        </div>
        <div className="flex gap-1.5">
          <IconBtn name="bell" badge />
          <IconBtn name="user" />
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-3.5">
        <CutBox cut={8} variant="trapezoid" backgroundColor={GB.surface} borderColor={GB.border}>
          <div className="flex items-center gap-2.5 py-2.5 px-3.5">
            <Icon name="search" size={16} color={GB.fg3} />
            <input
              placeholder="Search arenas, games, areas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent font-body text-[13px] text-gb-fg outline-none placeholder:text-[#8080A0]"
            />
            <Icon name="sliders" size={16} color={GB.accent} />
          </div>
        </CutBox>
      </div>

      {/* Pills */}
      <div className="flex gap-1.5 px-4 pb-4">
        {cats.map((c) => (
          <Pill key={c} active={cat === c} color={GB.primary} onClick={() => setCat(c)}>
            {c}
          </Pill>
        ))}
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <>
          <SectionHeader sub={`${String(featured.length).padStart(2, "0")} / ${String(total).padStart(2, "0")}`}>
            FEATURED ARENAS
          </SectionHeader>
          <div className="flex gap-3 overflow-x-auto px-4 pb-4.5 scrollbar-hide">
            {featured.map((venue) => (
              <div key={venue.id} className="min-w-[300px] max-w-[300px] flex-shrink-0">
                <FeaturedCard venue={venue} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Nearby */}
      <SectionHeader sub={`${String(nearby.length).padStart(2, "0")} RESULTS`}>
        NEARBY ARENAS
      </SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5 px-4 pb-8">
        {nearby.map((venue) => (
          <VenueRow key={venue.id} venue={venue} />
        ))}
      </div>

      {nearby.length === 0 && (
        <div className="text-center py-10">
          <p className="font-body text-[14px]" style={{ color: GB.fg3 }}>
            {debouncedSearch
              ? `No venues match "${debouncedSearch}"`
              : "No venues found nearby"}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Featured Card ─── */

function FeaturedCard({ venue }: { venue: VenueResponse }) {
  const minPrice = venue.stations.length > 0
    ? Math.min(...venue.stations.map((s) => s.pricePerHour))
    : 0;
  const totalCapacity = venue.stations.reduce((sum, s) => sum + s.capacity, 0);

  return (
    <Link href={`/venue/${venue.slug}`}>
      <CutBox cut={14} backgroundColor={GB.surface} borderColor={GB.border}>
        {/* Hero */}
        <div className="relative h-[180px]" style={{ backgroundColor: GB.raised }}>
          {(venue.coverUrl || venue.imageUrl) && (
            <Image
              src={venue.coverUrl ?? venue.imageUrl ?? ""}
              alt={venue.name}
              fill
              className="object-cover"
              sizes="300px"
            />
          )}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <MonoTag color={GB.success}>
              ● OPEN · {totalCapacity} BAYS
            </MonoTag>
          </div>
          <div className="absolute top-3 right-3">
            <MonoTag color={GB.cyan}>
              {venue.slug.toUpperCase().slice(0, 6)}
            </MonoTag>
          </div>
        </div>

        {/* Info */}
        <div className="px-3.5 pt-2.5 pb-1.5">
          <p
            className="font-disp text-[20px] truncate"
            style={{ color: GB.fg, letterSpacing: "0.8px" }}
          >
            {venue.name}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <Icon name="mapPin" size={10} color={GB.fg3} />
            <span className="font-mono text-[10px] truncate flex-1" style={{ color: GB.fg3 }}>
              {venue.address}
            </span>
            {venue.distanceKm != null && (
              <span className="font-mono text-[10px]" style={{ color: GB.accent }}>
                {venue.distanceKm.toFixed(1)} KM
              </span>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="px-3.5 pt-1.5 pb-2.5 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <Stars value={Math.round(venue.rating)} size={11} />
            <span className="font-head font-bold text-[13px]" style={{ color: GB.fg }}>
              {venue.rating.toFixed(1)}
            </span>
            <span className="font-mono text-[10px]" style={{ color: GB.fg3 }}>
              ({venue.reviewCount})
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className="font-disp text-[22px]"
              style={{ color: GB.accent, letterSpacing: "0.88px" }}
            >
              {minPrice}
            </span>
            <span className="font-mono text-[10px]" style={{ color: GB.fg3 }}>
              GEL/HR
            </span>
          </div>
        </div>
      </CutBox>
    </Link>
  );
}

function Stars({ value = 5, size = 12 }: { value?: number; size?: number }) {
  return (
    <div className="flex gap-px">
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon
          key={i}
          name={i <= value ? "star" : "starOutline"}
          size={size}
          color={GB.accent}
        />
      ))}
    </div>
  );
}
