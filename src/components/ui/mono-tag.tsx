"use client";

import React from "react";
import { GB } from "@/theme/tokens";

type Props = {
  children: React.ReactNode;
  color?: string;
  bg?: string;
  border?: string;
  className?: string;
};

function defaultBg(color: string): string {
  if (color === GB.cyan) return "rgba(0,245,255,0.08)";
  if (color === GB.accent) return "rgba(204,255,0,0.10)";
  if (color === GB.success) return "rgba(34,255,136,0.10)";
  return "rgba(123,53,255,0.10)";
}

function defaultBorder(color: string): string {
  if (color === GB.cyan) return "rgba(0,245,255,0.25)";
  if (color === GB.accent) return "rgba(204,255,0,0.30)";
  if (color === GB.success) return "rgba(34,255,136,0.25)";
  return "rgba(123,53,255,0.30)";
}

export const MonoTag = React.memo(function MonoTag({
  children,
  color = GB.cyan,
  bg,
  border,
  className,
}: Props) {
  return (
    <span
      className={`inline-block font-mono text-[9px] font-medium uppercase self-start ${className ?? ""}`}
      style={{
        backgroundColor: bg ?? defaultBg(color),
        border: `1px solid ${border ?? defaultBorder(color)}`,
        padding: "2px 6px",
        borderRadius: 2,
        color,
        letterSpacing: "0.72px",
      }}
    >
      {children}
    </span>
  );
});
