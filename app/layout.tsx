import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Bebas_Neue, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { ErrorHandler } from "./error-handler"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap',
  preload: true,
})
const bebasNeue = Bebas_Neue({ 
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-bebas",
  display: 'swap',
  preload: false,
})
const geistMono = Geist_Mono({ 
  subsets: ["latin"], 
  variable: "--font-geist-mono",
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  title: "Raffero | Anonymous Raffle System",
  description:
    "Raffero - Experience truly private raffles with zero-knowledge proofs on Scroll. Spin the wheel anonymously, win prizes without public announcements. Complete privacy guaranteed.",
  icons: {
    icon: "/logoRaffero.png",
    apple: "/logoRaffero.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Raffero",
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a14",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body 
        className={`${inter.variable} ${bebasNeue.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ErrorHandler />
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
