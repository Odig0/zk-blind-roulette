"use client"

import { WalletCard } from "./wallet-card"

export function DashboardSection() {
  return (
    <section id="dashboard" className="relative min-h-screen px-4 py-20 md:px-8 overflow-hidden">
      {/* Wonderland-inspired gradient background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-pink-500/40 to-purple-600/30 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute top-1/3 right-1/4 w-[700px] h-[700px] bg-gradient-to-br from-orange-500/35 to-yellow-500/25 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/2 w-[900px] h-[900px] bg-gradient-to-br from-purple-600/30 to-blue-500/25 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        
        {/* Gradient mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background/70" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex items-center justify-center min-h-screen">
        {/* Wallet Connection */}
        <div className="w-full max-w-md">
          <WalletCard />
        </div>
      </div>
    </section>
  )
}
