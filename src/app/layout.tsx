import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter, Noto_Sans_Bengali } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileActionBar } from "@/components/layout/HeaderClient";
import { business } from "@/config/business";
import { siteUrl } from "@/config/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

// Condensed display face for headings: reads as technical / workshop signage.
const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// Bengali glyphs only; not preloaded because Android and Windows ship a Bengali system font as fallback.
const bengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
  weight: ["400", "600"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${business.name} | Motorcycle Spare Parts in Madhupur`,
    template: `%s | ${business.name}`,
  },
  description: business.description,
  applicationName: business.name,
  openGraph: {
    siteName: business.name,
    locale: "en_BD",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e1115",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${barlowCondensed.variable} ${bengali.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <MobileActionBar />
      </body>
    </html>
  );
}
