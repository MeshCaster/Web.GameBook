"use client";

import React from "react";
import { GB } from "@/theme/tokens";
import { CutBox } from "@/components/ui/cut-box";
import { Icon, type IconName } from "@/components/ui/icon";

type Props = {
  icon: IconName;
  label: string;
  sub?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (v: number) => string;
  onChange: (v: number) => void;
};

export const CounterRow = React.memo(function CounterRow({
  icon,
  label,
  sub,
  value,
  min = 1,
  max = 99,
  step = 1,
  formatValue,
  onChange,
}: Props) {
  const canDec = value - step >= min;
  const canInc = value + step <= max;

  return (
    <CutBox cut={6} variant="trapezoid" backgroundColor={GB.surface} borderColor={GB.border}>
      <div className="flex items-center px-3.5 py-3">
        <div
          className="w-8 h-8 flex items-center justify-center border mr-2.5"
          style={{ backgroundColor: GB.raised, borderColor: GB.border }}
        >
          <Icon name={icon} size={16} color={GB.bright} />
        </div>
        <div className="flex-1">
          <span className="font-head font-bold text-[12px] uppercase block" style={{ color: GB.fg, letterSpacing: "0.72px" }}>
            {label}
          </span>
          {sub && <span className="font-mono text-[9px] mt-0.5 block" style={{ color: GB.fg3 }}>{sub}</span>}
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => canDec && onChange(value - step)}
            className="w-8 h-8 flex items-center justify-center border"
            style={{
              backgroundColor: canDec ? GB.raised : "transparent",
              borderColor: canDec ? GB.border : "rgba(42,42,64,0.4)",
            }}
          >
            <Icon name="minus" size={14} color={canDec ? GB.fg2 : GB.fg3} />
          </button>
          <div
            className="min-w-[44px] h-8 px-1.5 flex items-center justify-center border"
            style={{ backgroundColor: GB.raised, borderColor: GB.borderHi }}
          >
            <span className="font-disp text-[20px]" style={{ color: GB.accent, lineHeight: "22px" }}>
              {formatValue ? formatValue(value) : value}
            </span>
          </div>
          <button
            onClick={() => canInc && onChange(value + step)}
            className="w-8 h-8 flex items-center justify-center border"
            style={{
              backgroundColor: canInc ? GB.raised : "transparent",
              borderColor: canInc ? GB.border : "rgba(42,42,64,0.4)",
            }}
          >
            <Icon name="plus" size={14} color={canInc ? GB.fg2 : GB.fg3} />
          </button>
        </div>
      </div>
    </CutBox>
  );
});
