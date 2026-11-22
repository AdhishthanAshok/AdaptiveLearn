
/**
 * Root layout component for the Next.js application.
 * It sets up global fonts, HTML structure, and metadata for the entire app.
 */
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = "https://adaptive-learn-one.vercel.app";

export const metadata: Metadata = {
  // Core
  title: {
    default: "AdaptiveLearn — Learn Smarter",
    template: "%s | AdaptiveLearn",
  },
  description:
    "AdaptiveLearn is an adaptive short-form learning platform that combines engaging videos with interactive assessments to help you learn smarter and retain more.",
  keywords: [
    "adaptive learning",
    "e-learning",
    "short-form video",
    "interactive quiz",
    "personalized education",
    "online learning",
  ],
  authors: [{ name: "AdaptiveLearn Team", url: APP_URL }],
  creator: "AdaptiveLearn",
  publisher: "AdaptiveLearn",

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
    shortcut: "/favicon.ico",
  },

  // Manifest
  manifest: "/site.webmanifest",

  // Open Graph
  openGraph: {
    type: "website",
    url: APP_URL,
    siteName: "AdaptiveLearn",
    title: "AdaptiveLearn — Learn Smarter",
    description:
      "An adaptive short-form learning platform combining engaging videos with interactive assessments.",
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "AdaptiveLearn — Learn Smarter",
      },
    ],
    locale: "en_US",
  },

  // Robots / Indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Canonical URL
  alternates: {
    canonical: APP_URL,
  },

  // App / PWA hints
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AdaptiveLearn",
  },
  applicationName: "AdaptiveLearn",
  formatDetection: { telephone: false },

  // Verification
  // verification: {
  //   google: "YOUR_GOOGLE_SITE_VERIFICATION_TOKEN",
  //   yandex: "YOUR_YANDEX_TOKEN",
  // },
};

// Viewport configuration (Next.js 16)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,

  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],

  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
