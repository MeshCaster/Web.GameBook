"use client";

import Link from "next/link";
import { GB } from "@/theme/tokens";
import { GlitchText } from "@/components/ui/glitch-text";
import { CTAButton } from "@/components/ui/cta-button";
import { Icon } from "@/components/ui/icon";

export default function OnboardingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 max-w-md md:max-w-lg mx-auto text-center">
      {/* Tagline */}
      <p
        className="font-mono text-[10px] mb-3"
        style={{ color: GB.cyan, letterSpacing: "2.4px" }}
      >
        {'// GAMING STATIONS. BOOKED IN SECONDS.'}
      </p>

      {/* Hero */}
      <GlitchText text="GAMEBOOK" className="text-[52px] leading-none" />

      <p
        className="font-body text-[14px] mt-4 leading-relaxed"
        style={{ color: GB.fg2 }}
      >
        Discover gaming arenas near you. Pick your bay, lock your time, and
        start playing.
      </p>

      {/* Stats */}
      <div
        className="flex gap-6 mt-8 mb-10"
      >
        {[
          { val: "50+", label: "ARENAS" },
          { val: "500+", label: "STATIONS" },
          { val: "24/7", label: "ACCESS" },
        ].map(({ val, label }) => (
          <div key={label} className="flex flex-col items-center">
            <span
              className="font-disp text-[28px]"
              style={{ color: GB.accent, letterSpacing: "1.12px" }}
            >
              {val}
            </span>
            <span
              className="font-mono text-[8px]"
              style={{ color: GB.fg3, letterSpacing: "1.28px" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="w-full space-y-4 md:space-y-5 md:px-10">
        <Link href="/sign-in">
          <CTAButton label="GET STARTED" onClick={() => {}} />
        </Link>
        <Link href="/sign-in" className="block">
          <CTAButton label="SIGN IN" variant="secondary" onClick={() => {}} />
        </Link>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-1.5 mt-10">
        <Icon name="mapPin" size={12} color={GB.fg3} />
        <span className="font-mono text-[10px]" style={{ color: GB.fg3 }}>
          TBILISI, GEORGIA
        </span>
      </div>
    </div>
  );
}
