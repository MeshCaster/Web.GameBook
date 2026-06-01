"use client";

import React from "react";
import { GB } from "@/theme/tokens";

type Props = {
  children: React.ReactNode;
  sub?: string;
  className?: string;
};

export const SectionHeader = React.memo(function SectionHeader({
  children,
  sub,
  className,
}: Props) {
  return (
    <div className={`flex items-baseline justify-between px-4 mb-2.5 ${className ?? ""}`}>
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[11px]" style={{ color: GB.accent }}>
          {">>"}
        </span>
        <span
          className="font-head font-bold text-[13px] uppercase"
          style={{ color: GB.fg, letterSpacing: "1.82px" }}
        >
          {children}
        </span>
      </div>
      {sub && (
        <span
          className="font-mono text-[10px]"
          style={{ color: GB.fg3, letterSpacing: "0.8px" }}
        >
          {sub}
        </span>
      )}
    </div>
  );
});
