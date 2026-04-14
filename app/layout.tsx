import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://koko911.vercel.app";

const jetbrainsMono = localFont({
  src: [
    {
      path: "./fonts/jetbrains-mono-latin-300-normal.woff2",
      weight: "300",
      style: "normal"
    },
    {
      path: "./fonts/jetbrains-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal"
    },
    {
      path: "./fonts/jetbrains-mono-latin-500-normal.woff2",
      weight: "500",
      style: "normal"
    },
    {
      path: "./fonts/jetbrains-mono-latin-300-italic.woff2",
      weight: "300",
      style: "italic"
    },
    {
      path: "./fonts/jetbrains-mono-latin-400-italic.woff2",
      weight: "400",
      style: "italic"
    },
    {
      path: "./fonts/jetbrains-mono-latin-500-italic.woff2",
      weight: "500",
      style: "italic"
    }
  ],
  display: "swap",
  variable: "--font-jetbrains"
});

const ebGaramond = localFont({
  src: [
    {
      path: "./fonts/eb-garamond-latin-400-normal.woff2",
      weight: "400",
      style: "normal"
    },
    {
      path: "./fonts/eb-garamond-latin-600-normal.woff2",
      weight: "600",
      style: "normal"
    },
    {
      path: "./fonts/eb-garamond-latin-400-italic.woff2",
      weight: "400",
      style: "italic"
    },
    {
      path: "./fonts/eb-garamond-latin-600-italic.woff2",
      weight: "600",
      style: "italic"
    }
  ],
  display: "swap",
  variable: "--font-garamond"
});

const notoSansTifinagh = localFont({
  src: [
    {
      path: "./fonts/noto-sans-tifinagh-tifinagh-400-normal.woff2",
      weight: "400",
      style: "normal"
    }
  ],
  display: "swap",
  variable: "--font-tifinagh"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "7amdi",
    template: "%s | 7amdi"
  },
  description:
    "7amdi personal site. Web experiments, projects, guestbook, and notes.",
  applicationName: "7amdi",
  keywords: [
    "7amdi",
    "koko",
    "web developer",
    "next.js",
    "typescript",
    "morocco",
    "portfolio"
  ],
  authors: [{ name: "7amdi", url: "https://github.com/74mdi" }],
  creator: "7amdi",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "7amdi",
    description:
      "Web experiments, projects, guestbook, and notes.",
    siteName: "7amdi",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "7amdi personal site preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "7amdi",
    description:
      "Web experiments, projects, guestbook, and notes from Morocco.",
    images: ["/opengraph-image"],
    creator: "@74mdi"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  category: "technology"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} ${ebGaramond.variable} ${notoSansTifinagh.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
