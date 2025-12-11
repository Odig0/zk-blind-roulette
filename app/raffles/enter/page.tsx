"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Ticket, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function EnterRafflePage() {
  const [inviteCode, setInviteCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleEnterWithCode = async () => {
    if (!inviteCode.trim()) return

    setIsLoading(true)
    
    // TODO: Llamar a tu API para verificar el código
    // const response = await fetch('/api/raffles/verify-code', {
    //   method: 'POST',
    //   body: JSON.stringify({ code: inviteCode })
    // })
    
    // Por ahora, simular verificación
    setTimeout(() => {
      // Redirigir a la raffle si el código es válido
      // router.push(`/raffles/${raffleId}`)
      setIsLoading(false)
      alert(`Código: ${inviteCode} - API pendiente de implementar`)
    }, 1000)
  }

  return (
    <div className="min-h-screen px-4 py-20 md:px-8">
      {/* Artistic Background - Same as Dashboard */}
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

      {/* Medium floating orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-[20%] left-[15%] w-64 h-64 bg-gradient-to-br from-cyan-400/50 to-blue-600/40 rounded-full blur-[80px] animate-float"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute top-[60%] right-[20%] w-80 h-80 bg-gradient-to-tl from-teal-700/50 to-purple-900/45 rounded-full blur-[90px] animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="gap-2 hover:gap-3 transition-all">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold neon-gradient-text">
            Enter a Raffle
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join an exclusive raffle with an invitation code
          </p>
        </div>

        {/* Main Content */}
        <Card className="glass-card p-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Ticket className="h-8 w-8 text-purple-400" />
              <h2 className="text-2xl font-bold">Enter with Invitation Code</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invite-code" className="text-base">
                Invitation Code
              </Label>
              <Input
                id="invite-code"
                type="text"
                placeholder="Enter your exclusive code..."
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="text-lg h-14"
                onKeyDown={(e) => e.key === "Enter" && handleEnterWithCode()}
              />
              <p className="text-sm text-muted-foreground">
                Received an exclusive invite? Enter the code above to access private raffles.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <p className="text-sm text-purple-300">
                🔒 <strong>Private Access:</strong> Most raffles are invite-only to maintain
                exclusivity and ensure fair distribution. Get your code from the raffle creator.
              </p>
            </div>

            <Button
              onClick={handleEnterWithCode}
              disabled={!inviteCode.trim() || isLoading}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg h-14"
            >
              {isLoading ? "Verifying..." : "Enter Raffle"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
