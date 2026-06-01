"use client";

import React from "react";
import { GB } from "@/theme/tokens";
import { CutBox } from "@/components/ui/cut-box";
import { Icon, type IconName } from "@/components/ui/icon";
import { MonoTag } from "@/components/ui/mono-tag";

export type StationGroup = {
  kind: string;
  name: string;
  icon: IconName;
  bays: string;
  pricePerHour: number;
  available: number;
  total: number;
};

type Props = {
  station: StationGroup;
  selected?: boolean;
  onClick?: () => void;
};

export const StationRow = React.memo(function StationRow({
  station,
  selected = false,
  onClick,
}: Props) {
  const ratio = station.total > 0 ? station.available / station.total : 0;
  const ok = station.available > 0;

  return (
    <CutBox
      cut={6}
      variant="trapezoid"
      backgroundColor={selected ? "rgba(204,255,0,0.06)" : GB.surface}
      borderColor={selected ? GB.accent : GB.border}
      onClick={onClick}
      style={selected ? { boxShadow: `0 0 8px ${GB.cyanGlow}` } : undefined}
    >
      <div className="flex items-center gap-3 p-3">
        <div
          className="w-11 h-11 flex items-center justify-center border"
          style={{
            backgroundColor: GB.raised,
            borderColor: selected ? GB.accent : GB.border,
          }}
        >
          <Icon name={station.icon} size={20} color={selected ? GB.accent : GB.bright} />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-head font-bold text-[13px]" style={{ color: GB.fg, letterSpacing: "0.52px" }}>
              {station.name}
            </span>
            <MonoTag color={ok ? GB.success : GB.danger}>
              {ok ? `${station.available}/${station.total} FREE` : "FULL"}
            </MonoTag>
          </div>
          <span className="font-mono text-[10px] mt-0.5 block" style={{ color: GB.fg3, letterSpacing: "1px" }}>
            {station.bays}
          </span>
          <div className="mt-1.5 h-[3px] max-w-[120px]" style={{ backgroundColor: GB.border }}>
            <div
              className="h-full"
              style={{
                width: `${ratio * 100}%`,
                backgroundColor: ratio > 0.5 ? GB.success : ratio > 0 ? GB.warning : GB.danger,
              }}
            />
          </div>
        </div>

        <div className="text-right">
          <span className="font-disp text-[22px]" style={{ color: GB.accent, letterSpacing: "0.88px", lineHeight: "22px" }}>
            {station.pricePerHour}
          </span>
          <span className="font-mono text-[9px] block mt-0.5" style={{ color: GB.fg3 }}>GEL / HR</span>
        </div>
      </div>
    </CutBox>
  );
});
