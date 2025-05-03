'use client';

import './globals.css';
import React from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LigaProvider } from '@/context/ligaContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Asegúrate de tener NEXT_PUBLIC_GOOGLE_CLIENT_ID en .env.local */}
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          <LigaProvider>
            {children}
          </LigaProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}