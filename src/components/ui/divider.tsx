"use client";

import React from "react";

type Props = {
  label?: string;
};

export function Divider({ label }: Props) {
  return (
    <div className="flex items-center my-5">
      <div
        className="flex-1 h-px"
        style={{
          background: "linear-gradient(to right, transparent, #2A2A40)",
        }}
      />
      {label && (
        <span
          className="font-mono text-[11px] mx-4"
          style={{ color: "#8080A0", letterSpacing: "2.2px" }}
        >
          {label}
        </span>
      )}
      <div
        className="flex-1 h-px"
        style={{
          background: "linear-gradient(to right, #2A2A40, transparent)",
        }}
      />
    </div>
  );
}
