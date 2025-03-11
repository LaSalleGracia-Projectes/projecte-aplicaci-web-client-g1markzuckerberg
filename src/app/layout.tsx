import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FantasyDraft",
  description: "Fantasy Sports Draft Platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <header className="bg-[#787878] py-4">
          <h1 className="text-center text-3xl font-normal">FantasyDraft</h1>
        </header>
        <main className="min-h-[calc(100vh-128px)] bg-[#d9d9d9]">{children}</main>
        <Footer />
      </body>
    </html>
  )
}



import './globals.css'