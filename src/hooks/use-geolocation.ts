"use client";

import { useEffect, useState } from "react";

type Coords = { lat: number; lng: number };

export function useGeolocation() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        setError(err.message);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, []);

  return { coords, error };
}
