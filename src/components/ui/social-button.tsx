"use client";

import React from "react";
import { CutBox } from "./cut-box";

type Props = {
  provider: "google" | "apple" | "facebook";
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
};

function GoogleIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 48 48">
      <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" fill="#FFC107" />
      <path d="M3.2 14.1l7.1 5.2C12.2 15.1 17.5 12 24 12c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 14.8 2 6.7 7 3.2 14.1z" fill="#FF3D00" />
      <path d="M24 46c5.4 0 10.3-1.8 14.1-5l-6.5-5.5C29.6 37.1 27 38 24 38c-6 0-11.1-4-12.8-9.5l-7 5.4C7.5 41 15.2 46 24 46z" fill="#4CAF50" />
      <path d="M44.5 20H24v8.5h11.8c-.9 3-2.8 5.5-5.4 7.1l6.5 5.5C42 36.3 46 30.7 46 24c0-1.3-.2-2.7-.5-4z" fill="#1976D2" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24">
      <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.47h-2.796v8.385C19.612 22.954 24 17.99 24 12z" fill="#1877F2" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="#F0EEFF" />
    </svg>
  );
}

const icons = { google: GoogleIcon, facebook: FacebookIcon, apple: AppleIcon };

export function SocialButton({ provider, onClick, loading = false, disabled = false }: Props) {
  const SvgIcon = icons[provider];

  return (
    <CutBox
      cut={8}
      backgroundColor="#12121E"
      borderColor="#2A2A40"
      onClick={disabled || loading ? undefined : onClick}
      className={disabled ? "opacity-50" : ""}
    >
      <div className="flex items-center justify-center h-[50px]">
        {loading ? (
          <div className="w-5 h-5 border-2 border-gb-fg rounded-full animate-spin border-t-transparent" />
        ) : (
          <SvgIcon />
        )}
      </div>
    </CutBox>
  );
}
