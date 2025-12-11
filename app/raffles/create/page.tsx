"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePrivateRaffle } from "@/hooks/usePrivateRaffle"
import { parseEther } from "viem"
import { Loader2, Rocket, Info, ArrowLeft } from "lucide-react"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useWaitForTransactionReceipt } from "wagmi"

export default function CreateRafflePage() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const { toast } = useToast()
  
  // Estados para crear raffle
  const [ticketPrice, setTicketPrice] = useState("0.001")
  const [levels, setLevels] = useState("4")
  const [duration, setDuration] = useState("3600")
  const [prizeAmount, setPrizeAmount] = useState("0.01")

  const { createRaffle, isPending, isSuccess, hash } = usePrivateRaffle()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  const handleCreateRaffle = async () => {
    try {
      await createRaffle(ticketPrice, parseInt(levels), parseInt(duration), prizeAmount)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error creating raffle",
        description: error instanceof Error ? error.message : "Transaction rejected",
        variant: "destructive",
      })
    }
  }

  // Redirigir solo cuando la transacción se confirme
  useEffect(() => {
    if (isConfirmed && hash) {
      toast({
        title: "🎉 Raffle Created!",
        description: "Redirecting to your raffle...",
      })
      
      // Obtener el raffleId del evento (por ahora usaremos el hash como identificador temporal)
      // En producción, deberías obtener el raffleId del evento emitido
      const raffleId = "latest" // Cambiaremos esto para obtener el ID real del evento
      
      const timer = setTimeout(() => {
        router.push(`/raffles/live/${raffleId}`)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [isConfirmed, hash, toast, router])

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        {/* Same background as Enter Raffle */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-gradient-to-br from-purple-900/60 via-cyan-700/40 to-transparent rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute -bottom-48 -right-48 w-[700px] h-[700px] bg-gradient-to-tl from-orange-500/60 via-yellow-400/50 to-transparent rounded-full blur-[120px] animate-pulse-glow" />
        </div>

        <Card className="glass-card p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4 neon-gradient-text">Connect Wallet</h1>
          <p className="text-muted-foreground mb-6">
            Please connect your wallet to create a raffle
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-20 md:px-8">
      {/* Same artistic background */}
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

      <div className="max-w-3xl mx-auto space-y-8">        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="gap-2 hover:gap-3 transition-all">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold neon-gradient-text">
            Create a Raffle
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Launch your own private raffle with zero-knowledge proofs
          </p>
        </div>

        {/* Form */}
        <Card className="glass-card p-8">
          <div className="flex items-center gap-2 mb-6">
            <Rocket className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-bold">Raffle Configuration</h2>
          </div>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="ticket-price" className="text-base">Ticket Price (ETH)</Label>
                <Input
                  id="ticket-price"
                  type="number"
                  step="0.001"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(e.target.value)}
                  placeholder="0.001"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How much participants pay per ticket
                </p>
              </div>

              <div>
                <Label htmlFor="prize" className="text-base">Initial Prize (ETH)</Label>
                <Input
                  id="prize"
                  type="number"
                  step="0.001"
                  value={prizeAmount}
                  onChange={(e) => setPrizeAmount(e.target.value)}
                  placeholder="0.01"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Starting prize pool (grows with ticket sales)
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="levels" className="text-base">Max Participants</Label>
                <Input
                  id="levels"
                  type="number"
                  value={levels}
                  onChange={(e) => setLevels(e.target.value)}
                  placeholder="4"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Level {levels} = {Math.pow(2, parseInt(levels) || 0)} max participants
                </p>
              </div>

              <div>
                <Label htmlFor="duration" className="text-base">Duration</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="3600"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.floor(parseInt(duration || "0") / 60)} minutes ({Math.floor(parseInt(duration || "0") / 3600)} hours)
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex gap-3">
              <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Privacy Features:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Participants buy tickets anonymously with commitments</li>
                  <li>• Winner selection is pseudo-random on-chain</li>
                  <li>• Only the winner can verify and claim privately</li>
                </ul>
              </div>
            </div>

            <Button
              onClick={handleCreateRaffle}
              disabled={isPending || isConfirming}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg h-14"
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {isPending ? "Confirm in wallet..." : "Confirming transaction..."}
                </>
              ) : (
                "Create Raffle"
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
