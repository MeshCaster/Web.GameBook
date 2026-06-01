"use client";

import { useEffect, useRef, useState } from "react";
import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
} from "@microsoft/signalr";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5080";

type AvailabilityUpdate = {
  stationId: string;
  availableWindows: { startsAt: string; endsAt: string }[];
};

export function useVenueAvailability(venueSlug: string | undefined) {
  const [updates, setUpdates] = useState<AvailabilityUpdate[]>([]);
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    if (!venueSlug) return;

    const connection = new HubConnectionBuilder()
      .withUrl(`${API_BASE}/hubs/venue`)
      .configureLogging(LogLevel.Warning)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection.on("AvailabilityUpdated", (update: AvailabilityUpdate) => {
      setUpdates((prev) => [...prev, update]);
    });

    connection
      .start()
      .then(() => connection.invoke("JoinVenueGroup", venueSlug))
      .catch(console.error);

    return () => {
      connection
        .invoke("LeaveVenueGroup", venueSlug)
        .catch(() => {})
        .then(() => connection.stop());
    };
  }, [venueSlug]);

  return { updates };
}
