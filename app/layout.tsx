import type { Metadata } from "next";
import { Space_Grotesk, Caveat, JetBrains_Mono } from "next/font/google";
import data from "@/public/portfolio.json";
import "./globals.css";

const body = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-body" });
const hand = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-hand" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: data.meta.title,
  icons: { icon: "/favicon.svg" },
  description: data.meta.description,
  metadataBase: new URL(data.meta.url),
  openGraph: {
    title: data.meta.title,
    description: data.meta.description,
    url: data.meta.url,
    siteName: data.profile.name,
    images: [{ url: data.meta.image, width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: data.meta.title,
    description: data.meta.description,
    images: [data.meta.image],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${body.variable} ${hand.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
