"use client";

import React from "react";
import { CutBox } from "./cut-box";

type Props = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  disabled?: boolean;
};

export function CTAButton({
  label,
  onClick,
  variant = "primary",
  loading = false,
  disabled = false,
}: Props) {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";

  return (
    <div
      className={`mx-auto w-fit${disabled ? " opacity-50" : ""}`}
      style={
        isPrimary
          ? { filter: "drop-shadow(0 0 14px rgba(204,255,0,0.25))" }
          : undefined
      }
    >
      <CutBox
        cut={10}
        backgroundColor={isPrimary ? "#CCFF00" : "transparent"}
        borderColor={
          isPrimary
            ? "#CCFF00"
            : isSecondary
              ? "#7B35FF"
              : "#FF3B5C"
        }
        onClick={disabled || loading ? undefined : onClick}
      >
        <div className="flex items-center justify-center h-[54px] md:h-[72px] px-6 md:px-10">
          {loading ? (
            <div
              className="w-5 h-5 md:w-6 md:h-6 border-2 rounded-full animate-spin"
              style={{
                borderColor: isPrimary ? "#08080F" : "#EAEAFF",
                borderTopColor: "transparent",
              }}
            />
          ) : (
            <span
              className="font-head font-bold text-[14px] md:text-[17px] uppercase"
              style={{
                color: isPrimary ? "#08080F" : "#F0EEFF",
                letterSpacing: "2.52px",
              }}
            >
              {label}
            </span>
          )}
        </div>
      </CutBox>
    </div>
  );
}
