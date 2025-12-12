"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePrivateRaffle } from "@/hooks/usePrivateRaffle"
import { parseEther } from "viem"
import { Loader2, Rocket, Info, ArrowLeft, Copy, Check } from "lucide-react"
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
  const [raffleCode, setRaffleCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

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
      // Registrar la raffle en Firebase
      const registerRaffle = async () => {
        try {
          // console.log('🔥 Sending:', {
          //   ticketPrice: parseFloat(ticketPrice),
          //   initialPrize: parseFloat(prizeAmount),
          //   maxParticipants: parseInt(levels),
          //   duration: parseInt(duration),
          // })

          const response = await fetch('https://us-central1-raffero-58001.cloudfunctions.net/api/raffles/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ticketPrice: parseFloat(ticketPrice),
              initialPrize: parseFloat(prizeAmount),
              maxParticipants: parseInt(levels),
              duration: parseInt(duration),
            }),
          })

          // console.log('📡 Response status:', response.status)
          const data = await response.json()
          // console.log('📦 Response data:', data)

          if (data.success && data.raffleCode) {
            setRaffleCode(data.raffleCode)
            toast({
              title: "🎉 Raffle Created Successfully!",
              description: "Share your raffle code with friends to let them join!",
            })
          } else {
            throw new Error(data.message || 'Failed to register raffle')
          }
        } catch (error) {
          // console.error('❌ Error registering raffle:', error)
          toast({
            title: "⚠️ Raffle created on-chain",
            description: "But failed to register in database.",
            variant: "destructive",
          })
          
          setTimeout(() => {
            router.push(`/raffles/live/latest`)
          }, 2000)
        }
      }

      registerRaffle()
    }
  }, [isConfirmed, hash, ticketPrice, prizeAmount, levels, duration, toast, router])

  const copyToClipboard = () => {
    if (raffleCode) {
      navigator.clipboard.writeText(raffleCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const goToRaffle = () => {
    if (raffleCode) {
      router.push(`/raffles/live/${raffleCode}`)
    }
  }

  // Show success screen with raffle code
  if (raffleCode) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        {/* Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-gradient-to-br from-purple-900/60 via-cyan-700/40 to-transparent rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute -bottom-48 -right-48 w-[700px] h-[700px] bg-gradient-to-tl from-orange-500/60 via-yellow-400/50 to-transparent rounded-full blur-[120px] animate-pulse-glow" />
        </div>

        <Card className="glass-card p-8 md:p-12 max-w-2xl w-full text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl md:text-5xl font-bold neon-gradient-text mb-4">
            Raffle Created Successfully!
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Your raffle is now live! Share this unique code with your friends so they can join and participate.
          </p>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-xl p-6 space-y-3">
            <p className="text-sm font-medium text-purple-300 uppercase tracking-wider">
              Your Raffle Code
            </p>
            <div className="flex items-center justify-center gap-3">
              <code className="text-3xl md:text-4xl font-bold font-mono neon-gradient-text tracking-wider">
                {raffleCode}
              </code>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="icon"
                className="h-12 w-12"
              >
                {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
            {copied && (
              <p className="text-sm text-green-400 animate-in fade-in">
                ✓ Copied to clipboard!
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={goToRaffle}
              size="lg"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg h-14"
            >
              View Live Raffle
            </Button>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              size="lg"
              className="flex-1 text-lg h-14"
            >
              Back to Home
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            💡 Tip: Anyone with this code can join your raffle. Keep it safe or share it widely!
          </p>
        </Card>
      </div>
    )
  }

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
