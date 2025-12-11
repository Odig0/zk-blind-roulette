"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePrivateRaffle, useRaffleData, useCanDrawWinner, useParticipantCount } from "@/hooks/usePrivateRaffle"
import { BuyTicketModal } from "@/components/raffles/buy-ticket-modal"
import { CheckWinnerCard } from "@/components/raffles/check-winner-card"
import { parseEther, formatEther } from "viem"
import { Loader2, Rocket, Ticket, Trophy } from "lucide-react"
import { useAccount } from "wagmi"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TestContractPage() {
  const { address, isConnected } = useAccount()
  const [raffleId, setRaffleId] = useState<string>("1")
  
  // Estados para crear raffle
  const [ticketPrice, setTicketPrice] = useState("0.001")
  const [levels, setLevels] = useState("4")
  const [duration, setDuration] = useState("3600") // 1 hora
  const [prizeAmount, setPrizeAmount] = useState("0.01")

  const { createRaffle, isPending: isCreating, isSuccess: isCreated } = usePrivateRaffle()
  
  // Datos de la rifa actual
  const { data: raffleData, refetch: refetchRaffle } = useRaffleData(raffleId ? BigInt(raffleId) : undefined)
  const { data: participantCount } = useParticipantCount(raffleId ? BigInt(raffleId) : undefined)

  const handleCreateRaffle = async () => {
    await createRaffle(ticketPrice, parseInt(levels), parseInt(duration), prizeAmount)
    
    // Después de crear, actualizar para ver la nueva raffle
    setTimeout(() => {
      refetchRaffle()
    }, 3000)
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="glass-card p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Connect Wallet</h1>
          <p className="text-muted-foreground mb-6">
            Please connect your wallet to test the PrivateRaffle contract
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-20 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/raffles">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold neon-gradient-text">Test Contract</h1>
            <p className="text-muted-foreground mt-2">
              Interact with PrivateRaffle on Scroll Sepolia
            </p>
          </div>
        </div>

        {/* Contract Info */}
        <Card className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4">📝 Contract Info</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contract Address:</span>
              <a 
                href="https://sepolia.scrollscan.com/address/0x46aa91f8f0f52471fdea6481cf5027ee839ebb69"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline font-mono"
              >
                0x46aa...ebb69
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Your Wallet:</span>
              <span className="font-mono text-sm">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Create Raffle */}
          <Card className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Rocket className="h-6 w-6 text-purple-400" />
              <h2 className="text-xl font-bold">1. Create Raffle</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Ticket Price (ETH)</Label>
                <Input
                  type="number"
                  step="0.001"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(e.target.value)}
                  placeholder="0.001"
                />
              </div>

              <div>
                <Label>Tree Levels (Max Participants = 2^levels)</Label>
                <Input
                  type="number"
                  value={levels}
                  onChange={(e) => setLevels(e.target.value)}
                  placeholder="4"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Level {levels} = {Math.pow(2, parseInt(levels) || 0)} max participants
                </p>
              </div>

              <div>
                <Label>Duration (seconds)</Label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="3600"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.floor(parseInt(duration || "0") / 60)} minutes
                </p>
              </div>

              <div>
                <Label>Initial Prize (ETH)</Label>
                <Input
                  type="number"
                  step="0.001"
                  value={prizeAmount}
                  onChange={(e) => setPrizeAmount(e.target.value)}
                  placeholder="0.01"
                />
              </div>

              <Button
                onClick={handleCreateRaffle}
                disabled={isCreating}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Raffle"
                )}
              </Button>

              {isCreated && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-sm text-emerald-400">
                    ✓ Raffle created! Check the console for raffle ID
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* View Raffle */}
          <Card className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4">2. View Raffle</h2>
            
            <div className="space-y-4">
              <div>
                <Label>Raffle ID</Label>
                <Input
                  type="number"
                  value={raffleId}
                  onChange={(e) => setRaffleId(e.target.value)}
                  placeholder="1"
                />
              </div>

              <Button onClick={() => refetchRaffle()} variant="outline" className="w-full">
                Refresh Data
              </Button>

              {raffleData && (
                <div className="space-y-3 p-4 rounded-lg bg-secondary/30">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Creator:</span>
                    <span className="font-mono text-xs">{raffleData.creator.slice(0, 6)}...{raffleData.creator.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ticket Price:</span>
                    <span className="font-medium">{formatEther(raffleData.ticketPrice)} ETH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Prize Pool:</span>
                    <span className="font-medium text-orange-400">{formatEther(raffleData.prizePool)} ETH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Participants:</span>
                    <span className="font-medium">{participantCount?.toString() || "0"} / {raffleData.maxParticipants.toString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium">
                      {raffleData.status === 0 ? "🟢 Active" : raffleData.status === 1 ? "🟡 Closed" : "✅ Claimed"}
                    </span>
                  </div>
                  {raffleData.status === 1 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Winner Index:</span>
                      <span className="font-medium text-emerald-400">{raffleData.winnerIndex.toString()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Buy Ticket */}
        {raffleData && raffleData.status === 0 && (
          <Card className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Ticket className="h-6 w-6 text-cyan-400" />
              <h2 className="text-xl font-bold">3. Buy Ticket (Private)</h2>
            </div>
            <BuyTicketModal 
              raffleId={BigInt(raffleId)} 
              ticketPrice={raffleData.ticketPrice}
              onSuccess={() => refetchRaffle()}
            />
          </Card>
        )}

        {/* Check Winner / Draw */}
        {raffleData && raffleId && (
          <Card className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-6 w-6 text-amber-400" />
              <h2 className="text-xl font-bold">4. Draw Winner & Check Result</h2>
            </div>
            
            {/* Info sobre el estado */}
            <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-blue-300">
                {raffleData.status === 0 && (
                  <>⏳ Raffle is active. Wait for it to end or create a raffle with duration=60 for quick testing.</>
                )}
                {raffleData.status === 1 && (
                  <>🎲 Winner selected! You can check if you won.</>
                )}
                {raffleData.status === 2 && (
                  <>✅ Prize has been claimed!</>
                )}
              </p>
            </div>

            <CheckWinnerCard raffleId={BigInt(raffleId)} />
          </Card>
        )}
      </div>
    </div>
  )
}
