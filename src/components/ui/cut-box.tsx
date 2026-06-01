"use client";

import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  cut?: number;
  variant?: "default" | "trapezoid";
  borderColor?: string;
  backgroundColor?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
};

function buildDefaultClip(s: number) {
  return `polygon(0 0, calc(100% - ${s}px) 0, 100% ${s}px, 100% 100%, ${s}px 100%, 0 calc(100% - ${s}px))`;
}

function buildTrapezoidClip(s: number) {
  return `polygon(${s}px 0, 100% 0, calc(100% - ${s}px) 100%, 0 100%)`;
}

export const CutBox = React.memo(function CutBox({
  children,
  className,
  cut = 8,
  variant = "default",
  borderColor = "#2A2A40",
  backgroundColor = "#12121E",
  onClick,
  style,
}: Props) {
  const clip = variant === "trapezoid" ? buildTrapezoidClip(cut) : buildDefaultClip(cut);

  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        "relative",
        onClick && "cursor-pointer transition-opacity hover:opacity-90 active:opacity-75",
        className
      )}
      style={{
        clipPath: clip,
        ...style,
      }}
    >
      {/* Border layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: borderColor,
          clipPath: clip,
        }}
      />
      {/* Content layer (inset by 1px for border) */}
      <div
        className="relative"
        style={{
          backgroundColor,
          clipPath: clip,
          margin: 1,
        }}
      >
        {children}
      </div>
    </Wrapper>
  );
});
