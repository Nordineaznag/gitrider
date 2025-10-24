"use client";

import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Service Worker Registration
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered:", registration);
          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
        })
        .catch((error) => console.log("SW registration failed:", error));
    }

    // Prevent zoom on double tap (iOS)
    let lastTouchEnd = 0;
    document.addEventListener(
      "touchend",
      (event) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      },
      false,
    );

    // Performance monitoring
    if (typeof window !== "undefined" && "performance" in window) {
      window.addEventListener("load", () => {
        const perfData = performance.getEntriesByType(
          "navigation",
        )[0] as PerformanceNavigationTiming;
        if (perfData) {
          console.log(
            "Page Load Time:",
            perfData.loadEventEnd - perfData.fetchStart,
            "ms",
          );
          console.log(
            "DOM Content Loaded:",
            perfData.domContentLoadedEventEnd - perfData.fetchStart,
            "ms",
          );
        }
      });
    }

    // Network Information API for adaptive loading
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        console.log("Connection Type:", connection.effectiveType);
        console.log("Downlink Speed:", connection.downlink, "Mbps");

        // Adjust app behavior based on connection
        if (
          connection.effectiveType === "2g" ||
          connection.effectiveType === "slow-2g"
        ) {
          document.documentElement.classList.add("low-bandwidth");
        }
      }
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Essential Meta Tags */}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* Viewport Configuration - Critical for Mobile */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover"
        />

        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#F2F2F7" />
        <meta
          name="theme-color"
          content="#F2F2F7"
          media="(prefers-color-scheme: dark)"
        />
        <meta
          name="theme-color"
          content="#F2F2F7"
          media="(prefers-color-scheme: light)"
        />

        {/* App Title & Description */}
        <title>Ride App - Order a Ride</title>
        <meta name="application-name" content="Ride App" />
        <meta
          name="description"
          content="Your reliable ride-sharing companion with real-time tracking. Fast, secure, and available 24/7."
        />
        <meta
          name="keywords"
          content="ride sharing, taxi, cab, transportation, ride app, uber alternative"
        />

        {/* Apple iOS Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Ride App" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icon-192.png" />

        {/* Apple Splash Screens */}
        <link rel="apple-touch-startup-image" href="/icon-512.png" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#1a1d1f" />
        <meta name="msapplication-TileImage" content="/icon-192.png" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Icons */}
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icon-192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/icon-512.png"
        />
        <link rel="shortcut icon" href="/icon-192.png" />

        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Ride App - Order a Ride" />
        <meta
          property="og:description"
          content="Your reliable ride-sharing companion with real-time tracking"
        />
        <meta property="og:image" content="/icon-512.png" />
        <meta property="og:site_name" content="Ride App" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ride App - Order a Ride" />
        <meta
          name="twitter:description"
          content="Your reliable ride-sharing companion with real-time tracking"
        />
        <meta name="twitter:image" content="/icon-512.png" />

        {/* Performance & SEO */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="author" content="Ride App" />

        {/* DNS Prefetch & Preconnect for Performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Resource Hints */}
        <link rel="preload" href="/icon-192.png" as="image" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://rideapp.com" />

        {/* Color Scheme */}
        <meta name="color-scheme" content="dark light" />

        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta
          httpEquiv="Referrer-Policy"
          content="strict-origin-when-cross-origin"
        />

        {/* Samsung Internet */}
        <meta name="samsung-internet-app-capable" content="yes" />
        <meta
          name="samsung-internet-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body className="overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="ride-app-theme"
        >
          <AuthProvider>
            <div className="min-h-screen w-full overflow-x-hidden">
              {children}
            </div>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "hsl(var(--card))",
                  color: "hsl(var(--card-foreground))",
                  border: "1px solid hsl(var(--border))",
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>

        {/* Inline Critical Script for Performance */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent FOUC (Flash of Unstyled Content)
              (function() {
                try {
                  var theme = localStorage.getItem('ride-app-theme') || 'dark';
                  document.documentElement.classList.add(theme);
                } catch (e) {}
              })();

              // Performance optimization: Preload critical resources
              if ('requestIdleCallback' in window) {
                requestIdleCallback(function() {
                  // Defer non-critical operations
                  console.log('Idle callback executed');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
