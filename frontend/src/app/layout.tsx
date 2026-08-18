import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import { TOURNAMENT_NAME } from "@/lib/constants";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${TOURNAMENT_NAME} — Chess Tournament`,
  description: `Join ${TOURNAMENT_NAME}, a knockout-style chess tournament for players of all levels. Compete, connect, and conquer.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
