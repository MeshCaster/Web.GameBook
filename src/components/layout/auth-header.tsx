"use client";

import React from "react";
import { CutBox } from "../ui/cut-box";

export function AuthHeader() {
  return (
    <div
      className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 pt-6 pb-3 pointer-events-none"
      style={{ backgroundColor: "rgba(10, 10, 15, 0.85)" }}
    >
      <span
        className="font-disp text-[22px]"
        style={{ color: "#EAEAFF", letterSpacing: "1.76px" }}
      >
        GAMEBOOK
      </span>
      <CutBox cut={4} borderColor="#00F0FF" backgroundColor="transparent">
        <span className="font-mono text-[10px] px-2 py-1" style={{ color: "#00F0FF" }}>
          v0.1 · TBS
        </span>
      </CutBox>
    </div>
  );
}
