import type { Metadata } from "next";
import data from "@/data/portfolio.json";
import "./globals.css";

export const metadata: Metadata = {
  title: data.meta.title,
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
      <body>{children}</body>
    </html>
  );
}
