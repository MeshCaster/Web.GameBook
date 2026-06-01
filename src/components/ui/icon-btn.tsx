"use client";

import React from "react";
import { GB } from "@/theme/tokens";
import { Icon, type IconName } from "./icon";
import { CutBox } from "./cut-box";

type Props = {
  name: IconName;
  badge?: boolean;
  onClick?: () => void;
};

export const IconBtn = React.memo(function IconBtn({
  name,
  badge,
  onClick,
}: Props) {
  return (
    <CutBox
      cut={6}
      variant="trapezoid"
      backgroundColor={GB.surface}
      borderColor={GB.border}
      onClick={onClick}
      style={{ width: 36, height: 36 }}
    >
      <div className="flex items-center justify-center w-full h-full relative">
        <Icon name={name} size={16} color={GB.fg2} />
        {badge && (
          <div
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: GB.danger,
              boxShadow: `0 0 3px ${GB.danger}`,
            }}
          />
        )}
      </div>
    </CutBox>
  );
});
