import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Footer } from "@/components/footer"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Farmer–Vendor Bidding System",
  description: "Modern agricultural marketplace connecting farmers and vendors",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

import { LanguageProvider } from "@/components/language-provider"

// ... (keep metadata)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`font-sans antialiased`}>
        <LanguageProvider>
          {/* Background layer */}
          <div
            className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/vibrant-farming-landscape.jpg')`,
              backgroundAttachment: "fixed",
              opacity: 0.2,
            }}
          />

          {/* Overlay for readability */}
          <div className="fixed inset-0 z-[1] bg-gradient-to-br from-amber-50/85 via-white/90 to-emerald-50/85" />

          {/* Content layer */}
          <div className="relative z-10 flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>

          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}
