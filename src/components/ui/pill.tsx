"use client";

import React from "react";
import { GB } from "@/theme/tokens";

type Props = {
  children: React.ReactNode;
  active?: boolean;
  color?: string;
  onClick?: () => void;
};

export const Pill = React.memo(function Pill({
  children,
  active,
  color = GB.primary,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="font-head font-semibold text-[11px] uppercase rounded-full transition-colors"
      style={{
        backgroundColor: active ? color : GB.surface,
        border: `1px solid ${active ? color : GB.border}`,
        padding: "6px 14px",
        color: active ? GB.fg : GB.fg3,
        letterSpacing: "0.66px",
      }}
    >
      {children}
    </button>
  );
});
