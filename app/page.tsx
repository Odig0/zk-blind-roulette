"use client"

import { useRef } from "react"
import dynamic from "next/dynamic"
import { Starfield } from "@/components/starfield"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { DashboardSection } from "@/components/dashboard-section"
import { useWeb3Store, selectShowDashboard, selectSetShowDashboard } from "@/store/web3-store"

// Dynamically import Web3Provider to prevent indexedDB SSR errors
const Web3Provider = dynamic(
  () => import("@/blockchain/providers").then((mod) => ({ default: mod.Web3Provider })),
  { ssr: false }
)

function AppContent() {
  const showDashboard = useWeb3Store(selectShowDashboard)
  const setShowDashboard = useWeb3Store(selectSetShowDashboard)
  const dashboardRef = useRef<HTMLElement>(null)

  const handleEnterDashboard = () => {
    setShowDashboard(true)
    // Smooth scroll to dashboard section
    setTimeout(() => {
      dashboardRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Starfield />
      <Navigation />
      <HeroSection onEnterDashboard={handleEnterDashboard} />
      <section ref={dashboardRef}>
        <DashboardSection />
      </section>
    </main>
  )
}

export default function Home() {
  return (
    <Web3Provider>
      <AppContent />
    </Web3Provider>
  )
}
