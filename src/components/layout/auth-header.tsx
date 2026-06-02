"use client";

import React from "react";

export function AuthHeader() {
  return (
    <div
      className="absolute top-0 left-0 right-0 z-10 flex items-center px-6 pt-6 pb-3 pointer-events-none"
    >
      <span
        className="font-disp text-[22px]"
        style={{ color: "#EAEAFF", letterSpacing: "1.76px" }}
      >
        GAMEBOOK
      </span>
    </div>
  );
}
