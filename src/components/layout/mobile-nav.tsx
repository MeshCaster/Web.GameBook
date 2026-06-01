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

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t flex lg:hidden"
      style={{
        backgroundColor: GB.surface,
        borderColor: GB.border,
        height: 80,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-1 pt-2"
          >
            <Icon name={icon} size={22} color={active ? GB.cyan : GB.fg3} />
            <span
              className="font-mono text-[10px]"
              style={{
                color: active ? GB.cyan : GB.fg3,
                letterSpacing: "1px",
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}