"use client";

import React from "react";

const GRID_SPACING = 34;

export const AuthBackground = React.memo(function AuthBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #2E2254 0.5px, transparent 0.5px),
            linear-gradient(to bottom, #2E2254 0.5px, transparent 0.5px)
          `,
          backgroundSize: `${GRID_SPACING}px ${GRID_SPACING}px`,
          maskImage: "radial-gradient(ellipse 50% 35% at 50% 23%, white 0%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 50% 35% at 50% 23%, white 0%, transparent 100%)",
        }}
      />

      {/* Outer ring */}
      <div
        className="absolute rounded-full border border-gb-primary opacity-[0.12]"
        style={{
          width: 640,
          height: 640,
          top: "calc(23% - 320px)",
          left: "calc(50% - 320px)",
        }}
      />

      {/* Inner ring */}
      <div
        className="absolute rounded-full border border-gb-primary opacity-[0.08]"
        style={{
          width: 240,
          height: 240,
          top: "calc(23% - 120px)",
          left: "calc(50% - 120px)",
        }}
      />

      {/* Pinpoint */}
      <div
        className="absolute w-1.5 h-1.5 rounded-full bg-gb-cyan opacity-70"
        style={{
          top: "23%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Bottom gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, transparent 25%, rgba(30,20,64,0.6) 45%, rgba(30,20,64,0.92) 60%, #1E1440 75%)",
        }}
      />
    </div>
  );
});
