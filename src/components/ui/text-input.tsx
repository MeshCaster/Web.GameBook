"use client";

import React, { useState } from "react";
import { CutBox } from "./cut-box";
import { Icon } from "./icon";

type Props = {
  label: string;
  error?: string;
  isPassword?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
};

export function TextInput({
  label,
  error,
  isPassword = false,
  value,
  onChange,
  placeholder,
  type,
  autoComplete,
}: Props) {
  const [hidden, setHidden] = useState(isPassword);
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? "#FF3B5C"
    : focused
      ? "#7B35FF"
      : "#2A2A40";

  return (
    <div className="mb-4">
      <label
        className="block font-head text-[11px] uppercase text-gb-fg3 mb-2"
        style={{ letterSpacing: "1.76px" }}
      >
        {label}
      </label>
      <CutBox cut={8} backgroundColor="#12121E" borderColor={borderColor}>
        <div className="flex items-center gap-2 px-4">
          <input
            type={hidden ? "password" : type || "text"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            autoComplete={autoComplete}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="flex-1 bg-transparent font-head text-[16px] text-gb-fg py-3.5 outline-none placeholder:text-[#4A4A6A]"
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setHidden(!hidden)}
              className="text-[#7A7A9E] hover:text-gb-fg2 p-1"
            >
              <Icon name={hidden ? "x" : "check"} size={20} color="#7A7A9E" />
            </button>
          )}
        </div>
      </CutBox>
      {error && (
        <p className="font-mono text-[12px] text-gb-danger mt-1">{error}</p>
      )}
    </div>
  );
}
