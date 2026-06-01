"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GB } from "@/theme/tokens";
import { Icon, type IconName } from "@/components/ui/icon";

const NAV_ITEMS: { href: string; label: string; icon: IconName }[] = [
  { href: "/home", label: "HOME", icon: "gamepad" },
  { href: "/map", label: "MAP", icon: "map" },
  { href: "/bookings", label: "TICKETS", icon: "qr" },
  { href: "/profile", label: "PROFILE", icon: "user" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-[240px] border-r flex flex-col z-40 hidden lg:flex"
      style={{ backgroundColor: GB.surface, borderColor: GB.border }}
    >
      {/* Brand */}
      <div className="px-6 pt-7 pb-6">
        <Link href="/home">
          <span
            className="font-disp text-[28px]"
            style={{ color: GB.fg, letterSpacing: "2.24px" }}
          >
            GAMEBOOK
          </span>
        </Link>
        <p
          className="font-mono text-[9px] mt-1"
          style={{ color: GB.fg3, letterSpacing: "1.44px" }}
        >
          {'// GG, PLAYER'}
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded transition-colors"
              style={{
                backgroundColor: active ? "rgba(123,53,255,0.1)" : "transparent",
                borderLeft: `2px solid ${active ? GB.accent : "transparent"}`,
              }}
            >
              <Icon name={icon} size={18} color={active ? GB.accent : GB.fg3} />
              <span
                className="font-mono text-[11px] font-medium"
                style={{
                  color: active ? GB.fg : GB.fg3,
                  letterSpacing: "1.76px",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-6 py-4 border-t" style={{ borderColor: GB.border }}>
        <p className="font-mono text-[8px]" style={{ color: GB.fg3, letterSpacing: "1px" }}>
          v0.1 · TBILISI
        </p>
      </div>
    </aside>
  );
}