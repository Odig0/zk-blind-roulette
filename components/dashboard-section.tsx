"use client"

import { WalletCard } from "./wallet-card"
import { RouletteGame } from "./roulette"
import { OnboardingFlow } from "./onboarding-flow"
import { ScrollBadges } from "./scroll-badges"
import { useAccount } from "wagmi"

export function DashboardSection() {
  const { isConnected } = useAccount()
  
  return (
    <section id="dashboard" className="relative min-h-[100svh] px-3 py-12 sm:px-4 sm:py-16 md:px-8 md:py-20 overflow-hidden">
      {/* Wonderland-inspired gradient background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-cyan-600/40 to-purple-900/30 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute top-1/3 right-1/4 w-[700px] h-[700px] bg-gradient-to-br from-orange-500/35 to-yellow-500/25 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/2 w-[900px] h-[900px] bg-gradient-to-br from-purple-900/30 to-blue-500/25 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        
        {/* Gradient mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background/70" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-6 sm:space-y-8 md:space-y-12">
        {/* Scroll Benefits Badges */}
        <ScrollBadges />

        {/* Onboarding Flow */}
        <OnboardingFlow 
          isConnected={isConnected} 
          balance={500} 
          onComplete={() => {}} 
        />

        {/* Wallet Connection - Centered at top */}
        <div className="flex justify-center">
          <div className="w-full max-w-md px-2">
            <WalletCard />
          </div>
        </div>

        {/* Roulette Game */}
        <div className="mt-12">
          <RouletteGame />
        </div>
      </div>
    </section>
  )
}
