import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/provider";
import SiteFooter from "@/components/layouts/SiteFooter";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import SiteChrome from "@/components/layouts/SiteChrome";
import SiteSplash from "@/components/brand/SiteSplash";

// Science Gothic isn't in Next 15's Google font list, so the variable font is
// self-hosted (latin subset, axes: wght 100–900, wdth 50–200, slnt, CTRS). OFL: app/fonts/OFL.txt
const scienceGothic = localFont({
  src: "./fonts/ScienceGothic-Variable-latin.woff2",
  variable: "--font-science-gothic",
  weight: "100 900",
  style: "normal",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
  declarations: [{ prop: "font-stretch", value: "50% 200%" }],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Orbeetal — Custom Software & Amazing IT Services",
  description:
    "Orbeetal builds custom software and delivers world-class IT services — web & mobile engineering, cloud, AI, cybersecurity and digital growth.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/images/logo-mark.svg", type: "image/svg+xml" },
      { url: "/icons/icon512_rounded.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/icon512_rounded.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Orbeetal",
  },
};

export const viewport = {
  themeColor: "#081426",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <Providers>
        <body
          className={`${scienceGothic.variable} ${jetbrainsMono.variable} antialiased min-h-screen overflow-x-hidden w-full max-w-full`}
        >
          <SiteSplash />
          <ServiceWorkerRegister />
          <SiteChrome>{children}</SiteChrome>
          <SiteFooter />
        </body>
      </Providers>
    </html>
  );
}
