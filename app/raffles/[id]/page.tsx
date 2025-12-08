"use client"

import { use } from "react"
import { RaffleDetail } from "@/components/raffles"
import type { RaffleStatus, RaffleType } from "@/components/raffles"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock data - replace with actual data fetching
const MOCK_RAFFLE_DATA = {
  "1": {
    id: "1",
    title: "Exclusive NFT Collection Drop",
    type: "free" as RaffleType,
    prize: "1 Rare NFT from Genesis Collection",
    description: "Win one of the rarest NFTs from our Genesis Collection. This raffle is completely free to enter and winners will be selected using verifiable random functions with zero-knowledge proofs to ensure fairness and privacy.",
    endsIn: "2h 15m",
    status: "open" as RaffleStatus,
    participantCount: 234,
    hasParticipated: false,
  },
  "2": {
    id: "2",
    title: "50 USDC Prize Pool",
    type: "paid" as RaffleType,
    fee: "0.01 ETH",
    prize: "50 USDC",
    description: "Enter for a chance to win 50 USDC. A small entry fee of 0.01 ETH helps maintain the prize pool and platform operations.",
    endsIn: "5h 30m",
    status: "open" as RaffleStatus,
    participantCount: 89,
    hasParticipated: false,
  },
  "3": {
    id: "3",
    title: "Premium Whitelist Spot",
    type: "free" as RaffleType,
    prize: "Whitelist Access to Upcoming Project",
    description: "Get guaranteed access to the whitelist of our upcoming premium project. This is a free raffle with high-value benefits for early supporters.",
    endsIn: "Drawing in progress...",
    status: "drawing" as RaffleStatus,
    participantCount: 456,
    hasParticipated: true,
  },
  "4": {
    id: "4",
    title: "100 USDC Giveaway",
    type: "paid" as RaffleType,
    fee: "0.005 ETH",
    prize: "100 USDC",
    description: "Big prize pool of 100 USDC distributed to winners. Entry fee is just 0.005 ETH with multiple winners possible.",
    endsIn: "Finished",
    status: "finished" as RaffleStatus,
    participantCount: 312,
    hasParticipated: true,
    isWinner: false,
  },
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function RaffleDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const raffle = MOCK_RAFFLE_DATA[id as keyof typeof MOCK_RAFFLE_DATA]

  if (!raffle) {
    return (
      <div className="min-h-screen px-4 py-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Raffle not found</h1>
          <Button asChild>
            <Link href="/raffles">Back to Raffles</Link>
          </Button>
        </div>
      </div>
    )
  }

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

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" asChild className="gap-2">
          <Link href="/raffles">
            <ArrowLeft className="h-4 w-4" />
            Back to Raffles
          </Link>
        </Button>

        {/* Raffle Detail Component */}
        <RaffleDetail {...raffle} />
      </div>
    </div>
  )
}
