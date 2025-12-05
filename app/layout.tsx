import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Bebas_Neue, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { ErrorHandler } from "./error-handler"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: "Core Web3 Dashboard | Wonderland Style",
  description:
    "A futuristic Web3 dashboard demonstrating blockchain integration with Wagmi, Viem, and RainbowKit on Sepolia testnet.",
  icons: {
    icon: "/logoEnaid.png",
    apple: "/logoEnaid.png",
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
