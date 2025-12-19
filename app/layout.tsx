import "./globals.css";
import { Providers } from "@/store/Providers";
import { ReactNode } from "react";
import { logger } from "@/lib/utils/logger";
import { MobileNav } from "@/components/navigation/MobileNav";
import { OfflineIndicator } from "@/components/common/OfflineIndicator";
import { PWAInstaller } from "@/components/pwa/PWAInstaller";

export const metadata = {
  title: "Portfolio Tracker",
  description: "Trading portfolio tracker and analytics",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#00ff88",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // Log layout render (server-side only, no window access)
  if (typeof window === "undefined") {
    logger.info("RootLayout rendered (server-side)");
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00ff88" />
      </head>
      <body>
        <Providers>
          <OfflineIndicator />
          <PWAInstaller />
          {children}
          <MobileNav />
        </Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((reg) => console.log('SW registered:', reg))
                    .catch((err) => console.log('SW registration failed:', err));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
