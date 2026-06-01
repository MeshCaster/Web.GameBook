"use client";

import React from "react";
import { GB } from "@/theme/tokens";

type Props = {
  text: string;
  className?: string;
};

export function GlitchText({ text, className = "" }: Props) {
  return (
    <div className="relative">
      <span
        className={`absolute font-disp ${className}`}
        style={{
          top: -1,
          left: 1,
          color: GB.cyan,
          opacity: 0.4,
        }}
      >
        {text}
      </span>
      <span
        className={`absolute font-disp ${className}`}
        style={{
          top: 1,
          left: -1,
          color: GB.danger,
          opacity: 0.3,
        }}
      >
        {text}
      </span>
      <span className={`relative font-disp ${className}`} style={{ color: GB.fg }}>
        {text}
      </span>
    </div>
  );
}
