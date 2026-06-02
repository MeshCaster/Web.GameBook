"use client";

import React, { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import { GB } from "@/theme/tokens";
import type { VenueResponse } from "@/lib/api/venues";

const pulseDotIcon = L.divIcon({
  className: "",
  html: '<div class="pulse-dot"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

type Props = {
  center: { lat: number; lng: number };
  venues: VenueResponse[];
  selectedId: string | null;
  onSelect: (venue: VenueResponse) => void;
  userCoords: { lat: number; lng: number } | null;
};

export default function LeafletMap({ center, venues, selectedId, onSelect, userCoords }: Props) {
  const polylines = useMemo(() => {
    if (!userCoords) return [];
    const { lat, lng } = userCoords;
    return venues
      .filter((v) => v.latitude != null && v.longitude != null)
      .map((v) => ({
        id: v.id,
        dist: (v.latitude! - lat) ** 2 + (v.longitude! - lng) ** 2,
        positions: [
          [lat, lng] as [number, number],
          [v.latitude!, v.longitude!] as [number, number],
        ],
      }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 10);
  }, [userCoords, venues]);

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      className="w-full h-full"
      style={{ background: "#1E1440" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution=""
      />

      {/* Purple wire connections from user to each venue */}
      {polylines.map((pl) => (
        <Polyline
          key={pl.id}
          positions={pl.positions}
          pathOptions={{
            color: GB.primary,
            weight: 1.5,
            opacity: 0.35,
            dashArray: "6 4",
          }}
        />
      ))}

      {/* Venue markers */}
      {venues.map((v) => (
        <CircleMarker
          key={v.id}
          center={[v.latitude!, v.longitude!]}
          radius={8}
          pathOptions={{
            color: selectedId === v.id ? GB.accent : GB.cyan,
            fillColor: selectedId === v.id ? GB.accent : GB.cyan,
            fillOpacity: 0.8,
            weight: 2,
          }}
          eventHandlers={{
            click: () => onSelect(v),
          }}
        >
          <Popup>
            <div style={{ color: "#1E1440", fontFamily: "var(--font-space-grotesk)" }}>
              <strong>{v.name}</strong>
              <br />
              <span style={{ fontSize: 11 }}>{v.address}</span>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* Pulsating user location dot */}
      {userCoords && (
        <Marker position={[userCoords.lat, userCoords.lng]} icon={pulseDotIcon} />
      )}
    </MapContainer>
  );
}