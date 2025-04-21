'use client';

import "./globals.css";
import { LigaProvider } from "@/context/ligaContext";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LigaProvider> {/* ✅ Aquí envolvemos con el contexto */}
          {children}
        </LigaProvider>
      </body>
    </html>
  );
}
