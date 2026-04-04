import type { Metadata } from "next";
import { cookies } from "next/headers";
import data from "@/data/portfolio.json";
import "./globals.css";
import "@/styles/playful.css";
import "@/styles/dark.css";
import "@/styles/minimal.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ACTIVE_THEME, THEME_COOKIE, type Theme } from "@/config";

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const initialTheme = (cookieStore.get(THEME_COOKIE)?.value ?? ACTIVE_THEME) as Theme;

  return (
    <html lang="en">
      <body>
        <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
