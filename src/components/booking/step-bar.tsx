"use client";

import React from "react";
import { GB } from "@/theme/tokens";

const STEPS = ["STATION", "TIME", "PAY"] as const;

export const StepBar = React.memo(function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center mx-4 my-3.5">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const badgeColor = done || active ? GB.accent : GB.border;
        const textColor = done ? GB.accent : active ? GB.fg : GB.fg3;

        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-[22px] h-[22px] flex items-center justify-center border"
                style={{
                  backgroundColor: done || active ? "rgba(204,255,0,0.12)" : GB.surface,
                  borderColor: badgeColor,
                }}
              >
                <span className="font-mono text-[10px] font-bold" style={{ color: badgeColor }}>
                  {done ? "\u2713" : `${i + 1}`}
                </span>
              </div>
              <span className="font-mono text-[8px] font-semibold" style={{ color: textColor, letterSpacing: "0.8px" }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-px mx-1 mb-4"
                style={{ backgroundColor: i < current ? GB.accent : GB.border }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
});
