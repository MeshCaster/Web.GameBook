"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GB } from "@/theme/tokens";
import { supabase } from "@/lib/auth/supabase";
import { TextInput } from "@/components/ui/text-input";
import { CTAButton } from "@/components/ui/cta-button";
import { Icon } from "@/components/ui/icon";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });
      if (error) throw error;
      setSent(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="max-w-sm mx-auto px-6 pt-16 pb-20 text-center">
        <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full relative">
          <div
            className="absolute inset-0 rounded-full opacity-15"
            style={{ backgroundColor: GB.success }}
          />
          <Icon name="check" size={28} color={GB.success} />
        </div>
        <h2
          className="font-disp text-[28px] mb-2"
          style={{ color: GB.fg, letterSpacing: "1.12px" }}
        >
          CHECK YOUR EMAIL
        </h2>
        <p className="font-body text-[13px] mb-8" style={{ color: GB.fg3 }}>
          We sent a password reset link to {email}
        </p>
        <Link
          href="/sign-in"
          className="font-mono text-[11px]"
          style={{ color: GB.accent }}
        >
          ← BACK TO SIGN IN
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-6 pt-10 pb-20">
      <p
        className="font-mono text-[10px] mb-1"
        style={{ color: GB.cyan, letterSpacing: "1.6px" }}
      >
        {'// RESET PASSWORD'}
      </p>
      <h1
        className="font-disp text-[36px] leading-none mb-1"
        style={{ color: GB.fg, letterSpacing: "1.44px" }}
      >
        FORGOT PASSWORD
      </h1>
      <p className="font-body text-[13px] mb-8" style={{ color: GB.fg3 }}>
        Enter your email and we&apos;ll send a reset link.
      </p>

      <TextInput
        label="EMAIL"
        placeholder="gamer@gamebook.gg"
        value={email}
        onChange={setEmail}
        type="email"
        autoComplete="email"
      />

      {error && (
        <p className="font-mono text-[12px] text-gb-danger mb-3">{error}</p>
      )}

      <CTAButton label="SEND RESET LINK" onClick={handleSubmit} loading={loading} />

      <div className="mt-6 text-center">
        <Link
          href="/sign-in"
          className="font-mono text-[11px]"
          style={{ color: GB.fg3 }}
        >
          ← BACK TO SIGN IN
        </Link>
      </div>
    </div>
  );
}
