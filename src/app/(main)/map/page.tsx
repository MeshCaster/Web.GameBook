"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import dynamic from "next/dynamic";
import { GB } from "@/theme/tokens";
import { fetchVenues, type VenueResponse } from "@/lib/api/venues";
import { useGeolocation } from "@/hooks/use-geolocation";
import { Icon } from "@/components/ui/icon";

/* Leaflet must be loaded client-side only */
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((m) => m.CircleMarker),
  { ssr: false },
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false },
);

const TBILISI = { lat: 41.7151, lng: 44.8271 };

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function MapPage() {
  const { coords } = useGeolocation();
  const [selected, setSelected] = useState<VenueResponse | null>(null);

  const center = coords ?? TBILISI;

  const { data, isLoading } = useQuery({
    queryKey: ["venues-map", coords?.lat, coords?.lng],
    queryFn: () => fetchVenues({ lat: coords?.lat, lng: coords?.lng }),
  });

  const venues = data?.venues ?? [];
  const mappable = venues.filter((v) => v.latitude != null && v.longitude != null);

  const nearby = useMemo(() => {
    if (!coords) return mappable.slice(0, 15);
    return [...mappable]
      .sort(
        (a, b) =>
          haversineKm(coords.lat, coords.lng, a.latitude!, a.longitude!) -
          haversineKm(coords.lat, coords.lng, b.latitude!, b.longitude!),
      )
      .slice(0, 15);
  }, [coords, mappable]);

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
    <div className="flex h-screen lg:h-screen">
      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={13}
          className="w-full h-full"
          style={{ background: "#080810" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution=""
          />
          {mappable.map((v) => (
            <CircleMarker
              key={v.id}
              center={[v.latitude!, v.longitude!]}
              radius={8}
              pathOptions={{
                color: selected?.id === v.id ? GB.accent : GB.cyan,
                fillColor: selected?.id === v.id ? GB.accent : GB.cyan,
                fillOpacity: 0.8,
                weight: 2,
              }}
              eventHandlers={{
                click: () => setSelected(v),
              }}
            >
              <Popup>
                <div style={{ color: "#080810", fontFamily: "var(--font-space-grotesk)" }}>
                  <strong>{v.name}</strong>
                  <br />
                  <span style={{ fontSize: 11 }}>{v.address}</span>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Bottom venue card */}
        {selected && (
          <div
            className="absolute bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-auto lg:w-[360px] lg:left-4 z-[1000] transition-transform"
          >
            <VenueMapCard venue={selected} />
          </div>
        )}
      </div>

      {/* Desktop: side panel */}
      <div
        className="hidden lg:flex flex-col w-[360px] border-l overflow-y-auto"
        style={{ backgroundColor: GB.bg, borderColor: GB.border }}
      >
        <div className="px-4 pt-6 pb-3">
          <p
            className="font-head font-bold text-[15px]"
            style={{ color: GB.fg, letterSpacing: "1.8px" }}
          >
            NEARBY VENUES
          </p>
          <p className="font-mono text-[10px] mt-1" style={{ color: GB.fg3 }}>
            {nearby.length} RESULTS
          </p>
        </div>
        <div className="space-y-2 px-4 pb-6">
          {nearby.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelected(v)}
              className="w-full text-left p-3 border transition-colors"
              style={{
                backgroundColor: selected?.id === v.id ? "rgba(123,53,255,0.08)" : GB.surface,
                borderColor: selected?.id === v.id ? GB.primary : GB.border,
              }}
            >
              <p className="font-head font-bold text-[13px] truncate" style={{ color: GB.fg }}>
                {v.name}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <Icon name="mapPin" size={10} color={GB.fg3} />
                <span className="font-mono text-[10px] truncate" style={{ color: GB.fg3 }}>
                  {v.address}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1">
                  <Icon name="star" size={10} color={GB.accent} />
                  <span className="font-head font-bold text-[11px]" style={{ color: GB.fg2 }}>
                    {v.rating.toFixed(1)}
                  </span>
                </div>
                <span className="font-disp text-[16px]" style={{ color: GB.accent }}>
                  {v.stations.length > 0 ? Math.min(...v.stations.map((s) => s.pricePerHour)) : "?"}{" "}
                  <span className="font-mono text-[9px]" style={{ color: GB.fg3 }}>GEL/HR</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function VenueMapCard({ venue }: { venue: VenueResponse }) {
  const minPrice =
    venue.stations.length > 0
      ? Math.min(...venue.stations.map((s) => s.pricePerHour))
      : null;

  return (
    <Link href={`/venue/${venue.slug}`}>
      <div
        className="rounded-xl border overflow-hidden"
        style={{ backgroundColor: GB.surface, borderColor: GB.border }}
      >
        <div className="p-3.5">
          <div className="flex justify-between items-center">
            <p
              className="font-disp text-[22px] flex-1 truncate"
              style={{ color: GB.fg, letterSpacing: "0.88px" }}
            >
              {venue.name}
            </p>
            <div className="flex items-center gap-1 ml-2">
              <Icon name="star" size={12} color={GB.accent} />
              <span className="font-head font-bold text-[13px]" style={{ color: GB.fg }}>
                {venue.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="mt-1.5 flex items-center gap-1.5">
            <Icon name="mapPin" size={10} color={GB.fg3} />
            <span className="font-mono text-[10px] truncate flex-1" style={{ color: GB.fg3 }}>
              {venue.address}
            </span>
            {venue.distanceKm != null && (
              <span className="font-mono text-[10px]" style={{ color: GB.cyan }}>
                {venue.distanceKm.toFixed(1)} KM
              </span>
            )}
          </div>

          <div className="mt-2.5 flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <Icon name="clock" size={10} color={GB.fg3} />
              <span className="font-mono text-[10px]" style={{ color: GB.fg3 }}>
                {venue.opensAt} – {venue.closesAt}
              </span>
            </div>
            {minPrice != null && (
              <div className="flex items-baseline gap-1">
                <span
                  className="font-disp text-[20px]"
                  style={{ color: GB.accent, letterSpacing: "0.8px" }}
                >
                  {minPrice}
                </span>
                <span className="font-mono text-[9px]" style={{ color: GB.fg3 }}>
                  GEL/HR
                </span>
              </div>
            )}
          </div>
        </div>

        <div
          className="border-t py-2 flex items-center justify-center gap-1.5"
          style={{ borderColor: GB.border }}
        >
          <span
            className="font-mono text-[9px]"
            style={{ color: GB.fg3, letterSpacing: "1.44px" }}
          >
            TAP TO VIEW ARENA
          </span>
          <Icon name="chevR" size={10} color={GB.fg3} />
        </div>
      </div>
    </Link>
  );
}
