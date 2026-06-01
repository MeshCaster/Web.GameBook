import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/layout/providers";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GameBook",
  description: "Book gaming stations near you",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${bebasNeue.variable} ${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
        style={{ backgroundColor: "#080810", color: "#F0EEFF" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
