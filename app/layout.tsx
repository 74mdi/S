import type { Metadata, Viewport } from "next";
import { EB_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"]
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-garamond",
  weight: ["400", "600"],
  style: ["normal", "italic"]
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
