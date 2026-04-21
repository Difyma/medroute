import type { Metadata, Viewport } from "next";
import { Manrope, Sora } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MedRoute - Маршрут лечения и сбор по этапам",
  description:
    "Платформа онко-навигации: первичная оценка документов, roadmap лечения, подбор клиник и проверенных врачей, сбор средств на конкретный этап.",
  icons: {
    icon: "/style/logomedroute-Photoroom.png",
    apple: "/style/logomedroute-Photoroom.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#c9cdf8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${manrope.variable} ${sora.variable}`}>
      <body>
        <div className="site-shell">
          <SiteHeader />
          <div className="site-content">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
