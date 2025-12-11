"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RouletteWheel } from "@/components/roulette/roulette-wheel"
import { usePrivateRaffle } from "@/hooks/usePrivateRaffle"
import { useRaffleData, useParticipantCount } from "@/hooks/usePrivateRaffle"
import { BuyTicketModal } from "@/components/raffles/buy-ticket-modal"
import { CheckWinnerCard } from "@/components/raffles/check-winner-card"
import { ArrowLeft, Clock, Users, Ticket, Trophy, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { formatEther } from "viem"

export default function LiveRafflePage() {
  const params = useParams()
  const raffleId = params.id as string
  
  // Por ahora usaremos el ID "0" si es "latest"
  const currentRaffleId = raffleId === "latest" ? BigInt(0) : BigInt(raffleId)
  
  const { drawWinner, isPending } = usePrivateRaffle()
  const { data: raffle } = useRaffleData(currentRaffleId)
  const { data: participantCount } = useParticipantCount(currentRaffleId)

  const [timeRemaining, setTimeRemaining] = useState<string>("")
  const [hasEnded, setHasEnded] = useState(false)
  const [showBuyTicket, setShowBuyTicket] = useState(false)

  useEffect(() => {
    if (!raffle || !raffle.endTime) return

    const endTime = Number(raffle.endTime) * 1000 // Convert to milliseconds
    
    const interval = setInterval(() => {
      const now = Date.now()
      const difference = endTime - now

      if (difference <= 0) {
        setTimeRemaining("Raffle ended!")
        setHasEnded(true)
        clearInterval(interval)
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [raffle])

  // Loading state
  if (!raffle) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        {/* Background Effects */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-gradient-to-br from-purple-900/60 via-cyan-700/40 to-transparent rounded-full blur-[120px] animate-pulse-glow" />
          <div
            className="absolute -bottom-48 -right-48 w-[700px] h-[700px] bg-gradient-to-tl from-orange-500/60 via-yellow-400/50 to-transparent rounded-full blur-[120px] animate-pulse-glow"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-xl text-muted-foreground">Loading raffle...</p>
        </div>
      </div>
    )
  }

  const maxParticipants = raffle.levels ? 2 ** Number(raffle.levels) : 0
  const progress = participantCount && maxParticipants > 0 ? (Number(participantCount) / maxParticipants) * 100 : 0

  return (
    <div className="min-h-screen px-4 py-20 md:px-8">
      {/* Artistic Background */}
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

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="gap-2 hover:gap-3 transition-all">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        {/* Header with Countdown */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold neon-gradient-text">
            🎰 Live Raffle
          </h1>
          
          {/* Countdown Timer */}
          <Card className="glass-card p-6 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Clock className="h-6 w-6 text-cyan-400" />
              <h2 className="text-2xl font-bold">Time Until Draw</h2>
            </div>
            <p className={`text-4xl font-bold ${hasEnded ? 'text-red-400' : 'neon-gradient-text'}`}>
              {timeRemaining || "Calculating..."}
            </p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Roulette Wheel */}
          <Card className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="h-8 w-8 text-yellow-400" />
              <h2 className="text-3xl font-bold">Prize Wheel</h2>
            </div>
            
            <div className="flex items-center justify-center">
              <RouletteWheel />
            </div>

            {hasEnded && (
              <div className="mt-6 space-y-4">
                <Button
                  onClick={() => drawWinner(currentRaffleId)}
                  disabled={isPending || raffle.status !== 1} // 1 = Active
                  size="lg"
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  {isPending ? "Drawing Winner..." : "🎲 Draw Winner Now"}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  The raffle has ended. Click above to select the winner!
                </p>
              </div>
            )}
          </Card>

          {/* Right: Raffle Stats */}
          <div className="space-y-6">
            {/* Prize Pool */}
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="h-6 w-6 text-yellow-400" />
                <h3 className="text-2xl font-bold">Prize Pool</h3>
              </div>
              <p className="text-4xl font-bold neon-gradient-text">
                {raffle.prizePool ? formatEther(raffle.prizePool) : "0"} ETH
              </p>
            </Card>

            {/* Participants */}
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-purple-400" />
                <h3 className="text-2xl font-bold">Participants</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-lg">
                  <span className="text-muted-foreground">Current</span>
                  <span className="font-bold">{participantCount?.toString() || "0"}</span>
                </div>
                <div className="flex items-center justify-between text-lg">
                  <span className="text-muted-foreground">Maximum</span>
                  <span className="font-bold">{maxParticipants}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    {progress.toFixed(0)}% Full
                  </p>
                </div>
              </div>
            </Card>

            {/* Ticket Info */}
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Ticket className="h-6 w-6 text-cyan-400" />
                <h3 className="text-2xl font-bold">Ticket Info</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-bold text-xl">{raffle.ticketPrice ? formatEther(raffle.ticketPrice) : "0"} ETH</span>
                </div>
                
                {/* Buy Ticket Button */}
                {!hasEnded && raffle.status === 0 && (
                  <Button
                    onClick={() => setShowBuyTicket(true)}
                    size="lg"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Buy Ticket
                  </Button>
                )}
              </div>
            </Card>

            {/* Check Winner Card */}
            <CheckWinnerCard raffleId={currentRaffleId} />

            {/* Share Section */}
            <Card className="glass-card p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
              <h3 className="text-xl font-bold mb-3">📢 Share Your Raffle</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Invite people to join your raffle! Share this link or generate an invite code.
              </p>
              <Button variant="outline" className="w-full">
                Generate Invite Code
              </Button>
            </Card>
          </div>
        </div>

        {/* Buy Ticket Modal */}
        <BuyTicketModal
          raffleId={currentRaffleId}
          ticketPrice={raffle.ticketPrice || BigInt(0)}
          isOpen={showBuyTicket}
          onClose={() => setShowBuyTicket(false)}
        />
      </div>
    </div>
  )
}
