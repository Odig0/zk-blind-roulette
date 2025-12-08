"use client"

import { useState } from "react"
import { RaffleCard, RaffleFilters } from "@/components/raffles"
import type { RaffleStatus, RaffleType } from "@/components/raffles"

// Mock data - replace with actual data fetching
const MOCK_RAFFLES = [
  {
    id: "1",
    title: "Exclusive NFT Collection Drop",
    type: "free" as RaffleType,
    prize: "1 Rare NFT",
    endsIn: "2h 15m",
    status: "open" as RaffleStatus,
    participantCount: 234,
  },
  {
    id: "2",
    title: "50 USDC Prize Pool",
    type: "paid" as RaffleType,
    fee: "0.01 ETH",
    prize: "50 USDC",
    endsIn: "5h 30m",
    status: "open" as RaffleStatus,
    participantCount: 89,
  },
  {
    id: "3",
    title: "Premium Whitelist Spot",
    type: "free" as RaffleType,
    prize: "WL Access",
    endsIn: "Drawing...",
    status: "drawing" as RaffleStatus,
    participantCount: 456,
  },
  {
    id: "4",
    title: "100 USDC Giveaway",
    type: "paid" as RaffleType,
    fee: "0.005 ETH",
    prize: "100 USDC",
    endsIn: "Finished",
    status: "finished" as RaffleStatus,
    participantCount: 312,
    hasParticipated: true,
  },
]

export default function RafflesPage() {
  const [activeTab, setActiveTab] = useState<"all" | "free" | "paid">("all")
  const [activeStatus, setActiveStatus] = useState<"all" | "open" | "closed" | "finished">("all")

  // Filter raffles based on active filters
  const filteredRaffles = MOCK_RAFFLES.filter((raffle) => {
    const matchesType = activeTab === "all" || raffle.type === activeTab
    const matchesStatus = activeStatus === "all" || raffle.status === activeStatus
    return matchesType && matchesStatus
  })

  return (
    <div className="min-h-screen px-4 py-20 md:px-8">
      {/* Artistic Background Layer 1 - Large ambient glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-gradient-to-br from-purple-900/60 via-cyan-700/40 to-transparent rounded-full blur-[120px] animate-pulse-glow" />
        <div
          className="absolute -bottom-48 -right-48 w-[700px] h-[700px] bg-gradient-to-tl from-orange-500/60 via-yellow-400/50 to-transparent rounded-full blur-[120px] animate-pulse-glow"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/40 via-purple-800/45 to-cyan-600/35 rounded-full blur-[140px] animate-pulse-glow"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Artistic Background Layer 2 - Medium floating orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-[20%] left-[15%] w-64 h-64 bg-gradient-to-br from-cyan-400/50 to-blue-600/40 rounded-full blur-[80px] animate-float"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute top-[60%] right-[20%] w-80 h-80 bg-gradient-to-tl from-teal-700/50 to-purple-900/45 rounded-full blur-[90px] animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-[30%] left-[40%] w-72 h-72 bg-gradient-to-tr from-yellow-400/50 to-orange-500/45 rounded-full blur-[85px] animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[40%] right-[10%] w-56 h-56 bg-gradient-to-bl from-purple-700/50 to-blue-600/40 rounded-full blur-[75px] animate-float"
          style={{ animationDelay: "2.5s" }}
        />
      </div>

      {/* Artistic Background Layer 3 - Accent highlights */}
      <div className="fixed inset-0 -z-10 overflow-hidden mix-blend-screen">
        <div className="absolute top-[25%] right-[30%] w-32 h-32 bg-purple-600/50 rounded-full blur-[60px] animate-pulse-glow" />
        <div
          className="absolute bottom-[35%] left-[25%] w-40 h-40 bg-cyan-400/55 rounded-full blur-[65px] animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[50%] left-[60%] w-36 h-36 bg-orange-400/60 rounded-full blur-[70px] animate-pulse-glow"
          style={{ animationDelay: "1.8s" }}
        />
      </div>

      {/* Grain overlay */}
      <div className="fixed inset-0 -z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-20" />

      {/* Vignette */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_70%,rgba(0,0,0,0.6)_100%)]" />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="neon-gradient-text">Active Raffles</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Enter private raffles and win prizes. All results are anonymous and verified with zero-knowledge proofs.
          </p>
        </div>

        {/* Filters */}
        <RaffleFilters
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
        />

        {/* Raffles Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRaffles.map((raffle) => (
            <RaffleCard key={raffle.id} {...raffle} />
          ))}
        </div>

        {/* Empty State */}
        {filteredRaffles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No raffles found with the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
