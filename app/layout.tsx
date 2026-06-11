import type { Metadata } from "next";
import { Space_Grotesk, Caveat, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const body = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
});

const hand = Caveat({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-hand",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Vasu Garg — Senior Full Stack Engineer",
  description:
    "Portfolio of Vasu Garg, a Senior Full Stack Engineer with 4+ years building production web applications end-to-end across fintech, compliance, and security.",

  metadataBase: new URL("https://vasu-garg.vercel.app"),

  icons: {
    icon: "/favicon.svg",
  },

  openGraph: {
    title: "Vasu Garg — Senior Full Stack Engineer",
    description:
      "Portfolio of Vasu Garg, a Senior Full Stack Engineer with 4+ years building production web applications end-to-end across fintech, compliance, and security.",
    url: "https://vasu-garg.vercel.app",
    siteName: "Vasu Garg",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vasu Garg Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Vasu Garg — Senior Full Stack Engineer",
    description:
      "Portfolio of Vasu Garg, a Senior Full Stack Engineer with 4+ years building production web applications end-to-end across fintech, compliance, and security.",
    images: ["/og-image.png"],
  },

  alternates: {
    canonical: "https://vasu-garg.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${body.variable} ${hand.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  );
}