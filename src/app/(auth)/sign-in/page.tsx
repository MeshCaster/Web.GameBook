"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GB } from "@/theme/tokens";
import { supabase } from "@/lib/auth/supabase";
import { signInWithSocial } from "@/lib/auth/social-login";
import { TextInput } from "@/components/ui/text-input";
import { CTAButton } from "@/components/ui/cta-button";
import { SocialButton } from "@/components/ui/social-button";
import { Divider } from "@/components/ui/divider";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.replace("/home");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider: "google" | "apple" | "facebook") => {
    setSocialLoading(provider);
    try {
      await signInWithSocial(provider);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Social sign in failed");
      setSocialLoading(null);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-6 pt-10 pb-20">
      {/* Header */}
      <p
        className="font-mono text-[10px] mb-1"
        style={{ color: GB.cyan, letterSpacing: "1.6px" }}
      >
        {'// WELCOME BACK'}
      </p>
      <h1
        className="font-disp text-[36px] leading-none mb-1"
        style={{ color: GB.fg, letterSpacing: "1.44px" }}
      >
        SIGN IN
      </h1>
      <p className="font-body text-[13px] mb-8" style={{ color: GB.fg3 }}>
        Enter your credentials to continue.
      </p>

      {/* Social buttons */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        {(["google", "apple", "facebook"] as const).map((p) => (
          <SocialButton
            key={p}
            provider={p}
            onClick={() => handleSocial(p)}
            loading={socialLoading === p}
            disabled={!!socialLoading}
          />
        ))}
      </div>

      <Divider label="OR" />

      {/* Form */}
      <TextInput
        label="EMAIL"
        placeholder="gamer@gamebook.gg"
        value={email}
        onChange={setEmail}
        type="email"
        autoComplete="email"
      />
      <TextInput
        label="PASSWORD"
        placeholder="••••••••"
        value={password}
        onChange={setPassword}
        isPassword
        autoComplete="current-password"
      />

      {error && (
        <p className="font-mono text-[12px] text-gb-danger mb-3">{error}</p>
      )}

      <CTAButton label="SIGN IN" onClick={handleSubmit} loading={loading} />

      {/* Links */}
      <div className="flex justify-between mt-6">
        <Link
          href="/forgot-password"
          className="font-mono text-[11px]"
          style={{ color: GB.fg3 }}
        >
          FORGOT PASSWORD?
        </Link>
        <Link
          href="/sign-up"
          className="font-mono text-[11px]"
          style={{ color: GB.accent }}
        >
          CREATE ACCOUNT →
        </Link>
      </div>
    </div>
  );
}
