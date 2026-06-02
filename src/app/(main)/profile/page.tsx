"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { GB } from "@/theme/tokens";
import { useAuth } from "@/lib/auth/use-auth";
import { apiClient } from "@/lib/api/client";
import { fetchMyBookings, type BookingResponse } from "@/lib/api/bookings";
import { Icon } from "@/components/ui/icon";
import { MonoTag } from "@/components/ui/mono-tag";

type UserProfile = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  email: string | null;
  gamerTag: string | null;
  walletBalance: number;
  totalBookings: number;
  totalReviews: number;
};

function getInitials(name: string): string {
  return name
    .split(/[\s_@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return `${days[d.getDay()]} ${d.getDate()}`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

function computeDuration(startsAt: string, endsAt: string): string {
  const ms = new Date(endsAt).getTime() - new Date(startsAt).getTime();
  const mins = Math.round(ms / 60_000);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function getCountdown(startsAt: string): string | null {
  const diff = new Date(startsAt).getTime() - Date.now();
  if (diff <= 0) return null;
  const hrs = Math.floor(diff / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  if (hrs > 24) return `IN ${Math.floor(hrs / 24)}d`;
  if (hrs > 0) return `IN ${hrs}h ${mins}m`;
  return `IN ${mins}m`;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<"UPCOMING" | "HISTORY">("UPCOMING");

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => apiClient<UserProfile>("/v1/users/me"),
    enabled: !!user,
  });

  const { data: bookings } = useQuery({
    queryKey: ["myBookings"],
    queryFn: fetchMyBookings,
  });

  const now = Date.now();
  const upcoming = (bookings ?? [])
    .filter((b) => b.status.toLowerCase() !== "cancelled" && new Date(b.endsAt).getTime() > now)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  const history = (bookings ?? [])
    .filter((b) => b.status.toLowerCase() === "cancelled" || b.status.toLowerCase() === "completed" || new Date(b.endsAt).getTime() <= now)
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());

  const displayName =
    profile?.gamerTag ?? profile?.displayName ?? user?.email?.split("@")[0] ?? "GAMER";
  const email = profile?.email ?? user?.email;

  const totalHoursPlayed = history.reduce((sum, b) => {
    const ms = new Date(b.endsAt).getTime() - new Date(b.startsAt).getTime();
    return sum + ms / 3_600_000;
  }, 0);

  const handleSignOut = async () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      await signOut();
      router.replace("/onboarding");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "This will permanently delete your account and all associated data. This action cannot be undone.",
      )
    ) {
      try {
        await apiClient("/v1/users/me", { method: "DELETE" });
        await signOut();
        router.replace("/onboarding");
      } catch {
        window.alert("Failed to delete account. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4">
        <span
          className="font-head font-bold text-[15px]"
          style={{ color: GB.fg, letterSpacing: "1.8px" }}
        >
          PROFILE
        </span>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 px-3 py-1.5 border transition-opacity hover:opacity-80"
          style={{ backgroundColor: GB.surface, borderColor: GB.border, borderRadius: 6 }}
        >
          <Icon name="arrowRight" size={14} color={GB.danger} />
          <span className="font-head font-bold text-[10px]" style={{ color: GB.danger, letterSpacing: "1px" }}>
            SIGN OUT
          </span>
        </button>
      </div>

      <div className="overflow-y-auto pb-8">
        {/* Avatar + Identity */}
        <div className="flex items-center gap-4 px-4 pb-6">
          <div
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center border-2 shrink-0"
            style={{
              backgroundColor: GB.raised,
              borderColor: GB.accent,
              boxShadow: `0 0 20px rgba(204,255,0,0.12)`,
            }}
          >
            <span className="font-disp text-[26px]" style={{ color: GB.bright }}>
              {getInitials(displayName)}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <p
              className="font-mono text-[10px]"
              style={{ color: GB.cyan, letterSpacing: "1.6px" }}
            >
              {"// PLAYER"}
            </p>
            <p
              className="font-disp text-[26px] truncate mt-0.5"
              style={{ color: GB.fg, letterSpacing: "1.04px", lineHeight: "28px" }}
            >
              @{displayName.toUpperCase()}
            </p>
            {email && (
              <p className="font-mono text-[10px] mt-1 truncate" style={{ color: GB.fg3 }}>
                {email}
              </p>
            )}
            <div className="mt-1.5 flex gap-1.5">
              <MonoTag color={GB.success}>VERIFIED</MonoTag>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          className="mx-4 mb-6 flex border overflow-hidden"
          style={{ borderColor: GB.border, borderRadius: 8 }}
        >
          {[
            { value: String(profile?.totalBookings ?? bookings?.length ?? 0), label: "SESSIONS", color: GB.fg },
            { value: `${Math.round(totalHoursPlayed)}h`, label: "PLAYED", color: GB.accent },
            { value: String(profile?.totalReviews ?? 0), label: "REVIEWS", color: GB.cyan },
          ].map(({ value, label, color }, i) => (
            <div
              key={label}
              className="flex-1 py-4 px-1.5 flex flex-col items-center"
              style={{
                backgroundColor: GB.surface,
                borderLeft: i > 0 ? `1px solid ${GB.border}` : undefined,
              }}
            >
              <span
                className="font-disp text-[26px]"
                style={{ color, letterSpacing: "1.04px", lineHeight: "28px" }}
              >
                {value}
              </span>
              <span
                className="font-mono text-[8px] mt-1.5"
                style={{ color: GB.fg3, letterSpacing: "1.12px" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div
          className="flex mx-4 mb-4 border-b"
          style={{ borderColor: GB.border }}
        >
          {(["UPCOMING", "HISTORY"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2.5 text-center border-b-2 transition-colors"
              style={{
                borderBottomColor: tab === t ? GB.accent : "transparent",
                color: tab === t ? GB.accent : GB.fg3,
              }}
            >
              <span className="font-head font-bold text-[10px]" style={{ letterSpacing: "1.4px" }}>
                {t}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="px-4 space-y-4">
          {tab === "UPCOMING" &&
            (upcoming.length === 0 ? (
              <div className="py-8 text-center">
                <span className="font-mono text-[11px]" style={{ color: GB.fg3, letterSpacing: "0.88px" }}>
                  No upcoming sessions.
                </span>
              </div>
            ) : (
              upcoming.map((b) => <BookingMini key={b.id} booking={b} />)
            ))}
          {tab === "HISTORY" &&
            (history.length === 0 ? (
              <div className="py-8 text-center">
                <span className="font-mono text-[11px]" style={{ color: GB.fg3, letterSpacing: "0.88px" }}>
                  No past sessions yet.
                </span>
              </div>
            ) : (
              history.map((b) => <BookingMini key={b.id} booking={b} past />)
            ))}
        </div>

        {/* Delete Account */}
        <div className="px-4 mt-8">
          <button
            onClick={handleDeleteAccount}
            className="w-full py-3 text-center transition-opacity hover:opacity-70"
          >
            <span className="font-mono text-[11px]" style={{ color: GB.danger, letterSpacing: "1.2px" }}>
              DELETE ACCOUNT
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingMini({ booking, past }: { booking: BookingResponse; past?: boolean }) {
  const dayLabel = formatDateLabel(booking.startsAt).split(" ")[0];
  const dateNum = new Date(booking.startsAt).getDate().toString();
  const timeLabel = formatTime(booking.startsAt);
  const countdown = !past ? getCountdown(booking.startsAt) : null;

  return (
    <Link href={`/booking/ticket/${booking.id}`} className="block">
      <div
        className="border overflow-hidden transition-colors"
        style={{
          backgroundColor: GB.surface,
          borderColor: countdown ? GB.accent : GB.border,
          borderRadius: 8,
          boxShadow: countdown ? `0 0 16px rgba(204,255,0,0.08)` : undefined,
        }}
      >
        <div className="flex gap-3 p-3.5">
          <div
            className="w-12 py-2 flex flex-col items-center border shrink-0"
            style={{ backgroundColor: GB.raised, borderColor: GB.border, borderRadius: 6 }}
          >
            <span className="font-mono text-[9px]" style={{ color: GB.fg3, letterSpacing: "1.08px" }}>
              {dayLabel}
            </span>
            <span className="font-disp text-[22px] mt-0.5" style={{ color: past ? GB.fg3 : GB.fg, lineHeight: "24px" }}>
              {dateNum}
            </span>
            <span className="font-mono text-[8px] mt-0.5" style={{ color: GB.cyan, letterSpacing: "1.12px" }}>
              {timeLabel}
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-1.5">
              {countdown ? (
                <MonoTag color={GB.accent}>{countdown}</MonoTag>
              ) : (
                <MonoTag color={GB.fg3}>COMPLETED</MonoTag>
              )}
            </div>
            <p
              className="font-head font-bold text-[13px] truncate mt-1"
              style={{ color: past ? GB.fg2 : GB.fg, letterSpacing: "0.26px" }}
            >
              {booking.venueName}
            </p>
            <span className="font-mono text-[10px] mt-0.5" style={{ color: GB.fg3 }}>
              {booking.stationLabel} · {computeDuration(booking.startsAt, booking.endsAt)}
            </span>
          </div>
          {!past && (
            <div className="flex items-center">
              <Icon name="chevR" size={16} color={GB.fg3} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
