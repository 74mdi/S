import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "7amdi",
  description: "7amdi personal site"
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
      <body className={`${jetbrainsMono.variable} ${ebGaramond.variable}`}>
        {children}
      </body>
    </html>
  );
}
