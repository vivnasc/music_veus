import type { Metadata, Viewport } from "next";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import MiniPlayer from "@/components/music/MiniPlayer";
import FullPlayer from "@/components/music/FullPlayer";
import PlayTracker from "@/components/music/PlayTracker";
import NoDownload from "@/components/music/NoDownload";
import AuthGate from "@/components/music/AuthGate";
import RegisterSW from "@/components/RegisterSW";
import PushPrompt from "@/components/music/PushPrompt";
import DonationNudge from "@/components/music/DonationNudge";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Véus by Loranne",
    template: "%s — Véus",
  },
  description: "A banda sonora da tua transformação. Música original de Loranne.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://music.seteveus.space"),
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/veus_music-favicon.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/veus_music_favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/veus_music_favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/veus_music_favicon-192.png", sizes: "192x192" },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Véus",
  },
  openGraph: {
    title: "Véus",
    description: "Música original do universo Sete Véus. Banda sonora para a tua transformação.",
    siteName: "Véus",
    locale: "pt_PT",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0D1A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased overflow-x-hidden">
        <MusicPlayerProvider>
          <SubscriptionProvider>
            <div className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6]">
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#C9A96E] focus:text-[#0D0D1A] focus:rounded-lg"
              >
                Saltar para o conteudo
              </a>
              <AuthGate>
                <div id="main-content" className="pb-24" style={{ paddingTop: "env(safe-area-inset-top)" }}>
                  {children}
                </div>
              </AuthGate>
              <MiniPlayer />
              <FullPlayer />
              <PlayTracker />
              <DonationNudge />
              <NoDownload />
              <RegisterSW />
              <PushPrompt />
            </div>
          </SubscriptionProvider>
        </MusicPlayerProvider>
      </body>
    </html>
  );
}
