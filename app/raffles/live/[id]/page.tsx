"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePrivateRaffle } from "@/hooks/usePrivateRaffle"
import { useRaffleData, useParticipantCount } from "@/hooks/usePrivateRaffle"
import { BuyTicketModal } from "@/components/raffles/buy-ticket-modal"
import { CheckWinnerCard } from "@/components/raffles/check-winner-card"
import { ArrowLeft, Clock, Users, Ticket, Trophy, ShoppingCart, Copy } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { formatEther } from "viem"
import { useAccount } from "wagmi"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"


export default function LiveRafflePage() {
  const params = useParams()
  const raffleCode = params.id as string
  const { address } = useAccount()
  const { toast } = useToast()
  
  // Por ahora usaremos el ID "0" si es "latest", o buscaremos el ID real del código
  const [currentRaffleId, setCurrentRaffleId] = useState<bigint>(BigInt(0))
  const [raffleData, setRaffleData] = useState<any>(null)
  
  const { drawWinner, isPending } = usePrivateRaffle()
  const { data: raffle } = useRaffleData(currentRaffleId)
  const { data: participantCount } = useParticipantCount(currentRaffleId)

  const [timeRemaining, setTimeRemaining] = useState<string>("")
  const [hasEnded, setHasEnded] = useState(false)
  const [showBuyTicket, setShowBuyTicket] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const wheelRef = useRef<HTMLDivElement>(null)

  // Fetch raffle data from Firebase
  useEffect(() => {
    const fetchRaffleData = async () => {
      try {
        const response = await fetch(`https://us-central1-raffero-58001.cloudfunctions.net/api/raffles/verify/${raffleCode}`)
        const data = await response.json()
        
        if (data.success && data.raffle) {
          setRaffleData(data.raffle)
          // Aquí podrías mapear el raffleCode a un raffleId real del contrato
          // Por ahora usamos 0
          setCurrentRaffleId(BigInt(0))
        }
      } catch (error) {
        console.error('Error fetching raffle:', error)
      }
    }

    if (raffleCode !== 'latest') {
      fetchRaffleData()
    }
  }, [raffleCode])

  const handleJoinRaffle = async () => {
    if (!address) return
    
    try {
      const response = await fetch('https://us-central1-raffero-58001.cloudfunctions.net/api/raffles/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raffleCode: raffleCode,
          userId: address,
          walletAddress: address,
        }),
      })

      const data = await response.json()
      
      if (data.raffleCode) {
        toast({
          title: "✅ Joined raffle!",
          description: "You've been registered in Firebase",
        })
      }
    } catch (error) {
      console.error('Error joining raffle:', error)
    }
  }

  const copyRaffleCode = () => {
    navigator.clipboard.writeText(raffleCode)
    toast({
      title: "📋 Copied!",
      description: "Raffle code copied to clipboard",
    })
  }

  // Fetch tiempo restante desde Firebase API
  useEffect(() => {
    const fetchTimeRemaining = async () => {
      try {
        const response = await fetch(`https://us-central1-raffero-58001.cloudfunctions.net/api/raffles/time/${raffleCode}`)
        const data = await response.json()
        
        if (data.success && data.timeRemaining) {
          const { hours, minutes, seconds, totalSeconds } = data.timeRemaining
          
          if (totalSeconds <= 0) {
            setTimeRemaining("Raffle ended!")
            setHasEnded(true)
          } else {
            setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`)
            setHasEnded(false)
          }
        }
      } catch (error) {
        console.error('Error fetching time:', error)
      }
    }

    // Fetch inicial
    fetchTimeRemaining()
    
    // Actualizar cada segundo
    const interval = setInterval(fetchTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [raffleCode])

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
            
            <div className="flex items-center justify-center py-8">
              {/* Roulette Wheel */}
              <div className="relative w-96 h-96">
                <div
                  ref={wheelRef}
                  className="w-full h-full"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: isSpinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
                  }}
                >
                  <Image
                    src="/wheel.png"
                    alt="Roulette Wheel"
                    width={384}
                    height={384}
                    className="w-full h-full"
                    priority
                  />
                </div>
                
                {/* Pointer */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10">
                  <div className="w-0 h-0 border-l-[24px] border-r-[24px] border-t-[48px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-2xl"></div>
                </div>

                {/* Outer glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/30 via-orange-500/30 to-red-500/30 animate-pulse blur-2xl -z-10"></div>
              </div>
            </div>

            {hasEnded && (
              <div className="mt-6 space-y-4">
                <Button
                  onClick={async () => {
                    // Spin animation
                    setIsSpinning(true)
                    const spins = 5 + Math.random() * 3 // 5-8 full rotations
                    const finalDegree = Math.random() * 360
                    setRotation(360 * spins + finalDegree)
                    
                    // Draw winner after animation starts
                    await drawWinner(currentRaffleId)
                    
                    // Stop spinning after 4 seconds
                    setTimeout(() => {
                      setIsSpinning(false)
                    }, 4000)
                  }}
                  disabled={isPending || isSpinning || raffle.status !== 0}
                  size="lg"
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  {isPending || isSpinning ? "🎰 Spinning..." : "🎲 Draw Winner Now"}
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
                    onClick={() => {
                      handleJoinRaffle()
                      setShowBuyTicket(true)
                    }}
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
                Share this code with others to join your raffle!
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={raffleCode}
                  readOnly
                  className="flex-1 px-4 py-2 rounded-lg bg-black/40 border border-purple-500/30 text-center font-mono text-lg"
                />
                <Button onClick={copyRaffleCode} variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
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
