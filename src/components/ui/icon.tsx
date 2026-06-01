"use client";

import React from "react";

export type IconName =
  | "home" | "map" | "calendar" | "user" | "search" | "bell"
  | "settings" | "arrowLeft" | "arrowRight" | "star" | "starOutline"
  | "mapPin" | "clock" | "users" | "plus" | "check" | "chevR"
  | "qr" | "zap" | "heart" | "share" | "filter" | "grid"
  | "play" | "wifi" | "monitor" | "headset" | "gamepad" | "car"
  | "sliders" | "download" | "chain" | "coin" | "chevDown" | "x"
  | "crosshair" | "minus";

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
};

export const Icon = React.memo(function Icon({
  name,
  size = 18,
  color = "currentColor",
  strokeWidth = 1.6,
  className,
}: Props) {
  const p = {
    fill: "none" as const,
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const icons: Record<string, React.ReactNode> = {
    home: (
      <g {...p}>
        <path d="M3 11.5L12 4l9 7.5" />
        <path d="M5 10v10h14V10" />
      </g>
    ),
    map: (
      <g {...p}>
        <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z" />
        <path d="M9 4v16M15 6v16" />
      </g>
    ),
    calendar: (
      <g {...p}>
        <rect x={3} y={5} width={18} height={16} rx={2} />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </g>
    ),
    user: (
      <g {...p}>
        <circle cx={12} cy={8} r={4} />
        <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
      </g>
    ),
    search: (
      <g {...p}>
        <circle cx={11} cy={11} r={7} />
        <path d="M20 20l-4-4" />
      </g>
    ),
    bell: (
      <g {...p}>
        <path d="M6 10a6 6 0 1 1 12 0c0 4 2 6 2 6H4s2-2 2-6z" />
        <path d="M10 20a2 2 0 0 0 4 0" />
      </g>
    ),
    settings: (
      <g {...p}>
        <circle cx={12} cy={12} r={3} />
        <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2.1-1.2L14 3h-4l-.5 2.7a7 7 0 0 0-2.1 1.2l-2.3-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2.1 1.2l.5 2.7h4l.5-2.7a7 7 0 0 0 2.1-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z" />
      </g>
    ),
    arrowLeft: <path d="M15 18l-6-6 6-6" {...p} />,
    arrowRight: <path d="M9 18l6-6-6-6" {...p} />,
    star: (
      <path
        d="M12 3l2.7 5.6 6.3.9-4.5 4.4 1 6.1L12 17l-5.5 3 1-6.1L3 9.5l6.3-.9z"
        fill={color}
        stroke="none"
      />
    ),
    starOutline: (
      <path
        d="M12 3l2.7 5.6 6.3.9-4.5 4.4 1 6.1L12 17l-5.5 3 1-6.1L3 9.5l6.3-.9z"
        {...p}
      />
    ),
    mapPin: (
      <g {...p}>
        <path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13z" />
        <circle cx={12} cy={9} r={3} />
      </g>
    ),
    clock: (
      <g {...p}>
        <circle cx={12} cy={12} r={9} />
        <path d="M12 7v5l3 2" />
      </g>
    ),
    users: (
      <g {...p}>
        <circle cx={9} cy={8} r={3.5} />
        <path d="M2 21c0-3 3-5 7-5s7 2 7 5" />
        <circle cx={17} cy={9} r={3} />
        <path d="M17 14c3 0 5 2 5 5" />
      </g>
    ),
    plus: <path d="M12 5v14M5 12h14" {...p} />,
    check: <path d="M5 13l4 4L19 7" {...p} />,
    chevR: <path d="M9 18l6-6-6-6" {...p} />,
    qr: (
      <g {...p}>
        <rect x={3} y={3} width={6} height={6} />
        <rect x={15} y={3} width={6} height={6} />
        <rect x={3} y={15} width={6} height={6} />
        <path d="M12 3v6M12 12h6M15 15v3M21 12v9h-3M12 15v6" />
      </g>
    ),
    zap: <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" {...p} />,
    heart: (
      <path
        d="M12 21s-7-4.5-9.5-9C1 9 3 5 7 5c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6 4 4.5 7C19 16.5 12 21 12 21z"
        {...p}
      />
    ),
    share: (
      <g {...p}>
        <circle cx={18} cy={5} r={3} />
        <circle cx={6} cy={12} r={3} />
        <circle cx={18} cy={19} r={3} />
        <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
      </g>
    ),
    filter: <path d="M3 5h18l-7 9v6l-4-2v-4z" {...p} />,
    grid: (
      <g {...p}>
        <rect x={3} y={3} width={7} height={7} />
        <rect x={14} y={3} width={7} height={7} />
        <rect x={3} y={14} width={7} height={7} />
        <rect x={14} y={14} width={7} height={7} />
      </g>
    ),
    play: <path d="M6 4l14 8-14 8z" fill={color} stroke="none" />,
    wifi: (
      <g {...p}>
        <path d="M2 9a16 16 0 0 1 20 0" />
        <path d="M5 13a11 11 0 0 1 14 0" />
        <path d="M8.5 16.5a6 6 0 0 1 7 0" />
        <circle cx={12} cy={20} r={1} fill={color} />
      </g>
    ),
    monitor: (
      <g {...p}>
        <rect x={3} y={4} width={18} height={12} rx={1} />
        <path d="M8 20h8M12 16v4" />
      </g>
    ),
    headset: (
      <g {...p}>
        <path d="M4 14a8 8 0 0 1 16 0v3" />
        <rect x={2.5} y={13} width={4} height={7} rx={1.5} />
        <rect x={17.5} y={13} width={4} height={7} rx={1.5} />
      </g>
    ),
    gamepad: (
      <g {...p}>
        <path d="M6 8h12a4 4 0 0 1 4 4v4a3 3 0 0 1-5.5 1.5L15 16H9l-1.5 1.5A3 3 0 0 1 2 16v-4a4 4 0 0 1 4-4z" />
        <path d="M7 12v2M6 13h2M16 13h.01M18 13h.01M17 12h.01M17 14h.01" />
      </g>
    ),
    car: (
      <g {...p}>
        <path d="M5 17h14M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13M3 17v-3l2-1h14l2 1v3M3 17v2h3v-2M21 17v2h-3v-2" />
        <circle cx={7.5} cy={17} r={1.5} />
        <circle cx={16.5} cy={17} r={1.5} />
      </g>
    ),
    sliders: (
      <g {...p}>
        <path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h14M18 18h2" />
        <circle cx={16} cy={6} r={2} />
        <circle cx={8} cy={12} r={2} />
        <circle cx={16} cy={18} r={2} />
      </g>
    ),
    download: (
      <g {...p}>
        <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
      </g>
    ),
    chain: (
      <g {...p}>
        <path d="M9 15L15 9" />
        <path d="M10.5 6.5l2-2a4 4 0 0 1 5.7 5.7l-2 2" />
        <path d="M13.5 17.5l-2 2a4 4 0 0 1-5.7-5.7l2-2" />
      </g>
    ),
    coin: (
      <g {...p}>
        <circle cx={12} cy={12} r={9} />
        <path d="M9 9h4a2 2 0 0 1 0 4H9zM9 13h5a2 2 0 0 1 0 4H9zM11 7v2M11 17v2" />
      </g>
    ),
    chevDown: <path d="M6 9l6 6 6-6" {...p} />,
    x: <path d="M6 6l12 12M18 6L6 18" {...p} />,
    crosshair: (
      <g {...p}>
        <circle cx={12} cy={12} r={8} />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      </g>
    ),
    minus: <path d="M5 12h14" {...p} />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      {icons[name] || null}
    </svg>
  );
});
